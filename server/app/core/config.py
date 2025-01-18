from typing import List, Union

from pydantic import validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "WhatsApp Bot API"

    # CORS Configuration
    CORS_ORIGINS: List[str] = ["*"]

    @validator("CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v

    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True

    # Database Configuration
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "waspy"
    POSTGRES_PASSWORD: str = "waspy"
    POSTGRES_DB: str = "waspy"
    POSTGRES_PORT: str = "5433"

    @property
    def DATABASE_URL(self) -> str:
        """Get database URL."""
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # WhatsApp Configuration
    WHATSAPP_TOKEN: str
    PHONE_NUMBER_ID: str
    VERSION: str = "v21.0"
    BUSINESS_ID: str
    WEBHOOK_URL: str
    VERIFY_TOKEN: str
    APP_ID: str
    APP_SECRET: str

    @property
    def WHATSAPP_API_URL(self) -> str:
        return f"https://graph.facebook.com/{self.VERSION}"

    # OpenAI Configuration
    OPENAI_API_KEY: str
    OPENAI_ASSISTANT_ID: str
    OPENAI_MODEL: str = "gpt-4o-mini"

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings = Settings()
