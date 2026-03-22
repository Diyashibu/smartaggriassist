import numpy as np

def calculate_volatility(prices):
    """
    prices: list or pandas Series of historical prices
    returns normalized volatility score (0 to 1)
    """
    prices = np.array(prices)
    
    mean_price = np.mean(prices)

    if mean_price == 0:
        return 0

    return min(np.std(prices) / mean_price, 1)
