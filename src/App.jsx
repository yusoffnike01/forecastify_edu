import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import HistoricalDataTable from './components/DataInput/HistoricalDataTable';
import ForecastingParameters from './components/DataInput/ForecastingParameters';
import SalesChart from './components/GraphVisualization/SalesChart';
import ResultsDisplay from './components/EducationalDisplay/ResultsDisplay';
import { calculateForecast, combineDataForGraph, calculateStatistics, validateData } from './utils/calculations';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'calculation'
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [historicalData, setHistoricalData] = useState([
    { year: 2022, sales: 5000 },
    { year: 2023, sales: 5500 },
    { year: 2024, sales: 5800 }
  ]);
  const [forecastParameters, setForecastParameters] = useState([
    { year: 2025, percentage: 10 },
    { year: 2026, percentage: 20 },
    { year: 2027, percentage: -5 }
  ]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('line');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState('pdf');

  const handleCalculate = () => {
    console.log('Calculate button clicked');
    console.log('Historical Data:', historicalData);
    console.log('Forecast Parameters:', forecastParameters);
    
    try {
      const validation = validateData(historicalData, forecastParameters);
      console.log('Validation result:', validation);
      
      if (!validation.isValid) {
        setError(validation.message);
        return;
      }

      const forecastedData = calculateForecast(historicalData, forecastParameters);
      console.log('Forecasted Data:', forecastedData);
      
      const combinedData = combineDataForGraph(historicalData, forecastedData);
      console.log('Combined Data:', combinedData);
      
      const statistics = calculateStatistics(historicalData, forecastedData);
      console.log('Statistics:', statistics);

      setResults({
        forecastedData,
        combinedData,
        statistics,
        calculationSteps: forecastedData.map(item => ({
          year: item.year,
          previousYear: item.previousYear,
          previousSales: item.previousSales,
          percentageChange: item.percentageChange,
          calculatedSales: item.sales
        }))
      });
      setError('');
    } catch (err) {
      console.error('Calculation error:', err);
      setError('An error occurred during calculation. Please check your data.');
    }
  };

  const exportToPDF = async (element) => {
    if (!element) {
      console.error('Element not found for PDF generation');
      alert('Error: Could not find content to export');
      return;
    }

    try {
      console.log('Starting PDF generation...');
      
      // Create PDF with custom design
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);
      let yPosition = 30;

      // Header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('FORECASTIFY EDU', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Educational Sales Forecasting Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Date
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += 15;

      // Historical Data Table
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Historical Sales Data', margin, yPosition);
      yPosition += 10;

      // Table headers
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Year', margin, yPosition);
      pdf.text('Sales (Units)', margin + 40, yPosition);
      pdf.text('Growth Rate (%)', margin + 80, yPosition);
      yPosition += 8;

      // Table data
      pdf.setFont('helvetica', 'normal');
      historicalData.forEach((item, index) => {
        const growth = index > 0 
          ? (((item.sales - historicalData[index - 1].sales) / historicalData[index - 1].sales) * 100).toFixed(2)
          : '-';
        
        pdf.text(item.year.toString(), margin, yPosition);
        pdf.text(item.sales.toString(), margin + 40, yPosition);
        pdf.text(growth, margin + 80, yPosition);
        yPosition += 6;
      });

      yPosition += 10;

      // Forecasted Data Table
      if (results && results.forecastedData) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Forecasted Sales Data', margin, yPosition);
        yPosition += 10;

        // Table headers
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Year', margin, yPosition);
        pdf.text('Sales (Units)', margin + 40, yPosition);
        pdf.text('Growth Rate (%)', margin + 80, yPosition);
        yPosition += 8;

        // Table data
        pdf.setFont('helvetica', 'normal');
        results.forecastedData.forEach((item) => {
          pdf.text(item.year.toString(), margin, yPosition);
          pdf.text(item.sales.toString(), margin + 40, yPosition);
          pdf.text(`${item.percentage >= 0 ? '+' : ''}${item.percentage}%`, margin + 80, yPosition);
          yPosition += 6;
        });

        yPosition += 15;
      }

      // Summary Statistics
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Summary Statistics', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Total Historical Sales: ${results?.statistics?.totalHistorical?.toLocaleString()} units`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Total Forecasted Sales: ${results?.statistics?.totalForecasted?.toLocaleString()} units`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Average Growth Rate: ${results?.statistics?.averageGrowthRate?.toFixed(2)}%`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Projected Growth: ${results?.statistics?.projectedGrowth?.toFixed(2)}%`, margin, yPosition);
      yPosition += 15;

      // Formulas Section
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Calculation Formulas', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Projected Growth = ((First Forecasted - Last Historical) / Last Historical) × 100', margin, yPosition);
      yPosition += 6;
      pdf.text('Average Growth = Sum of Yearly Growth Rates / Number of Years', margin, yPosition);
      yPosition += 6;
      pdf.text('Forecasted Sales = Previous Year Sales × (1 + Percentage Change)', margin, yPosition);
      yPosition += 15;

      // End of PDF - No graph section
      
      // Add second page with graph
      pdf.addPage();
      yPosition = 30;

      // Graph Section on Page 2
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Sales Forecast Chart', margin, yPosition);
      yPosition += 10;

      // Try to capture the existing chart from the page
      try {
        // Find the existing chart element
        const chartContainer = document.querySelector('.recharts-wrapper') || 
                             document.querySelector('.chart-container') ||
                             document.querySelector('[data-testid="chart"]');
        
        if (chartContainer) {
          const canvas = await html2canvas(chartContainer, {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: chartContainer.scrollWidth,
            height: chartContainer.scrollHeight
          });

          const imgData = canvas.toDataURL('image/png', 0.9);
          const imgWidth = contentWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Check if graph fits on page
          if (yPosition + imgHeight > pageHeight - margin) {
            // Adjust size to fit
            const maxHeight = pageHeight - margin - yPosition;
            const adjustedWidth = (imgWidth * maxHeight) / imgHeight;
            pdf.addImage(imgData, 'PNG', margin, yPosition, adjustedWidth, maxHeight);
          } else {
            pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
          }
        } else {
          throw new Error('Chart container not found');
        }
      } catch (graphError) {
        console.error('Graph generation failed:', graphError);
        
        // Fallback: Create a simple text-based chart representation
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Chart Type: ${chartType.toUpperCase()}`, margin, yPosition);
        yPosition += 10;
        
        pdf.text('Historical Data:', margin, yPosition);
        yPosition += 6;
        historicalData.forEach((item) => {
          pdf.text(`${item.year}: ${item.sales} units`, margin + 10, yPosition);
          yPosition += 5;
        });
        
        yPosition += 5;
        pdf.text('Forecasted Data:', margin, yPosition);
        yPosition += 6;
        if (results && results.forecastedData) {
          results.forecastedData.forEach((item) => {
            pdf.text(`${item.year}: ${item.sales} units (${item.percentage}%)`, margin + 10, yPosition);
            yPosition += 5;
          });
        }
      }

      pdf.save('forecastify-results.pdf');
      console.log('PDF saved successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Try alternative approach
      try {
        console.log('Trying alternative PDF generation...');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Add text content instead of image
        pdf.setFontSize(16);
        pdf.text('FORECASTIFY EDU - Results Report', 20, 20);
        
        pdf.setFontSize(12);
        pdf.text('Historical Data:', 20, 40);
        historicalData.forEach((item, index) => {
          pdf.text(`${item.year}: ${item.sales} units`, 30, 50 + (index * 10));
        });
        
        if (results && results.forecastedData) {
          pdf.text('Forecasted Data:', 20, 80);
          results.forecastedData.forEach((item, index) => {
            pdf.text(`${item.year}: ${item.sales} units (${item.percentage}%)`, 30, 90 + (index * 10));
          });
        }
        
        pdf.save('forecastify-results.pdf');
        console.log('Alternative PDF saved successfully');
      } catch (altError) {
        console.error('Alternative PDF generation also failed:', altError);
        alert('PDF generation failed. Please try Excel export instead.');
      }
    }
  };

  const exportToExcel = () => {
    if (!results || !results.statistics) return;

    // Create CSV content with multiple sheets
    let csvContent = '';
    
    // Sheet 1: Historical Data
    csvContent += 'FORECASTIFY EDU - Historical Sales Data\n';
    csvContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    csvContent += 'Year,Sales Units,Growth Rate (%)\n';
    
    const { growthRates = [] } = results.statistics;
    historicalData.forEach((item, index) => {
      const growthRate = index > 0 && growthRates[index - 1] ? growthRates[index - 1] : '-';
      csvContent += `${item.year},${item.sales},${growthRate}\n`;
    });
    
    csvContent += '\n\n';
    
    // Sheet 2: Forecasted Data
    csvContent += 'FORECASTIFY EDU - Forecasted Sales Data\n';
    csvContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    csvContent += 'Year,Sales Units,Growth Rate (%)\n';
    
    if (results.forecastedData) {
      results.forecastedData.forEach((item) => {
        csvContent += `${item.year},${item.sales},${item.percentage}\n`;
      });
    }
    
    csvContent += '\n\n';
    
    // Sheet 3: Summary Statistics
    csvContent += 'FORECASTIFY EDU - Summary Statistics\n';
    csvContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    csvContent += 'Metric,Value\n';
    csvContent += `Total Historical Years,${historicalData.length}\n`;
    csvContent += `Total Forecast Years,${results.forecastedData ? results.forecastedData.length : 0}\n`;
    csvContent += `Average Historical Growth,${results.statistics.averageGrowth ? results.statistics.averageGrowth.toFixed(2) : 'N/A'}%\n`;
    csvContent += `Total Historical Sales,${results.statistics.totalHistorical ? results.statistics.totalHistorical.toLocaleString() : 'N/A'}\n`;
    csvContent += `Total Forecasted Sales,${results.statistics.totalForecasted ? results.statistics.totalForecasted.toLocaleString() : 'N/A'}\n`;
    csvContent += `Projected Growth,${results.statistics.projectedGrowth ? results.statistics.projectedGrowth.toFixed(2) : 'N/A'}%\n`;
    
    csvContent += '\n\n';
    
    // Sheet 4: Calculation Formulas
    csvContent += 'FORECASTIFY EDU - Calculation Formulas\n';
    csvContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    csvContent += 'Formula,Description,Example\n';
    csvContent += 'Growth Rate,((Current Year - Previous Year) / Previous Year) × 100,((2023 - 2022) / 2022) × 100\n';
    csvContent += 'Average Growth,Sum of all growth rates / Number of periods,Sum of rates / Number of years\n';
    csvContent += 'Forecasted Sales,Previous Year Sales × (1 + Percentage Change),2023 Sales × (1 + 0.10)\n';
    csvContent += 'Projected Growth,((First Forecasted - Last Historical) / Last Historical) × 100,((2024 - 2023) / 2023) × 100\n';
    
    csvContent += '\n\n';
    
    // Sheet 5: Detailed Calculations
    csvContent += 'FORECASTIFY EDU - Detailed Calculations\n';
    csvContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    csvContent += 'Year,Calculation,Result\n';
    
    // Historical calculations
    historicalData.forEach((item, index) => {
      if (index > 0) {
        const prevSales = historicalData[index - 1].sales;
        const currentSales = item.sales;
        const growthRate = ((currentSales - prevSales) / prevSales * 100).toFixed(2);
        csvContent += `${item.year},(${currentSales} - ${prevSales}) / ${prevSales} × 100,${growthRate}%\n`;
      }
    });
    
    // Forecasted calculations
    if (results.forecastedData && historicalData.length > 0) {
      const lastHistorical = historicalData[historicalData.length - 1];
      results.forecastedData.forEach((item) => {
        const calculation = `${lastHistorical.sales} × (1 + ${item.percentage / 100})`;
        csvContent += `${item.year},${calculation},${item.sales}\n`;
      });
    }
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'forecastify-results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Excel file saved successfully');
  };

  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.02, y: -5 }
  };

  return (
    <div className="app">
      {/* Header */}
      <motion.header 
        className="app-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">FORECASTIFY EDU</h1>
            <p className="app-subtitle">Educational Sales Forecasting System</p>
          </div>
          <div className="header-right">
            {currentPage === 'calculation' && (
              <motion.button
                className="back-button"
                onClick={() => setCurrentPage('home')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="arrow">←</span>
                Back to Home
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {currentPage === 'home' ? (
            <motion.div
              key="home"
              className="homepage"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              {/* Hero Section */}
              <motion.div 
                className="hero-section"
                variants={itemVariants}
                style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
              >
                {/* Welcome Message */}
                <motion.div
                  variants={itemVariants}
                  style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}
                >
                  <h2 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '700', 
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-6)'
                  }}>
                    Welcome to Professional Forecasting
                  </h2>
                  <p style={{ 
                    fontSize: '1.2rem', 
                    color: 'var(--text-secondary)',
                    lineHeight: '1.7',
                    maxWidth: '700px',
                    margin: '0 auto',
                    marginBottom: 'var(--space-8)'
                  }}>
                    Transform your sales data into actionable insights with our advanced forecasting system. 
                    Perfect for educational and professional use.
                  </p>
                  
                  {/* CTA Button */}
                  <motion.button
                    className="btn btn-primary"
                    onClick={() => setCurrentPage('calculation')}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      fontSize: '1.3rem',
                      padding: 'var(--space-4) var(--space-8)',
                      borderRadius: 'var(--radius-lg)',
                      fontWeight: '600',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                  >
                    🚀 Start Forecasting
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Features Preview */}
              <motion.div
                variants={itemVariants}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 'var(--space-6)',
                  marginTop: 'var(--space-8)'
                }}
              >
                <motion.div
                  className="feature-preview"
                  whileHover={{ scale: 1.02, y: -3 }}
                  style={{
                    background: 'var(--bg-card)',
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <div style={{ 
                    fontSize: '3rem', 
                    marginBottom: 'var(--space-3)'
                  }}>
                    📊
                  </div>
                  <h3 style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: '600', 
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-2)'
                  }}>
                    Advanced Analytics
                  </h3>
                  <p style={{ 
                    fontSize: '1rem', 
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5'
                  }}>
                    Powerful forecasting algorithms with detailed step-by-step calculations
                  </p>
                </motion.div>

                <motion.div
                  className="feature-preview"
                  whileHover={{ scale: 1.02, y: -3 }}
                  style={{
                    background: 'var(--bg-card)',
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <div style={{ 
                    fontSize: '3rem', 
                    marginBottom: 'var(--space-3)'
                  }}>
                    📈
                  </div>
                  <h3 style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: '600', 
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-2)'
                  }}>
                    Interactive Charts
                  </h3>
                  <p style={{ 
                    fontSize: '1rem', 
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5'
                  }}>
                    Beautiful visualizations with multiple chart types and export options
                  </p>
                </motion.div>

                <motion.div
                  className="feature-preview"
                  whileHover={{ scale: 1.02, y: -3 }}
                  style={{
                    background: 'var(--bg-card)',
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <div style={{ 
                    fontSize: '3rem', 
                    marginBottom: 'var(--space-3)'
                  }}>
                    🎓
                  </div>
                  <h3 style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: '600', 
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-2)'
                  }}>
                    Educational Focus
                  </h3>
                  <p style={{ 
                    fontSize: '1rem', 
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5'
                  }}>
                    Perfect for learning forecasting concepts and professional development
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="calculation"
              className="calculation-dashboard"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="error-message"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    style={{
                      background: 'var(--danger-gradient)',
                      color: 'var(--white)',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 'var(--space-6)',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Section */}
              <motion.div 
                className="input-section"
                variants={itemVariants}
                style={{ marginBottom: 'var(--space-8)' }}
              >
                <motion.div 
                  className="data-input-card"
                  variants={cardVariants}
                  whileHover="hover"
                  style={{
                    background: 'var(--bg-card)',
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <h2 style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: '600', 
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-6)',
                    textAlign: 'center'
                  }}>
                    📊 Data Input
                  </h2>
                  
                  <HistoricalDataTable 
                    data={historicalData}
                    onDataChange={setHistoricalData}
                  />
                  
                  <ForecastingParameters 
                    parameters={forecastParameters}
                    onParametersChange={setForecastParameters}
                  />
                  
                  {/* Button Row - 2 Columns */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-4)',
                    marginTop: 'var(--space-6)'
                  }}>
                    <motion.button
                      className="btn btn-primary"
                      onClick={handleCalculate}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        fontSize: '1.1rem',
                        padding: 'var(--space-4)',
                        fontWeight: '600'
                      }}
                    >
                      🚀 Calculate Forecast
                    </motion.button>
                    
                    <motion.button
                      className="btn btn-danger"
                      onClick={() => {
                        setHistoricalData([
                          { year: 2022, sales: 5000 },
                          { year: 2023, sales: 5500 },
                          { year: 2024, sales: 5800 }
                        ]);
                        setForecastParameters([
                          { year: 2025, percentage: 10 },
                          { year: 2026, percentage: 20 },
                          { year: 2027, percentage: -5 }
                        ]);
                        setResults(null);
                        setError('');
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        fontSize: '1.1rem',
                        padding: 'var(--space-4)',
                        fontWeight: '600'
                      }}
                    >
                      🔄 Reset Data
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>

              {/* Results Section */}
              <AnimatePresence>
                {results && (
                  <motion.div 
                    className="results-section"
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <motion.div 
                      className="results-card"
                      variants={cardVariants}
                      whileHover="hover"
                      style={{
                        background: 'var(--bg-card)',
                        padding: 'var(--space-6)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-md)'
                      }}
                    >
                      <h2 style={{ 
                        fontSize: '1.8rem', 
                        fontWeight: '600', 
                        color: 'var(--text-primary)',
                        marginBottom: 'var(--space-6)',
                        textAlign: 'center'
                      }}>
                        📈 Results & Analysis
                      </h2>
                      
                      {/* Chart Type Selector */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: 'var(--space-3)', 
                        marginBottom: 'var(--space-6)',
                        flexWrap: 'wrap'
                      }}>
                        {[
                          { value: 'line', label: 'Line Chart', icon: '📈' },
                          { value: 'bar', label: 'Bar Chart', icon: '📊' },
                          { value: 'area', label: 'Area Chart', icon: '📉' }
                        ].map((type) => (
                          <motion.button
                            key={type.value}
                            onClick={() => setChartType(type.value)}
                            className={`btn ${chartType === type.value ? 'btn-primary' : 'btn-outline'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ fontSize: '0.9rem' }}
                          >
                            {type.icon} {type.label}
                          </motion.button>
                        ))}
                      </div>
                      
                      <SalesChart 
                        data={results.combinedData}
                        graphType={chartType}
                      />
                      
                      <ResultsDisplay 
                        historicalData={historicalData}
                        forecastedData={results.forecastedData}
                        statistics={results.statistics}
                        onExportClick={(type = 'pdf') => {
                          setExportType(type);
                          setShowExportModal(true);
                        }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Export Confirmation Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExportModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 'var(--space-4)'
            }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                maxWidth: '400px',
                width: '100%',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}
            >
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: 'var(--space-4)',
                animation: 'bounce 2s infinite'
              }}>
                {exportType === 'pdf' ? '📄' : '📊'}
              </div>
              
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-3)'
              }}>
                Export {exportType.toUpperCase()} Report
              </h3>
              
              <p style={{ 
                fontSize: '1rem', 
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-6)',
                lineHeight: '1.6'
              }}>
                Are you sure you want to export the current results as a {exportType.toUpperCase()} report?
              </p>
              
              <div style={{
                display: 'flex',
                gap: 'var(--space-3)',
                justifyContent: 'center'
              }}>
                <motion.button
                  className="btn btn-outline"
                  onClick={() => setShowExportModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ minWidth: '120px' }}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowExportModal(false);
                    if (exportType === 'pdf') {
                      // Trigger PDF export
                      const resultsDisplay = document.getElementById('results-content');
                      console.log('Looking for results-content element:', resultsDisplay);
                      
                      if (resultsDisplay) {
                        exportToPDF(resultsDisplay);
                      } else {
                        // Try alternative element selection
                        const alternativeElement = document.querySelector('.results-card');
                        console.log('Alternative element:', alternativeElement);
                        
                        if (alternativeElement) {
                          exportToPDF(alternativeElement);
                        } else {
                          alert('Could not find content to export. Please try again.');
                        }
                      }
                    } else {
                      // Trigger Excel export
                      exportToExcel();
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ minWidth: '120px' }}
                >
                  Export {exportType.toUpperCase()}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
