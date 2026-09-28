from __future__ import annotations

from functools import lru_cache
from typing import Any

import joblib
import numpy as np
import pandas as pd

from app.ml.config.settings import (
    DURATION_MODEL_FILE,
    FREIGHT_MODEL_FILE,
    OVERRUN_HIGH_THRESHOLD,
    OVERRUN_LOW_THRESHOLD,
    OVERRUN_MODEL_FILE,
    RISK_MODEL_FILE,
    SEVERITY_RISK_VALUE,
)
from app.ml.features.builder import (
    DURATION_FEATURES,
    FREIGHT_FEATURES,
    OVERRUN_FEATURES,
    RISK_FEATURES,
    task_feature_row,
)


def _require(path):
    if not path.exists():
        raise RuntimeError(
            f"Module 2 model is not trained: {path.name}. "
            "Run: .\\venv\\Scripts\\python.exe -m app.ml.training.train_all"
        )
    return path


@lru_cache(maxsize=4)
def _load(path_str: str):
    return joblib.load(path_str)


def _artifact(path):
    path = _require(path)
    return _load(str(path))


def predict_risk(task: dict[str, Any]) -> dict[str, Any]:
    artifact = _artifact(RISK_MODEL_FILE)
    pipeline = artifact["pipeline"]
    row = task_feature_row(task)
    frame = pd.DataFrame([row], columns=RISK_FEATURES)
    probabilities = pipeline.predict_proba(frame)[0]
    classes = list(pipeline.named_steps["model"].classes_)
    best_index = int(np.argmax(probabilities))
    severity = str(classes[best_index])
    confidence = float(probabilities[best_index])
    expected_score = sum(
        float(probabilities[index]) * SEVERITY_RISK_VALUE.get(str(label), 50.0)
        for index, label in enumerate(classes)
    )
    return {
        "risk_score": round(float(expected_score), 1),
        "severity": severity,
        "confidence": round(confidence, 4),
    }


def predict_duration(task: dict[str, Any], resources: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    artifact = _artifact(DURATION_MODEL_FILE)
    pipeline = artifact["pipeline"]
    row = task_feature_row(task)
    row["severity"] = task.get("labels", {}).get("severity") or predict_risk(task)["severity"]

    if resources:
        usable = [item for item in resources if item.get("is_usable", item.get("status") == "Available")]
        crew_quantity = sum(
            int(item.get("quantity") or 0)
            for item in usable
            if item.get("resource_type") == "Crew"
        )
        if crew_quantity:
            row["crew_available"] = crew_quantity
            row["crew_gap"] = max(int(row.get("required_crew", 0)) - crew_quantity, 0)

    frame = pd.DataFrame([row], columns=DURATION_FEATURES)
    minutes = max(float(pipeline.predict(frame)[0]), 1.0)
    buffer_80 = float(artifact.get("residual_buffer_80", 15.0))
    lower = max(minutes - buffer_80, 1.0)
    upper = minutes + buffer_80
    confidence = max(0.50, min(0.99, 1.0 - (buffer_80 / max(minutes + buffer_80, 1.0))))
    return {
        "minutes": round(minutes, 1),
        "lower": round(lower, 1),
        "upper": round(upper, 1),
        "confidence": round(confidence, 4),
    }


def predict_overrun(block_context: dict[str, Any]) -> dict[str, Any]:
    artifact = _artifact(OVERRUN_MODEL_FILE)
    pipeline = artifact["pipeline"]
    row = {feature: block_context.get(feature) for feature in OVERRUN_FEATURES}
    frame = pd.DataFrame([row], columns=OVERRUN_FEATURES)
    probabilities = pipeline.predict_proba(frame)[0]
    classes = list(pipeline.named_steps["model"].classes_)
    positive_index = classes.index(1)
    probability = float(probabilities[positive_index])
    if probability >= OVERRUN_HIGH_THRESHOLD:
        label = "High"
    elif probability >= OVERRUN_LOW_THRESHOLD:
        label = "Medium"
    else:
        label = "Low"
    return {"probability": round(probability, 4), "class": label}


def forecast_goods(section: dict[str, Any], window: dict[str, Any]) -> dict[str, Any]:
    artifact = _artifact(FREIGHT_MODEL_FILE)
    pipeline = artifact["pipeline"]
    row = {
        "section_id": section.get("section_id") or window.get("section_id") or "Unknown",
        "hour": window.get("hour", 0),
        "day_of_week": window.get("day_of_week", "Unknown"),
        "season": window.get("season", "Unknown"),
        "recent_freight_count": window.get("recent_freight_count", 0),
        "network_load_index": window.get("network_load_index", 0.0),
        "traffic_density": section.get("traffic_density", window.get("traffic_density", 0)),
    }
    frame = pd.DataFrame([row], columns=FREIGHT_FEATURES)
    predicted_count = max(float(pipeline.predict(frame)[0]), 0.0)
    if predicted_count >= 4:
        load = "High"
    elif predicted_count >= 2.5:
        load = "Medium"
    elif predicted_count >= 1.5:
        load = "Low-Medium"
    else:
        load = "Opportunity Window"
    return {"predicted_count": round(predicted_count, 2), "load": load}



def predict_overrun_batch(contexts: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Vectorized overrun inference for optimizer candidate windows."""
    if not contexts:
        return []
    artifact = _artifact(OVERRUN_MODEL_FILE)
    pipeline = artifact["pipeline"]
    rows = [
        {feature: context.get(feature) for feature in OVERRUN_FEATURES}
        for context in contexts
    ]
    frame = pd.DataFrame(rows, columns=OVERRUN_FEATURES)
    probability_matrix = pipeline.predict_proba(frame)
    classes = list(pipeline.named_steps["model"].classes_)
    positive_index = classes.index(1)
    results = []
    for probabilities in probability_matrix:
        probability = float(probabilities[positive_index])
        if probability >= OVERRUN_HIGH_THRESHOLD:
            label = "High"
        elif probability >= OVERRUN_LOW_THRESHOLD:
            label = "Medium"
        else:
            label = "Low"
        results.append({"probability": round(probability, 4), "class": label})
    return results


def forecast_goods_batch(
    section: dict[str, Any],
    windows: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Vectorized freight inference for multiple planning windows."""
    if not windows:
        return []
    rows = [
        {
            "section_id": section.get("section_id") or window.get("section_id") or "Unknown",
            "hour": window.get("hour", 0),
            "day_of_week": window.get("day_of_week", "Unknown"),
            "season": window.get("season", "Unknown"),
            "recent_freight_count": window.get("recent_freight_count", 0),
            "network_load_index": window.get("network_load_index", 0.0),
            "traffic_density": section.get("traffic_density", window.get("traffic_density", 0)),
        }
        for window in windows
    ]
    artifact = _artifact(FREIGHT_MODEL_FILE)
    pipeline = artifact["pipeline"]
    frame = pd.DataFrame(rows, columns=FREIGHT_FEATURES)
    predictions = pipeline.predict(frame)
    results = []
    for value in predictions:
        predicted_count = max(float(value), 0.0)
        if predicted_count >= 4:
            load = "High"
        elif predicted_count >= 2.5:
            load = "Medium"
        elif predicted_count >= 1.5:
            load = "Low-Medium"
        else:
            load = "Opportunity Window"
        results.append({"predicted_count": round(predicted_count, 2), "load": load})
    return results
