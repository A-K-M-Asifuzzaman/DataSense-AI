"""
Download routes — cleaned CSV and full JSON report.
All numpy/pandas types sanitised before JSON serialisation.
"""
import io
import json
import numpy as np
import pandas as pd
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from routes.upload import DATA_STORE

router = APIRouter()

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "*",
}


# ── helpers ────────────────────────────────────────────────────────────────
def _sanitize(obj):
    """Recursively make obj JSON-safe."""
    if isinstance(obj, dict):
        return {k: _sanitize(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_sanitize(v) for v in obj]
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        f = float(obj)
        return None if (np.isnan(f) or np.isinf(f)) else f
    if isinstance(obj, np.ndarray):
        return _sanitize(obj.tolist())
    if isinstance(obj, pd.DataFrame):
        return _sanitize(obj.to_dict(orient="records"))
    if isinstance(obj, pd.Series):
        return _sanitize(obj.tolist())
    return obj


# ── routes ─────────────────────────────────────────────────────────────────
@router.get("/download/{session_id}/csv")
async def download_cleaned_csv(session_id: str):
    if session_id not in DATA_STORE:
        raise HTTPException(status_code=404, detail="Session not found.")

    store = DATA_STORE[session_id]
    df = store["cleaned"] if store.get("cleaned") is not None else store["original"]
    filename = store.get("filename", "data.csv").replace(".csv", "_cleaned.csv")

    output = io.StringIO()
    df.to_csv(output, index=False)
    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            **CORS_HEADERS,
            "Content-Disposition": f"attachment; filename={filename}",
        },
    )


@router.get("/download/{session_id}/report")
async def download_report(session_id: str):
    if session_id not in DATA_STORE:
        raise HTTPException(status_code=404, detail="Session not found.")

    store    = DATA_STORE[session_id]
    df_orig  = store["original"]
    df_clean = store.get("cleaned")
    model_result = store.get("model_result")

    from services.data_quality import compute_quality_report
    from services.insights import generate_insights

    report = {
        "session_id":    session_id,
        "filename":      store.get("filename", "unknown"),
        "original_shape": {
            "rows":    int(len(df_orig)),
            "columns": int(len(df_orig.columns)),
        },
        "quality_report": compute_quality_report(df_orig),
        "insights":       generate_insights(df_orig),
    }

    if df_clean is not None:
        report["cleaned_shape"] = {
            "rows":    int(len(df_clean)),
            "columns": int(len(df_clean.columns)),
        }

    if model_result:
        # Only serialisable scalar fields
        SKIP = {"model", "X_test", "y_test", "X_train"}
        safe_model = {k: v for k, v in model_result.items() if k not in SKIP}
        report["model_results"] = safe_model

    # Sanitise every numpy/pandas type before hand-off to JSONResponse
    clean_report = _sanitize(report)

    return JSONResponse(
        content=clean_report,
        headers={
            **CORS_HEADERS,
            "Content-Disposition": "attachment; filename=datasense_report.json",
        },
    )
