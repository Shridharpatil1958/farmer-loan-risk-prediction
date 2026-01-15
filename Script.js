// ===========================
// Global State Management
// ===========================
let predictionHistory = [];
let currentCrop = null;

// ===========================
// Navigation System
// ===========================
function navigateTo(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
    
    // Refresh page content
    if (pageName === 'visuals') {
        updateVisualsPage();
    } else if (pageName === 'history') {
        updateHistoryPage();
    } else if (pageName === 'insights') {
        loadInsightsPage();
    }
}

// Add click listeners to nav items
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            navigateTo(page);
        });
    });
    
    // Initialize form submission
    document.getElementById('loan-form').addEventListener('submit', handleFormSubmit);
    
    // Initialize export button
    document.getElementById('export-csv')?.addEventListener('click', exportToCSV);
});

// ===========================
// Risk Prediction Logic
// ===========================
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        land_size: parseFloat(document.getElementById('land_size').value),
        income: parseInt(document.getElementById('income').value),
        loan_amount: parseInt(document.getElementById('loan_amount').value),
        loan_term: parseInt(document.getElementById('loan_term').value),
        crop_type: document.getElementById('crop_type').value,
        soil_type: document.getElementById('soil_type').value,
        rainfall: parseInt(document.getElementById('rainfall').value),
        previous_defaults: parseInt(document.getElementById('previous_defaults').value)
    };
    
    currentCrop = formData.crop_type;
    
    // Simulate prediction (replace with actual API call)
    const prediction = simulatePrediction(formData);
    
    // Save to history
    predictionHistory.push({
        name: formData.name,
        age: formData.age,
        crop: formData.crop_type,
        loan_amount: formData.loan_amount,
        predicted_risk: prediction.label,
        date: new Date().toLocaleString()
    });
    
    // Display results
    displayResults(prediction);
}

function simulatePrediction(data) {
    // Simple risk calculation logic (replace with actual model)
    let riskScore = 0;
    
    // Age factor
    if (data.age < 25 || data.age > 60) riskScore += 15;
    else if (data.age < 30 || data.age > 55) riskScore += 10;
    else riskScore += 5;
    
    // Income to loan ratio
    const ratio = data.loan_amount / data.income;
    if (ratio > 0.5) riskScore += 25;
    else if (ratio > 0.3) riskScore += 15;
    else riskScore += 5;
    
    // Previous defaults
    riskScore += data.previous_defaults * 10;
    
    // Land size
    if (data.land_size < 2) riskScore += 15;
    else if (data.land_size < 5) riskScore += 10;
    
    // Rainfall
    if (data.rainfall < 50) riskScore += 15;
    else if (data.rainfall < 100) riskScore += 10;
    
    // Loan term
    if (data.loan_term > 36) riskScore += 10;
    else if (data.loan_term > 24) riskScore += 5;
    
    // Determine risk category
    let riskClass, riskLabel;
    let probabilities = [0, 0, 0]; // [High, Medium, Low]
    
    if (riskScore >= 60) {
        riskClass = 0;
        riskLabel = "High Risk ❌";
        probabilities = [0.75 + Math.random() * 0.15, 0.15 + Math.random() * 0.10, 0.05 + Math.random() * 0.05];
    } else if (riskScore >= 30) {
        riskClass = 1;
        riskLabel = "Medium Risk ⚠️";
        probabilities = [0.15 + Math.random() * 0.10, 0.65 + Math.random() * 0.15, 0.15 + Math.random() * 0.10];
    } else {
        riskClass = 2;
        riskLabel = "Low Risk ✅";
        probabilities = [0.05 + Math.random() * 0.05, 0.15 + Math.random() * 0.10, 0.75 + Math.random() * 0.15];
    }
    
    // Normalize probabilities
    const sum = probabilities.reduce((a, b) => a + b, 0);
    probabilities = probabilities.map(p => p / sum);
    
    // Feature importance (simulated)
    const featureImportance = {
        'Age': 0.08 + Math.random() * 0.05,
        'Land Size': 0.12 + Math.random() * 0.05,
        'Income': 0.20 + Math.random() * 0.05,
        'Crop Type': 0.10 + Math.random() * 0.05,
        'Loan Amount': 0.18 + Math.random() * 0.05,
        'Loan Term': 0.09 + Math.random() * 0.05,
        'Prev Defaults': 0.15 + Math.random() * 0.05,
        'Rainfall': 0.08 + Math.random() * 0.05,
        'Soil Type': 0.07 + Math.random() * 0.05,
        'Market Index': 0.06 + Math.random() * 0.05
    };
    
    return {
        class: riskClass,
        label: riskLabel,
        probabilities: probabilities,
        confidence: probabilities[riskClass],
        featureImportance: featureImportance
    };
}

// ===========================
// Results Display
// ===========================
function displayResults(prediction) {
    const resultsSection = document.getElementById('results-section');
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Update risk label
    document.getElementById('risk-label').textContent = `🎯 ${prediction.label}`;
    
    // Update confidence bar
    const confidenceFill = document.getElementById('confidence-fill');
    const confidenceText = document.getElementById('confidence-text');
    confidenceFill.style.width = `${prediction.confidence * 100}%`;
    confidenceText.textContent = `Confidence: ${(prediction.confidence * 100).toFixed(1)}%`;
    
    // Color code based on risk
    if (prediction.class === 0) {
        confidenceFill.style.background = 'linear-gradient(90deg, #EF5350, #E53935)';
    } else if (prediction.class === 1) {
        confidenceFill.style.background = 'linear-gradient(90deg, #FFCA28, #FFB300)';
    } else {
        confidenceFill.style.background = 'linear-gradient(90deg, #66BB6A, #4CAF50)';
    }
    
    // Create gauge chart
    createGaugeChart(prediction.confidence * 100);
    
    // Create probability bar chart
    createProbabilityChart(prediction.probabilities);
    
    // Create feature importance chart
    createFeatureImportanceChart(prediction.featureImportance);
}

// ===========================
// Chart Creation Functions
// ===========================
function createGaugeChart(value) {
    const data = [{
        type: "indicator",
        mode: "gauge+number",
        value: value,
        number: { suffix: "%", font: { size: 40 } },
        gauge: {
            axis: { range: [null, 100], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
                { range: [0, 33], color: '#ffcccc' },
                { range: [33, 66], color: '#fff4cc' },
                { range: [66, 100], color: '#ccffcc' }
            ],
        }
    }];
    
    const layout = {
        height: 200,
        margin: { t: 30, r: 10, l: 10, b: 10 },
        font: { family: 'Segoe UI' }
    };
    
    Plotly.newPlot('gauge-chart', data, layout, { responsive: true, displayModeBar: false });
}

function createProbabilityChart(probabilities) {
    const data = [{
        x: ['High Risk', 'Medium Risk', 'Low Risk'],
        y: probabilities,
        type: 'bar',
        marker: {
            color: ['#EF5350', '#FFCA28', '#66BB6A'],
            line: {
                color: 'white',
                width: 2
            }
        },
        text: probabilities.map(p => `${(p * 100).toFixed(1)}%`),
        textposition: 'auto',
    }];
    
    const layout = {
        title: '📊 Risk Probability Distribution',
        height: 400,
        showlegend: false,
        font: { family: 'Segoe UI' },
        yaxis: { title: 'Probability', range: [0, 1] },
        xaxis: { title: 'Risk Category' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };
    
    Plotly.newPlot('probability-chart', data, layout, { responsive: true });
}

function createFeatureImportanceChart(importance) {
    const features = Object.keys(importance);
    const values = Object.values(importance);
    
    const data = [{
        x: features,
        y: values,
        type: 'bar',
        marker: {
            color: values,
            colorscale: 'Viridis',
            reversescale: true,
            showscale: false
        },
        text: values.map(v => v.toFixed(3)),
        textposition: 'auto',
    }];
    
    const layout = {
        title: '🔍 Feature Importance - What Drives This Prediction?',
        height: 400,
        showlegend: false,
        font: { family: 'Segoe UI' },
        yaxis: { title: 'Importance' },
        xaxis: { title: 'Features' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };
    
    Plotly.newPlot('importance-chart', data, layout, { responsive: true });
}

// ===========================
// Insights Page
// ===========================
function loadInsightsPage() {
    // Simulate crop risk data
    const cropRiskData = {
        crops: ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize'],
        high: [45, 38, 52, 42, 35],
        medium: [78, 85, 68, 75, 82],
        low: [112, 95, 88, 98, 105]
    };
    
    createCropRiskChart(cropRiskData);
    createMarketTrendChart();
    createCorrelationHeatmap();
}

function createCropRiskChart(data) {
    const traces = [
        {
            x: data.crops,
            y: data.high,
            name: 'High Risk',
            type: 'bar',
            marker: { color: '#EF5350' }
        },
        {
            x: data.crops,
            y: data.medium,
            name: 'Medium Risk',
            type: 'bar',
            marker: { color: '#FFCA28' }
        },
        {
            x: data.crops,
            y: data.low,
            name: 'Low Risk',
            type: 'bar',
            marker: { color: '#66BB6A' }
        }
    ];
    
    const layout = {
        title: 'Risk Distribution by Crop',
        barmode: 'group',
        height: 400,
        font: { family: 'Segoe UI' },
        xaxis: { title: 'Crop Type' },
        yaxis: { title: 'Number of Cases' }
    };
    
    Plotly.newPlot('crop-risk-chart', traces, layout, { responsive: true });
}

function createMarketTrendChart() {
    if (!currentCrop) {
        currentCrop = 'Wheat';
    }
    
    const years = [2020, 2021, 2022, 2023, 2024, 2025];
    const marketIndex = years.map(() => 40 + Math.random() * 30);
    
    const data = [{
        x: years,
        y: marketIndex,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: '#2E7D32', size: 10 },
        line: { color: '#2E7D32', width: 3 }
    }];
    
    const layout = {
        title: `${currentCrop} Market Trend`,
        height: 400,
        font: { family: 'Segoe UI' },
        xaxis: { title: 'Year' },
        yaxis: { title: 'Market Index' }
    };
    
    Plotly.newPlot('market-trend-chart', data, layout, { responsive: true });
}

function createCorrelationHeatmap() {
    const features = ['Age', 'Land Size', 'Income', 'Loan Amount', 'Rainfall', 'Market Index'];
    const correlation = [
        [1.00, 0.15, 0.23, 0.18, -0.05, 0.12],
        [0.15, 1.00, 0.45, 0.52, 0.38, 0.28],
        [0.23, 0.45, 1.00, 0.68, 0.22, 0.35],
        [0.18, 0.52, 0.68, 1.00, 0.15, 0.42],
        [-0.05, 0.38, 0.22, 0.15, 1.00, 0.55],
        [0.12, 0.28, 0.35, 0.42, 0.55, 1.00]
    ];
    
    const data = [{
        z: correlation,
        x: features,
        y: features,
        type: 'heatmap',
        colorscale: 'RdBu',
        reversescale: true,
        zmid: 0
    }];
    
    const layout = {
        title: '📊 Feature Correlation Matrix',
        height: 500,
        font: { family: 'Segoe UI' },
        xaxis: { side: 'bottom' }
    };
    
    Plotly.newPlot('correlation-heatmap', data, layout, { responsive: true });
}

// ===========================
// Visuals Page
// ===========================
function updateVisualsPage() {
    if (predictionHistory.length === 0) {
        document.getElementById('visuals-content').style.display = 'block';
        document.getElementById('visuals-charts').style.display = 'none';
        return;
    }
    
    document.getElementById('visuals-content').style.display = 'none';
    document.getElementById('visuals-charts').style.display = 'block';
    
    createRiskPieChart();
    createAgeHistogram();
    createLoanScatterChart();
    createVisualsTable();
}

function createRiskPieChart() {
    const riskCounts = { 'High Risk ❌': 0, 'Medium Risk ⚠️': 0, 'Low Risk ✅': 0 };
    predictionHistory.forEach(item => {
        riskCounts[item.predicted_risk]++;
    });
    
    const data = [{
        values: Object.values(riskCounts),
        labels: Object.keys(riskCounts),
        type: 'pie',
        hole: 0.4,
        marker: {
            colors: ['#EF5350', '#FFCA28', '#66BB6A']
        }
    }];
    
    const layout = {
        title: 'Risk Distribution',
        height: 400,
        font: { family: 'Segoe UI' }
    };
    
    Plotly.newPlot('risk-pie-chart', data, layout, { responsive: true });
}

function createAgeHistogram() {
    const ages = predictionHistory.map(item => item.age);
    const risks = predictionHistory.map(item => item.predicted_risk);
    
    const traces = [];
    const riskTypes = ['High Risk ❌', 'Medium Risk ⚠️', 'Low Risk ✅'];
    const colors = ['#EF5350', '#FFCA28', '#66BB6A'];
    
    riskTypes.forEach((risk, i) => {
        const filteredAges = ages.filter((age, idx) => risks[idx] === risk);
        if (filteredAges.length > 0) {
            traces.push({
                x: filteredAges,
                type: 'histogram',
                name: risk,
                marker: { color: colors[i] },
                opacity: 0.7
            });
        }
    });
    
    const layout = {
        title: 'Age vs Risk',
        height: 400,
        barmode: 'overlay',
        font: { family: 'Segoe UI' },
        xaxis: { title: 'Age' },
        yaxis: { title: 'Count' }
    };
    
    Plotly.newPlot('age-histogram', traces, layout, { responsive: true });
}

function createLoanScatterChart() {
    const data = [{
        x: predictionHistory.map(item => item.loan_amount),
        y: predictionHistory.map(item => item.age),
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: predictionHistory.map(item => item.age / 2),
            color: predictionHistory.map(item => {
                if (item.predicted_risk.includes('High')) return '#EF5350';
                if (item.predicted_risk.includes('Medium')) return '#FFCA28';
                return '#66BB6A';
            }),
            line: {
                color: 'white',
                width: 2
            }
        },
        text: predictionHistory.map(item => 
            `${item.name}<br>Crop: ${item.crop}<br>Risk: ${item.predicted_risk}`
        ),
        hovertemplate: '%{text}<extra></extra>'
    }];
    
    const layout = {
        title: 'Loan Amount vs Age vs Risk',
        height: 500,
        font: { family: 'Segoe UI' },
        xaxis: { title: 'Loan Amount (₹)' },
        yaxis: { title: 'Age' }
    };
    
    Plotly.newPlot('loan-scatter-chart', data, layout, { responsive: true });
}

function createVisualsTable() {
    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Crop</th>
                    <th>Loan Amount</th>
                    <th>Predicted Risk</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${predictionHistory.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.age}</td>
                        <td>${item.crop}</td>
                        <td>₹${item.loan_amount.toLocaleString()}</td>
                        <td class="${getRiskClass(item.predicted_risk)}">${item.predicted_risk}</td>
                        <td>${item.date}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('visuals-table').innerHTML = tableHTML;
}

// ===========================
// History Page
// ===========================
function updateHistoryPage() {
    if (predictionHistory.length === 0) {
        document.getElementById('history-content').style.display = 'block';
        document.getElementById('history-table-container').style.display = 'none';
        return;
    }
    
    document.getElementById('history-content').style.display = 'none';
    document.getElementById('history-table-container').style.display = 'block';
    
    const tbody = document.getElementById('history-tbody');
    tbody.innerHTML = predictionHistory.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.age}</td>
            <td>${item.crop}</td>
            <td>₹${item.loan_amount.toLocaleString()}</td>
            <td class="${getRiskClass(item.predicted_risk)}">${item.predicted_risk}</td>
            <td>${item.date}</td>
        </tr>
    `).join('');
}

// ===========================
// Helper Functions
// ===========================
function getRiskClass(riskLabel) {
    if (riskLabel.includes('High')) return 'risk-high';
    if (riskLabel.includes('Medium')) return 'risk-medium';
    return 'risk-low';
}

function exportToCSV() {
    if (predictionHistory.length === 0) return;
    
    const headers = ['Name', 'Age', 'Crop', 'Loan Amount', 'Predicted Risk', 'Date'];
    const csvContent = [
        headers.join(','),
        ...predictionHistory.map(item => 
            [item.name, item.age, item.crop, item.loan_amount, item.predicted_risk, item.date].join(',')
        )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loan_risk_history.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}