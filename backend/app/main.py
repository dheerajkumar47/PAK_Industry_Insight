from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "PAK Industry Insight API is running"}
