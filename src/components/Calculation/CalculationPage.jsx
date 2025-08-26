import React, { useState } from 'react';
import { motion } from 'framer-motion';
import HistoricalDataTable from '../DataInput/HistoricalDataTable';
import ForecastingParameters from '../DataInput/ForecastingParameters';
import SalesChart from '../GraphVisualization/SalesChart';
import ResultsDisplay from '../EducationalDisplay/ResultsDisplay';
import { calculateForecast, combineDataForGraph, calculateStatistics, validateData } from '../../utils/calculations';
import { logButtonClick } from '../../firebase/analytics';

const CalculationPage = () => {
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

  // Handle calculation process
  const handleCalculate = async () => {
    setIsCalculating(true);
    setError('');
    
    // Log calculation event
    logButtonClick('calculate_forecast', 'calculation_page');
    
    try {
      // Debug logging
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

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.5
      }} />
      
      {/* Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: 'var(--space-6)',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            marginBottom: 'var(--space-8)',
            color: 'white'
          }}
        >
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: 'var(--space-2)',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            📊 Data Input
          </h1>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto',
            textShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }}>
            Enter your historical sales data and forecasting parameters
          </p>
        </motion.div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--space-6)'
        }}>
          
          {/* Input Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
              gap: 'var(--space-6)',
              marginBottom: 'var(--space-8)'
            }}
          >
            {/* Historical Data Card */}
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
              <HistoricalDataTable 
                data={historicalData}
                onDataChange={setHistoricalData}
              />
            </motion.div>

            {/* Forecasting Parameters Card */}
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
              <ForecastingParameters 
                parameters={forecastParameters}
                onParametersChange={setForecastParameters}
              />
            </motion.div>
          </motion.div>

          {/* Action Center */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: 'var(--space-6)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              marginBottom: 'var(--space-8)',
              textAlign: 'center'
            }}
          >
            <div style={{
              display: 'flex',
              gap: 'var(--space-4)',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: 'var(--space-4)'
            }}>
              <motion.button
                onClick={handleCalculate}
                disabled={isCalculating}
                whileHover={{ scale: isCalculating ? 1 : 1.05 }}
                whileTap={{ scale: isCalculating ? 1 : 0.95 }}
                className="btn btn-primary"
                style={{
                  background: isCalculating 
                    ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: 'var(--space-4) var(--space-8)',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: isCalculating ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease',
                  minWidth: '200px'
                }}
              >
                {isCalculating ? '🔄 Calculating...' : '🚀 Calculate Forecast'}
              </motion.button>

              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  padding: 'var(--space-4) var(--space-6)',
                  borderRadius: '50px',
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

            {/* Chart Type Selector */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 'var(--space-3)',
              flexWrap: 'wrap'
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
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(254, 242, 242, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #fecaca',
                borderRadius: '16px',
                padding: 'var(--space-4)',
                color: '#dc2626',
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
                    {chartType === 'line' ? 'Line Chart' : chartType === 'bar' ? 'Bar Chart' : 'Area Chart'} • {results.combinedData?.length || 0} data points
                  </p>
                </div>
                
                {/* Chart Component */}
                <div style={{ position: 'relative' }}>
                  <SalesChart 
                    data={results.combinedData}
                    graphType={chartType}
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
                />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculationPage;