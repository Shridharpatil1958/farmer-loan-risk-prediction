# 🌾 Farm Loan Risk Predictor - HTML/CSS/JS Version

A modern, responsive web application for predicting farm loan risk categories using AI/ML. This is a complete HTML/CSS/JavaScript conversion of your Streamlit project.

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
```

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