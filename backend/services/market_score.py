def calculate_market_score(
    profit_range,
    demand_index,
    supply_index,
    volatility_index
):
    avg_profit = sum(profit_range) / 2

    # Normalize profit roughly
    profit_score = min(avg_profit / 100000, 1)

    score = (
        0.4 * profit_score +
        0.3 * demand_index -
        0.2 * supply_index -
        0.1 * volatility_index
    )

    return round(max(0, min(score * 100, 100)), 2)
