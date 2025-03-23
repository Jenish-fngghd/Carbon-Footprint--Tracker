import time
import pandas as pd
import numpy as np
import joblib
import xgboost as xgb
import lightgbm as lgb
from sklearn.ensemble import ExtraTreesRegressor, RandomForestRegressor, HistGradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error

# ✅ Load the dataset
corrected_df = pd.read_csv("feeds_with_predictions.csv")

# ✅ Feature selection (using three input features)
features = ['TEMP', 'HUMD', 'Predicted_CO2']
target = 'Estimated CO2 (PPM) (MQ-135 Formula)'

X = corrected_df[features]
y = corrected_df[target]

# ✅ Scale the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ✅ Split the dataset (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# ✅ Define standalone models with your specified hyperparameters
models = {
    "Linear Regression": LinearRegression(),
    "Extra Trees": ExtraTreesRegressor(n_estimators=100, bootstrap=False,
                                       ccp_alpha=0.0, max_depth=None, max_features=None,
                                       min_samples_leaf=1, min_samples_split=2, oob_score=False, random_state=42),
    "Random Forest": RandomForestRegressor(n_estimators=30, bootstrap=False,
                                           ccp_alpha=0.0, max_depth=None, max_features=None, max_samples=None,
                                           min_samples_leaf=1, min_samples_split=2, oob_score=False, random_state=42),
    "LightGBM": lgb.LGBMRegressor(n_estimators=590, colsample_bytree=0.9197,
                                   learning_rate=0.2003, max_depth=13, min_child_samples=3,
                                   num_leaves=174, subsample=0.5274, random_state=42),
    "HistGradientBoosting": HistGradientBoostingRegressor(l2_regularization=0.0001,
                                                           learning_rate=0.1340, max_bins=255,
                                                           max_depth=10, max_iter=1500, min_samples_leaf=1, random_state=42)
}

# ✅ Train and evaluate each model directly on X_train/X_test
results = []
for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

    results.append([name, mae, r2, rmse, mape])
    print(f"📊 Evaluation -> {name}: MAE = {mae:.2f} | R² = {r2:.4f} | RMSE = {rmse:.2f} | MAPE = {mape:.2f}%")

# ✅ Convert results into DataFrame
results_df = pd.DataFrame(results, columns=["Model", "MAE (PPM)", "R² Score", "RMSE (PPM)", "MAPE (%)"])

# ✅ Apply selection criteria
results_df["Rounded_MAE"] = results_df["MAE (PPM)"].round(3)
results_df = results_df.sort_values(by=["Rounded_MAE", "R² Score"], ascending=[True, False])

# ✅ Select best model with lowest MAE & highest R²
best_model_name = results_df.iloc[0]["Model"]
best_model = models[best_model_name]

# ✅ Save results
results_df.to_csv("model_performance_with_specified_params.csv", index=False)

# ✅ Print Best Model Selection Criteria
print("\n🏆 Best Model Selection Criteria (Sorted by Rounded MAE, then R² Score):")
print(results_df)

# ✅ Save the best model and scaler
joblib.dump(best_model, "best_model_with_specified_params.joblib")
joblib.dump(scaler, "scaler.joblib")

print(f"\n🏆 Best Model: {best_model_name} (MAE = {results_df.iloc[0]['MAE (PPM)']:.2f} PPM, R² = {results_df.iloc[0]['R² Score']:.4f})")
print("✅ Best model saved as 'best_model_with_specified_params.joblib'")
print("✅ Scaler saved as 'scaler.joblib'")

# ✅ Define predict function for three inputs
def predict_co2(temp, hum, co2):
    input_data = np.array([[temp, hum, co2]])
    input_scaled = scaler.transform(input_data)
    prediction = best_model.predict(input_scaled)
    return prediction[0]

# ✅ Test prediction function
test_temp, test_hum, co2 = 26.0, 40.0, 450
predicted_co2 = predict_co2(test_temp, test_hum, co2)
print(f"\n🔹 Test Prediction -> Temperature: {test_temp}°C, Humidity: {test_hum}%, CO₂: {co2} PPM")
print(f"📈 Predicted CO₂: {predicted_co2:.2f} PPM")

print("\n✅ Model training and testing with specified hyperparameters completed!")