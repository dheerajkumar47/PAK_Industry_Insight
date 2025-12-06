from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth_routes, company_routes, industry_routes, news_routes

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

app.include_router(auth_routes.router)
app.include_router(company_routes.router)
app.include_router(industry_routes.router)
app.include_router(news_routes.router)
