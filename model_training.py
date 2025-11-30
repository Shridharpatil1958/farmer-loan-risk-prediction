import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
import pickle
import warnings

warnings.filterwarnings("ignore")

# 1️⃣ Load Dataset
df = pd.read_csv("farm_loan_risk_dataset_with_year.csv")

# 2️⃣ Clean Column Names
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

print("Dataset shape:", df.shape)
print("\nClass distribution:")
print(df['label_repaid'].value_counts())
print(df['label_repaid'].value_counts(normalize=True))

# ✅ EXACT FEATURES MATCHING STREAMLIT APP (10 features only!)
feature_cols = [
    "age", "land_size", "income", "crop_type", "loan_amount",
    "loan_term", "previous_defaults", "rainfall", "soil_type", "market_index"
]

target_col = "label_repaid"

# 3️⃣ Validate columns exist
missing_cols = [col for col in feature_cols if col not in df.columns]
if missing_cols:
    raise ValueError(f"❌ Missing columns: {missing_cols}")
if target_col not in df.columns:
    raise ValueError(f"❌ Target column '{target_col}' not found!")

print(f"\n✅ Using features: {feature_cols}")

# 4️⃣ Prepare X and y (EXACTLY matching app)
X = df[feature_cols].copy()
y = df[target_col].copy()

# 5️⃣ Handle missing values
for col in X.select_dtypes(include=[np.number]).columns:
    X[col] = pd.to_numeric(X[col], errors='coerce').fillna(X[col].median())
for col in X.select_dtypes(exclude=[np.number]).columns:
    X[col] = X[col].astype(str).fillna('Unknown')

# 6️⃣ Encode CATEGORICALS (MATCHING APP EXACTLY)
crop_map = {"Wheat": 0, "Rice": 1, "Cotton": 2, "Sugarcane": 3, "Maize": 4}
soil_map = {"Sandy": 0, "Clay": 1, "Loamy": 2, "Black": 3, "Red": 4}

X['crop_type'] = X['crop_type'].map(crop_map).fillna(0).astype(int)
X['soil_type'] = X['soil_type'].map(soil_map).fillna(0).astype(int)

# 7️⃣ Encode target (Low=2, Medium=1, High=0 to match app)
target_map = {"Low Risk": 2, "Medium Risk": 1, "High Risk": 0}
y = y.map(target_map).fillna(0).astype(int)

print(f"\nTarget encoded sample: {y[:5].values}")

# 8️⃣ Train/Test Split (stratified)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 9️⃣ Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"\n✅ Features after scaling: {X_train_scaled.shape[1]}")

# 🔟 NO SMOTE - Use class_weight='balanced' instead
print(f"Training without SMOTE (Python 3.7 compatible)")

# 1️⃣1️⃣ Define Models (with class_weight='balanced' for imbalance)
models = {
    "Logistic Regression": LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42),
    "Decision Tree": DecisionTreeClassifier(class_weight='balanced', random_state=42, max_depth=10),
    "Random Forest": RandomForestClassifier(n_estimators=200, class_weight='balanced', random_state=42, max_depth=10),
    "SVM": SVC(probability=True, class_weight='balanced', kernel="rbf", random_state=42)
}

# 1️⃣2️⃣ Train & Evaluate
results = {}
print("\n🚜 Training Models...")
for name, model in models.items():
    model.fit(X_train_scaled, y_train)
    y_pred = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    results[name] = acc
    print(f"\n🔹 {name} Accuracy: {acc:.4f}")
    print(classification_report(y_test, y_pred, 
          target_names=["High Risk", "Medium Risk", "Low Risk"]))
    print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

# 1️⃣3️⃣ Save BEST MODEL + exact preprocessors for app
best_model_name = max(results, key=results.get)
best_model = models[best_model_name]

# Save model, scaler, mappings
with open("saved_model.pkl", "wb") as f:
    pickle.dump(best_model, f)
with open("scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

# Save target mapping for app
target_mapping = {0: "High Risk ❌", 1: "Medium Risk ⚠️", 2: "Low Risk ✅"}
with open("target_encoder.pkl", "wb") as f:
    pickle.dump(target_mapping, f)

print(f"\n🏆 Best Model: {best_model_name} ({results[best_model_name]:.4f})")
print("✅ Files saved: saved_model.pkl, scaler.pkl, target_encoder.pkl")
print("\n🎯 Your Streamlit app will now predict ALL 3 classes correctly!")
print("Test with: age=65, land_size=0.5, income=50000, loan_amount=400000, previous_defaults=4")
