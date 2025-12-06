from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import timedelta
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from ..database import db
from ..schemas.user_schema import (
    UserCreate,
    UserResponse,
    UserInDB,
    Token,
    TokenData,
    UserLogin,
    GoogleLogin,
    SimplePasswordReset,
    UserUpdate
)
from ..utils.auth import get_password_hash, verify_password, create_access_token
from ..config import settings
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = db.users.find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception
    
    # Convert _id to id for response
    user["id"] = str(user["_id"])
    return user

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    print(f"DEBUG: Register attempt for {user.email}")
    # Check if user already exists
    if db.users.find_one({"email": user.email}):
        print("DEBUG: Email already registered")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_in_db = UserInDB(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    
    # Insert into DB
    try:
        print("DEBUG: Attempting to insert user into DB...")
        new_user = db.users.insert_one(user_in_db.dict())
        print(f"DEBUG: User inserted with ID: {new_user.inserted_id}")
        created_user = db.users.find_one({"_id": new_user.inserted_id})
        
        # Format response
        created_user["id"] = str(created_user["_id"])
        return created_user
    except Exception as e:
        print(f"ERROR: Database insertion failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=Token)
async def login(form_data: UserLogin):
    user = db.users.find_one({"email": form_data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.post("/google", response_model=Token)
async def google_login(payload: GoogleLogin):
    print(f"DEBUG: Google login request received")
    if not settings.GOOGLE_CLIENT_ID:
        print("ERROR: GOOGLE_CLIENT_ID is not set in settings")
        raise HTTPException(status_code=500, detail="Google login not configured")
    
    print(f"DEBUG: Verifying token with Client ID: {settings.GOOGLE_CLIENT_ID}")
    try:
        idinfo = id_token.verify_oauth2_token(
            payload.credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
        print("DEBUG: Token verified successfully")
    except Exception as e:
        print(f"ERROR: Token verification failed: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid Google token: {str(e)}")

    email = idinfo.get("email")
    full_name = idinfo.get("name")
    picture = idinfo.get("picture")

    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email")

    user = db.users.find_one({"email": email})

    if not user:
        # Create a user for Google login without a local password
        user_in_db = UserInDB(
            email=email,
            full_name=full_name,
            picture=picture,
            hashed_password="",  # marker for Google-only accounts
        )
        new_user = db.users.insert_one(user_in_db.dict())
        user = db.users.find_one({"_id": new_user.inserted_id})
    else:
        # Update existing user's picture and name if they log in with Google again
        update_fields = {}
        if picture and user.get("picture") != picture:
            update_fields["picture"] = picture
        
        if full_name and user.get("full_name") != full_name:
            update_fields["full_name"] = full_name
            
        if update_fields:
            db.users.update_one({"_id": user["_id"]}, {"$set": update_fields})
            # Update user dict in memory just for consistency, though currently unused for token
            user.update(update_fields)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/reset-password")
async def reset_password(payload: SimplePasswordReset):
    """
    Simple password reset: given an email and new password, update the stored hash.
    In a production app you would protect this with a reset token emailed to the user.
    """
    user = db.users.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Reuse the same password strength rules as registration
    try:
        UserCreate.validate_password_strength(payload.new_password)  # type: ignore[arg-type]
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Check if new password is same as old password
    if verify_password(payload.new_password, user["hashed_password"]):
        raise HTTPException(
            status_code=400, 
            detail="New password cannot be the same as the current password."
        )

    new_hashed = get_password_hash(payload.new_password)
    db.users.update_one({"_id": user["_id"]}, {"$set": {"hashed_password": new_hashed}})

    return {"message": "Password has been reset successfully"}

@router.put("/me", response_model=UserResponse)
async def update_user(user_update: UserUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    
    if not update_data:
        current_user["id"] = str(current_user["_id"])
        return current_user

    try:
        db.users.update_one({"_id": user_id}, {"$set": update_data})
        updated_user = db.users.find_one({"_id": user_id})
        updated_user["id"] = str(updated_user["_id"])
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update user: {str(e)}")
