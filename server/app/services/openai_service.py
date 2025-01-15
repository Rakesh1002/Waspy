"""OpenAI service for generating responses."""
from typing import Any, Dict, List, Optional

import pandas as pd
from loguru import logger
from openai import AsyncOpenAI
from sqlalchemy import or_
from sqlalchemy.orm import Session

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
            # Get conversation history
            history = self.support_conversation_history.get(user_id, [])

            # Search knowledge base for relevant information
            kb_results = await self.search_knowledge_base(message, db)

            # Get customer's order details
            order_details = await self.get_order_details(user_id, db)

            # Create a context-rich system message
            system_message = SUPPORT_SYSTEM_PROMPT

            # Add order information first for more prominence
            if order_details:
                system_message += "\n\nCustomer Order Information:\n"
                for order in order_details:
                    system_message += f"\nOrder #{order['order_id']}:\n"
                    system_message += f"Status: {order['status']}\n"
                    if order.get("delivery_date"):
                        system_message += f"Delivery Date: {order['delivery_date']}\n"

                # Add specific instructions for order-related queries
                system_message += "\nWhen responding about orders:\n"
                system_message += "1. Always reference specific order IDs\n"
                system_message += "2. Include delivery dates when available\n"
                system_message += "3. Provide clear status updates\n"
            else:
                system_message += "\nNo orders found for this customer.\n"

            if kb_results:
                system_message += "\n\nRelevant Knowledge Base Information:\n"
                for result in kb_results:
                    system_message += f"\nSource: {result['source']}\n"
                    system_message += f"Content: {result['content']}\n"
                    if result.get("meta_info"):
                        system_message += f"Additional Info: {result['meta_info']}\n"

            # Add user context
            system_message += f"\nCustomer Phone: {user_id}\n"

            # Construct messages with history and context
            messages = [{"role": "system", "content": system_message}]
            messages.extend(history[-self.max_history_length :])
            messages.append({"role": "user", "content": message})

            logger.debug(
                f"Generating response with context. Orders found: {len(order_details)}"
            )
            response = await self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=messages,
                max_tokens=500,
                temperature=0.7,
                presence_penalty=0.6,
                frequency_penalty=0.2,
            )

            if not response.choices:
                return (
                    "I apologize, but I couldn't generate a response. Please try again."
                )

            assistant_message = str(response.choices[0].message.content)

            # Update conversation history
            history.append({"role": "user", "content": message})
            history.append({"role": "assistant", "content": assistant_message})
            self.support_conversation_history[user_id] = history

            return assistant_message

        except Exception as e:
            logger.error(f"Error generating OpenAI response: {str(e)}")
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
        """Create an OpenAI assistant for order support."""
        assistant = await self.client.beta.assistants.create(
            name="Order Support Assistant",
            instructions="""You are a helpful customer support assistant for our e-commerce platform.
            Help customers with:
            1. Order status inquiries
            2. Product information
            3. Shipping updates
            4. General support questions

            Always be polite and professional. If you need to query order details, use the provided functions.
            """,
            model="gpt-4o-mini",
            tools=[
                {
                    "type": "function",
                    "function": {
                        "name": "get_order_status",
                        "description": "Get the current status of an order",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "order_number": {
                                    "type": "string",
                                    "description": "The order number to look up",
                                }
                            },
                            "required": ["order_number"],
                        },
                    },
                }
            ],
        )
        return assistant.id

    async def get_order_status(self, order_number: str) -> Dict[str, Any]:
        """Query order status from database."""
        # TODO: Implement database query
        return {
            "status": "processing",
            "estimated_delivery": "2024-03-20",
            "tracking_number": "1234567890",
        }
