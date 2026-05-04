# DataSense AI – Explainable Data Quality & AutoML Platform

A production-ready full-stack web application for intelligent data analysis, automated cleaning, EDA visualization, ML model training, and SHAP explainability.

---

## 🏗 Architecture

```
datasense-ai/
├── backend/                    # FastAPI Python backend
│   ├── main.py                 # App entry point + CORS
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── routes/
│   │   ├── upload.py           # POST /upload – CSV ingestion
│   │   ├── quality.py          # GET  /quality/{id} – quality report
│   │   ├── cleaning.py         # POST /clean – data cleaning
│   │   ├── eda.py              # GET  /eda/{id} – chart data
│   │   ├── insights.py         # GET  /insights/{id} – text insights
│   │   ├── ml.py               # POST /train – AutoML
│   │   ├── xai.py              # GET  /xai/{id} – SHAP explanations
│   │   └── download.py         # GET  /download/{id}/csv|report
│   ├── services/
│   │   ├── data_quality.py     # Quality scoring engine
│   │   ├── cleaning.py         # Smart cleaning service
│   │   ├── eda.py              # Plotly chart generation
│   │   ├── insights.py         # Automated insight engine
│   │   ├── ml_model.py         # RandomForest AutoML
│   │   └── xai.py              # SHAP TreeExplainer
│   └── utils/
│       └── helpers.py          # JSON serialization utils
│
└── frontend/                   # React + Vite + Tailwind
    ├── src/
    │   ├── App.jsx             # Router + Global context
    │   ├── main.jsx
    │   ├── index.css           # Tailwind + custom styles
    │   ├── services/
    │   │   └── api.js          # Axios service layer
    │   ├── components/
    │   │   ├── Sidebar.jsx     # Navigation sidebar
    │   │   ├── PageHeader.jsx
    │   │   ├── PlotlyChart.jsx # Plotly wrapper
    │   │   ├── ScoreGauge.jsx  # SVG score gauges
    │   │   ├── DataTable.jsx   # Data preview table
    │   │   ├── LoadingSpinner.jsx
    │   │   └── EmptyState.jsx
    │   └── pages/
    │       ├── UploadPage.jsx  # Drag & drop CSV upload
    │       ├── QualityPage.jsx # Quality dashboard
    │       ├── CleaningPage.jsx # Cleaning panel
    │       ├── EDAPage.jsx     # Interactive EDA + insights
    │       └── MLPage.jsx      # AutoML + SHAP XAI
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── Dockerfile
```

---

## 🚀 Quick Start

### Option 1: Manual (Recommended for Development)

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API is now at: http://localhost:8000  
Swagger docs: http://localhost:8000/docs

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:5173

---

### Option 2: Docker Compose

```bash
docker-compose up --build
```

---

## 🔥 Features

### 1. CSV Upload
- Drag & drop or click to upload
- Preview first 10 rows
- Auto-detect column types (numeric / categorical)
- Supports up to 100K rows, 100MB files

### 2. Data Quality Engine
Computes a weighted score (0–100) across:
- **Completeness** (35%) – missing value ratio
- **Uniqueness** (25%) – duplicate row detection
- **Outlier Score** (25%) – IQR-based outlier detection
- **Validity** (15%) – data type consistency

### 3. Smart Cleaning
- Auto/mean/median/mode imputation per column
- Duplicate row removal
- IQR or Z-Score outlier clipping
- Detailed cleaning log
- Download cleaned CSV

### 4. Advanced EDA (Plotly)
Interactive charts include:
- Histograms with hover tooltips
- Multi-column box plots
- Correlation heatmap (zoomable)
- Scatter plot (highest-correlated pair)
- Missing values bar chart
- Categorical value distribution bars
- Data type pie chart

### 5. Insight Engine
Auto-generates human-readable insights:
- Skewness detection (moderate & severe)
- Strong correlations (|r| > 0.8)
- Class imbalance in categorical columns
- Near-zero variance columns
- High-cardinality categoricals
- Constant column detection
- Dataset summary

### 6. AutoML
- Automatic task detection (classification vs regression)
- RandomForest (100 estimators)
- Metrics: Accuracy, F1, RMSE, MAE, R²
- Full classification report
- Feature importance ranking

### 7. SHAP Explainability (XAI)
- Global feature importance (mean |SHAP|)
- SHAP summary bar chart
- SHAP waterfall chart (first prediction)
- Individual prediction breakdown with directional bars
- Graceful fallback to model feature importance

### 8. Downloads
- Cleaned CSV
- Full JSON report (quality + insights + model metrics)

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload CSV file |
| GET | `/api/quality/{session_id}` | Data quality report |
| GET | `/api/quality/{session_id}/suggestions` | Cleaning suggestions |
| POST | `/api/clean` | Apply cleaning |
| GET | `/api/eda/{session_id}` | EDA chart data |
| GET | `/api/insights/{session_id}` | Text insights |
| POST | `/api/train` | Train AutoML model |
| GET | `/api/xai/{session_id}` | SHAP explanations |
| GET | `/api/download/{session_id}/csv` | Download cleaned CSV |
| GET | `/api/download/{session_id}/report` | Download JSON report |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Charts | Plotly.js (primary) |
| HTTP Client | Axios |
| Backend | FastAPI, Uvicorn |
| Data | Pandas, NumPy |
| ML | Scikit-learn (RandomForest) |
| XAI | SHAP (TreeExplainer) |
| UI State | React Context + Hooks |

---

## ⚠️ Edge Cases Handled

- Empty CSV → HTTP 400 with clear message
- Non-CSV file → rejected at upload
- >100K rows → auto-truncated
- Non-numeric target → auto label-encoded
- SHAP failure → graceful fallback to RF importance
- Missing target column → HTTP 400
- Too little data (<10 rows) → training rejected
- Constant/zero-variance columns → auto-detected in insights
- Large datasets → 200-row SHAP sampling for performance

---

## 📝 License

MIT
