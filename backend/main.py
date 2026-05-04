from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes import upload, quality, cleaning, eda, insights, ml, xai, download

app = FastAPI(
    title="DataSense AI",
    description="Explainable Data Quality & AutoML Platform",
    version="1.0.0"
)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*",
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,   # must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Catch-all: ensure CORS headers survive unhandled 500 errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers=CORS_HEADERS,
    )

# Explicit OPTIONS preflight handler (belt-and-suspenders)
@app.options("/{full_path:path}")
async def preflight(full_path: str):
    return JSONResponse(content={}, headers=CORS_HEADERS)

app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(quality.router, prefix="/api", tags=["Quality"])
app.include_router(cleaning.router, prefix="/api", tags=["Cleaning"])
app.include_router(eda.router, prefix="/api", tags=["EDA"])
app.include_router(insights.router, prefix="/api", tags=["Insights"])
app.include_router(ml.router, prefix="/api", tags=["ML"])
app.include_router(xai.router, prefix="/api", tags=["XAI"])
app.include_router(download.router, prefix="/api", tags=["Download"])

@app.get("/")
def root():
    return {"message": "DataSense AI API is running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}
