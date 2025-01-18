from datetime import datetime
import uuid
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.campaign import Campaign
from app.schemas.campaign import CampaignCreate, CampaignUpdate
from app.services.whatsapp_service import WhatsAppService

class CampaignService:
    def __init__(self, db: Session, whatsapp_service: WhatsAppService):
        self.db = db
        self.whatsapp_service = whatsapp_service

    def create_campaign(self, user_id: str, campaign_in: CampaignCreate) -> Campaign:
        """Create a new campaign."""
        campaign = Campaign(
            id=str(uuid.uuid4()),
            user_id=user_id,
            **campaign_in.dict()
        )
        self.db.add(campaign)
        self.db.commit()
        self.db.refresh(campaign)
        return campaign

    def get_campaign(self, campaign_id: str) -> Optional[Campaign]:
        """Get a campaign by ID."""
        return self.db.query(Campaign).filter(Campaign.id == campaign_id).first()

    def get_user_campaigns(self, user_id: str) -> List[Campaign]:
        """Get all campaigns for a user."""
        return self.db.query(Campaign).filter(Campaign.user_id == user_id).all()

    def update_campaign(self, campaign_id: str, campaign_in: CampaignUpdate) -> Optional[Campaign]:
        """Update a campaign."""
        campaign = self.get_campaign(campaign_id)
        if not campaign:
            return None

        update_data = campaign_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(campaign, field, value)

        self.db.commit()
        self.db.refresh(campaign)
        return campaign

    async def process_campaign(self, campaign_id: str) -> Campaign:
        """Process a campaign by sending messages to all recipients."""
        campaign = self.get_campaign(campaign_id)
        if not campaign:
            raise ValueError("Campaign not found")

        campaign.status = "in_progress"
        campaign.updated_at = datetime.utcnow()
        self.db.commit()

        try:
            if campaign.recipient_type == "individual":
                for recipient in campaign.recipients:
                    try:
                        await self.whatsapp_service.send_template_message(
                            phone_number=recipient,
                            template_name=campaign.template_name,
                            template_data={
                                "language": {"code": campaign.template_language},
                                "components": campaign.template_components
                            }
                        )
                        campaign.sent_count += 1
                    except Exception as e:
                        campaign.error_count += 1
                        # Log the error but continue with other recipients
                        print(f"Error sending to {recipient}: {str(e)}")

            campaign.status = "completed"
            campaign.completed_at = datetime.utcnow()

        except Exception as e:
            campaign.status = "failed"
            raise e

        finally:
            campaign.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(campaign)

        return campaign 