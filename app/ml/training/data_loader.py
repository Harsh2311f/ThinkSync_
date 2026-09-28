from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app.ml.config.settings import DATA_DIR


def load_jsonl(name: str, data_dir: Path = DATA_DIR) -> list[dict[str, Any]]:
    path = data_dir / name
    if not path.exists():
        raise FileNotFoundError(f"ThinkSync dataset file not found: {path}")

    records: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, start=1):
            line = line.strip()
            if not line:
                continue
            try:
                records.append(json.loads(line))
            except json.JSONDecodeError as exc:
                raise ValueError(f"Invalid JSON in {path.name} at line {line_number}") from exc
    return records


def load_training_data() -> dict[str, list[dict[str, Any]]]:
    return {
        "tasks": load_jsonl("maintenance_tasks.jsonl"),
        "blocks": load_jsonl("block_history.jsonl"),
        "movements": load_jsonl("train_movements.jsonl"),
        "sections": load_jsonl("sections.jsonl"),
        "resources": load_jsonl("resources.jsonl"),
        "rules": load_jsonl("compatibility_rules.jsonl"),
    }
