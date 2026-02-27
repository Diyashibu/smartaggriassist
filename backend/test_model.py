from services.price_predictor import train_price_model, predict_future_prices

model = train_price_model(
    csv_path="data/prices.csv",
    crop="Tomato",
    market="Kolar"
)

forecast = predict_future_prices(model, months_ahead=3)

print(forecast.tail(6))
