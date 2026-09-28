from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[3]
DATA_DIR = PROJECT_ROOT / "data" / "unified"
MODEL_DIR = PROJECT_ROOT / "app" / "ml" / "models"

RANDOM_STATE = 42
TEST_SIZE = 0.20

RISK_MODEL_FILE = MODEL_DIR / "risk_model.joblib"
DURATION_MODEL_FILE = MODEL_DIR / "duration_model.joblib"
OVERRUN_MODEL_FILE = MODEL_DIR / "overrun_model.joblib"
FREIGHT_MODEL_FILE = MODEL_DIR / "freight_model.joblib"
METRICS_FILE = MODEL_DIR / "training_metrics.json"

SEVERITY_RISK_VALUE = {
    "Low": 20.0,
    "Medium": 45.0,
    "High": 72.0,
    "Critical": 92.0,
}

OVERRUN_LOW_THRESHOLD = 0.30
OVERRUN_HIGH_THRESHOLD = 0.65
