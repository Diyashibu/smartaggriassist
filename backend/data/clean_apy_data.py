import pandas as pd

df = pd.read_csv("apy.csv")

# remove spaces
df["Crop"] = df["Crop"].str.strip()

# normalize case
df["Crop"] = df["Crop"].str.title()

# convert area from hectares to acres
df["Area_Acres"] = df["Area"] * 2.471

# save cleaned dataset
df.to_csv("apy_cleaned.csv", index=False)

print("APY cleaned successfully")