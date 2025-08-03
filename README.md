# FORECASTIFY EDU 📊

**Educational Sales Forecasting System** - A comprehensive React-based application for learning and practicing sales forecasting techniques.

## 🌟 Overview

FORECASTIFY EDU is an interactive educational platform designed to help students and professionals understand sales forecasting concepts through hands-on experience. The application provides a user-friendly interface for inputting historical sales data, setting forecasting parameters, and visualizing results with professional charts and reports.

## ✨ Features

### 📈 **Data Input & Management**
- **Historical Data Entry**: Input sales data by year with flexible year management
- **Forecasting Parameters**: Set percentage changes for future years
- **Dynamic Year Management**: Add/remove years with validation
- **Real-time Validation**: Minimum 3 years required for calculation

### 🧮 **Advanced Calculations**
- **Growth Rate Analysis**: Automatic calculation of year-over-year growth
- **Forecasted Sales**: Projected sales based on percentage changes
- **Statistical Analysis**: Average growth, total sales, projected growth
- **Formula Display**: Educational insights with mathematical expressions

### 📊 **Visualization & Charts**
- **Multiple Chart Types**: Line, Bar, and Area charts
- **Interactive Selection**: User can choose preferred chart type
- **Color-coded Data**: Historical (blue) vs Forecasted (red) data
- **Responsive Design**: Charts adapt to different screen sizes

### 📄 **Export Capabilities**
- **PDF Reports**: Professional 2-page reports with data and graphs
- **Excel Export**: Complete CSV data with multiple sheets
- **Comprehensive Content**: Historical data, forecasts, statistics, formulas
- **Professional Format**: Business-ready reports

### 🎨 **Modern UI/UX**
- **Blue Theme**: Professional blue gradient design
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Intuitive Navigation**: Two-page design (Home + Calculation)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/forecastify.git
   cd forecastify
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
   ```
   http://localhost:5173
   ```

## 📖 Usage Guide

### 1. **Homepage**
- Welcome message and introduction
- "Start Forecasting" button to begin

### 2. **Data Input**
- **Historical Sales Data**: Enter year and sales units
- **Forecasting Parameters**: Set percentage changes for future years
- **Add/Remove Years**: Flexible year management

### 3. **Calculation**
- Click "Calculate Forecast" to process data
- View results with charts and statistics
- Select chart type (Line, Bar, Area)

### 4. **Export Results**
- **PDF Export**: 2-page professional report
- **Excel Export**: Complete data in CSV format
- Both include historical data, forecasts, and formulas

## 🛠️ Technology Stack

### **Frontend**
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Professional chart library

### **Styling**
- **CSS3**: Custom styling with CSS variables
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Professional blue theme

### **Export Libraries**
- **jsPDF**: PDF generation
- **html2canvas**: Chart capture for PDF
- **CSV Generation**: Excel-compatible exports

## 📁 Project Structure

```
forecastify/
├── public/
│   ├── _headers          # Cloudflare Pages config
│   ├── _redirects        # SPA routing
│   └── vite.svg          # App icon
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
│   ├── App.jsx           # Main application
│   ├── index.css         # Global styles
│   └── main.jsx         # Entry point
├── .cloudflare/
│   └── wrangler.toml    # Cloudflare config
├── package.json
└── README.md
```

## 🧮 Calculation Formulas

### **Growth Rate**
```
Growth Rate = ((Current Year - Previous Year) / Previous Year) × 100
```

### **Forecasted Sales**
```
Forecasted Sales = Previous Year Sales × (1 + Percentage Change)
```

### **Average Growth**
```
Average Growth = Sum of all growth rates / Number of periods
```

### **Projected Growth**
```
Projected Growth = ((First Forecasted - Last Historical) / Last Historical) × 100
```

## 🎨 Design Features

### **Color Scheme**
- **Primary Blue**: `#3b82f6` (Professional blue)
- **Secondary Blue**: `#1d4ed8` (Darker blue)
- **Success Green**: `#10b981` (Positive actions)
- **Danger Red**: `#ef4444` (Remove/reset actions)

### **Button Design**
- **Add Year**: Blue (btn-primary)
- **Remove Year**: Red outline (btn-outline)
- **Calculate**: Blue (btn-primary)
- **Reset**: Red (btn-danger)

## 📊 Export Features

### **PDF Export**
- **Page 1**: Historical data, forecasts, statistics, formulas
- **Page 2**: Professional chart visualization
- **Black & White**: Print-friendly format
- **Professional Layout**: Business report quality

### **Excel Export**
- **Sheet 1**: Historical Sales Data
- **Sheet 2**: Forecasted Sales Data
- **Sheet 3**: Summary Statistics
- **Sheet 4**: Calculation Formulas
- **Sheet 5**: Detailed Calculations

## 🚀 Deployment

### **Cloudflare Pages**
1. Connect your GitHub repository
2. Build command: `npm run build:cloudflare`
3. Publish directory: `dist`
4. Deploy automatically

### **Manual Deployment**
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🔧 Configuration Files

### **Cloudflare Pages**
- `public/_headers`: MIME type configuration
- `public/_redirects`: SPA routing
- `.cloudflare/wrangler.toml`: Build settings

### **Vite Configuration**
- `vite.config.js`: Build optimization for Cloudflare

## 📱 Responsive Design

- **Desktop**: Full-featured layout
- **Tablet**: Optimized for touch
- **Mobile**: Single-column layout
- **Cross-browser**: Modern browser support

## 🎯 Educational Value

### **Learning Objectives**
- Understanding sales forecasting concepts
- Practicing growth rate calculations
- Visualizing data trends
- Creating professional reports

### **Target Audience**
- Business students
- Sales professionals
- Data analysts
- Educators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing framework
- **Vite**: For the fast build tool
- **Recharts**: For the chart library
- **Framer Motion**: For the animations

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**FORECASTIFY EDU** - Transforming sales data into actionable insights for educational excellence! 📊✨
