import json
import re
from typing import Any, Dict

from loguru import logger


def process_text_for_whatsapp(text: str) -> str:
    """Format text for WhatsApp markdown style."""
    # Remove brackets
    pattern = r"\【.*?\】"
    text = re.sub(pattern, "", text).strip()

    # Pattern to find double asterisks including the word(s) in between
    pattern = r"\*\*(.*?)\*\*"
    # Replacement pattern with single asterisks
    replacement = r"*\1*"
    # Substitute occurrences of the pattern with the replacement
    whatsapp_style_text = re.sub(pattern, replacement, text)

    return whatsapp_style_text


def get_text_message_input(recipient: str, text: str) -> str:
    """Generate WhatsApp text message payload."""
    return json.dumps(
        {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": recipient,
            "type": "text",
            "text": {"preview_url": False, "body": text},
        }
    )


def log_http_response(response: Any) -> None:
    """Log HTTP response details."""
    logger.info("Status: %s", response.status_code)
    logger.info("Content-type: %s", response.headers.get('content-type'))
    logger.info("Body: %s", response.text)


def is_valid_whatsapp_message(body: Dict[str, Any]) -> bool:
    """Validate if the webhook payload contains a valid WhatsApp message."""
    try:
        logger.info("Validating WhatsApp message payload:")
        logger.info(json.dumps(body, indent=2))

        # Check for entry array
        entries = body.get("entry", [])
        if not entries:
            logger.error("No entries found in webhook payload")
            return False

        # Get the first entry
        entry = entries[0]
        changes = entry.get("changes", [])
        if not changes:
            logger.error("No changes found in entry")
            return False

        # Get the first change
        change = changes[0]
        value = change.get("value", {})
        
        # Check for messages array
        messages = value.get("messages", [])
        if not messages:
            logger.error("No messages found in value")
            return False

        logger.info("✅ Valid WhatsApp message payload")
        return True

    except Exception as e:
        logger.error(f"Error validating WhatsApp message: {str(e)}")
        return False


def extract_whatsapp_message_data(body: Dict[str, Any]) -> Dict[str, Any]:
    """Extract relevant data from WhatsApp webhook payload."""
    try:
        logger.info("Extracting message data from payload:")
        logger.info(json.dumps(body, indent=2))

        # Get the message from the webhook payload
        entry = body["entry"][0]
        change = entry["changes"][0]
        value = change["value"]
        message = value["messages"][0]
        contact = value["contacts"][0]

        # Extract message data
        message_data = {
            "from": message["from"],
            "wa_id": contact["wa_id"],
            "name": contact["profile"]["name"],
            "message_id": message["id"],
            "timestamp": message["timestamp"],
            "type": message["type"],
            "message": message["text"]["body"] if message["type"] == "text" else "",
        }

        logger.info("Extracted message data:")
        logger.info(json.dumps(message_data, indent=2))

        return message_data

    except Exception as e:
        logger.error(f"Error extracting message data: {str(e)}", exc_info=True)
        raise
