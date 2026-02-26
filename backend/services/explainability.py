def generate_explanation(
    crop,
    demand,
    supply,
    volatility,
    profit_range,
    market_score
):
    reasons = []

    if demand == "High":
        reasons.append("Strong market demand")

    if supply == "Low":
        reasons.append("Limited supply increases price potential")

    if volatility == "Low":
        reasons.append("Stable prices reduce risk")

    if profit_range[0] < 0:
        reasons.append("Projected losses due to unfavorable pricing")

    if market_score < 30:
        reasons.append("Overall market conditions are weak")

    if not reasons:
        reasons.append("Moderate market conditions")

    return reasons
