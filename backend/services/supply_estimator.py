import pandas as pd

def estimate_supply_from_acreage(
    acreage_df: pd.DataFrame,
    crop: str,
    market: str
):
    """
    Estimate supply level based on acreage trend.
    """

    df = acreage_df[
        (acreage_df["crop"] == crop) &
        (acreage_df["market"] == market)
    ].sort_values("year")

    # Fallback if no data
    if len(df) < 2:
        return "Medium", 0.5

    # Calculate year-on-year percentage change
    df["growth"] = df["area_acres"].pct_change()

    avg_growth = df["growth"].mean()

    # Decide supply level
    if avg_growth > 0.10:
        return "High", 0.7
    elif avg_growth < -0.05:
        return "Low", 0.3
    else:
        return "Medium", 0.5
