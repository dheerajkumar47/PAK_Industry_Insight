from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.company_routes import router as company_router
from .routes.industry_routes import router as industry_router
from .routes.auth_routes import router as auth_router

from .config import settings

app = FastAPI(title="PAK Industry Insight API")

@app.on_event("startup")
async def startup_event():
    print(f"Startup Config: GOOGLE_CLIENT_ID={settings.GOOGLE_CLIENT_ID[:10]}... (masked)")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev (fixes port 3001 issue)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend API Working!"}

app.include_router(auth_router)
app.include_router(company_router)
app.include_router(industry_router)
