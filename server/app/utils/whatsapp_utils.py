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
    """Check if the incoming webhook event has a valid WhatsApp message structure.
    """
    return (
        body.get("object")
        and body.get("entry")
        and body["entry"][0].get("changes")
        and body["entry"][0]["changes"][0].get("value")
        and body["entry"][0]["changes"][0]["value"].get("messages")
        and body["entry"][0]["changes"][0]["value"]["messages"][0]
    )


def extract_whatsapp_message_data(body: Dict[str, Any]) -> Dict[str, str]:
    """Extract relevant data from WhatsApp message webhook."""
    try:
        wa_id = body["entry"][0]["changes"][0]["value"]["contacts"][0]["wa_id"]
        name = body["entry"][0]["changes"][0]["value"]["contacts"][0]["profile"]["name"]
        message = body["entry"][0]["changes"][0]["value"]["messages"][0]
        message_body = message["text"]["body"]

        return {"wa_id": wa_id, "name": name, "message": message_body}
    except (KeyError, IndexError) as e:
        logger.error("Error extracting WhatsApp message data: %s", str(e))
        raise ValueError("Invalid message format") from e
