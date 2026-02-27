import numpy as np

def estimate_demand_from_prices(hist_prices):
    """
    Data-driven demand estimation using price strength + stability
    """

    if len(hist_prices) < 6:
        return "Medium", 0.5

    prices = np.array(hist_prices)

    avg_price = prices.mean()
    price_std = prices.std()
    cv = price_std / avg_price if avg_price > 0 else 1

    # ---- RULES ----
    # Strong + stable prices → High demand
    if avg_price >= 30 and cv < 0.25:
        return "High", 0.7

    # Highly unstable prices → Low demand
    if cv > 0.4:
        return "Low", 0.3

    # Otherwise → Medium
    return "Medium", 0.5
