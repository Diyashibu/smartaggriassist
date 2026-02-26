import numpy as np

def calculate_volatility(prices):
    """
    prices: list or pandas Series of historical prices
    returns normalized volatility score (0 to 1)
    """
    prices = np.array(prices)
    return np.std(prices) / np.mean(prices)
