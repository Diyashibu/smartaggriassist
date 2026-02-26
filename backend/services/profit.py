def calculate_profit_range(
    price_low,
    price_high,
    yield_per_acre,
    cost_per_acre,
    land_size=1
):
    min_profit = (price_low * yield_per_acre * land_size) - (cost_per_acre * land_size)
    max_profit = (price_high * yield_per_acre * land_size) - (cost_per_acre * land_size)
    return min_profit, max_profit
