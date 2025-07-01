import os
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.datastructures import Secret
from schema import ( FoodIn,
                     FoodOut,
                     FoodUpdate,
                     NotificationOut,
                     LoginCredentials,
                     SuccessResponse,
                     SecretResponse,
                     UserPublicDetails)
import db
from recipes import fetch_recipes
from dotenv import load_dotenv
load_dotenv()


origins = ["http://localhost:5173", "dpg-d108v4e3jp1c739o6pp0-a", "https://wastenot-frontend-e09l.onrender.com", "https://www.wastenotkitchen.com", "https://wastenotkitchen.com"]

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
    same_site="lax",
    https_only=False,     # set True when deployed with HTTPS
)


@app.get("/api/food-items", response_model=list[FoodOut])
async def get_food_items() -> list[FoodOut]:
    return db.get_food_items()


@app.post("/api/food-items", response_model=FoodOut)
async def create_food_item(item: FoodIn) -> FoodOut:
    item = db.create_food_item(item)
    return item


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
def get_notifications() -> list[NotificationOut]:
    db.check_expiring_items()
    return db.get_notifications()


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
async def signup(
    credentials: LoginCredentials, request: Request
) -> SuccessResponse:
    username = credentials.username
    password = credentials.password

    if not username or not password:
        raise HTTPException(
            status_code=400, detail="Username and password required"
        )

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
