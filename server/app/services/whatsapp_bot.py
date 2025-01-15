import json
from typing import Any, Dict, List

import requests
from fastapi import HTTPException
from loguru import logger
from sqlalchemy.orm import Session
import httpx

from app.core.config import settings
from app.services.openai_service import OpenAIService
from app.utils.whatsapp_utils import (
    extract_whatsapp_message_data,
    get_text_message_input,
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
            if not is_valid_whatsapp_message(body):
                raise ValueError("Invalid WhatsApp message format")

            # Extract message data
            message_data = extract_whatsapp_message_data(body)

            # Generate AI response with database context
            response = await self.openai.generate_response(
                message=message_data["message"],
                user_id=message_data["wa_id"],
                db=db,
                context="support",
            )

            # Format response for WhatsApp
            formatted_response = process_text_for_whatsapp(response)

            # Send the response as a regular text message
            await self.send_message(
                recipient=message_data["wa_id"],
                message=formatted_response,
                use_template=False,
            )

            return {
                "status": "success",
                "message": "Response sent successfully",
                "recipient": message_data["name"],
            }

        except ValueError as e:
            logger.error(f"Validation error: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            logger.error(f"Error handling message: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    async def send_message(
        self,
        recipient: str,
        message: str,
        use_template: bool = True,
        template_name: str = "hello_world",
    ) -> None:
        """Send message to WhatsApp recipient."""
        try:
            recipient = recipient.strip().replace(" ", "")
            if not recipient.startswith("+"):
                recipient = f"+{recipient}"

            url = f"{self.base_url}/{self.phone_number_id}/messages"
            headers = {
                "Authorization": f"Bearer {self.whatsapp_token}",
                "Content-Type": "application/json",
            }

            if use_template:
                templates = await self.get_templates()
                template = templates.get(template_name)

                if not template:
                    raise HTTPException(
                        status_code=400, detail="Template %s not found" % template_name
                    )

                data = {
                    "messaging_product": "whatsapp",
                    "to": recipient,
                    "type": "template",
                    "template": {
                        "name": template_name,
                        "language": {"code": template.get("language", "en")},
                    },
                }

                # Handle template variables
                if message and template.get("variables_count", 0) > 0:
                    variables = message.split(";")
                    variables = [v.strip() for v in variables]

                    components = []
                    for i, param in enumerate(template.get("parameters", [])):
                        if param["type"] in ["header", "body"] and i < len(variables):
                            components.append(
                                {
                                    "type": param["type"].lower(),
                                    "parameters": [
                                        {"type": "text", "text": variables[i]}
                                    ],
                                }
                            )
                    if components:
                        data["template"]["components"] = components

                logger.debug("Sending template message: %s", json.dumps(data))
            else:
                # For non-template messages, send as regular text
                data = {
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": recipient,
                    "type": "text",
                    "text": {"preview_url": False, "body": message},
                }
                logger.debug("Sending text message: %s", json.dumps(data))

            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()

            log_http_response(response)
            logger.info("Message sent successfully to %s", recipient)

        except requests.exceptions.RequestException as e:
            logger.error("Error sending message: %s", str(e))
            if hasattr(e.response, "text"):
                logger.error("Response: %s", e.response.text)
            raise HTTPException(
                status_code=500, detail="Failed to send WhatsApp message: %s" % str(e)
            )

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
            data = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": recipient,
                "type": "contacts",
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/{self.phone_number_id}/messages",
                    headers=self.headers,
                    json=data,
                    timeout=10.0,
                )
                response.raise_for_status()

        except Exception as e:
            logger.error("Error sending typing indicator: %s", str(e))
            if hasattr(e, "response"):
                logger.error("Response: %s", e.response.text)

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
                    requires_message = False
                    variables_count = 0

                    for component in components:
                        comp_type = component.get("type", "").upper()
                        logger.debug(
                            "Component type: %s for template: %s",
                            comp_type, name
                        )

                        # Check for variables in text
                        if "text" in component:
                            text = component.get("text", "")
                            variables = text.count("{{")
                            variables_count += variables

                            if variables > 0:
                                requires_message = True

                        if comp_type in ["BODY", "HEADER"]:
                            parameters.append(
                                {
                                    "type": comp_type.lower(),
                                    "format": component.get("format", "TEXT"),
                                    "text": component.get("text", ""),
                                    "example": component.get("example", {}),
                                }
                            )

                    processed_templates[name] = {
                        "name": name,
                        "description": template.get("category", "").title(),
                        "category": template.get("category"),
                        "parameters": parameters,
                        "requiresMessage": requires_message,
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
