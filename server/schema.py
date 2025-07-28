from pydantic import BaseModel
from datetime import date, datetime


class FoodIn(BaseModel):
    name: str
    expiration_date: date
    category_id: int


class FoodOut(FoodIn):
    id: int
    added_by_id: int
    household_id: int

    class Config:
        orm_mode = True


class FoodUpdate(BaseModel):
    name: str | None = None
    expiration_date: date | None = None
    category_id: int | None = None


class NotificationIn(BaseModel):
    message: str
    created_at: datetime
    food_id: int


class NotificationOut(NotificationIn):
    notification_id: int

    class Config:
        orm_mode = True


class LoginCredentials(BaseModel):
    username: str
    password: str


class SuccessResponse(BaseModel):
    success: bool


class SecretResponse(BaseModel):
    secret: str


class UserPublicDetails(BaseModel):
    username: str
    household_id: int | None = None


class UserIn(BaseModel):
    id: int
    username: str
    session_expires_at: datetime | None = None

    class Config:
        orm_mode = True


class FavoriteRecipeIn(BaseModel):
    recipe_id: str  # making it a string in case we change the api and it's not numeric
    title: str
    image_url: str | None = None


class FavoriteRecipeOut(FavoriteRecipeIn):
    id: int

    model_config = {"from_attributes": True}


class HouseholdIn(BaseModel):
    name: str


class HouseholdOut(HouseholdIn):
    id: int
    invite_id: str
    admin_user_id: int

    class Config:
        orm_mode = True


class HouseholdMembershipOut(BaseModel):
    id: int
    user_id: int
    household_id: int
    pending: bool

    class Config:
        orm_mode = True
