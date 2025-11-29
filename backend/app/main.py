from fastapi import FastAPI
from .routes.company_routes import router as company_router
from .routes.industry_routes import router as industry_router

app = FastAPI(title="PAK Industry Insight API")

@app.get("/")
def root():
    return {"message": "Backend API Working!"}

app.include_router(company_router)
app.include_router(industry_router)
