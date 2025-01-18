from pydantic import BaseModel

class DashboardStats(BaseModel):
    active_campaigns: int
    total_messages: int
    response_rate: float
    active_campaigns_change: float
    total_messages_change: float
    response_rate_change: float 