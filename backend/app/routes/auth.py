from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
import httpx
import os

router = APIRouter()

GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:8000')

@router.get("/auth/github")
async def github_login():
    return RedirectResponse(
        f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&redirect_uri={BACKEND_URL}/auth/github/callback"
    )

@router.get("/auth/github/callback")
async def github_callback(code: str):
    # Exchange code for access token
    token_url = "https://github.com/login/oauth/access_token"
    async with httpx.AsyncClient() as client:
        response = await client.post(
            token_url,
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code
            },
            headers={"Accept": "application/json"}
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        token_data = response.json()
        access_token = token_data.get("access_token")
        
        # Get user data from GitHub
        user_response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json"
            }
        )
        
        if user_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get user data")
        
        user_data = user_response.json()
        
        # Here you would typically:
        # 1. Create or update user in your database
        # 2. Generate a JWT token
        # 3. Set up session/cookies if needed
        
        # Redirect to frontend with token/user data
        return RedirectResponse(
            f"{FRONTEND_URL}/auth/callback?token={access_token}&user={user_data['login']}"
        ) 