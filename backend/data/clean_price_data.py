import pandas as pd

# Load original dataset
df = pd.read_csv("Agriculture_price_dataset(kaggle).csv")

# Keep only needed columns
df = df[[
    "Price Date",
    "Market Name",
    "Commodity",
    "Modal_Price"
]]

# Rename columns
df = df.rename(columns={
    "Price Date": "date",
    "Market Name": "market",
    "Commodity": "crop",
    "Modal_Price": "price"
})

# Convert date format
df["date"] = pd.to_datetime(df["date"], errors="coerce")

# Drop missing values
df = df.dropna(subset=["date", "price"])

# Remove zero or negative prices
df = df[df["price"] > 0]

# Clean crop names
df["crop"] = df["crop"].str.strip()

# Save cleaned file
df.to_csv("prices.csv", index=False)

print("Cleaned prices.csv created successfully!")