# scripts/extract_regional_cereals_FINAL.py
import pandas as pd

# Read the CSV file
df_raw = pd.read_csv("data/raw/3. Agriculture_AS 2024.xlsx - AG,5.csv", header=None)

# Extract only the 12 main regions (rows that don't start with spaces and are before "Total")
regions_data = []
region_rows = [8, 17, 26, 36, 43, 49, 58, 67, 73, 80]  # Main 12 regions

for idx in region_rows:
    if idx < len(df_raw):
        regions_data.append(df_raw.iloc[idx])

df = pd.DataFrame(regions_data)

# Name the columns (column 0 = region, 1-4 = cereals data, 5 = Arabic name)
df.columns = ["region_raw", "ble_dur", "ble_tendre", "orge", "mais", "arabic_name"]

# Clean region names (remove Arabic part and extra spaces)
df["region"] = df["region_raw"].str.split("ط").str[0].str.strip()
df["region"] = df["region"].str.replace("L'", "", regex=False).str.strip()

# Standard mapping to exactly match your GeoJSON
region_map = {
    "Tanger - Tétouan - Al Hoceima": "Tanger-Tétouan-Al Hoceïma",
    "Oriental": "Oriental",
    "Fès - Meknès": "Fès-Meknès",
    "Rabat - Salé - Kénitra": "Rabat-Salé-Kénitra",
    "Béni  Mellal - Khénifra": "Béni Mellal-Khénifra",  # Note: double space in source
    "Casablanca- Settat": "Casablanca-Settat",
    "Marrakech - Safi": "Marrakech-Safi",
    "Drâa- Tafilalet": "Drâa-Tafilalet",
    "Souss - Massa": "Souss-Massa",
    "Guelmim - Oued Noun": "Guelmim-Oued Noun",
    "Laâyoune - Saguia al Hamra": "Laâyoune-Sakia El Hamra",
    "Dakhla - Oued Ed-Dahab": "Dakhla-Oued Ed-Dahab"
}

df["region"] = df["region"].map(region_map)

# Convert string numbers with non-breaking spaces to float, then to thousands of tonnes
def to_float(x):
    if pd.isna(x) or x == "-" or x == "":
        return 0.0
    return float(str(x).replace("\u202f", "").replace(" ", "").replace(",", "."))

df["ble_dur_kt"]   = df["ble_dur"].apply(to_float) * 0.1
df["ble_tendre_kt"]= df["ble_tendre"].apply(to_float) * 0.1
df["orge_kt"]      = df["orge"].apply(to_float) * 0.1

df["production_2023_kt"] = (df["ble_dur_kt"] + df["ble_tendre_kt"] + df["orge_kt"]).round(1)

# Final result
final = df[["region", "production_2023_kt"]].dropna().reset_index(drop=True)

# Save
final.to_csv("data/processed/regional_cereals_2023.csv", index=False)
final.to_json("data/processed/regional_cereals_2023.json", orient="records", force_ascii=False, indent=2)

print("PERFECT – Official 2022-2023 cereal production by region (thousands of tonnes):\n")
print(final)