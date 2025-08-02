# FORECASTIFY EDU 📊

**Interactive Educational Sales Forecasting System**

A modern React-based application designed to teach students about sales forecasting through interactive data input, percentage-based calculations, and visual chart representations.

## 🎯 Project Overview

FORECASTIFY EDU is an educational tool that helps students understand sales forecasting concepts by:

- **Inputting historical sales data** (5-10 years)
- **Setting forecasting parameters** with percentage adjustments
- **Visualizing results** through interactive charts
- **Learning calculation steps** with detailed formulas
- **Exporting results** as professional PDF reports

## ✨ Features

### 📊 Data Input & Management
- **Historical Data Table**: Input sales data for 5-10 years
- **Forecasting Parameters**: Set percentage changes for future years
- **Dynamic Tables**: Add/remove years as needed
- **Input Validation**: Real-time error checking

### 📈 Visualization & Charts
- **Multiple Chart Types**: Line, Bar, and Area charts
- **Interactive Selection**: Switch between chart types
- **Continuous Lines**: Seamless connection between historical and forecasted data
- **Responsive Design**: Works on all screen sizes

### 🧮 Educational Features
- **Step-by-step Calculations**: Detailed formula explanations
- **Real-time Results**: Instant calculation updates
- **Professional Statistics**: Summary and insights
- **PDF Export**: Clean, printable reports

### 🎨 User Experience
- **Modern Design**: Professional gradient theme
- **Responsive Layout**: Mobile-first approach
- **Intuitive Interface**: Easy-to-use controls
- **Error Handling**: Clear validation messages

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yusoffnike01/forecastify_edu.git
   cd forecastify_edu
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5174`

## 📖 How to Use

### 1. Input Historical Data
- Enter sales data for 5-10 years (minimum 5 years required)
- Use the "Add Year" or "Remove Year" buttons to adjust
- Example: 2020=1000, 2021=1200, 2022=1400, etc.

### 2. Set Forecasting Parameters
- Define percentage changes for future years
- Positive % = increase, Negative % = decrease
- Example: 2025=+10%, 2026=+20%, 2027=-5%

### 3. Calculate & Visualize
- Click "Calculate Forecast" to process data
- View results in interactive charts
- Switch between Line, Bar, and Area chart types

### 4. Review Results
- Check detailed calculations
- Export results as PDF
- Analyze insights and trends

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0
- **Build Tool**: Vite
- **Charts**: Recharts
- **Styling**: Custom CSS with responsive design
- **PDF Export**: jsPDF + html2canvas

## 📁 Project Structure

```
forecastify_edu/
├── src/
│   ├── components/
│   │   ├── DataInput/
│   │   │   ├── HistoricalDataTable.jsx
│   │   │   └── ForecastingParameters.jsx
│   │   ├── GraphVisualization/
│   │   │   └── SalesChart.jsx
│   │   └── EducationalDisplay/
│   │       └── ResultsDisplay.jsx
│   ├── utils/
│   │   └── calculations.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
└── README.md
```

## 🧮 Calculation Formula

The system uses a simple percentage-based forecasting formula:

```
Forecasted Sales = Previous Year Sales × (1 + Percentage Change)
```

### Example Calculation:
- **2024 Sales**: 1800 units
- **2025 Forecast**: +10%
- **Calculation**: 1800 × (1 + 0.10) = **1980 units**

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full feature set with large charts
- **Tablet**: Adjusted layouts and touch-friendly controls
- **Mobile**: Vertical layouts with compact design
- **Landscape**: Optimized horizontal layouts

## 🎨 Design Features

- **Modern Gradients**: Professional color schemes
- **Clean Typography**: Readable fonts and spacing
- **Interactive Elements**: Hover effects and transitions
- **Accessibility**: High contrast and clear navigation

## 📄 PDF Export

The system generates professional PDF reports including:
- **Summary Statistics**: Total sales, growth rates
- **Detailed Results**: Year-by-year breakdown
- **Calculation Steps**: Step-by-step formulas
- **Insights**: Trend analysis and projections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing framework
- **Recharts**: For the excellent charting library
- **Vite**: For the fast build tool
- **Educational Community**: For inspiring this project

## 📞 Contact

**Project Link**: [https://github.com/yusoffnike01/forecastify_edu](https://github.com/yusoffnike01/forecastify_edu)

---

⭐ **Star this repository if you find it helpful!**

Made with ❤️ for educational purposes
