def clamp_price(price, min_price=1, max_price=200):
    """
    Prevent absurd ML outputs
    """
    return max(min(price, max_price), min_price)


def smooth_price_trend(price_list):
    """
    Simple smoothing using median
    """
    if not price_list:
        return price_list

    sorted_prices = sorted(price_list)
    mid = len(sorted_prices) // 2
    return sorted_prices[mid]
