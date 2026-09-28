from app.ml.inference.predictors import _artifact
from app.ml.config.settings import DURATION_MODEL_FILE, FREIGHT_MODEL_FILE, OVERRUN_MODEL_FILE, RISK_MODEL_FILE


def main():
    for path in (RISK_MODEL_FILE, DURATION_MODEL_FILE, OVERRUN_MODEL_FILE, FREIGHT_MODEL_FILE):
        _artifact(path)
        print(f"[OK] {path.name}")
    from ortools.sat.python import cp_model
    model = cp_model.CpModel()
    x = model.NewBoolVar("x")
    model.Maximize(x)
    solver = cp_model.CpSolver()
    status = solver.Solve(model)
    assert solver.Value(x) == 1
    print(f"[OK] OR-Tools CP-SAT: {solver.StatusName(status)}")
    print("ThinkSync Module 2 Batch 2 smoke check: OK")


if __name__ == "__main__":
    main()
