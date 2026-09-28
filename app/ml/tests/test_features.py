from app.ml.features.builder import block_training_frame, freight_training_frame, task_training_frame
from app.ml.training.data_loader import load_training_data


def test_feature_builders_produce_rows():
    data = load_training_data()
    assert not task_training_frame(data["tasks"]).empty
    assert not block_training_frame(data["blocks"]).empty
    assert not freight_training_frame(data["movements"], data["sections"]).empty
