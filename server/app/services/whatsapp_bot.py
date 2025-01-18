import json
from typing import Any, Dict

import httpx
import requests
from fastapi import HTTPException
from loguru import logger
from sqlalchemy.orm import Session

from app.core.config import settings
from app.services.openai_service import OpenAIService
from app.utils.whatsapp_utils import (
    extract_whatsapp_message_data,
    is_valid_whatsapp_message,
    log_http_response,
    process_text_for_whatsapp,
)


class WhatsAppBot:
    def __init__(self) -> None:
        self.openai = OpenAIService()
        self.base_url = f"https://graph.facebook.com/{settings.VERSION}"
        self.phone_number_id = settings.PHONE_NUMBER_ID
        self.whatsapp_token = settings.WHATSAPP_TOKEN
        self.headers = {
            "Authorization": f"Bearer {self.whatsapp_token}",
            "Content-Type": "application/json",
        }

    async def handle_message(self, body: Dict[Any, Any], db: Session) -> Dict[str, Any]:
        try:
            logger.info("🔄 Starting message handling process")
            logger.info(f"Incoming message body: {json.dumps(body, indent=2)}")

            if not is_valid_whatsapp_message(body):
                logger.error("❌ Invalid message format received")
                raise ValueError("Invalid WhatsApp message format")

            # Extract message data
            message_data = extract_whatsapp_message_data(body)
            logger.info(f"📩 Extracted message data: {json.dumps(message_data)}")

            # Send typing indicator
            try:
                await self.send_typing_indicator(message_data["wa_id"])
                logger.info("✓ Sent typing indicator")
            except Exception as e:
                logger.warning(f"Could not send typing indicator: {str(e)}")

            # Generate AI response
            logger.info(f"🤖 Generating AI response for user {message_data['wa_id']}")
            response = await self.openai.generate_response(
                message=message_data["message"],
                user_id=message_data["wa_id"],
                db=db,
                context="support",
            )
            logger.info(f"✓ Generated AI response: {response}")

            # Format and send response
            formatted_response = process_text_for_whatsapp(response)
            logger.info(f"📝 Formatted response: {formatted_response}")

            try:
                await self.send_message(
                    recipient=message_data["wa_id"],
                    message=formatted_response,
                    use_template=False,
                )
                logger.info("✅ Successfully sent response to WhatsApp")
            except Exception as e:
                logger.error(f"❌ Failed to send WhatsApp response: {str(e)}", exc_info=True)
                raise

            return {
                "status": "success",
                "message": "Response sent successfully",
                "recipient": message_data["name"],
            }

        except Exception as e:
            logger.error(f"❌ Error in handle_message: {str(e)}", exc_info=True)
            raise

    async def send_message(
        self,
        recipient: str,
        message: str,
        use_template: bool = False,
        template_name: str = None,
    ) -> None:
        """Send message to WhatsApp recipient."""
        try:
            logger.info(f"🚀 Sending message to {recipient}")
            logger.info(f"Message content: {message}")

            recipient = recipient.strip().replace(" ", "")
            if not recipient.startswith("+"):
                recipient = f"+{recipient}"

            url = f"{self.base_url}/{self.phone_number_id}/messages"
            
            logger.debug(f"WhatsApp API URL: {url}")
            logger.debug(f"Headers: {json.dumps(self.headers)}")

            data = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": recipient,
                "type": "text",
                "text": {"preview_url": False, "body": message},
            }
            
            logger.info(f"Request payload: {json.dumps(data, indent=2)}")

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url,
                    headers=self.headers,
                    json=data,
                    timeout=10.0
                )
                response.raise_for_status()
                
                logger.info(f"WhatsApp API Response: {response.text}")
                logger.info(f"✅ Message sent successfully to {recipient}")

        except httpx.HTTPError as e:
            logger.error(f"❌ HTTP error sending message: {str(e)}")
            if hasattr(e, "response"):
                logger.error(f"Response: {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"❌ Error sending message: {str(e)}", exc_info=True)
            raise

    async def verify_webhook(self, mode: str, token: str, challenge: str) -> str:
        """Verify webhook endpoint for WhatsApp API."""
        logger.debug(
            "Verifying webhook - Mode: %s, Token: %s, Challenge: %s",
            mode, token, challenge
        )

        if not all([mode, token, challenge]):
            logger.error("Missing required verification parameters")
            raise HTTPException(
                status_code=400, detail="Missing required verification parameters"
            )

        if mode != "subscribe":
            logger.error("Invalid mode: %s", mode)
            raise HTTPException(status_code=403, detail="Invalid mode")

        if token != settings.VERIFY_TOKEN:
            logger.error("Invalid verify token")
            raise HTTPException(status_code=403, detail="Invalid verify token")

        logger.info("Webhook verified successfully with challenge: %s", challenge)
        return challenge

    async def delete_message(self, message_id: str) -> None:
        """Delete a message by its ID."""
        try:
            params = {"messaging_product": "whatsapp", "message_id": message_id}

            async with httpx.AsyncClient() as client:
                response = await client.delete(
                    f"{self.base_url}/{self.phone_number_id}/messages",
                    headers=self.headers,
                    params=params,
                    timeout=10.0,
                )
                response.raise_for_status()

        except Exception as e:
            logger.error("Error deleting message: %s", str(e))
            if hasattr(e, "response"):
                logger.error("Response: %s", e.response.text)

    async def send_typing_indicator(self, recipient: str) -> None:
        """Send typing indicator to recipient."""
        try:
            logger.info(f"Sending typing indicator to {recipient}")
            
            recipient = recipient.strip().replace(" ", "")
            if not recipient.startswith("+"):
                recipient = f"+{recipient}"

            url = f"{self.base_url}/{self.phone_number_id}/messages"
            
            data = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": recipient,
                "type": "interactive",
                "interactive": {
                    "type": "button",
                    "body": {
                        "text": "..."
                    },
                    "action": {
                        "buttons": [
                            {
                                "type": "reply",
                                "reply": {
                                    "id": "typing",
                                    "title": "⌛"
                                }
                            }
                        ]
                    }
                }
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url,
                    headers=self.headers,
                    json=data,
                    timeout=5.0
                )
                response.raise_for_status()
                logger.info(f"Typing indicator sent to {recipient}")

        except Exception as e:
            logger.error(f"Error sending typing indicator: {str(e)}")
            if hasattr(e, 'response'):
                logger.error(f"Response: {e.response.text}")

    async def get_templates(self) -> Dict[str, Any]:
        """Fetch templates from WhatsApp Business API."""
        try:
            url = f"{self.base_url}/{settings.BUSINESS_ID}/message_templates"

            headers = {
                "Authorization": f"Bearer {self.whatsapp_token}",
                "Content-Type": "application/json",
            }

            # Add required fields according to the API docs
            params = {
                "limit": 1000,
                "fields": "name,status,language,category,components",
            }

            logger.debug("Fetching templates from URL: %s", url)
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()

            response_data = response.json()
            logger.debug("API Response: %s", json.dumps(response_data))

            templates = response_data.get("data", [])
            logger.debug("Fetched %d templates", len(templates))

            # Process templates to match frontend format
            processed_templates = {}
            for template in templates:
                status = template.get("status")
                name = template.get("name")
                logger.debug("Processing template: %s with status: %s", name, status)

                if status == "APPROVED":
                    components = template.get("components", [])
                    parameters = []
                    variables_count = 0

                    # Process each component
                    for component in components:
                        comp_type = component.get("type", "").upper()
                        
                        # Count actual parameters in the component
                        if "parameters" in component:
                            param_count = len(component.get("parameters", []))
                            variables_count += param_count
                            
                            if param_count > 0:
                                parameters.append({
                                    "type": comp_type,
                                    "format": component.get("format", "TEXT"),
                                    "text": component.get("text", ""),
                                    "example": component.get("example", {}),
                                    "param_count": param_count
                                })

                    processed_templates[name] = {
                        "name": name,
                        "description": template.get("category", "").title(),
                        "category": template.get("category"),
                        "parameters": parameters,
                        "requiresMessage": variables_count > 0,
                        "language": template.get("language"),
                        "components": components,
                        "variables_count": variables_count,
                    }

                    logger.debug(
                        "Successfully processed template: %s with %d variables",
                        name, variables_count
                    )

            logger.info("Total processed templates: %d", len(processed_templates))
            return processed_templates

        except requests.exceptions.RequestException as e:
            logger.error("Error fetching templates: %s", str(e))
            if hasattr(e.response, "text"):
                logger.error("Response: %s", e.response.text)
            raise HTTPException(
                status_code=500,
                detail="Failed to fetch WhatsApp templates: %s" % str(e)
            )
