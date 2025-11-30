from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.company_routes import router as company_router
from .routes.industry_routes import router as industry_router
from .routes.auth_routes import router as auth_router

app = FastAPI(title="PAK Industry Insight API")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"], # React/Vite ports
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
