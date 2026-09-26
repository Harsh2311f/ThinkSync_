"""
ThinkSync - Dataset Combiner
============================
Reads the 4 uploaded archives and produces ONE unified set of MongoDB
collections as .jsonl files (one JSON document per line).

Run:  python build_thinksync_db.py
Then: mongoimport each .jsonl file (see LOAD_INTO_MONGO.md)

Nothing here touches MongoDB. This step is pure file-to-file transformation,
so you can run it as many times as you like without breaking anything.
"""

import json
import os
import re
import pandas as pd
import os


# ---------------------------------------------------------------- paths
SRC = "C:/Users/Omaima/Desktop/ThinkSync/data"
JH = f"{SRC}/ThinkSync_Jharkhand_FY2025_26_Complete_Dataset"
GEN = f"{SRC}/ThinkSync_FY2025_26_Complete_CSV_Dataset"
GEO = f"{SRC}/archive__1_"
OUT = "C:/Users/Omaima/Desktop/ThinkSync/unified"
os.makedirs(OUT, exist_ok=True)


# ------------------------------------------------------------- helpers
def write_jsonl(docs, name):
    """Write a list of dicts to <name>.jsonl - the format mongoimport wants."""
    path = f"{OUT}/{name}.jsonl"
    with open(path, "w", encoding="utf-8") as f:
        for d in docs:
            f.write(json.dumps(d, default=str, ensure_ascii=False) + "\n")
    print(f"  {name:22s} {len(docs):>7,} documents")
    return path


def dt(value):
    """Turn a CSV datetime string into MongoDB Extended JSON date, or None."""
    if pd.isna(value) or value in ("", "None"):
        return None
    ts = pd.to_datetime(value, errors="coerce")
    if pd.isna(ts):
        return None
    # {"$date": "..."} is how mongoimport recognises a real Date, not a string
    return {"$date": ts.strftime("%Y-%m-%dT%H:%M:%SZ")}


def boolean(value):
    """CSV booleans arrive as True/False, 'True'/'False' or 'Yes'/'No'."""
    if pd.isna(value):
        return None
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in ("true", "yes", "1")


def num(value):
    """Return a plain Python number, or None. Avoids numpy types in JSON."""
    if pd.isna(value):
        return None
    f = float(value)
    return int(f) if f.is_integer() else round(f, 4)


def text(value):
    if pd.isna(value):
        return None
    return str(value).strip()


# ==========================================================================
# STEP 1 - STATIONS (real geography from archive__1_/stations.json)
# ==========================================================================
def normalise_station_name(name):
    """'TATANAGAR JUNCTION' -> 'TATANAGAR' so names from different
    sources can be matched against each other."""
    n = str(name).upper().strip()
    n = re.sub(r"\b(JUNCTION|JN|HALT|TERMINUS|TERMINAL|CITY|RAILWAY STATION)\b", "", n)
    n = re.sub(r"[^A-Z ]", " ", n)
    return re.sub(r"\s+", " ", n).strip()


def build_station_lookup():
    """Index ALL 8,990 Indian stations by normalised name.

    Why all of them and not just the ones tagged 'Jharkhand'? Because the
    2020 GeoJSON tags several major Jharkhand junctions (Ranchi, Hatia,
    Bokaro Steel City) under a neighbouring state or with a blank state.
    Filtering by state first would silently lose them.
    """
    raw = json.load(open(f"{GEO}/stations.json"))["features"]
    lookup = {}
    for feat in raw:
        p = feat["properties"]
        if not feat.get("geometry") or not feat["geometry"].get("coordinates"):
            continue                           # a few entries have no coordinates
        lon, lat = feat["geometry"]["coordinates"]
        key = normalise_station_name(p["name"])
        lookup.setdefault(key, {
            "station_code": p.get("code"),
            "station_name": p.get("name"),
            "match_key": key,
            "state": p.get("state"),
            "zone": p.get("zone"),
            "address": p.get("address"),
            "location": {"type": "Point", "coordinates": [lon, lat]},
        })
    return lookup


def build_stations(sections, lookup):
    """The stations collection holds only the stations our sections actually
    use - that is what the dashboard map needs to draw."""
    docs, seen = [], set()
    for s in sections:
        for name in (s["origin_station"], s["destination_station"]):
            if not name:
                continue
            key = normalise_station_name(name)
            if key in seen:
                continue
            seen.add(key)
            if key in lookup:
                doc = dict(lookup[key])
                doc["source"] = "geojson"
            elif key in MANUAL_STATIONS:
                lon, lat = MANUAL_STATIONS[key]
                doc = {"station_code": None, "station_name": name,
                       "match_key": key, "state": "Jharkhand", "zone": None,
                       "address": None, "source": "manual",
                       "location": {"type": "Point", "coordinates": [lon, lat]}}
            else:
                continue
            doc["section_station_name"] = name
            docs.append(doc)
    return docs


# Stations that exist in your section files but are missing from the 2020
# GeoJSON, or spelled differently. Coordinates are public station locations.
MANUAL_STATIONS = {
    "TATANAGAR":       (86.2029, 22.7868), "DHANBAD":        (86.4304, 23.7957),
    "GOMOH":           (86.1500, 23.8700), "CHANDIL":        (86.0500, 22.9600),
    "SINI":            (85.8100, 22.7900), "RAJKHARSAWAN":   (85.8200, 22.6300),
    "BARWADIH":        (84.1300, 23.8400), "GARHWA ROAD":    (83.8000, 24.1600),
    "HAZARIBAGH TOWN": (85.3600, 23.9900), "RAMGARH TOWN":   (85.5100, 23.6300),
    "SINDRI":          (86.4900, 23.6700), "BHOJUDIH":       (86.4200, 23.6400),
    "NAMKOM":          (85.3500, 23.3200),
}


def station_point(name, lookup):
    """Find coordinates for a station name. Returns None if truly unknown."""
    key = normalise_station_name(name)
    if key in lookup:
        return lookup[key]["location"]
    if key in MANUAL_STATIONS:
        lon, lat = MANUAL_STATIONS[key]
        return {"type": "Point", "coordinates": [lon, lat]}
    return None


# ==========================================================================
# STEP 2 - SECTIONS (the master key every other collection joins to)
# ==========================================================================
def build_sections(lookup):
    docs = []

    jh = pd.read_csv(f"{JH}/jharkhand_sections.csv")
    for _, r in jh.iterrows():
        docs.append({
            "section_id": r["section_id"],
            "dataset": "jharkhand",
            "state": text(r["state"]),
            "division": text(r["division"]),
            "zone": text(r["zone"]),
            "district_corridor": text(r["district_corridor"]),
            "origin_station": text(r["origin_station"]),
            "destination_station": text(r["destination_station"]),
            "origin_geo": station_point(r["origin_station"], lookup),
            "destination_geo": station_point(r["destination_station"], lookup),
            "line_type": text(r["line_type"]),
            "length_km": num(r["length_km"]),
            "traffic_density": num(r["traffic_density"]),
            "asset_age_index": num(r["asset_age_index"]),
            "depot_id": text(r["depot_id"]),
        })

    gen = pd.read_csv(f"{GEN}/sections.csv")
    for _, r in gen.iterrows():
        docs.append({
            "section_id": r["section_id"],
            "dataset": "generic",
            "state": None, "division": None,
            "zone": text(r["zone"]),
            "district_corridor": None,
            "origin_station": None, "destination_station": None,
            "origin_geo": None, "destination_geo": None,
            "line_type": text(r["line_type"]),
            "length_km": num(r["length_km"]),
            "traffic_density": num(r["traffic_density"]),
            "asset_age_index": num(r["asset_age_index"]),
            "depot_id": text(r["depot_id"]),
        })
    return docs


# ==========================================================================
# STEP 3 - MAINTENANCE TASKS  (the real merge: TMS + SMMS + TDMS)
# ==========================================================================
# Each source system names the same idea differently. This table is the
# translation dictionary that makes one collection possible.
SOURCE_CONFIG = {
    "TMS":  {"department": "Engineering",
             "defect": "defect_type",   "since": "last_maintenance_days",
             "crew": "crew_available",  "req_crew": "required_crew",
             "material": "material_available"},
    "SMMS": {"department": "S&T",
             "defect": "failure_type",  "since": "last_inspection_days",
             "crew": "technicians_available", "req_crew": "required_technicians",
             "material": "spares_available"},
    "TDMS": {"department": "TRD",
             "defect": "defect_type",   "since": "last_maintenance_days",
             "crew": "crew_available",  "req_crew": "required_crew",
             "material": "material_available"},
}

GEO_COLS = ["state", "division", "zone", "district_corridor",
            "origin_station", "destination_station"]


def readiness_score(crew, req_crew, material, machine, tower_needed, tower_ok):
    """0.0 - 1.0. How ready are we to actually start this job?
    Used later by the resource engine and as an ML feature."""
    parts = []
    if req_crew and req_crew > 0:
        parts.append(min(1.0, (crew or 0) / req_crew))
    if material is not None:
        parts.append(1.0 if material else 0.0)
    if machine is not None:
        parts.append(1.0 if machine else 0.0)
    if tower_needed:
        parts.append(1.0 if tower_ok else 0.0)
    return round(sum(parts) / len(parts), 3) if parts else None


def build_maintenance():
    docs = []
    files = [
        ("jharkhand", "TMS",  f"{JH}/jharkhand_tms_maintenance.csv"),
        ("jharkhand", "SMMS", f"{JH}/jharkhand_smms_maintenance.csv"),
        ("jharkhand", "TDMS", f"{JH}/jharkhand_tdms_maintenance.csv"),
        ("generic",   "TMS",  f"{GEN}/tms_maintenance.csv"),
        ("generic",   "SMMS", f"{GEN}/smms_maintenance.csv"),
        ("generic",   "TDMS", f"{GEN}/tdms_maintenance.csv"),
    ]

    for dataset, system, path in files:
        cfg = SOURCE_CONFIG[system]
        df = pd.read_csv(path)

        for _, r in df.iterrows():
            crew = num(r.get(cfg["crew"]))
            req_crew = num(r.get(cfg["req_crew"]))
            material = boolean(r.get(cfg["material"]))
            machine = boolean(r["machine_available"]) if "machine_available" in df.columns else None
            tower_needed = boolean(r["tower_wagon_required"]) if "tower_wagon_required" in df.columns else None
            tower_ok = boolean(r["tower_wagon_available"]) if "tower_wagon_available" in df.columns else None
            overdue = num(r["overdue_hours"]) or 0

            docs.append({
                "task_id": r["task_id"],
                "source_system": system,
                "department": cfg["department"],
                "dataset": dataset,
                "section_id": r["section_id"],

                "geo": {c: text(r[c]) for c in GEO_COLS if c in df.columns} or None,

                "event_datetime": dt(r["event_datetime"]),
                "season": text(r["season"]),

                "asset": {
                    "type": text(r["asset_type"]),
                    "defect_type": text(r[cfg["defect"]]),
                    "age_years": num(r["asset_age_years"]),
                },

                "context": {
                    "traffic_density": num(r["traffic_density"]),
                    "previous_failures_12m": num(r["previous_failures_12m"]),
                    "days_since_service": num(r[cfg["since"]]),
                    # track-only measurements; None for S&T and TRD
                    "rail_wear_mm": num(r["rail_wear_mm"]) if "rail_wear_mm" in df.columns else None,
                    "track_vibration": num(r["track_vibration"]) if "track_vibration" in df.columns else None,
                    "ballast_condition": text(r["ballast_condition"]) if "ballast_condition" in df.columns else None,
                },

                "schedule": {
                    "due_date": dt(r["due_date"]),
                    "overdue_hours": overdue,
                    "is_overdue": overdue > 0,
                },

                "readiness": {
                    "crew_available": crew,
                    "required_crew": req_crew,
                    "crew_gap": max(0, (req_crew or 0) - (crew or 0)),
                    "material_available": material,
                    "machine_available": machine,
                    "power_block_required": boolean(r["power_block_required"]) if "power_block_required" in df.columns else None,
                    "disconnection_required": boolean(r["disconnection_required"]) if "disconnection_required" in df.columns else None,
                    "tower_wagon_required": tower_needed,
                    "tower_wagon_available": tower_ok,
                    "readiness_score": readiness_score(crew, req_crew, material, machine, tower_needed, tower_ok),
                },

                "labels": {
                    "risk_score": num(r["risk_score"]),
                    "severity": text(r["severity"]),
                    "maintenance_required": boolean(r["maintenance_required"]),
                    "actual_repair_min": num(r["actual_repair_min"]),
                },
            })
    return docs


# ==========================================================================
# STEP 4 - TRAIN MOVEMENTS (COA passenger + goods freight in one collection)
# ==========================================================================
def build_movements():
    docs = []

    for dataset, path in [("jharkhand", f"{JH}/jharkhand_coa_train_movements.csv"),
                          ("generic",   f"{GEN}/coa_train_movements.csv")]:
        df = pd.read_csv(path)
        for _, r in df.iterrows():
            entry = pd.to_datetime(r["scheduled_entry"], errors="coerce")
            docs.append({
                "movement_id": r["movement_id"],
                "train_category": "passenger",
                "dataset": dataset,
                "section_id": r["section_id"],
                "geo": {c: text(r[c]) for c in GEO_COLS if c in df.columns} or None,
                "train_id": text(r["train_id"]),
                "train_type": text(r["train_type"]),
                "scheduled_entry": dt(r["scheduled_entry"]),
                "scheduled_exit": dt(r["scheduled_exit"]),
                "actual_entry": dt(r["actual_entry"]),
                "actual_exit": dt(r["actual_exit"]),
                "delay_minutes": num(r["delay_minutes"]),
                "direction": text(r["direction"]),
                "priority": text(r["priority"]),
                "corridor_status": text(r["corridor_status"]),
                # derived so both categories can be queried the same way
                "hour": int(entry.hour) if pd.notna(entry) else None,
                "day_of_week": entry.day_name() if pd.notna(entry) else None,
                "commodity_class": None,
                "network_load_index": None,
            })

    for dataset, path in [("jharkhand", f"{JH}/jharkhand_goods_train_history.csv"),
                          ("generic",   f"{GEN}/goods_train_history.csv")]:
        df = pd.read_csv(path)
        for _, r in df.iterrows():
            docs.append({
                "movement_id": r["movement_id"],
                "train_category": "goods",
                "dataset": dataset,
                "section_id": r["section_id"],
                "geo": {c: text(r[c]) for c in GEO_COLS if c in df.columns} or None,
                "train_id": text(r["goods_train_id"]),
                "train_type": "Goods",
                "scheduled_entry": dt(r["entry_datetime"]),
                "scheduled_exit": dt(r["exit_datetime"]),
                "actual_entry": None,
                "actual_exit": None,
                "delay_minutes": num(r["delay_minutes"]),
                "direction": text(r["direction"]),
                "priority": "Freight",
                "corridor_status": None,
                "hour": num(r["hour"]),
                "day_of_week": text(r["day_of_week"]),
                "commodity_class": text(r["commodity_class"]),
                "network_load_index": num(r["network_load_index"]),
            })
    return docs


# ==========================================================================
# STEP 5 - RESOURCES, BLOCK HISTORY, COMPATIBILITY RULES
# ==========================================================================
def build_resources():
    docs = []
    for dataset, path in [("jharkhand", f"{JH}/jharkhand_resources_inventory.csv"),
                          ("generic",   f"{GEN}/resources_inventory.csv")]:
        df = pd.read_csv(path)
        for _, r in df.iterrows():
            docs.append({
                "resource_id": r["resource_id"],
                "dataset": dataset,
                "section_id": r["section_id"],
                "geo": {c: text(r[c]) for c in GEO_COLS if c in df.columns} or None,
                "resource_type": text(r["resource_type"]),
                "department": text(r["department"]),
                "depot_id": text(r["depot_id"]),
                "available_from": dt(r["available_from"]),
                "available_to": dt(r["available_to"]),
                "quantity": num(r["quantity"]),
                "status": text(r["status"]),
                "skill_or_item": text(r["skill_or_item"]),
                "is_usable": text(r["status"]) == "Available",
            })
    return docs


def build_blocks():
    docs = []
    for dataset, path in [("jharkhand", f"{JH}/jharkhand_block_history.csv"),
                          ("generic",   f"{GEN}/block_history.csv")]:
        df = pd.read_csv(path)
        for _, r in df.iterrows():
            planned = num(r["planned_duration_min"])
            actual = num(r["actual_duration_min"])
            docs.append({
                "block_id": r["block_id"],
                "dataset": dataset,
                "section_id": r["section_id"],
                "geo": {c: text(r[c]) for c in GEO_COLS if c in df.columns} or None,
                "block_start": dt(r["block_start"]),
                "planned_duration_min": planned,
                "actual_duration_min": actual,
                "overrun_min": (actual - planned) if (planned and actual) else None,
                "block_type": text(r["block_type"]),
                "departments": [d.strip() for d in str(r["departments"]).split("+")],
                "tasks_count": num(r["tasks_count"]),
                "resource_readiness_pct": num(r["resource_readiness_pct"]),
                "train_conflicts": num(r["train_conflicts"]),
                "planned_delay_min": num(r["planned_delay_min"]),
                "actual_delay_min": num(r["actual_delay_min"]),
                "overrun_flag": boolean(r["overrun_flag"]),
                "block_outcome": text(r["block_outcome"]),
            })
    return docs


def build_rules():
    docs = []
    for dataset, path in [("jharkhand", f"{JH}/jharkhand_task_compatibility.csv"),
                          ("generic",   f"{GEN}/task_compatibility.csv")]:
        df = pd.read_csv(path)
        for i, r in df.iterrows():
            docs.append({
                "rule_id": text(r["rule_id"]) if "rule_id" in df.columns else f"GEN-RULE-{i+1:02d}",
                "dataset": dataset,
                "department_a": text(r["department_a"]),
                "task_category_a": text(r["task_category_a"]),
                "department_b": text(r["department_b"]),
                "task_category_b": text(r["task_category_b"]),
                "compatible": boolean(r["compatible"]),
                "dependency_rule": text(r["dependency_rule"]),
                "notes": text(r["notes"]),
            })
    return docs


# ==========================================================================
# STEP 6 - ROLLING-STOCK TELEMETRY (Kaggle) - kept SEPARATE on purpose
# ==========================================================================
def build_telemetry():
    """These files are train-health data, not track/section data. They have
    no section_id, so they cannot join to anything above. We keep them for
    ML pre-training only."""
    docs = []
    for path, tag in [(f"{SRC}/archive/indian_railway_failure_detection_maintenance_v2.csv", "failure_detection_v2"),
                      (f"{SRC}/archive/indian_railway_predictive_maintenance_100k.csv", "predictive_100k")]:
        df = pd.read_csv(path)
        df = df.where(pd.notna(df), None)
        for rec in df.to_dict("records"):
            rec["source_file"] = tag
            rec["scope"] = "rolling_stock"
            docs.append(rec)
    return docs


# ==========================================================================
# STEP 7 - VALIDATION
# ==========================================================================
def validate(sections, maintenance, movements, resources, blocks):
    print("\nVALIDATION")
    valid_ids = {s["section_id"] for s in sections}
    ok = True
    for name, docs in [("maintenance_tasks", maintenance), ("train_movements", movements),
                       ("resources", resources), ("block_history", blocks)]:
        orphans = {d["section_id"] for d in docs} - valid_ids
        status = "OK" if not orphans else f"FAIL -> {sorted(orphans)[:5]}"
        print(f"  section_id integrity: {name:20s} {status}")
        ok &= not orphans

    missing_geo = [s["section_id"] for s in sections
                   if s["dataset"] == "jharkhand" and not s["origin_geo"]]
    print(f"  Jharkhand sections with coordinates: {32 - len(missing_geo)}/32")

    dup = len(maintenance) - len({d["task_id"] for d in maintenance})
    print(f"  duplicate task_id: {dup}")

    by_dept = {}
    for d in maintenance:
        by_dept[d["department"]] = by_dept.get(d["department"], 0) + 1
    print(f"  maintenance by department: {by_dept}")
    return ok


# ==========================================================================
if __name__ == "__main__":
    print("Building unified ThinkSync dataset...\n")

    lookup = build_station_lookup()
    sections = build_sections(lookup)
    stations = build_stations(sections, lookup)
    maintenance = build_maintenance()
    movements = build_movements()
    resources = build_resources()
    blocks = build_blocks()
    rules = build_rules()

    write_jsonl(stations, "stations")
    write_jsonl(sections, "sections")
    write_jsonl(maintenance, "maintenance_tasks")
    write_jsonl(movements, "train_movements")
    write_jsonl(resources, "resources")
    write_jsonl(blocks, "block_history")
    write_jsonl(rules, "compatibility_rules")

    validate(sections, maintenance, movements, resources, blocks)
    print(f"\nDone. Files are in {OUT}")
    print("Rolling-stock telemetry is NOT built by default (63 MB).")
    print("Run with BUILD_TELEMETRY=1 to include it.")

    if os.environ.get("BUILD_TELEMETRY") == "1":
        write_jsonl(build_telemetry(), "rs_telemetry_ref")
