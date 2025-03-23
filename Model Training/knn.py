import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score

# ✅ Load datasets
feeds_df = pd.read_csv("feeds_filtered.csv")
co2_df = pd.read_csv("CO2.csv")

# ✅ Select relevant features
features = ['TEMP', 'HUMD']
target = 'REF'  # Reference CO2 concentration in CO2.csv

# ✅ Drop NaN values
feeds_df = feeds_df.dropna(subset=features)
co2_df = co2_df.dropna(subset=features + [target])

# ✅ Extract input features
X_train = co2_df[features]  # Reference dataset (CO2.csv)
y_train = co2_df[target]  # Reference CO2 values

X_test = feeds_df[features]  # New dataset for testing (feeds.csv)

# ✅ Standardize the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ✅ Train KNN model
knn = KNeighborsRegressor(n_neighbors=3, weights='distance')  # K=3, weighted by distance
knn.fit(X_train_scaled, y_train)

# ✅ Predict CO₂ for feeds.csv
feeds_df['Predicted_CO2'] = knn.predict(X_test_scaled)

# ✅ Save predictions
feeds_df.to_csv("feeds_with_predictions.csv", index=False)
print("✅ Predictions saved to feeds_with_predictions.csv")

# ✅ Evaluate accuracy (if actual CO₂ values exist in feeds.csv)
if 'CO2_Actual' in feeds_df.columns:
    mae = mean_absolute_error(feeds_df['CO2_Actual'], feeds_df['Predicted_CO2'])
    r2 = r2_score(feeds_df['CO2_Actual'], feeds_df['Predicted_CO2'])
    print(f"📉 Mean Absolute Error (MAE): {mae:.2f} PPM")
    print(f"📈 R² Score: {r2:.4f}")
