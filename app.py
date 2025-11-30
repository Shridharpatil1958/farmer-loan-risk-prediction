import streamlit as st
import pandas as pd
import numpy as np
import pickle
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Set Plotly theme
import plotly.io as pio
pio.templates.default = "plotly_white"

# -----------------------------
# Load Model and Scaler
# -----------------------------
model = pickle.load(open("saved_model.pkl", "rb"))
scaler = pickle.load(open("scaler.pkl", "rb"))

# Load target mapping (DICT, not LabelEncoder)
try:
    target_mapping = pickle.load(open("target_encoder.pkl", "rb"))
except:
    target_mapping = {0: "High Risk ❌", 1: "Medium Risk ⚠️", 2: "Low Risk ✅"}

# Automatically detect training feature names
try:
    expected_features = scaler.feature_names_in_
except AttributeError:
    expected_features = None

# -----------------------------
# Streamlit Page Settings
# -----------------------------
st.set_page_config(page_title="AI Farm Loan Risk Predictor", page_icon="🌾", layout="wide")

# Initialize session history and current crop
if "history" not in st.session_state:
    st.session_state.history = []
if "current_crop" not in st.session_state:
    st.session_state.current_crop = None

# Sidebar Navigation
menu = st.sidebar.radio("📍 Navigate", ["🏠 Home", "📊 Predict Risk", "📈 Insights", "📊 Visuals", "📋 History"])

# -----------------------------
# 🏠 HOME PAGE - CLEAN VERSION
# -----------------------------
if menu == "🏠 Home":
    st.title("🌾 AI-Powered Farm Loan Risk Prediction System")
    
    st.markdown("""
    Welcome to the **AI Farm Loan Risk Prediction System** —  
    an intelligent platform that estimates **loan risk categories (Low, Medium, High)**  
    for farmers using advanced machine learning models.
    
    ## 🎯 **Key Features**
    - **Real-time predictions** with confidence scores
    - **Interactive visualizations** across all pages
    - **Historical tracking** with export options
    - **Market trend analysis** by crop type
    
    ## 🛠️ **Technology Stack**
    - **Frontend**: Streamlit + Plotly (Interactive Charts)
    - **Backend**: Scikit-learn (Random Forest, SVM, Logistic Regression)
    - **Data**: 500+ farmer records (2020-2025)
    
    ---
    **Ready to predict?** → [Predict Risk](#📊-predict-risk-page)
    """)

# -----------------------------
# 📊 PREDICT RISK PAGE - FIXED FORM
# -----------------------------
elif menu == "📊 Predict Risk":
    st.header("🔍 Enter Farmer Details to Predict Loan Risk")

    # ✅ SINGLE FORM - Both columns inside ONE form
    with st.form("loan_form"):
        col1, col2 = st.columns(2)
        
        with col1:
            name = st.text_input("👤 Farmer Name")
            age = st.number_input("👴 Age", 18, 80, 35)
            land_size = st.number_input("🌾 Land Size (acres)", 0.1, 100.0, 5.0)
            income = st.number_input("💰 Annual Income (₹)", 10000, 1000000, 200000)
        
        with col2:
            loan_amount = st.number_input("🏦 Loan Amount (₹)", 1000, 1000000, 50000)
            loan_term = st.number_input("📅 Loan Term (months)", 3, 60, 12)
            crop_type = st.selectbox("🌱 Crop Type", ["Wheat", "Rice", "Cotton", "Sugarcane", "Maize"])
            soil_type = st.selectbox("⛏️ Soil Type", ["Sandy", "Clay", "Loamy", "Black", "Red"])
            rainfall = st.number_input("🌧️ Rainfall (mm)", 0, 500, 120)
            previous_defaults = st.number_input("⚠️ Previous Defaults", 0, 10, 0)
        
        # ✅ SINGLE SUBMIT BUTTON - Full width
        submitted = st.form_submit_button("🌾 **Predict Risk Now**", use_container_width=True)

    if submitted and name:  # Check name to avoid empty submissions
        st.session_state.current_crop = crop_type
        market_index = 50

        # Encode input features
        crop_map = {"Wheat": 0, "Rice": 1, "Cotton": 2, "Sugarcane": 3, "Maize": 4}
        soil_map = {"Sandy": 0, "Clay": 1, "Loamy": 2, "Black": 3, "Red": 4}

        input_data = pd.DataFrame([[
            age, land_size, income, crop_map[crop_type], loan_amount,
            loan_term, previous_defaults, rainfall, soil_map[soil_type], market_index
        ]], columns=[
            "age", "land_size", "income", "crop_type", "loan_amount",
            "loan_term", "previous_defaults", "rainfall", "soil_type", "market_index"
        ])

        scaled_input = scaler.transform(input_data)
        pred_probs = model.predict_proba(scaled_input)[0]
        pred_class = np.argmax(pred_probs)
        risk_label = target_mapping.get(pred_class, "Unknown")

        # Save to history
        st.session_state.history.append({
            "Name": name, "Age": age, "Crop": crop_type, "Loan Amount": loan_amount,
            "Predicted Risk": risk_label, "Date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })

        # === PERFECTLY ALIGNED RESULTS ===
        st.markdown("---")
        
        # Row 1: Main Result + Gauge
        col_result1, col_result2 = st.columns([3, 1])
        with col_result1:
            st.markdown(f"# 🎯 **{risk_label}**")
            st.progress(pred_probs[pred_class])
            st.caption(f"**Confidence**: {pred_probs[pred_class]:.1%}")
        
        with col_result2:
            fig_gauge = go.Figure(go.Indicator(
                mode="gauge+number",
                value=pred_probs[pred_class]*100,
                domain={'x': [0, 1], 'y': [0, 1]},
                gauge={'bar': {'color': "darkblue"},
                       'axis': {'range': [None, 100]},
                       'steps': [{'range': [0, 33], 'color': "red"},
                                {'range': [33, 66], 'color': "yellow"},
                                {'range': [66, 100], 'color': "green"}]}))
            fig_gauge.update_layout(height=200, margin=dict(l=10, r=10, t=30, b=10))
            st.plotly_chart(fig_gauge, use_container_width=True)

        # Row 2: Probability Bar Chart (Full Width)
        risk_levels = ["High Risk", "Medium Risk", "Low Risk"]
        colors = ["#ff4444", "#ffaa00", "#44ff44"]
        
        fig_prob = go.Figure(data=[go.Bar(
            x=risk_levels, y=pred_probs, marker_color=colors,
            text=[f'{p:.1%}' for p in pred_probs], textposition='auto',
            marker_line_color='white', marker_line_width=2)])
        fig_prob.update_layout(title="📊 Risk Probability Distribution", 
                             height=400, showlegend=False)
        st.plotly_chart(fig_prob, use_container_width=True)

        # Row 3: Feature Importance (Full Width)
        if hasattr(model, 'feature_importances_'):
            feature_names = ["Age", "Land", "Income", "Crop", "Loan Amt", 
                           "Term", "Defaults", "Rainfall", "Soil", "Market"]
            importance = model.feature_importances_
            
            fig_imp = px.bar(x=feature_names, y=importance, 
                           title="🔍 Feature Importance - What Drives This Prediction?",
                           color=importance, color_continuous_scale="viridis_r",
                           height=400)
            fig_imp.update_layout(showlegend=False)
            st.plotly_chart(fig_imp, use_container_width=True)

# -----------------------------
# 📈 INSIGHTS PAGE
# -----------------------------
elif menu == "📈 Insights":
    st.header("🌾 Agricultural Market Insights")
    
    try:
        @st.cache_data
        def load_data():
            df = pd.read_csv("farm_loan_risk_dataset_with_year.csv")
            df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
            return df
        
        df = load_data()
        
        # Row 1: Risk by Crop + Market Trend
        col1, col2 = st.columns(2)
        with col1:
            risk_pivot = df.groupby(['crop_type', 'label_repaid']).size().unstack(fill_value=0)
            fig1 = px.bar(risk_pivot, title="Risk Distribution by Crop", height=400)
            st.plotly_chart(fig1, use_container_width=True)
        
        with col2:
            if st.session_state.current_crop:
                df_crop = df[df["crop_type"] == st.session_state.current_crop]
                df_grouped = df_crop.groupby("year")["market_index"].mean().reset_index()
                fig2 = px.line(df_grouped, x="year", y="market_index", 
                             title=f"{st.session_state.current_crop} Market Trend",
                             markers=True, height=400)
                st.plotly_chart(fig2, use_container_width=True)
        
        # Row 2: Correlation Heatmap (Full Width)
        st.markdown("---")
        num_cols = ['age', 'land_size', 'income', 'loan_amount', 'rainfall', 'market_index']
        corr = df[num_cols].corr()
        fig_heatmap = px.imshow(corr, title="📊 Feature Correlation Matrix", 
                               color_continuous_scale="RdBu_r", height=500)
        st.plotly_chart(fig_heatmap, use_container_width=True)
        
    except FileNotFoundError:
        st.error("❌ Dataset file not found!")

# -----------------------------
# 📊 VISUALS PAGE
# -----------------------------
elif menu == "📊 Visuals":
    st.header("📊 Your Prediction Analytics")
    
    if len(st.session_state.history) > 0:
        df_hist = pd.DataFrame(st.session_state.history)
        
        # Row 1: Pie + Age Distribution
        col1, col2 = st.columns(2)
        with col1:
            risk_counts = df_hist['Predicted Risk'].value_counts()
            fig_pie = px.pie(values=risk_counts.values, names=risk_counts.index,
                           title="Risk Distribution", hole=0.4, height=400)
            st.plotly_chart(fig_pie, use_container_width=True)
        
        with col2:
            fig_age = px.histogram(df_hist, x='Age', color='Predicted Risk',
                                 title="Age vs Risk", nbins=20, height=400)
            st.plotly_chart(fig_age, use_container_width=True)
        
        # Row 2: Loan Scatter (Full Width)
        st.markdown("---")
        fig_scatter = px.scatter(df_hist, x='Loan Amount', y='Age', color='Predicted Risk',
                               size='Age', hover_name='Name', hover_data=['Crop'],
                               title="Loan Amount vs Age vs Risk", height=500)
        st.plotly_chart(fig_scatter, use_container_width=True)
        
        # Row 3: Data Table
        st.markdown("---")
        st.subheader("📋 Complete History")
        st.dataframe(df_hist, use_container_width=True)
        
    else:
        st.info("👆 **Make predictions first** to unlock analytics!")

# -----------------------------
# 📋 HISTORY PAGE
# -----------------------------
elif menu == "📋 History":
    st.header("🕒 Prediction History")
    if len(st.session_state.history) > 0:
        df_hist = pd.DataFrame(st.session_state.history)
        st.dataframe(df_hist, use_container_width=True)
        
        # Download button
        csv = df_hist.to_csv(index=False).encode("utf-8")
        col1, col2 = st.columns([3, 1])
        with col2:
            st.download_button("⬇️ Export CSV", csv, "loan_risk_history.csv", 
                             "text/csv", use_container_width=True)
    else:
        st.info("📝 **No predictions yet.** Go to 'Predict Risk' to start!")
