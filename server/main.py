import os
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.datastructures import Secret
from schema import (
    FoodIn,
    FoodOut,
    FoodUpdate,
    NotificationOut,
    LoginCredentials,
    SuccessResponse,
    SecretResponse,
    UserPublicDetails,
    UserIn,
    FavoriteRecipeIn,
    FavoriteRecipeOut,
    HouseholdIn,
    HouseholdMembershipOut,
    HouseholdOut,
)
import db
from recipes import fetch_recipes
from models import DBAccount
from dotenv import load_dotenv
import re

load_dotenv()


origins = [
    "http://localhost:5173",
    "https://wastenot-frontend-e09l.onrender.com",
    "https://www.wastenotkitchen.com",
    "https://wastenotkitchen.com",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=Secret(os.getenv("SESSION_SECRET", "dev_secret")),
    session_cookie="session",
    max_age=60 * 60 * 2,
    same_site="none",  # set to none when deploying and set to lax when local
    https_only=True,  # set True when deployed with HTTPS
)



def get_current_user(request: Request) -> UserIn:
    username = request.session.get("username")
    session_token = request.session.get("session_token")

    if not isinstance(username, str) or not isinstance(session_token, str):
        raise HTTPException(status_code=401, detail="Not authenticated")

    if not db.validate_session(username, session_token):
        raise HTTPException(status_code=403, detail="Invalid session")

    user = db.get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


def get_current_household(request: Request) -> HouseholdOut:
    user=get_current_user(request)

    household = db.get_household_for_user(user.id)

    if not household:
        raise HTTPException(status_code=404, detail="Household not found")

    return household


@app.get("/api/households/current", response_model=HouseholdOut)
async def get_current_user_household(
    household: HouseholdOut = Depends(get_current_household),
) -> HouseholdOut:
    return household


@app.post("/api/households/join/{invite_id}")
def join_household_by_invite(invite_id: str, request: Request):
    user = get_current_user(request)

    household = db.get_household_by_invite_id(invite_id)
    if not household:
        raise HTTPException(status_code=404, detail="invalid invite")

    existing_household = db.get_household_for_user(user.id)
    if existing_household:
        raise HTTPException(status_code=409, detail="User already in a household")

    db.add_user_to_household(user.id, household.id, pending=False)
    #temporarily making pending=False
    #will change once we actually send out email invites that need to be accepted

    return {"message": "Household invite sent"}


@app.post("/api/households/accept") #while pending=False, this endpoint will be unused
def accept_household_invite(request: Request):
    user = get_current_user(request)
    membership = db.get_membership_for_user(user.id)

    if not membership:
        raise HTTPException(status_code=404, detail="No household membership found")

    if not membership.pending:
        raise HTTPException(status_code=400, detail="Membership already accepted")

    db.update_membership_pending_status(user.id, pending=False)

    return {"message": "Household invite accepted"}


@app.get("/api/households/membership", response_model=HouseholdMembershipOut)
def get_current_user_membership(request: Request):
    user = get_current_user(request)

    membership = db.get_membership_for_user(user.id)
    if not membership:
        raise HTTPException(status_code=404, detail="No household membership found")

    return membership

@app.delete("/api/households/membership")
def leave_household(current_user: UserIn = Depends(get_current_user)):

    membership = db.get_membership_for_user(current_user.id)
    if not membership:
        raise HTTPException(status_code=404, detail="No household membership found")

    household = db.get_household_by_id(membership.household_id)
    if household.admin_user_id==current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Admin cannot leave the household. Please transfer admin rights or delete household."
        )

    deleted_membership = db.delete_membership_by_user_id(current_user.id)

    if not deleted_membership:
        raise HTTPException(status_code=500, detail="Membership failed to delete")

    return {"message": "Left household successfully"}


@app.get("/api/food-items", response_model=list[FoodOut])
async def get_food_items_for_current_household(
    household: HouseholdOut = Depends(get_current_household),
) -> list[FoodOut]:
    return db.get_food_items(household.id)


@app.post("/api/food-items", response_model=FoodOut)
async def create_food_item(
    item: FoodIn, current_user: UserIn = Depends(get_current_user)
) -> FoodOut:
    food_item = db.create_food_item(item, current_user)

    if food_item is None:
        raise HTTPException(
            status_code=400, detail="User does not belong to a household"
        )
    return food_item


@app.get("/api/food-items/{id}", response_model=FoodOut)
async def get_food_item(id: int) -> FoodOut:
    return db.get_food_item(id)


@app.put("/api/food-items/{id}", response_model=FoodOut)
async def update_food_item(id: int, item: FoodUpdate) -> FoodOut:
    updated_item = db.update_food_item(id, item)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated_item


@app.delete("/api/food-items/{id}")
async def delete_food_item(id: int):
    deleted_item = db.delete_food_item(id)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return True


@app.get("/api/recipes")
def get_recipes(ingredients: str):
    recipes = fetch_recipes(ingredients)
    if not recipes:
        raise HTTPException(status_code=404, detail="Recipes not found")
    return recipes


@app.get("/api/notifications", response_model=list[NotificationOut])
def get_notifications_for_current_household(
    household: HouseholdOut = Depends(get_current_household),
) -> list[NotificationOut]:
    db.check_expiring_items()
    return db.get_notifications_for_current_household(household.id)


@app.post("/api/households", response_model=HouseholdOut)
def create_household(
    household: HouseholdIn, current_user: UserIn = Depends(get_current_user)
) -> HouseholdOut:
    return db.create_household(household, current_user)


# Endpoint to handle login requests
@app.post("/api/login", response_model=SuccessResponse)
async def session_login(
    credentials: LoginCredentials, request: Request
) -> SuccessResponse:

    username = credentials.username
    password = credentials.password
    new_session_token = db.validate_username_password(username, password)

    if not new_session_token:
        raise HTTPException(status_code=401)

    request.session["username"] = username
    request.session["session_token"] = new_session_token
    return SuccessResponse(success=True)


@app.get("/api/logout", response_model=SuccessResponse)
async def session_logout(request: Request) -> SuccessResponse:

    username = request.session.get("username")
    if not username and not isinstance(username, str):
        return SuccessResponse(success=False)
    session_token = request.session.get("session_token")
    if not session_token and not isinstance(session_token, str):
        return SuccessResponse(success=False)
    db.invalidate_session(username, session_token)
    request.session.clear()
    return SuccessResponse(success=True)


@app.post("/api/signup", response_model=SuccessResponse)
async def signup(credentials: LoginCredentials, request: Request) -> SuccessResponse:
    username = credentials.username
    password = credentials.password

    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password required")

    errors = []
    if len(password) < 8:
        errors.append("• Password must be at least 8 characters long")

    if not re.search(r"[A-Z]", password):
        errors.append("•Password must contain at least one uppercase letter")

    if not re.search(r"\d", password):
        errors.append("•Password must contain at least one number")

    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        errors.append("•Password must contain at least one special character")

    if errors:
        raise HTTPException(status_code=400, detail="\n".join(errors))

    success = db.create_user_account(username, password)
    if not success:
        raise HTTPException(status_code=409, detail="Username already exists")

    new_session_token = db.validate_username_password(username, password)
    request.session["username"] = username
    request.session["session_token"] = new_session_token
    return SuccessResponse(success=True)


# This is an authentication function which can be Depend'd
# on by a route to require authentication for access to the route.
# See the next route below (@app.get("/", ...)) for an example.
def get_auth_user(request: Request):
    """
    Dependency for protected routes.
    Verifies that the user has a valid session. Raises 401 if not
    authenticated, 403 if session is invalid. Returns True if
    authenticated.
    """
    """verify that user has a valid session"""
    username = request.session.get("username")
    if not username and not isinstance(username, str):
        raise HTTPException(status_code=401)
    session_token = request.session.get("session_token")
    if not session_token and not isinstance(session_token, str):
        raise HTTPException(status_code=401)
    if not db.validate_session(username, session_token):
        raise HTTPException(status_code=403)
    return True


# This is how to declare that a route is "protected" and requires
# that the user be logged in to access the content.
@app.get(
    "/api/secret",
    response_model=SecretResponse,
    dependencies=[Depends(get_auth_user)],
)
async def secret() -> SecretResponse:
    """
    Example protected route.
    Returns a secret message if the user is authenticated.
    """
    return SecretResponse(secret="info")


@app.get(
    "/api/me",
    response_model=UserPublicDetails,
    dependencies=[Depends(get_auth_user)],
)
async def get_me(request: Request) -> UserPublicDetails:
    """
    Returns the public details of the currently authenticated user.
    Raises 404 if the user is not found in the database.
    """
    username = request.session.get("username")
    if not isinstance(username, str):
        raise HTTPException(status_code=404, detail="User not found")
    user_details = db.get_user_public_details(username)
    if not user_details:
        raise HTTPException(status_code=404, detail="User not found")
    return user_details


@app.get("/api/favorite-recipes", response_model=list[FavoriteRecipeOut])
def get_favorites(current_user: UserIn = Depends(get_current_user)):
    return db.get_favorites(current_user)


@app.post("/api/favorite-recipes", response_model=FavoriteRecipeOut)
def add_favorite(
    recipe: FavoriteRecipeIn, current_user: UserIn = Depends(get_current_user)
):
    return db.add_favorite(recipe, current_user)


@app.delete("/api/favorite-recipes/{recipe_id}", response_model=SuccessResponse)
def delete_favorite(recipe_id: str, current_user: UserIn = Depends(get_current_user)):
    return db.delete_favorite(recipe_id, current_user)
