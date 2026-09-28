from __future__ import annotations

from collections.abc import Sequence

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from pandas.api.types import is_numeric_dtype

from app.ml.config.settings import RANDOM_STATE


def _preprocessor(frame, features: Sequence[str]) -> ColumnTransformer:
    numeric = [name for name in features if is_numeric_dtype(frame[name])]
    categorical = [name for name in features if name not in numeric]

    categorical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore")),
    ])
    numeric_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
    ])

    return ColumnTransformer([
        ("categorical", categorical_pipeline, categorical),
        ("numeric", numeric_pipeline, numeric),
    ])


def classification_pipeline(frame, features: Sequence[str], n_estimators: int = 220) -> Pipeline:
    return Pipeline([
        ("preprocessor", _preprocessor(frame, features)),
        ("model", RandomForestClassifier(
            n_estimators=n_estimators,
            random_state=RANDOM_STATE,
            n_jobs=-1,
            class_weight="balanced_subsample",
            min_samples_leaf=2,
        )),
    ])


def regression_pipeline(frame, features: Sequence[str], n_estimators: int = 220) -> Pipeline:
    return Pipeline([
        ("preprocessor", _preprocessor(frame, features)),
        ("model", RandomForestRegressor(
            n_estimators=n_estimators,
            random_state=RANDOM_STATE,
            n_jobs=-1,
            min_samples_leaf=2,
        )),
    ])
