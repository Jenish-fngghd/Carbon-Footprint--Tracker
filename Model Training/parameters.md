Extra trees model:

n_estimators: 100
bootstrap: False
ccp_alpha: 0.0
max_depth: None
max_features: None
min_samples_leaf: 1
min_samples_split: 2
oob_score: False
Mean MAE: 13.86 PPM
Mean R²: 0.9938

random forest model:

n_estimators: 30
bootstrap: False
ccp_alpha: 0.0
max_depth: None
max_features: None
max_samples: None
min_samples_leaf: 1
min_samples_split: 2
oob_score: False
Mean MAE: 9.97 PPM
Mean R²: 0.9923

xgb model:

n_estimators: 120
colsample_bytree: 1.0
gamma: 0.1
learning_rate: 0.15
max_depth: 12
min_child_weight: 1
reg_alpha: 0
reg_lambda: 1
subsample: 0.9
Mean MAE: 12.41 PPM
Mean R²: 0.9947

lightgbm model:

n_estimators: 590
colsample_bytree: 0.9197
learning_rate: 0.2003
max_depth: 13
min_child_samples: 3
num_leaves: 174
subsample: 0.5274
Mean MAE: 13.13 PPM
Mean R²: 0.9941

histgradientboostingregressor model:

l2_regularization: 0.0001
learning_rate: 0.1340
max_bins: 255
max_depth: 10
max_iter: 1500
min_samples_leaf: 1
Mean MAE: 14.11 PPM
Mean R²: 0.9939



real world data:

📌 Meta-Learner: Linear Regression
📉 Mean Absolute Error (MAE): 0.30 PPM
📈 R² Score: 0.9989

📌 Meta-Learner: XGBoost
📉 Mean Absolute Error (MAE): 0.40 PPM
📈 R² Score: 0.9981

📌 Meta-Learner: Extra Trees
📉 Mean Absolute Error (MAE): 0.33 PPM
📈 R² Score: 0.9988

📌 Meta-Learner: Random Forest
📉 Mean Absolute Error (MAE): 0.29 PPM
📈 R² Score: 0.9990

📌 Meta-Learner: LightGBM
📉 Mean Absolute Error (MAE): 0.35 PPM
📈 R² Score: 0.9985

📌 Meta-Learner: HistGradientBoosting Regressor
📉 Mean Absolute Error (MAE): 0.41 PPM
📈 R² Score: 0.9980

🚀 Best Meta-Learner: Random Forest with MAE = 0.29 PPM and R² = 0.9990




🏆 Best Meta-Learner Selection Criteria:
                  Model  MAE (PPM)  R² Score  RMSE (PPM)  MAPE (%)  Rounded_MAE
0     Linear Regression   2.083849  0.893191    4.364933  0.428264        2.084
2           Extra Trees   2.084801  0.892254    4.384044  0.428436        2.085
3         Random Forest   2.085506  0.891531    4.398729  0.428550        2.086
5  HistGradientBoosting   2.088757  0.892931    4.370237  0.429306        2.089
1               XGBoost   2.092700  0.880184    4.623070  0.429638        2.093
4              LightGBM   2.105476  0.884049    4.547901  0.432393        2.105

🏆 Best Meta-Learner: Linear Regression (MAE = 2.08 PPM)
✅ Best model saved as 'best_model.joblib'
C:\Users\sorat\AppData\Local\Programs\Python\Python313\Lib\site-packages\sklearn\utils\validation.py:2739: UserWarning: X does not have valid feature names, but StandardScaler was fitted with feature names
  warnings.warn(
C:\Users\sorat\AppData\Local\Programs\Python\Python313\Lib\site-packages\sklearn\utils\validation.py:2739: UserWarning: X does not have valid feature names, but LGBMRegressor was fitted with feature names
  warnings.warn(

🔹 Test Prediction -> Temperature: 26.0°C, Humidity: 40.0%, CO₂: 450 PPM
📈 Predicted CO₂: 486.37 PPM



Scaler Mean: [ 27.33448541  30.5578597  907.97910207]
Scaler Scale: [  1.79960561   9.81660328 271.06047383]



Coefficients: [ 0.55809119 10.51000843 -3.59284028]
Intercept: 480.12884717413715
Scaler Mean: [ 27.33448541  30.5578597  907.97910207]
Scaler Std: [  1.79960561   9.81660328 271.06047383]

    n_estimators=15,        # Reduced from 30 to 15
    max_depth=11,            # Limit depth to 8 (adjustable: try 5–10)
    max_features='log2',    # Use sqrt(n_features) ≈ 1-2 features per split
    min_samples_split=2,    # Minimum samples to split a node
    min_samples_leaf=1,     # Minimum samples per leaf
    bootstrap=False,        # No bootstrapping (consistent with your setup)
    ccp_alpha=0.0,          # No complexity pruning
    oob_score=False,        # Disable out-of-bag scoring
    random_state=42

    n_estimators=11,        # Reduced from 30 to 15
    max_depth=13,            # Limit depth to 8 (adjustable: try 5–10)
    max_features='sqrt',    # Use sqrt(n_features) ≈ 1-2 features per split
    min_samples_split=2,    # Minimum samples to split a node
    min_samples_leaf=1,     # Minimum samples per leaf
    bootstrap=False,        # No bootstrapping (consistent with your setup)
    ccp_alpha=0.0,          # No complexity pruning
    oob_score=False,        # Disable out-of-bag scoring
    random_state=42  

    n_estimators=13,        # Reduced from 30 to 15
    max_depth=12,            # Limit depth to 8 (adjustable: try 5–10)
    max_features=None,    # Use sqrt(n_features) ≈ 1-2 features per split
    min_samples_split=2,    # Minimum samples to split a node
    min_samples_leaf=1,     # Minimum samples per leaf
    bootstrap=False,        # No bootstrapping (consistent with your setup)
    ccp_alpha=0.0,          # No complexity pruning
    oob_score=False,        # Disable out-of-bag scoring
    random_state=42

    MAE: 2.0875 PPM
    R²: 0.8933
     Test Prediction -> Temperature: 26.0°C, Humidity: 40.0%, CO₂: 450.0 PPM
📈 Predicted CO₂: 486.37 PPM
C:\Users\sorat\AppData\Local\Programs\Python\Python313\Lib\site-packages\sklearn\utils\validation.py:2739: UserWarning: X does not have valid feature names, but StandardScaler was fitted with feature names
  warnings.warn(
🔹 Test Prediction -> Temperature: 20.0°C, Humidity: 10.0%, CO₂: 400.0 PPM
📈 Predicted CO₂: 445.25 PPM
C:\Users\sorat\AppData\Local\Programs\Python\Python313\Lib\site-packages\sklearn\utils\validation.py:2739: UserWarning: X does not have valid feature names, but StandardScaler was fitted with feature names
  warnings.warn(
🔹 Test Prediction -> Temperature: 35.0°C, Humidity: 50.0%, CO₂: 1500.0 PPM
📈 Predicted CO₂: 676.81 PPM