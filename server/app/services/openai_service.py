"""OpenAI service for generating responses."""
from typing import Any, Dict, List, Optional

import pandas as pd
from loguru import logger
from openai import AsyncOpenAI
from sqlalchemy import or_
from sqlalchemy.orm import Session
import asyncio

from app.core.config import settings
from app.models.order import KnowledgeBase, Order

SUPPORT_SYSTEM_PROMPT = """You are a helpful WhatsApp Business assistant. Your role is to:
1. Answer questions about products and services
2. Help with order status and tracking
3. Provide customer support
4. Handle general inquiries professionally
5. Assist with technical issues

Guidelines:
- Keep responses concise and friendly
- Use clear and simple language
- Be helpful and solution-oriented
- If you can't help, politely explain why
- Format responses appropriately for WhatsApp
- Don't use markdown or complex formatting
- Keep responses under 4000 characters
- Use emojis sparingly and appropriately 👋

When responding about orders:
- Always provide order details directly without asking for confirmation if you have them
- Include the order ID, status, and delivery date in your response
- For "last order" queries, use the most recent order by date
- If multiple orders exist, focus on the most relevant one first
- Only ask for order ID if you need to disambiguate between multiple recent orders

Example responses:
For "Where is my order?":
"Your most recent order #ORD123 is currently [status] and will be delivered on [date]."

For "What's my order status?":
"Your order #ORD123 is [status]. [Additional context based on status]."
"""

CAMPAIGN_SYSTEM_PROMPT = """You are a WhatsApp marketing campaign assistant.
Your role is to:
1. Help create engaging marketing messages
2. Suggest campaign improvements
3. Analyze campaign performance
4. Provide template suggestions
5. Ensure compliance with WhatsApp Business policies

Keep suggestions practical and compliant with WhatsApp's guidelines.
Focus on engagement and conversion while maintaining professional tone.
"""


class OpenAIService:
    def __init__(self) -> None:
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.max_history_length = 10
        self.support_conversation_history = {}
        self.user_threads = {}  # Store thread IDs for each user

    async def load_knowledge_base_csv(self, file_path: str, db: Session) -> None:
        """Load knowledge base from CSV file into database."""
        try:
            df = pd.read_csv(file_path)
            for _, row in df.iterrows():
                kb_entry = KnowledgeBase(
                    category=row["category"],
                    question=row["question"],
                    answer=row["answer"],
                    keywords=row["keywords"],
                )
                db.add(kb_entry)
            db.commit()
            logger.info(f"Successfully loaded knowledge base from {file_path}")
        except Exception as e:
            logger.error(f"Error loading knowledge base: {str(e)}")
            raise

    async def search_knowledge_base(
        self, query: str, db: Session
    ) -> List[Dict[str, str]]:
        """Search knowledge base for relevant information."""
        try:
            # Search in content and metadata
            results = (
                db.query(KnowledgeBase)
                .filter(
                    or_(
                        KnowledgeBase.content.ilike(f"%{query}%"),
                        KnowledgeBase.source.ilike(f"%{query}%"),
                    )
                )
                .all()
            )

            return [
                {"content": r.content, "source": r.source, "meta_info": r.meta_info}
                for r in results
            ]
        except Exception as e:
            logger.error(f"Error searching knowledge base: {str(e)}")
            return []

    async def get_order_details(
        self, phone_number: str, db: Session
    ) -> List[Dict[str, Any]]:
        """Get order details for a customer."""
        try:
            # Format phone number to match database format
            phone_number = phone_number.strip().replace(" ", "")
            if not phone_number.startswith("+"):
                phone_number = f"+{phone_number}"

            logger.debug(f"Searching orders for phone number: {phone_number}")
            orders = (
                db.query(Order)
                .filter(Order.customer_phone == phone_number)
                .order_by(Order.created_at.desc())
                .all()
            )

            order_details = [
                {
                    "order_id": order.order_id,
                    "status": order.status,
                    "delivery_date": order.delivery_date.isoformat()
                    if order.delivery_date
                    else None,
                }
                for order in orders
            ]
            logger.debug(f"Found {len(order_details)} orders")
            return order_details
        except Exception as e:
            logger.error(f"Error getting order details: {str(e)}")
            return []

    async def generate_response(
        self, message: str, user_id: str, db: Session, context: str = "support"
    ) -> str:
        try:
            logger.info(f"🤖 Generating OpenAI response for user {user_id}")
            logger.info(f"Message: {message}")

            # Create thread if needed
            if user_id not in self.user_threads:
                thread = await self.client.beta.threads.create()
                self.user_threads[user_id] = thread.id
                logger.info(f"Created new thread for user {user_id}: {thread.id}")

            thread_id = self.user_threads[user_id]
            logger.info(f"Using thread ID: {thread_id}")

            # Add message to thread
            await self.client.beta.threads.messages.create(
                thread_id=thread_id,
                role="user",
                content=message
            )
            logger.info("Added user message to thread")

            # Run assistant
            run = await self.client.beta.threads.runs.create(
                thread_id=thread_id,
                assistant_id=settings.OPENAI_ASSISTANT_ID
            )
            logger.info(f"Started assistant run: {run.id}")

            # Wait for completion with timeout
            start_time = asyncio.get_event_loop().time()
            timeout = 30  # 30 seconds timeout

            while True:
                if asyncio.get_event_loop().time() - start_time > timeout:
                    logger.error("Assistant run timed out")
                    return "I apologize, but the response is taking too long. Please try again."

                run_status = await self.client.beta.threads.runs.retrieve(
                    thread_id=thread_id,
                    run_id=run.id
                )
                
                if run_status.status == 'completed':
                    logger.info("Assistant run completed")
                    break
                elif run_status.status == 'failed':
                    logger.error(f"Assistant run failed: {run_status.last_error}")
                    return "I apologize, but I encountered an error processing your request."
                
                await asyncio.sleep(1)

            # Get response
            messages = await self.client.beta.threads.messages.list(
                thread_id=thread_id
            )
            
            # Get the latest assistant message
            for msg in messages.data:
                if msg.role == "assistant":
                    response = msg.content[0].text.value
                    logger.info(f"Generated response: {response}")
                    return response

            logger.error("No assistant message found")
            return "I apologize, but I couldn't generate a response."

        except Exception as e:
            logger.error(f"❌ Error generating OpenAI response: {str(e)}", exc_info=True)
            return "I apologize, but I'm having trouble processing your request right now. Please try again later."

    async def analyze_campaign(self, campaign_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze campaign performance and provide recommendations."""
        try:
            analysis_prompt = f"""Analyze this WhatsApp marketing campaign and provide recommendations:
Campaign Name: {campaign_data.get('name')}
Target Audience: {campaign_data.get('audience')}
Message Content: {campaign_data.get('message')}
Performance Metrics:
- Sent: {campaign_data.get('sent', 0)}
- Delivered: {campaign_data.get('delivered', 0)}
- Read: {campaign_data.get('read', 0)}
- Responses: {campaign_data.get('responses', 0)}

Provide analysis in the following format:
1. Performance Summary
2. Key Insights
3. Areas for Improvement
4. Specific Recommendations
"""

            response = await self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": CAMPAIGN_SYSTEM_PROMPT},
                    {"role": "user", "content": analysis_prompt},
                ],
                max_tokens=500,
                temperature=0.5,
            )

            if not response.choices:
                raise ValueError("No analysis generated")

            analysis = str(response.choices[0].message.content)

            return {
                "campaign_id": campaign_data.get("id"),
                "analysis": analysis,
                "success": True,
            }

        except Exception as e:
            logger.error(f"Error analyzing campaign: {str(e)}")
            return {
                "campaign_id": campaign_data.get("id"),
                "error": str(e),
                "success": False,
            }

    async def generate_campaign_template(
        self,
        product_type: str,
        target_audience: str,
        campaign_goal: str,
        special_requirements: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Generate a campaign message template based on given parameters."""
        try:
            template_prompt = f"""Create a WhatsApp marketing campaign template with the following parameters:
Product/Service Type: {product_type}
Target Audience: {target_audience}
Campaign Goal: {campaign_goal}
Special Requirements: {special_requirements or 'None'}

Provide the template in the following format:
1. Message Template (with variables in {{brackets}})
2. Suggested Variables
3. Best Practices
4. Compliance Notes
"""

            response = await self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": CAMPAIGN_SYSTEM_PROMPT},
                    {"role": "user", "content": template_prompt},
                ],
                max_tokens=400,
                temperature=0.7,
            )

            if not response.choices:
                raise ValueError("No template generated")

            template = str(response.choices[0].message.content)

            return {
                "template": template,
                "parameters": {
                    "product_type": product_type,
                    "target_audience": target_audience,
                    "campaign_goal": campaign_goal,
                },
                "success": True,
            }

        except Exception as e:
            logger.error(f"Error generating campaign template: {str(e)}")
            return {"error": str(e), "success": False}

    async def create_assistant(self) -> str:
        """Create an OpenAI assistant for WhatsApp support."""
        try:
            assistant = await self.client.beta.assistants.create(
                name="WhatsApp Support Assistant",
                instructions="""You are a helpful WhatsApp support assistant. Your role is to:
                1. Answer customer queries professionally and concisely
                2. Provide product information and support
                3. Help with order status and tracking
                4. Handle general inquiries
                5. Maintain a friendly and helpful tone

                Guidelines:
                - Keep responses under 4000 characters
                - Use simple, clear language
                - Be helpful and solution-oriented
                - Format responses appropriately for WhatsApp
                - Use emojis sparingly and professionally
                """,
                model=settings.OPENAI_MODEL,
                tools=[
                    {
                        "type": "retrieval"  # Enable knowledge retrieval
                    }
                ]
            )
            logger.info(f"Created new assistant with ID: {assistant.id}")
            return assistant.id
        except Exception as e:
            logger.error(f"Error creating assistant: {str(e)}")
            raise

    async def get_order_status(self, order_number: str) -> Dict[str, Any]:
        """Query order status from database."""
        # TODO: Implement database query
        return {
            "status": "processing",
            "estimated_delivery": "2024-03-20",
            "tracking_number": "1234567890",
        }
