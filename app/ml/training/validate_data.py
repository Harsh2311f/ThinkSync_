from app.ml.features.builder import block_training_frame, freight_training_frame, task_training_frame
from app.ml.training.data_loader import load_training_data


def main() -> None:
    data = load_training_data()
    tasks = task_training_frame(data["tasks"])
    blocks = block_training_frame(data["blocks"])
    freight = freight_training_frame(data["movements"], data["sections"])

    assert len(tasks) > 0, "No maintenance task training rows"
    assert len(blocks) > 0, "No block training rows"
    assert len(freight) > 0, "No freight training windows"
    assert tasks["severity"].notna().any(), "Risk target is missing"
    assert tasks["actual_repair_min"].notna().any(), "Duration target is missing"
    assert blocks["overrun_flag"].notna().any(), "Overrun target is missing"

    print("ThinkSync Module 2 data validation: OK")
    print(f"maintenance task rows : {len(tasks):,}")
    print(f"block history rows    : {len(blocks):,}")
    print(f"freight windows       : {len(freight):,}")


if __name__ == "__main__":
    main()
