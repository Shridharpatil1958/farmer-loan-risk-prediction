# 🌾 Farm Loan Risk Predictor

A modern, responsive web application for predicting farm loan risk categories using AI/ML. This is a complete HTML/CSS/JavaScript conversion of your Streamlit project.

🏠 Home Dashboard
Overview of the AI-Powered Farm Loan Risk Prediction System
A centralized dashboard highlighting key features such as real-time predictions, interactive visualizations, historical tracking, and agricultural market analysis.
<img width="1920" height="925" alt="Screenshot 2026-01-15 144649" src="https://github.com/user-attachments/assets/69bafad4-0cdc-4694-9343-799a487b39e2" />

🧾 Loan Risk Prediction Form
Farmer Loan Risk Prediction Interface
Users can enter farmer details including age, land size, income, crop type, rainfall, loan amount, and past defaults to predict loan risk using machine learning.
<img width="1919" height="922" alt="Screenshot 2026-01-15 144809" src="https://github.com/user-attachments/assets/cab4eda8-ca2b-4e30-acaa-2407d40b3351" />

🎯 Prediction Result & Confidence Score
Loan Risk Classification with Confidence Score
Displays predicted loan risk category (Low, Medium, High) along with model confidence using an intuitive progress bar and gauge visualization.
<img width="1920" height="931" alt="Screenshot 2026-01-15 144825" src="https://github.com/user-attachments/assets/c80da96a-d91c-4a96-a1a6-d6ffccb477ee" />

📊 Risk Probability Distribution
Probability Distribution Across Risk Categories
Visual breakdown of predicted probabilities for High, Medium, and Low risk classes, helping stakeholders understand model certainty.
<img width="1920" height="930" alt="Screenshot 2026-01-15 144835" src="https://github.com/user-attachments/assets/57c43d73-f77a-452a-8364-7f6d3b3165fa" />

🔍 Feature Importance Analysis
Explainable AI – Feature Importance Visualization
Shows which features (income, loan amount, previous defaults, crop type, etc.) most influence the loan risk prediction, ensuring transparency.
<img width="1920" height="928" alt="Screenshot 2026-01-15 144849" src="https://github.com/user-attachments/assets/6fd45afc-d85f-4e51-aa18-2a0cb3a72f04" />

📈 Prediction Analytics Dashboard
Prediction Analytics & Risk Distribution Insights
Includes risk distribution charts and age vs risk analysis to identify trends across different farmer demographics.
<img width="1920" height="927" alt="Screenshot 2026-01-15 144950" src="https://github.com/user-attachments/assets/db267357-f37c-42c1-a509-27043eb3ef80" />

🕒 Prediction History & Export
Prediction History with CSV Export
Maintains a log of all past predictions with timestamps and allows users to export data for reporting and auditing.
<img width="1920" height="925" alt="Screenshot 2026-01-15 145010" src="https://github.com/user-attachments/assets/3359a84e-c84c-48b1-afa1-38a5013d33b4" />

## 📋 Features

- **🏠 Home Page**: Welcome page with feature highlights and technology stack
- **📊 Predict Risk**: Interactive form to input farmer details and get risk predictions
- **📈 Insights**: Agricultural market insights with interactive charts
- **📊 Visuals**: Analytics dashboard with pie charts, histograms, and scatter plots
- **📋 History**: Complete prediction history with CSV export functionality

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No server or installation required!

### Installation

1. Extract all files to a folder on your computer:
   - `farm-loan-predictor.html`
   - `styles.css`
   - `script.js`

2. Open `farm-loan-predictor.html` in your web browser

That's it! The application runs entirely in your browser.

## 📁 File Structure

```
farm-loan-predictor/
│
├── farm-loan-predictor.html    # Main HTML file
├── styles.css                   # Styling and layout
├── script.js                    # Application logic and charts
└── README.md                    # This file
|___app.py
|___model_training.py            #Traiing models 


## 🎨 Features Overview

### 1. Risk Prediction
- Input farmer details through an intuitive form
- Get instant risk predictions (High, Medium, Low)
- View confidence scores with visual indicators
- See probability distribution across risk categories
- Understand feature importance for each prediction

### 2. Interactive Visualizations
- **Gauge Chart**: Visual representation of confidence level
- **Bar Charts**: Probability distribution and feature importance
- **Pie Chart**: Overall risk distribution
- **Histogram**: Age vs risk analysis
- **Scatter Plot**: Loan amount vs age correlation
- **Heatmap**: Feature correlation matrix

### 3. Data Management
- Automatic prediction history tracking
- Export history to CSV format
- Filter and analyze past predictions
- Real-time data updates

## 🛠️ Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Application logic and interactivity
- **Plotly.js**: Interactive data visualizations
- **Local Storage**: Client-side data persistence (can be added)

## 🎯 How to Use

### Making a Prediction

1. Navigate to **"Predict Risk"** from the sidebar
2. Fill in all farmer details:
   - Personal info (name, age)
   - Land and income details
   - Loan information
   - Agricultural data (crop type, soil, rainfall)
3. Click **"Predict Risk Now"**
4. View the results with:
   - Risk category and confidence
   - Probability distribution
   - Feature importance analysis

### Viewing Analytics

1. **Insights Page**: 
   - View risk distribution by crop type
   - Track market trends for selected crops
   - Analyze feature correlations

2. **Visuals Page**:
   - See your prediction analytics
   - Interactive charts and graphs
   - Complete data table

3. **History Page**:
   - Review all past predictions
   - Export data to CSV

## 🔧 Customization

### Changing Colors

Edit `styles.css` and modify the CSS variables in `:root`:

```css
:root {
    --primary-color: #2E7D32;    /* Main green */
    --secondary-color: #66BB6A;   /* Light green */
    --accent-color: #FFA726;      /* Orange */
    /* ... more colors */
}
```

### Adding Backend Integration

To connect to a real ML model:

1. Replace the `simulatePrediction()` function in `script.js`
2. Add API calls to your backend:

```javascript
async function makePrediction(formData) {
    const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    return await response.json();
}
```

### Enabling Local Storage

Add persistence between sessions by using localStorage:

```javascript
// Save history
localStorage.setItem('predictionHistory', JSON.stringify(predictionHistory));

// Load on startup
predictionHistory = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
```

## 📱 Responsive Design

The application is fully responsive and works on:
- 🖥️ Desktop computers
- 💻 Laptops
- 📱 Tablets
- 📱 Mobile phones

The sidebar collapses on smaller screens for optimal viewing.

## 🌐 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## 📊 Prediction Algorithm

The current implementation uses a simulated risk scoring system based on:
- **Age**: Risk increases for very young (<25) or older (>60) farmers
- **Income-to-Loan Ratio**: Higher ratios indicate higher risk
- **Previous Defaults**: Each default adds 10 points to risk score
- **Land Size**: Smaller land holdings increase risk
- **Rainfall**: Low rainfall areas get higher risk scores
- **Loan Term**: Longer terms slightly increase risk

**Note**: Replace this with your actual ML model for production use.

## 🔐 Security Considerations

- All data is processed client-side (no server transmission)
- No sensitive data is stored externally
- For production, implement proper authentication and authorization
- Use HTTPS when deploying
- Validate and sanitize all inputs server-side

## 🚀 Deployment

### Local Testing
Simply open the HTML file in a browser.

### Web Hosting
Upload all three files to any web hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any traditional web host

### With Backend API
1. Set up your ML model as a REST API
2. Update the `script.js` file to call your API
3. Handle CORS properly on your backend
4. Deploy frontend and backend separately

## 📝 Future Enhancements

- [ ] User authentication system
- [ ] Database integration for persistent storage
- [ ] Real-time data updates
- [ ] Advanced filtering and search
- [ ] PDF report generation
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Mobile app version

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For questions or issues:
- Review the code comments in each file
- Check browser console for error messages
- Ensure all three files are in the same directory


---

**Built with ❤️ for farmers and financial institutions**


Enjoy your new web application! 🌾



