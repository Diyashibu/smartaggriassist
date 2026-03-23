import pandas as pd

df = pd.read_csv("cost.csv")

df.columns = df.columns.str.strip()

# normalize crop name
df["Crop"] = df["Crop"].str.strip().str.title()

# convert hectare → acre
df["cost_per_acre"] = df["Cost of Cultivation (`/Hectare) C2"] / 2.471

# keep only needed columns
clean = df[["Crop","cost_per_acre"]]

# rename column
clean = clean.rename(columns={
    "Crop":"crop"
})

clean.to_csv("cost_cleaned.csv",index=False)

print("Cost dataset cleaned")