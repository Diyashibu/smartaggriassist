from fastapi import FastAPI
import pandas as pd

from fastapi.middleware.cors import CORSMiddleware
from services.post_processing import clamp_price, smooth_price_trend
from services.price_predictor import train_price_model, predict_future_prices
from services.volatility import calculate_volatility
from services.profit import calculate_profit_range
from services.market_score import calculate_market_score
from services.explainability import generate_explanation
from services.supply_estimator import estimate_supply_from_acreage
from services.demand_estimator import estimate_demand_from_prices


app = FastAPI(title="SmartAgriAssist Market Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def health_check():
    return {"status": "Backend running"}

@app.get("/available-crops")
def get_available_crops():
    price_df = pd.read_csv("data/prices.csv")

    crops = sorted(price_df["crop"].unique().tolist())

    return {"crops": crops}


@app.post("/market-analysis")
def market_analysis(request: dict):
    crops = request.get("crops", [])
    land_size = request.get("land_size", 1)

    # Load static datasets
    price_df = pd.read_csv("data/prices.csv")
    apy_df = pd.read_csv("data/apy_cleaned.csv")
    cost_df = pd.read_csv("data/cost_cleaned.csv")


    results = []

    for crop in crops:

        crop = crop.strip().title()

        # ------------------------------------------------
        # Historical prices (cleaned + averaged per date)
        # ------------------------------------------------

        hist_df = price_df[price_df["crop"] == crop]

        # remove extreme mandi outliers
        hist_df = hist_df[(hist_df["price"] > 50) & (hist_df["price"] < 20000)]

        # average price per date across markets
        hist_df = hist_df.groupby("date")["price"].mean().reset_index()

        # historical price list (used later for volatility/demand)
        hist_prices = hist_df["price"].tolist()

        # ------------------------------------------------
        # Train ML model
        # ------------------------------------------------
        model = train_price_model(
            csv_path="data/prices.csv",
            crop=crop
        )

        forecast = predict_future_prices(model, months_ahead=3)

        # ------------------------------------------------
        # Price trend (Past + Future)
        # ------------------------------------------------

        # last 3 historical average prices
        hist = hist_prices[-3:] if len(hist_prices) >= 3 else hist_prices

        # predicted price
        future = forecast["yhat"].iloc[-1]

        raw_prices = hist + [future]

        price_trend = [clamp_price(p) for p in raw_prices]

        # prediction range
        price_low = clamp_price(forecast["yhat_lower"].iloc[-1])
        price_high = clamp_price(forecast["yhat_upper"].iloc[-1])
        # ------------------------------------------------
        # Volatility
        # ------------------------------------------------
        if len(hist_prices) < 2:
            volatility_index = 0.2
        else:
            volatility_index = calculate_volatility(hist_prices)

        if volatility_index > 0.3:
            volatility_label = "High"
        elif volatility_index > 0.15:
            volatility_label = "Medium"
        else:
            volatility_label = "Low"

        # ------------------------------------------------
        # Confidence
        # ------------------------------------------------
        if volatility_label == "High":
            confidence = "Low"
        elif volatility_label == "Medium":
            confidence = "Medium"
        else:
            confidence = "High"

        # ------------------------------------------------
        # Profit calculation
        # ------------------------------------------------

        yield_data = apy_df[apy_df["Crop"] == crop]

        if len(yield_data) == 0:
            yield_per_acre = 20
        else:
            yield_per_hectare = yield_data["Yield"].mean()
            yield_per_acre = yield_per_hectare / 2.471

        cost_data = cost_df[cost_df["crop"] == crop]

        if len(cost_data) == 0:
            cost_per_acre = 20000
        else:
            cost_per_acre = cost_data["cost_per_acre"].mean()

        profit_range = calculate_profit_range(
            price_low,
            price_high,
            yield_per_acre,
            cost_per_acre,
            land_size
        )

        profit_range = (float(profit_range[0]), float(profit_range[1]))

        # ------------------------------------------------
        # Supply estimation
        # ------------------------------------------------
        supply_label, supply_index = estimate_supply_from_acreage(
            apy_df=apy_df,
            crop=crop
        )

        # ------------------------------------------------
        # Demand estimation
        # ------------------------------------------------
        demand_label, demand_index = estimate_demand_from_prices(hist_prices)

        # ------------------------------------------------
        # Market score
        # ------------------------------------------------
        market_score = calculate_market_score(
            profit_range,
            demand_index,
            supply_index,
            volatility_index
        )

        market_score = float(market_score)

        # ------------------------------------------------
        # Explanation
        # ------------------------------------------------
        explanation = generate_explanation(
            crop=crop,
            demand=demand_label,
            supply=supply_label,
            volatility=volatility_label,
            profit_range=profit_range,
            market_score=market_score
        )

        results.append({
            "crop": crop,
            "price_trend": price_trend,
            "profit_range": profit_range,
            "volatility": volatility_label,
            "confidence": confidence,
            "supply": supply_label,
            "demand": demand_label,
            "market_score": market_score,
            "explanation": explanation
        })

        # Debug print
        #print(crop, price_trend)

    return {"comparison": results}

    