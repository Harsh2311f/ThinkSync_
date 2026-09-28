from __future__ import annotations

import json
from datetime import datetime, timezone

import joblib
import numpy as np
from sklearn.metrics import accuracy_score, f1_score, mean_absolute_error, mean_squared_error, r2_score, roc_auc_score
from sklearn.model_selection import train_test_split

from app.ml.config.settings import (
    DURATION_MODEL_FILE,
    FREIGHT_MODEL_FILE,
    METRICS_FILE,
    MODEL_DIR,
    OVERRUN_MODEL_FILE,
    RANDOM_STATE,
    RISK_MODEL_FILE,
    TEST_SIZE,
)
from app.ml.features.builder import (
    DURATION_FEATURES,
    FREIGHT_FEATURES,
    OVERRUN_FEATURES,
    RISK_FEATURES,
    block_training_frame,
    freight_training_frame,
    task_training_frame,
)
from app.ml.training.data_loader import load_training_data
from app.ml.training.pipelines import classification_pipeline, regression_pipeline


def _rmse(y_true, y_pred) -> float:
    return float(mean_squared_error(y_true, y_pred) ** 0.5)


def train_risk(task_frame):
    frame = task_frame.dropna(subset=["severity"]).copy()
    X = frame[RISK_FEATURES]
    y = frame["severity"].astype(str)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    pipeline = classification_pipeline(X_train, RISK_FEATURES)
    pipeline.fit(X_train, y_train)
    prediction = pipeline.predict(X_test)
    probability = pipeline.predict_proba(X_test)
    confidence = np.max(probability, axis=1)
    artifact = {
        "pipeline": pipeline,
        "features": RISK_FEATURES,
        "classes": list(pipeline.named_steps["model"].classes_),
        "validation_mean_confidence": float(np.mean(confidence)),
    }
    joblib.dump(artifact, RISK_MODEL_FILE, compress=3)
    return {
        "samples": int(len(frame)),
        "accuracy": float(accuracy_score(y_test, prediction)),
        "f1_macro": float(f1_score(y_test, prediction, average="macro", zero_division=0)),
        "mean_confidence": float(np.mean(confidence)),
    }


def train_duration(task_frame):
    frame = task_frame.dropna(subset=["actual_repair_min", "severity"]).copy()
    X = frame[DURATION_FEATURES]
    y = frame["actual_repair_min"].astype(float)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
    )
    pipeline = regression_pipeline(X_train, DURATION_FEATURES)
    pipeline.fit(X_train, y_train)
    prediction = pipeline.predict(X_test)
    residual = np.abs(y_test.to_numpy() - prediction)
    buffer_80 = float(np.quantile(residual, 0.80))
    buffer_90 = float(np.quantile(residual, 0.90))
    artifact = {
        "pipeline": pipeline,
        "features": DURATION_FEATURES,
        "residual_buffer_80": buffer_80,
        "residual_buffer_90": buffer_90,
        "validation_mae": float(mean_absolute_error(y_test, prediction)),
    }
    joblib.dump(artifact, DURATION_MODEL_FILE, compress=3)
    return {
        "samples": int(len(frame)),
        "mae": float(mean_absolute_error(y_test, prediction)),
        "rmse": _rmse(y_test, prediction),
        "r2": float(r2_score(y_test, prediction)),
        "residual_buffer_80": buffer_80,
        "residual_buffer_90": buffer_90,
    }


def train_overrun(block_frame):
    frame = block_frame.dropna(subset=["overrun_flag"]).copy()
    X = frame[OVERRUN_FEATURES]
    y = frame["overrun_flag"].astype(int)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    pipeline = classification_pipeline(X_train, OVERRUN_FEATURES)
    pipeline.fit(X_train, y_train)
    prediction = pipeline.predict(X_test)
    probability = pipeline.predict_proba(X_test)
    positive_index = list(pipeline.named_steps["model"].classes_).index(1)
    positive_probability = probability[:, positive_index]
    artifact = {"pipeline": pipeline, "features": OVERRUN_FEATURES}
    joblib.dump(artifact, OVERRUN_MODEL_FILE, compress=3)
    return {
        "samples": int(len(frame)),
        "accuracy": float(accuracy_score(y_test, prediction)),
        "f1": float(f1_score(y_test, prediction, zero_division=0)),
        "roc_auc": float(roc_auc_score(y_test, positive_probability)),
    }


def train_freight(freight_frame):
    frame = freight_frame.dropna(subset=["goods_count"]).copy()
    X = frame[FREIGHT_FEATURES]
    y = frame["goods_count"].astype(float)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
    )
    pipeline = regression_pipeline(X_train, FREIGHT_FEATURES)
    pipeline.fit(X_train, y_train)
    prediction = pipeline.predict(X_test)
    artifact = {
        "pipeline": pipeline,
        "features": FREIGHT_FEATURES,
        "validation_mae": float(mean_absolute_error(y_test, prediction)),
    }
    joblib.dump(artifact, FREIGHT_MODEL_FILE, compress=3)
    return {
        "samples": int(len(frame)),
        "mae": float(mean_absolute_error(y_test, prediction)),
        "rmse": _rmse(y_test, prediction),
        "r2": float(r2_score(y_test, prediction)),
    }


def main() -> None:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    data = load_training_data()

    print("Preparing ThinkSync Module 2 training frames...")
    task_frame = task_training_frame(data["tasks"])
    block_frame = block_training_frame(data["blocks"])
    freight_frame = freight_training_frame(data["movements"], data["sections"])

    print(f"Tasks: {len(task_frame):,}")
    print(f"Blocks: {len(block_frame):,}")
    print(f"Freight windows: {len(freight_frame):,}")

    print("\nTraining risk model...")
    risk_metrics = train_risk(task_frame)
    print(risk_metrics)

    print("\nTraining duration model...")
    duration_metrics = train_duration(task_frame)
    print(duration_metrics)

    print("\nTraining overrun model...")
    overrun_metrics = train_overrun(block_frame)
    print(overrun_metrics)

    print("\nTraining freight model...")
    freight_metrics = train_freight(freight_frame)
    print(freight_metrics)

    metrics = {
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "risk": risk_metrics,
        "duration": duration_metrics,
        "overrun": overrun_metrics,
        "freight": freight_metrics,
    }
    METRICS_FILE.write_text(json.dumps(metrics, indent=2), encoding="utf-8")

    print("\nModule 2 baseline training complete.")
    print(f"Models saved in: {MODEL_DIR}")
    print(f"Metrics saved to: {METRICS_FILE}")


if __name__ == "__main__":
    main()
