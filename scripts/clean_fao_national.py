# scripts/clean_fao_national.py
import pandas as pd

# Load the raw FAO CSV
df = pd.read_csv('data/raw/FAOSTAT_data_en_11-27-2025.csv')

# Key crops to focus on (relevant to OCP Nutricrops: cereals, olives, tomatoes, etc.)
crops = ['Wheat', 'Barley', 'Olives', 'Tomatoes', 'Citrus Fruit', 'Almonds, in shell', 'Watermelons']

# French translations for CV/dashboard (bilingual)
crop_fr_map = {
    'Wheat': 'Blé',
    'Barley': 'Orge',
    'Olives': 'Olives',
    'Tomatoes': 'Tomates',
    'Citrus Fruit': 'Agrumes',
    'Almonds, in shell': 'Amandes en coque',
    'Watermelons': 'Pastèques'
}

# Filter for these crops and years 2010-2023
df = df[(df['Item'].isin(crops)) & (df['Year'].between(2010, 2023))]

# Pivot: one row per crop/year, with columns for production_kt, area_ha, yield_tha
pivot = df.pivot(index=['Year', 'Item'], columns='Element', values='Value').reset_index()

# Rename columns
pivot.columns = ['year', 'crop_en', 'area_ha', 'production_t', 'yield_kgha']

# Convert units: production to thousands of tonnes (kt), yield to t/ha
pivot['production_kt'] = pivot['production_t'] / 1000
pivot['yield_tha'] = pivot['yield_kgha'] / 1000

# Drop old columns
pivot = pivot.drop(columns=['production_t', 'yield_kgha'])

# Add French crop name
pivot['crop_fr'] = pivot['crop_en'].map(crop_fr_map)

# Reorder columns
pivot = pivot[['year', 'crop_en', 'crop_fr', 'production_kt', 'area_ha', 'yield_tha']]

# Save
pivot.to_csv('data/processed/fao_national_clean.csv', index=False)

print("Clean FAO data saved to data/processed/fao_national_clean.csv")
print(pivot.head(10))  # Check the first 10 rows
