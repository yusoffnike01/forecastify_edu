import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import HistoricalDataTable from '../DataInput/HistoricalDataTable';
import ForecastingParameters from '../DataInput/ForecastingParameters';
import SalesChart from '../GraphVisualization/SalesChart';
import ResultsDisplay from '../EducationalDisplay/ResultsDisplay';
import { calculateForecast, combineDataForGraph, calculateStatistics, validateData } from '../../utils/calculations';
import { getUserProducts } from '../../firebase/products';
import { useAuth } from '../../contexts/AuthContext';

const CalculationPage = () => {
  const { currentUser } = useAuth();
  
  // Product selection state
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // State management for calculation data
  const [historicalData, setHistoricalData] = useState([
    { year: 2020, sales: 1000 },
    { year: 2021, sales: 1200 },
    { year: 2022, sales: 1400 },
    { year: 2023, sales: 1600 }
  ]);
  
  const [forecastParameters, setForecastParameters] = useState([
    { year: 2024, percentage: 10 },
    { year: 2025, percentage: 8 }
  ]);
  
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('line');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState('pdf');
  const [selectedCurrency, setSelectedCurrency] = useState('MYR');
  const [exchangeRates, setExchangeRates] = useState({
    MYR: 1,      // Base currency (Ringgit Malaysia)
    USD: 0.22,   // 1 MYR = 0.22 USD
    EUR: 0.20,   // 1 MYR = 0.20 EUR
    GBP: 0.17,   // 1 MYR = 0.17 GBP
    JPY: 32.5,   // 1 MYR = 32.5 JPY
    SGD: 0.30,   // 1 MYR = 0.30 SGD
    AUD: 0.33,   // 1 MYR = 0.33 AUD
    CAD: 0.30    // 1 MYR = 0.30 CAD
  });
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // Fetch live exchange rates from API
  const fetchExchangeRates = async () => {
    setIsLoadingRates(true);
    try {
      // Using free API service for exchange rates (MYR as base)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/MYR');
      const data = await response.json();
      
      if (data && data.rates) {
        setExchangeRates({
          MYR: 1,
          USD: data.rates.USD || 0.22,
          EUR: data.rates.EUR || 0.20,
          GBP: data.rates.GBP || 0.17,
          JPY: data.rates.JPY || 32.5,
          SGD: data.rates.SGD || 0.30,
          AUD: data.rates.AUD || 0.33,
          CAD: data.rates.CAD || 0.30
        });
        console.log('Live exchange rates updated successfully');
      }
    } catch (error) {
      console.warn('Failed to fetch live rates, using default rates:', error);
      // Keep default rates if API fails
    } finally {
      setIsLoadingRates(false);
    }
  };

  // Currency conversion function (MYR as base)
  const convertCurrency = (amount, fromCurrency = 'MYR', toCurrency = selectedCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    // Convert from MYR to target currency
    const myrAmount = fromCurrency === 'MYR' ? amount : amount / exchangeRates[fromCurrency];
    return toCurrency === 'MYR' ? myrAmount : myrAmount * exchangeRates[toCurrency];
  };

  // Format currency display
  const formatCurrency = (amount, currency = selectedCurrency) => {
    const convertedAmount = convertCurrency(amount);
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      MYR: 'RM',
      SGD: 'S$',
      AUD: 'A$',
      CAD: 'C$'
    };
    
    return `${currencySymbols[currency] || currency} ${convertedAmount.toLocaleString(undefined, {
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2
    })}`;
  };

  // Load user products
  const loadProducts = async () => {
    if (!currentUser) {
      setLoadingProducts(false);
      return;
    }
    
    try {
      const userProducts = await getUserProducts(currentUser.uid);
      setProducts(userProducts);
      
      // Auto-select first product if available
      if (userProducts.length > 0) {
        setSelectedProduct(userProducts[0].id);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch exchange rates on component mount
  useEffect(() => {
    fetchExchangeRates();
    loadProducts();
  }, [currentUser]);

  // Handle calculation process
  const handleCalculate = async () => {
    setIsCalculating(true);
    setError('');
    
    try {
      // Check if product is selected
      if (!selectedProduct) {
        setError('Please select a product before calculating the forecast.');
        setIsCalculating(false);
        return;
      }
      
      // Debug logging
      console.log('Selected Product:', selectedProduct);
      console.log('Historical Data:', historicalData);
      console.log('Forecast Parameters:', forecastParameters);
      
      // Check if data exists
      if (!historicalData || !forecastParameters) {
        setError('Missing data. Please ensure both historical data and forecast parameters are provided.');
        setIsCalculating(false);
        return;
      }
      
      // Validate input data
      const validation = validateData(historicalData, forecastParameters);
      
      if (!validation.isValid) {
        setError(validation.message);
        setIsCalculating(false);
        return;
      }

      // Perform calculations
      const forecastedData = calculateForecast(historicalData, forecastParameters);
      const combinedData = combineDataForGraph(historicalData, forecastedData);
      const statistics = calculateStatistics(historicalData, forecastedData);

      // Validate calculation results
      if (!forecastedData || forecastedData.length === 0) {
        setError('No forecast data generated. Please check your input parameters.');
        setIsCalculating(false);
        return;
      }

      if (!combinedData || combinedData.length === 0) {
        setError('Failed to combine historical and forecast data.');
        setIsCalculating(false);
        return;
      }

      // Set results
      setResults({
        forecastedData,
        combinedData,
        statistics,
        calculationSteps: forecastedData.map(item => ({
          year: item.year,
          calculation: item.calculation || `${item.year} forecast calculation`,
          sales: item.sales
        }))
      });
      
      console.log('Calculation completed successfully');
      console.log('Results:', {
        forecastedData,
        combinedData,
        statistics
      });
    } catch (err) {
      console.error('Calculation error:', err);
      setError(`Calculation failed: ${err.message || 'Unknown error occurred'}`);
    } finally {
      setIsCalculating(false);
    }
  };

  // Reset calculation data
  const handleReset = () => {
    setHistoricalData([
      { year: 2020, sales: 1000 },
      { year: 2021, sales: 1200 },
      { year: 2022, sales: 1400 },
      { year: 2023, sales: 1600 }
    ]);
    setForecastParameters([
      { year: 2024, percentage: 10 },
      { year: 2025, percentage: 8 }
    ]);
    setResults(null);
    setError('');
  };

  // Export to PDF function
  const exportToPDF = async (element) => {
    if (!element) {
      console.error('Element not found for PDF generation');
      alert('Error: Could not find content to export');
      return;
    }

    try {
      console.log('Starting PDF generation...');
      
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

      // Add second page with graph
      pdf.addPage();
      yPosition = 30;

      // Graph Section on Page 2
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Sales Forecast Chart', margin, yPosition);
      yPosition += 10;

      try {
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

          if (yPosition + imgHeight > pageHeight - margin) {
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
      alert('PDF generation failed. Please try Excel export instead.');
    }
  };

  // Export to Excel function
  const exportToExcel = () => {
    if (!results || !results.statistics) return;

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

  return (
    <>
      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative'
      }}>
      
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />
      
      {/* Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '2rem',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>


        {/* Forecasting Content */}
        <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
            style={{ 
              marginBottom: '0.8rem',
              display: 'inline-block'
            }}
          >
            <motion.img
              src="/images/logoforecastifyedu.jpeg"
              alt="Forecastify EDU"
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
              transition={{ duration: 0.3 }}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '16px',
                objectFit: 'contain',
                background: '#ffffff'
              }}
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: '800',
              marginBottom: '0.8rem',
              background: 'linear-gradient(135deg, #1a202c 0%, #4a5568 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.2'
            }}
          >
            Data Input
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              fontSize: '1rem',
              color: '#4a5568',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.5'
            }}
          >
            Enter your historical sales data and forecasting parameters to generate accurate supply chain predictions
          </motion.p>
        </motion.div>

        {/* Product Selection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {/* Product Selection */}
            <div style={{ flex: '1', minWidth: '250px' }}>
              <label style={{
                display: 'block',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '0.8rem'
              }}>
                📦 Select Product for Forecasting
              </label>
              {loadingProducts ? (
                <div style={{
                  padding: '12px 16px',
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  Loading products...
                </div>
              ) : products.length === 0 ? (
                <div style={{
                  padding: '12px 16px',
                  background: '#fef3c7',
                  border: '1px solid #fbbf24',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#92400e'
                }}>
                  No products found. Please create a product first in the Products section.
                </div>
              ) : (
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    background: 'white',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                >
                  <option value="">Select a product...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Calculate Button */}
            <motion.button
              onClick={handleCalculate}
              disabled={isCalculating || !selectedProduct || products.length === 0}
              whileHover={!isCalculating && selectedProduct ? { scale: 1.05 } : {}}
              whileTap={!isCalculating && selectedProduct ? { scale: 0.95 } : {}}
              style={{
                background: (!selectedProduct || products.length === 0) 
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                  : isCalculating 
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '16px 32px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: (!selectedProduct || products.length === 0 || isCalculating) ? 'not-allowed' : 'pointer',
                boxShadow: (!selectedProduct || products.length === 0) 
                  ? '0 4px 15px rgba(156, 163, 175, 0.3)'
                  : '0 8px 25px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s ease',
                minWidth: '160px'
              }}
            >
              {isCalculating ? '⏳ Calculating...' : '🚀 Calculate Forecast'}
            </motion.button>
          </div>

          {/* Selected Product Info */}
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}
            >
              {(() => {
                const product = products.find(p => p.id === selectedProduct);
                return product ? (
                  <div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: '600', 
                      color: '#667eea', 
                      marginBottom: '0.5rem' 
                    }}>
                      Selected Product: {product.name}
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#4a5568' 
                    }}>
                      {product.description || 'No description available'}
                    </div>
                  </div>
                ) : null;
              })()}
            </motion.div>
          )}
        </motion.div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          
          {/* Historical Data Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            whileHover={{ y: -8, scale: 1.02 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              style={{ marginBottom: '1.5rem' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  📈
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#1a202c',
                    margin: 0
                  }}>
                    Historical Sales Data
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#4a5568',
                    margin: 0
                  }}>
                    Past performance data for analysis
                  </p>
                </div>
              </div>
            </motion.div>
            <HistoricalDataTable 
              data={historicalData}
              onDataChange={setHistoricalData}
            />
          </motion.div>

          {/* Forecasting Parameters Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            whileHover={{ y: -8, scale: 1.02 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              style={{ marginBottom: '1.5rem' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  🎯
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#1a202c',
                    margin: 0
                  }}>
                    Forecasting Parameters
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#4a5568',
                    margin: 0
                  }}>
                    Future growth predictions & targets
                  </p>
                </div>
              </div>
            </motion.div>
            <ForecastingParameters 
              parameters={forecastParameters}
              onParametersChange={setForecastParameters}
            />
          </motion.div>
        </div>

        {/* Action Center */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            marginBottom: '3rem',
            textAlign: 'center'
          }}
          >
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '1.5rem'
            }}>
              <motion.button
                onClick={handleCalculate}
                disabled={isCalculating}
                whileHover={{ scale: isCalculating ? 1 : 1.08, y: -2 }}
                whileTap={{ scale: isCalculating ? 1 : 0.95 }}
                style={{
                  background: isCalculating 
                    ? 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  fontSize: '1.2rem',
                  padding: '16px 32px',
                  fontWeight: '700',
                  minWidth: '220px',
                  borderRadius: '16px',
                  cursor: isCalculating ? 'not-allowed' : 'pointer',
                  boxShadow: isCalculating 
                    ? 'none'
                    : '0 10px 30px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <span style={{ position: 'relative', zIndex: 2 }}>
                  {isCalculating ? '🔄 Calculating...' : '🚀 Calculate Forecast'}
                </span>
                {!isCalculating && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transition: 'left 0.5s ease'
                  }} />
                )}
              </motion.button>

              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#4a5568',
                  border: '2px solid #e2e8f0',
                  padding: '14px 24px',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
              >
                🔄 Reset Data
              </motion.button>
            </div>

            {/* Chart Type and Currency Selectors */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 'var(--space-6)',
              flexWrap: 'wrap'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-3)'
              }}>
                <label style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: '#374151'
                }}>
                  Chart Type:
                </label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    fontSize: '1rem',
                    background: 'white',
                    cursor: 'pointer',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="line">📈 Line Chart</option>
                  <option value="bar">📊 Bar Chart</option>
                  <option value="area">📉 Area Chart</option>
                </select>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-3)',
                flexWrap: 'wrap'
              }}>
                <label style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: '#374151'
                }}>
                  Currency:
                </label>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      fontSize: '1rem',
                      background: 'white',
                      cursor: 'pointer',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      minWidth: '140px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="MYR">🇲🇾 MYR (RM)</option>
                    <option value="USD">🇺🇸 USD ($)</option>
                    <option value="EUR">🇪🇺 EUR (€)</option>
                    <option value="GBP">🇬🇧 GBP (£)</option>
                    <option value="JPY">🇯🇵 JPY (¥)</option>
                    <option value="SGD">🇸🇬 SGD (S$)</option>
                    <option value="AUD">🇦🇺 AUD (A$)</option>
                    <option value="CAD">🇨🇦 CAD (C$)</option>
                  </select>
                  <motion.button
                    onClick={fetchExchangeRates}
                    disabled={isLoadingRates}
                    whileHover={{ scale: isLoadingRates ? 1 : 1.05 }}
                    whileTap={{ scale: isLoadingRates ? 1 : 0.95 }}
                    style={{
                      padding: 'var(--space-3)',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      background: 'white',
                      cursor: isLoadingRates ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      opacity: isLoadingRates ? 0.6 : 1,
                      transition: 'all 0.3s ease'
                    }}
                    title="Update exchange rates"
                  >
                    {isLoadingRates ? '🔄' : '💱'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'var(--bg-danger)',
                border: '1px solid var(--border-danger)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                color: 'var(--text-danger)',
                fontSize: '1rem',
                fontWeight: '500',
                textAlign: 'center',
                marginBottom: 'var(--space-6)'
              }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* Loading State */}
          {isCalculating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '16px',
                padding: 'var(--space-6)',
                textAlign: 'center',
                marginBottom: 'var(--space-6)'
              }}
            >
              <div style={{
                display: 'inline-block',
                width: '32px',
                height: '32px',
                border: '3px solid rgba(59, 130, 246, 0.3)',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: 'var(--space-3)'
              }} />
              <h3 style={{
                color: '#3b82f6',
                fontSize: '1.2rem',
                fontWeight: '600',
                margin: '0 0 8px 0'
              }}>
                🔄 Calculating Forecast...
              </h3>
              <p style={{
                color: '#64748b',
                fontSize: '0.9rem',
                margin: 0
              }}>
                Processing your data and generating predictions
              </p>
              
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </motion.div>
          )}

          {/* Results Section */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 'var(--space-6)'
              }}
            >
              {/* Chart Visualization */}
              <motion.div
                whileHover={{ y: -5 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: 'var(--space-6)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                {/* Chart Header */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: 'var(--space-4)'
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#374151',
                    margin: 0
                  }}>
                    📈 Sales Forecast Chart
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    margin: '8px 0 0 0'
                  }}>
                    {chartType === 'line' ? 'Line Chart' : chartType === 'bar' ? 'Bar Chart' : 'Area Chart'} • {results.combinedData?.length || 0} data points • Values in <strong>units</strong>
                  </p>
                </div>
                
                {/* Chart Component */}
                <div style={{ position: 'relative' }}>
                  <SalesChart 
                    data={results.combinedData}
                    graphType={chartType}
                    showOriginalValues={true}
                  />
                  
                  {/* Chart Loading/Error Fallback */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: '#9ca3af',
                    fontSize: '0.9rem',
                    pointerEvents: 'none',
                    zIndex: -1
                  }}>
                    📊 Chart Loading...
                  </div>
                </div>
              </motion.div>

              {/* Results Display */}
              <motion.div
                whileHover={{ y: -5 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: 'var(--space-6)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                {/* Results Header */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: 'var(--space-4)'
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#374151',
                    margin: 0
                  }}>
                    📊 Forecast Results & Analysis
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    margin: '8px 0 0 0'
                  }}>
                    Detailed breakdown and statistics • {results.forecastedData?.length || 0} forecasted years
                  </p>
                </div>

                <ResultsDisplay 
                  historicalData={historicalData}
                  forecastedData={results.forecastedData}
                  statistics={results.statistics}
                  selectedCurrency={selectedCurrency}
                  formatCurrency={formatCurrency}
                  onExportClick={(type = 'pdf') => {
                    setExportType(type);
                    setShowExportModal(true);
                  }}
                />
              </motion.div>
            </motion.div>
          )}

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
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: 'var(--space-8)',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
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
                color: '#374151',
                marginBottom: 'var(--space-3)'
              }}>
                Export {exportType.toUpperCase()} Report
              </h3>
              
              <p style={{ 
                fontSize: '1rem', 
                color: '#6b7280',
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
                  onClick={() => setShowExportModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    minWidth: '120px',
                    padding: 'var(--space-3) var(--space-6)',
                    borderRadius: '50px',
                    border: '2px solid #667eea',
                    background: 'transparent',
                    color: '#667eea',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  onClick={() => {
                    setShowExportModal(false);
                    if (exportType === 'pdf') {
                      const resultsDisplay = document.getElementById('results-content') ||
                                           document.querySelector('.results-card') ||
                                           document.querySelector('[data-testid="results"]');
                      
                      if (resultsDisplay) {
                        exportToPDF(resultsDisplay);
                      } else {
                        alert('Could not find content to export. Please try again.');
                      }
                    } else {
                      exportToExcel();
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    minWidth: '120px',
                    padding: 'var(--space-3) var(--space-6)',
                    borderRadius: '50px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Export {exportType.toUpperCase()}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
          )}
        </AnimatePresence>
        </div>

      </div>
      </div>
    </>
  );
};

export default CalculationPage;