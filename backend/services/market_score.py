def calculate_market_score(
    profit_range,
    demand_index,
    supply_index,
    volatility_index
):
    avg_profit = sum(profit_range) / 2

    # Normalize profit to 0–1 range (# Normalize profit between -1 and 1)
    profit_score = max(min(avg_profit / 50000, 1), -1)

    # Shift to 0–1 range
    profit_score = (profit_score + 1) / 2

    score = (
        0.4 * profit_score +
        0.3 * demand_index +
        0.2 * (1 - supply_index) +
        0.1 * (1 - volatility_index)
    )

    return round(score * 100, 2)