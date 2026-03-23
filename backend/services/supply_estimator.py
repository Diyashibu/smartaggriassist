import pandas as pd

def estimate_supply_from_acreage(apy_df: pd.DataFrame, crop: str):

    df = apy_df[apy_df["Crop"] == crop].sort_values("Crop_Year")

    if len(df) < 2:
        return "Medium", 0.5

    df["growth"] = df["Area"].pct_change()

    avg_growth = df["growth"].mean()

    if avg_growth > 0.10:
        return "High", 0.7
    elif avg_growth < -0.05:
        return "Low", 0.3
    else:
        return "Medium", 0.5