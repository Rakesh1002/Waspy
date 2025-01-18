import httpx
from typing import List, Optional, Dict, Any
from app.core.config import settings
from app.schemas.whatsapp import PhoneNumber
from fastapi import HTTPException, Request
import logging
import json
import sys
import hmac
import hashlib

# Force debug logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
logger.addHandler(handler)

class WhatsAppClient:
    def __init__(self):
        print("\n=== Initializing WhatsApp Client ===")
        
        # Basic configuration
        self.base_url = "https://graph.facebook.com"
        self.version = settings.VERSION
        self.access_token = settings.WHATSAPP_TOKEN
        self.business_id = settings.BUSINESS_ID
        
        # Debug mode for development
        self.debug_mode = True  # Force debug mode on
        
        # Log configuration
        print("\nConfiguration:")
        print(f"- Base URL: {self.base_url}")
        print(f"- API Version: {self.version}")
        print(f"- Business ID: {self.business_id}")
        print(f"- Debug Mode: {self.debug_mode}")
        
        # Validate credentials
        if not self.access_token:
            error_msg = "WHATSAPP_TOKEN not configured in settings"
            print(f"\nERROR: {error_msg}")
            raise ValueError(error_msg)
            
        if not self.business_id:
            error_msg = "BUSINESS_ID not configured in settings"
            print(f"\nERROR: {error_msg}")
            raise ValueError(error_msg)
            
        if not self.version:
            error_msg = "API VERSION not configured in settings"
            print(f"\nERROR: {error_msg}")
            raise ValueError(error_msg)
            
        # Log masked token for debugging
        masked_token = f"{self.access_token[:6]}...{self.access_token[-4:]}"
        print(f"- Access Token (masked): {masked_token}")
            
        # Setup headers
        self.headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        print("=== WhatsApp Client Initialized Successfully ===\n")

    async def get_phone_numbers(
        self, 
        business_id: str,
        sort_ascending: bool = False,
        account_mode: Optional[str] = None
    ) -> List[PhoneNumber]:
        """
        Fetch all phone numbers associated with the business account using Graph API
        """
        print("\n=== Starting Phone Number Fetch ===")
        
        try:
            if not business_id:
                error_msg = "business_id is required"
                print(f"\nERROR: {error_msg}")
                raise ValueError(error_msg)

            # Construct URL and parameters
            url = f"{self.base_url}/{self.version}/{business_id}/phone_numbers"
            params = {}
            
            if sort_ascending:
                params["sort"] = "last_onboarded_time_ascending"
            if account_mode:
                params["account_mode"] = account_mode
            
            # Log request details
            print("\nRequest Details:")
            print(f"- URL: {url}")
            print(f"- Method: GET")
            print(f"- Parameters: {json.dumps(params)}")
            print(f"- Headers: {json.dumps({k: '***' if k == 'Authorization' else v for k, v in self.headers.items()})}")
            
            # Make the request
            print("\nMaking request to Meta API...")
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    url, 
                    headers=self.headers,
                    params=params,
                    timeout=30.0
                )
                
                # Log response details
                print("\n=== Meta API Response ===")
                print(f"- Status Code: {response.status_code}")
                print(f"- Content Type: {response.headers.get('content-type', 'unknown')}")
                print(f"- Response Body: {response.text[:2000]}")
                
                # Handle non-200 responses
                if response.status_code != 200:
                    error_msg = f"Meta API error: {response.text}"
                    print(f"\nERROR: {error_msg}")
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=error_msg
                    )
                
                # Parse response
                try:
                    data = response.json()
                    print("\nRaw Meta API Response Data:")
                    print(json.dumps(data, indent=2))
                except json.JSONDecodeError as e:
                    error_msg = f"Failed to parse JSON response: {str(e)}"
                    print(f"\nERROR: {error_msg}")
                    print(f"Raw response: {response.text[:1000]}")
                    raise HTTPException(status_code=500, detail=error_msg)
                
                # Process phone numbers
                if not data or "data" not in data:
                    print("\nWarning: No phone numbers in response")
                    return []

                phone_numbers = []
                print("\nProcessing phone numbers:")
                for number in data.get("data", []):
                    try:
                        print(f"\nProcessing number data:")
                        print(json.dumps(number, indent=2))
                        
                        # Check if the number is registered with WhatsApp
                        verification_status = number.get("code_verification_status")
                        whatsapp_registered = verification_status == "VERIFIED"
                        
                        phone_number = PhoneNumber(
                            id=number.get("id"),
                            verified_name=number.get("verified_name"),
                            display_phone_number=number.get("display_phone_number"),
                            quality_rating=number.get("quality_rating", "NA"),
                            code_verification_status=verification_status,
                            whatsapp_registered=whatsapp_registered
                        )
                        phone_numbers.append(phone_number)
                        print("Successfully processed phone number:")
                        print(json.dumps(phone_number.dict(), indent=2))
                        
                    except Exception as e:
                        print(f"\nError processing phone number: {str(e)}")
                        print(f"Problematic data: {json.dumps(number, indent=2)}")

                print(f"\n=== Phone Number Fetch Completed ===")
                print(f"Successfully processed {len(phone_numbers)} phone numbers")
                return phone_numbers

        except httpx.TimeoutException:
            error_msg = "Meta API request timed out after 30 seconds"
            print(f"\nERROR: {error_msg}")
            raise HTTPException(status_code=504, detail=error_msg)
            
        except httpx.HTTPError as e:
            error_msg = f"HTTP Error in Meta API call: {str(e)}"
            print(f"\nERROR: {error_msg}")
            if hasattr(e, 'response'):
                print(f"Response status: {e.response.status_code}")
                print(f"Response body: {e.response.text}")
            raise HTTPException(
                status_code=e.response.status_code if hasattr(e, 'response') else 500,
                detail=error_msg
            )
            
        except Exception as e:
            error_msg = f"Unexpected error in get_phone_numbers: {str(e)}"
            print(f"\nERROR: {error_msg}")
            raise HTTPException(status_code=500, detail=error_msg)

    async def get_single_phone_number(self, phone_number_id: str, include_name_status: bool = False):
        """
        Get information about a single phone number
        """
        try:
            params = {}
            if include_name_status:
                params["fields"] = "name_status"

            url = f"{self.base_url}/{self.version}/{phone_number_id}"
            logger.info(f"Making GET request to: {url}")
            logger.debug(f"Request params: {params}")
            logger.debug(f"Request headers: {self.headers}")

            async with httpx.AsyncClient() as client:
                response = await client.get(
                    url,
                    headers=self.headers,
                    params=params
                )
                logger.info(f"Response status for phone {phone_number_id}: {response.status_code}")
                logger.debug(f"Response headers: {dict(response.headers)}")
                logger.debug(f"Response body: {response.text}")
                
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"HTTP Error in get_single_phone_number for {phone_number_id}: {str(e)}")
            if hasattr(e, 'response'):
                logger.error(f"Response status: {e.response.status_code}")
                logger.error(f"Response body: {e.response.text}")
            raise HTTPException(
                status_code=e.response.status_code if hasattr(e, 'response') else 500,
                detail=f"WhatsApp API error: {str(e)}"
            )

    async def request_code(
        self, 
        business_id: str,
        phone_number: str,
        cc: str,
        method: str
    ):
        """Request a verification code for a phone number"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/{self.version}/{business_id}/request_code",
                headers=self.headers,
                json={
                    "phone_number": phone_number,
                    "cc": cc,
                    "method": method
                }
            )
            response.raise_for_status()
            return response.json()

    async def verify_code(
        self,
        business_id: str,
        phone_number: str,
        cc: str,
        code: str
    ):
        """Verify a phone number using the received code"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/{self.version}/{business_id}/verify_code",
                headers=self.headers,
                json={
                    "phone_number": phone_number,
                    "cc": cc,
                    "code": code
                }
            )
            response.raise_for_status()
            return response.json()

    async def register_account(
        self,
        cc: str,
        phone_number: str,
        method: str,
        cert: str,
        pin: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Register a WhatsApp account using the Cloud API.
        
        Args:
            cc: Country code (e.g., "91" for India)
            phone_number: Phone number without country code
            method: Verification method ("sms" or "voice")
            cert: Base64 encoded certificate for verified name
            pin: Optional 6-digit PIN for two-step verification
        """
        url = f"{self.base_url}/{self.version}/phone_numbers"
        
        data = {
            "messaging_product": "whatsapp",
            "cc": cc,
            "phone_number": phone_number,
            "verified_name": "YOBITECH",  # From the certificate
            "pin": pin
        }
            
        logger.info(f"Making POST request to: {url}")
        logger.info(f"Headers: {{'Authorization': 'Bearer {self.access_token[:5]}...'}}")
        logger.info(f"Request body: {data}")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers={"Authorization": f"Bearer {self.access_token}"},
                json=data
            )
            
            logger.info(f"Response status: {response.status_code}")
            logger.info(f"Response headers: {dict(response.headers)}")
            logger.info(f"Response body: {response.text}")
            
            if response.status_code != 200:
                logger.error(f"Error response: {response.text}")
                raise Exception(f"Failed to register account: {response.text}")
            
            return response.json() 

    async def register_phone_number(self, phone_number_id: str, pin: str) -> Dict[str, Any]:
        """Register a phone number with WhatsApp Cloud API."""
        logger.debug(f"\n=== Starting phone number registration ===")
        logger.debug(f"Phone number ID: {phone_number_id}")
        logger.debug(f"PIN: ******")
        
        try:
            url = f"{self.base_url}/{self.version}/{phone_number_id}/register"
            logger.debug(f"Registration URL: {url}")
            
            payload = {
                "messaging_product": "whatsapp",
                "pin": pin
            }
            logger.debug(f"Request payload: {json.dumps(payload, indent=2)}")
            logger.debug(f"Request headers: {json.dumps(self.headers, indent=2)}")
            
            async with httpx.AsyncClient() as client:
                logger.debug("Sending registration request...")
                response = await client.post(
                    url,
                    json=payload,
                    headers=self.headers,
                    timeout=30.0
                )
                
                logger.debug(f"Response status code: {response.status_code}")
                logger.debug(f"Response headers: {dict(response.headers)}")
                
                try:
                    response_data = response.json()
                    logger.debug(f"Response data: {json.dumps(response_data, indent=2)}")
                except json.JSONDecodeError:
                    logger.debug(f"Raw response text: {response.text}")
                    response_data = {"text": response.text}
                
                if not response.is_success:
                    error_msg = response_data.get("error", {}).get("message", response.text)
                    logger.error(f"Registration failed: {error_msg}")
                    raise WhatsAppError(message=error_msg, status_code=response.status_code)
                
                logger.debug("Registration successful!")
                return response_data
                
        except httpx.HTTPError as e:
            logger.error(f"HTTP error during registration: {str(e)}")
            raise WhatsAppError(message=f"HTTP error: {str(e)}", status_code=500)
        except Exception as e:
            logger.error(f"Unexpected error during registration: {str(e)}")
            raise WhatsAppError(message=f"Registration failed: {str(e)}", status_code=500)

    async def verify_registration(self, phone_number_id: str) -> bool:
        """Check if a phone number is registered with WhatsApp Cloud API."""
        try:
            # Try to get phone number details - this will fail if not registered
            await self.get_single_phone_number(phone_number_id)
            return True
        except Exception as e:
            if "not registered" in str(e).lower():
                return False
            raise 

    async def get_template_content(self, phone_number_id: str, template_name: str):
        """Fetch template content from Meta/WhatsApp API"""
        try:
            url = f"{self.base_url}/{self.version}/{self.business_id}/message_templates"
            params = {
                "name": template_name,
                "fields": "name,components,language,status"
            }
            
            logger.debug(f"Fetching template content from: {url}")
            logger.debug(f"Parameters: {params}")
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    url,
                    headers=self.headers,
                    params=params
                )
                
                logger.debug(f"Response status: {response.status_code}")
                logger.debug(f"Response body: {response.text}")
                
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=f"Failed to fetch template content: {response.text}"
                    )
                    
                data = response.json()
                templates = data.get("data", [])
                
                # Find the specific template by name
                template = None
                for t in templates:
                    if t.get("name") == template_name:
                        template = t
                        break
                        
                if not template:
                    raise HTTPException(
                        status_code=404,
                        detail=f"Template {template_name} not found"
                    )
                
                # Process components into the expected format
                content = {
                    "header": None,
                    "body": None,
                    "footer": None,
                    "buttons": []
                }
                
                for component in template.get("components", []):
                    component_type = component.get("type", "").lower()
                    
                    if component_type == "header":
                        content["header"] = {
                            "format": component.get("format", "text").lower(),
                            "text": component.get("text", "")
                        }
                    elif component_type == "body":
                        content["body"] = component.get("text", "")
                    elif component_type == "footer":
                        content["footer"] = component.get("text", "")
                    elif component_type == "buttons":
                        content["buttons"] = [
                            {
                                "type": btn.get("type", ""),
                                "text": btn.get("text", ""),
                                "url": btn.get("url", "") if btn.get("type") == "URL" else None
                            }
                            for btn in component.get("buttons", [])
                        ]
                
                # Return the processed template data
                return {
                    "name": template.get("name", ""),
                    "language": template.get("language", ""),
                    "status": template.get("status", ""),
                    "content": content
                }
                
        except HTTPException as http_error:
            logger.error(f"HTTP error in get_template_content: {str(http_error)}")
            raise http_error
        except Exception as e:
            logger.error(f"Error in get_template_content: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Internal server error: {str(e)}"
            ) 

class WhatsAppWebhook:
    def __init__(self):
        self.app_secret = settings.APP_SECRET
        self.verify_token = settings.VERIFY_TOKEN

    async def verify_webhook(self, mode: str, token: str, challenge: str) -> int:
        """Verify webhook subscription"""
        if mode == 'subscribe' and token == self.verify_token:
            return int(challenge)
        raise HTTPException(status_code=403, detail="Webhook verification failed")

    def verify_signature(self, request: Request, payload: bytes) -> bool:
        """Verify that the webhook payload is from Meta"""
        signature = request.headers.get('x-hub-signature-256', '')
        
        if not signature:
            return False
            
        expected_signature = hmac.new(
            self.app_secret.encode('utf-8'),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(f'sha256={expected_signature}', signature)

    async def handle_webhook(self, payload: Dict[str, Any]):
        """Handle incoming webhook events"""
        try:
            if payload['object'] != 'whatsapp_business_account':
                raise HTTPException(status_code=400, detail="Invalid webhook object")

            for entry in payload['entry']:
                for change in entry['changes']:
                    await self._process_webhook_change(change)
                    
        except Exception as e:
            logger.error(f"Error processing webhook: {str(e)}")
            raise HTTPException(status_code=500, detail="Error processing webhook")

    async def _process_webhook_change(self, change: Dict[str, Any]):
        """Process different types of webhook changes"""
        field = change['field']
        value = change['value']

        handlers = {
            'messages': self._handle_message,
            'message_template_status_update': self._handle_template_status,
            'phone_number_quality_update': self._handle_quality_update,
            # Add more handlers as needed
        }

        handler = handlers.get(field)
        if handler:
            await handler(value)
        else:
            logger.info(f"Unhandled webhook field: {field}")

    async def _handle_message(self, value: Dict[str, Any]):
        """Handle incoming messages"""
        # Implement message handling logic
        logger.info(f"Received message: {value}")

    async def _handle_template_status(self, value: Dict[str, Any]):
        """Handle template status updates"""
        logger.info(f"Template status update: {value}")

    async def _handle_quality_update(self, value: Dict[str, Any]):
        """Handle phone number quality updates"""
        logger.info(f"Quality update: {value}") 