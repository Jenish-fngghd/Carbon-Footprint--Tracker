import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
from joblib import load, dump
import m2cgen as m2c

# Load dataset
corrected_df = pd.read_csv("feeds_with_predictions.csv")
features = ['TEMP', 'HUMD', 'Predicted_CO2']
target = 'Estimated CO2 (PPM) (MQ-135 Formula)'

X = corrected_df[features]
y = corrected_df[target]

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train a smaller Random Forest model
small_rf_model = RandomForestRegressor(
    n_estimators=13,        # Reduced from 30 to 15
    max_depth=12,            # Limit depth to 8 (adjustable: try 5–10)
    max_features=None,    # Use sqrt(n_features) ≈ 1-2 features per split
    min_samples_split=2,    # Minimum samples to split a node
    min_samples_leaf=1,     # Minimum samples per leaf
    bootstrap=False,        # No bootstrapping (consistent with your setup)
    ccp_alpha=0.0,          # No complexity pruning
    oob_score=False,        # Disable out-of-bag scoring
    random_state=42
)
small_rf_model.fit(X_train, y_train)

# Load the original Random Forest model for comparison (if available)
# If not, comment this out
original_rf_model = load("best_model_with_specified_params.joblib")  # Adjust filename as needed

# Predictions
y_pred_small = small_rf_model.predict(X_test)
y_pred_original = original_rf_model.predict(X_test)

# Evaluation metrics
mae_small = mean_absolute_error(y_test, y_pred_small)
r2_small = r2_score(y_test, y_pred_small)
mae_original = mean_absolute_error(y_test, y_pred_original)
r2_original = r2_score(y_test, y_pred_original)

# Print results
print("Smaller Random Forest Model (n_estimators=15, max_depth=8):")
print(f"MAE: {mae_small:.4f} PPM")
print(f"R²: {r2_small:.4f}")
print("\nOriginal Random Forest Model (n_estimators=30, max_depth=None):")
print(f"MAE: {mae_original:.4f} PPM")
print(f"R²: {r2_original:.4f}")

# Save the smaller model and scaler
dump(small_rf_model, "smaller_rf_model.joblib")
dump(scaler, "scaler.joblib")

# Generate C code for the smaller model
code = m2c.export_to_c(small_rf_model)
with open("smaller_rf_model.c", "w") as f:
    f.write(code)

# Extract scaler parameters for Arduino
print("\nScaler Parameters for Arduino:")
print("static const float mean[3] = {", end="")
for i, value in enumerate(scaler.mean_):
    print(f"{value:.6f}", end="")
    if i < len(scaler.mean_) - 1:
        print(", ", end="")
print("};")
print("static const float std_dev[3] = {", end="")
for i, value in enumerate(scaler.scale_):
    print(f"{value:.6f}", end="")
    if i < len(scaler.scale_) - 1:
        print(", ", end="")
print("};")

# Test predictions
test_inputs = [
    [26.0, 40.0, 450.0],  # Test case 1
    [20.0, 10.0, 400.0],  # Test case 2
    [35.0, 50.0, 1500.0]  # Test case 3
]
for temp, humd, co2 in test_inputs:
    scaled_input = scaler.transform([[temp, humd, co2]])
    pred = small_rf_model.predict(scaled_input)[0]
    print(f"🔹 Test Prediction -> Temperature: {temp}°C, Humidity: {humd}%, CO₂: {co2} PPM")
    print(f"📈 Predicted CO₂: {pred:.2f} PPM")