import json
from typing import Any, Dict, Optional

import httpx
from loguru import logger

from app.core.config import settings
from app.utils.error_handler import WhatsAppError


class WhatsAppService:
    """WhatsApp API service for sending messages and managing templates."""

    def __init__(self):
        self.api_url = f"https://graph.facebook.com/{settings.VERSION}"
        self.token = settings.WHATSAPP_TOKEN
        self.phone_number_id = settings.PHONE_NUMBER_ID
        self.version = settings.VERSION
        self.business_id = settings.BUSINESS_ID
        self._setup_client()

    def _setup_client(self):
        """Set up the HTTP client with proper configuration."""
        self.client = httpx.AsyncClient(
            base_url=self.api_url,
            headers={
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json",
            },
            timeout=30.0
        )

    async def close(self):
        """Properly close the client connection."""
        if self.client:
            await self.client.aclose()

    async def _send_message(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Send message to WhatsApp API."""
        try:
            url = f"/{self.phone_number_id}/messages"

            logger.debug("WhatsApp API Request:")
            logger.debug(f"URL: {self.api_url}{url}")
            logger.debug(f"Payload: {json.dumps(payload, indent=2)}")

            response = await self.client.post(url, json=payload)

            logger.debug(f"Response Status: {response.status_code}")
            logger.debug(f"Response Body: {response.text}")

            if not response.is_success:
                try:
                    error_data = response.json()
                    error_msg = error_data.get('error', {}).get('message', response.text)
                except json.JSONDecodeError:
                    error_msg = response.text

                raise WhatsAppError(
                    message=f"WhatsApp API error: {error_msg}",
                    status_code=response.status_code
                ) from None

            return response.json()

        except httpx.HTTPError as e:
            raise WhatsAppError(message=f"HTTP error: {str(e)}", status_code=500) from e
        except Exception as e:
            raise WhatsAppError(
                message=f"Unexpected error: {str(e)}",
                status_code=500
            ) from e

    async def send_template_message(
        self,
        phone_number: str,
        template_name: str,
        template_data: Optional[dict] = None
    ) -> Dict[str, Any]:
        """Send a template message."""
        try:
            # Format phone number to include country code if not present
            formatted_phone = (
                phone_number if phone_number.startswith("+") 
                else f"+{phone_number}"
            )

            # Base payload structure
            payload = {
                "messaging_product": "whatsapp",
                "to": formatted_phone,
                "type": "template",
                "template": {
                    "name": template_name,
                    "language": {
                        "code": template_data.get("language", {}).get("code", "en_US")
                    },
                    "components": []
                }
            }

            # Process components
            if template_data and template_data.get("components"):
                components = []
                
                # Add header if present
                header_component = next(
                    (c for c in template_data["components"] if c.get("type", "").upper() == "HEADER"),
                    None
                )
                if header_component and header_component.get("parameters"):
                    components.append({
                        "type": "header",
                        "parameters": header_component["parameters"]
                    })

                # Collect all body parameters into a single body component
                body_parameters = []
                for component in template_data["components"]:
                    if component.get("type", "").upper() == "BODY" and component.get("parameters"):
                        body_parameters.extend(component["parameters"])

                if body_parameters:
                    components.append({
                        "type": "body",
                        "parameters": body_parameters
                    })

                # Add buttons if present
                button_component = next(
                    (c for c in template_data["components"] if c.get("type", "").upper() == "BUTTONS"),
                    None
                )
                if button_component:
                    components.append({
                        "type": "button",
                        "sub_type": "url",
                        "parameters": button_component.get("parameters", [])
                    })

                payload["template"]["components"] = components

            logger.debug(f"Template message payload:\n{json.dumps(payload, indent=2)}")
            
            response = await self._send_message(payload)
            return response

        except Exception as e:
            logger.error(f"Error sending template message: {str(e)}")
            raise WhatsAppError(
                message=f"Failed to send template message: {str(e)}",
                status_code=500
            )

    async def send_text_message(self, phone_number: str, message: str) -> Dict[str, Any]:
        """Send a text message."""
        try:
            payload = {
                "messaging_product": "whatsapp",
                "to": phone_number,
                "type": "text",
                "text": {"body": message}
            }

            logger.debug(f"Text message payload:\n{json.dumps(payload, indent=2)}")
            return await self._send_message(payload)

        except Exception as e:
            raise WhatsAppError(
                message=f"Failed to send text message: {str(e)}",
                status_code=500
            ) from e

    async def verify_token(self) -> bool:
        """Verify WhatsApp token is valid."""
        try:
            # Simple API call to verify token
            url = f"{settings.WHATSAPP_API_URL}/{settings.PHONE_NUMBER_ID}/phone_numbers"
            headers = {
                "Authorization": f"Bearer {settings.WHATSAPP_TOKEN}",
                "Content-Type": "application/json"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                return True
                
        except Exception as e:
            logger.error(f"WhatsApp token verification failed: {str(e)}")
            raise ValueError(f"Invalid WhatsApp token: {str(e)}")

    async def get_message_metrics(self, message_id: Optional[str]) -> Dict[str, Any]:
        """Get metrics for a specific message."""
        if not message_id:
            return {
                "delivered": 0,
                "read": 0,
                "button_clicks": []
            }

        try:
            url = f"/{self.phone_number_id}/messages/{message_id}"
            
            response = await self.client.get(url)
            
            if not response.is_success:
                logger.error(f"Failed to get message metrics: {response.text}")
                return {
                    "delivered": 0,
                    "read": 0,
                    "button_clicks": []
                }

            data = response.json()
            status = data.get("status", "")
            
            # If message is read, it was also delivered
            is_read = status == "read"
            is_delivered = is_read or status == "delivered"
            
            return {
                "delivered": is_delivered,
                "read": is_read,
                "button_clicks": data.get("conversations", {}).get("button_clicks", []),
                "status": status,
                "timestamp": data.get("timestamp")
            }

        except Exception as e:
            logger.error(f"Error getting message metrics: {str(e)}")
            return {
                "delivered": 0,
                "read": 0,
                "button_clicks": []
            }

    async def get_template_content(self, template_name: str) -> Dict[str, Any]:
        """Fetch template content from WhatsApp API."""
        try:
            # The correct endpoint for fetching message templates
            url = f"/{self.phone_number_id}/message_templates"
            response = await self.client.get(url)
            
            if not response.is_success:
                logger.error(f"Failed to get template content: {response.text}")
                return None

            data = response.json()
            # Extract the specific template from the response
            templates = data.get("data", [])
            template = next((t for t in templates if t.get("name") == template_name), None)
            
            if not template:
                logger.error(f"Template {template_name} not found in response")
                return None

            # Extract the components in the correct language (default to first available)
            components = template.get("components", [])
            
            return {
                "name": template.get("name"),
                "language": template.get("language"),
                "category": template.get("category"),
                "components": components,
                "status": template.get("status")
            }

        except Exception as e:
            logger.error(f"Error getting template content: {str(e)}")
            return None

    def construct_final_message(self, template_name: str, template_data: Dict[str, Any], template_content: Optional[Dict[str, Any]] = None) -> str:
        """Construct the final message that was sent to the user."""
        try:
            if not template_content:
                # If we can't get template content, fall back to using the data we have
                message_parts = []
                if template_data and template_data.get("components"):
                    for component in template_data["components"]:
                        if component.get("type") == "BODY":
                            for param in component.get("parameters", []):
                                if param.get("type") == "text":
                                    message_parts.append(param.get("text", ""))
                
                    final_message = "\n".join(message_parts)
                    return (
                        f"Template: {template_name}\n"
                        f"Language: {template_data.get('language', {}).get('code', 'en')}\n\n"
                        f"Message Content:\n{final_message}"
                    )
                return "Could not fetch template content"

            # Get the template structure
            message_parts = []
            components = template_content.get("components", [])
            param_values = {}

            # Extract parameter values from the sent data
            if template_data and template_data.get("components"):
                for component in template_data["components"]:
                    if component.get("type") == "BODY" and component.get("parameters"):
                        for i, param in enumerate(component["parameters"], 1):
                            param_values[f"{{{{{i}}}}}"] = param.get("text", "")

            # Process each component from the template
            for component in components:
                comp_type = component.get("type", "").upper()
                
                if comp_type == "HEADER":
                    format = component.get("format", "")
                    if format == "TEXT":
                        header_text = component.get("text", "")
                        message_parts.append(f"Header: {header_text}")
                    elif format == "IMAGE":
                        message_parts.append("[Image Header]")
                    elif format == "DOCUMENT":
                        message_parts.append("[Document Header]")
                        
                elif comp_type == "BODY":
                    body_text = component.get("text", "")
                    # Replace variables with actual values
                    for placeholder, value in param_values.items():
                        body_text = body_text.replace(placeholder, value)
                    message_parts.append(f"Body: {body_text}")
                    
                elif comp_type == "FOOTER":
                    footer_text = component.get("text", "")
                    message_parts.append(f"Footer: {footer_text}")
                    
                elif comp_type == "BUTTONS":
                    buttons = []
                    for button in component.get("buttons", []):
                        button_type = button.get("type", "").upper()
                        if button_type == "QUICK_REPLY":
                            buttons.append(f"[Button: {button.get('text', '')}]")
                        elif button_type == "URL":
                            buttons.append(f"[Link: {button.get('text', '')}]")
                    if buttons:
                        message_parts.append("Buttons:\n" + "\n".join(buttons))

            # Combine all parts with proper spacing
            final_message = "\n\n".join(part for part in message_parts if part)
            
            # Add template info
            template_info = (
                f"Template: {template_name}\n"
                f"Language: {template_content.get('language', 'en')}\n"
                f"Category: {template_content.get('category', 'unknown')}\n"
                f"Status: {template_content.get('status', 'unknown')}\n\n"
                f"Message Content:\n{final_message}"
            )
            
            return template_info

        except Exception as e:
            logger.error(f"Error constructing final message: {str(e)}")
            return "Error: Could not construct final message"
