import pandas as pd
from prophet import Prophet
import numpy as np


def train_price_model(csv_path, crop):
    """
    Trains a Prophet model for a given crop
    """

    # 1. Read CSV
    df = pd.read_csv(csv_path)

    # Remove unrealistic mandi outliers
    df = df[(df["price"] > 50) & (df["price"] < 20000)]

    # 2. Filter required crop
    df = df[df["crop"] == crop]

    #print(df.head(10))
    #print(df["price"].describe())

    # 3. Aggregate prices across markets per date
    df = df.groupby("date")["price"].mean().reset_index()

    # 4. Safety check
    if len(df) < 12:
        raise ValueError(f"Not enough data for crop {crop}")

    # 5. Rename columns for Prophet
    df.columns = ["ds", "y"]

    # 6. Convert date column
    df["ds"] = pd.to_datetime(df["ds"])

    # 7. Sort by date
    df = df.sort_values("ds")

    # 8. Smooth prices slightly
    df["y"] = df["y"].rolling(window=3, min_periods=1).mean()

    # 9. Log transform
    df["y"] = np.log1p(df["y"])

    # 10. Create Prophet model
    model = Prophet(
        yearly_seasonality=False,
        weekly_seasonality=False,
        daily_seasonality=False,
        changepoint_prior_scale=0.1
    )

    # 11. Train model
    model.fit(df)

    return model


def predict_future_prices(model, months_ahead=3):
    """
    Predict future prices using trained model
    """

    # 12. Create future dataframe
    future = model.make_future_dataframe(periods=months_ahead, freq="ME")

    # 13. Generate forecast
    forecast = model.predict(future)

    # 14. Convert predictions back to original price scale
    forecast["yhat"] = np.expm1(forecast["yhat"])
    forecast["yhat_lower"] = np.expm1(forecast["yhat_lower"])
    forecast["yhat_upper"] = np.expm1(forecast["yhat_upper"])

    # 15. Clamp unrealistic predictions
    forecast["yhat"] = forecast["yhat"].clip(50, 20000)
    forecast["yhat_lower"] = forecast["yhat_lower"].clip(50, 20000)
    forecast["yhat_upper"] = forecast["yhat_upper"].clip(50, 20000)

    # 16. Return last 4 points (3 past + 1 future)
    forecast = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(4)

    return forecast