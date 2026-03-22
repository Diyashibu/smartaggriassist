def clamp_price(price):
    if price < 0:
        return 0
    return float(price)

def smooth_price_trend(price_list):
    """
    Simple smoothing using median
    """
    if not price_list:
        return price_list

    sorted_prices = sorted(price_list)
    mid = len(sorted_prices) // 2
    return sorted_prices[mid]
