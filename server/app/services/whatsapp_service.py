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
        template_data: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Send a template message."""
        try:
            language_code = (
                template_data.get("language", {}).get("code")
                if template_data and template_data.get("language")
                else "en"
            )

            # Basic template payload
            payload = {
                "messaging_product": "whatsapp",
                "to": phone_number,
                "type": "template",
                "template": {
                    "name": template_name,
                    "language": {"code": language_code}
                }
            }

            # Only add components if they exist and are valid
            if template_data and "components" in template_data:
                # Validate components structure
                components = template_data["components"]
                if isinstance(components, list):
                    # Filter out any components without parameters
                    valid_components = [
                        comp for comp in components 
                        if isinstance(comp, dict) 
                        and comp.get("type") 
                        and comp.get("parameters")
                        and isinstance(comp["parameters"], list)
                    ]
                    
                    if valid_components:
                        payload["template"]["components"] = valid_components

            logger.debug(f"Template message payload:\n{json.dumps(payload, indent=2)}")
            return await self._send_message(payload)

        except Exception as e:
            if "Template name does not exist" in str(e):
                raise WhatsAppError(
                    message=f"Template '{template_name}' not found in language '{language_code}'",
                    status_code=404
                )
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
