import { useState, useEffect } from 'react';
import HistoricalDataTable from './components/DataInput/HistoricalDataTable';
import ForecastingParameters from './components/DataInput/ForecastingParameters';
import SalesChart from './components/GraphVisualization/SalesChart';
import ResultsDisplay from './components/EducationalDisplay/ResultsDisplay';
import { calculateForecast, combineDataForGraph, calculateStatistics, validateData } from './utils/calculations';

function App() {
  const [historicalData, setHistoricalData] = useState([
    { year: 2020, sales: 1000 },
    { year: 2021, sales: 1200 },
    { year: 2022, sales: 1400 },
    { year: 2023, sales: 1600 },
    { year: 2024, sales: 1800 }
  ]);

  const [forecastingParameters, setForecastingParameters] = useState([
    { year: 2025, percentage: 10 },
    { year: 2026, percentage: 20 },
    { year: 2027, percentage: -5 }
  ]);

  const [forecastedData, setForecastedData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [errors, setErrors] = useState([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [selectedGraphType, setSelectedGraphType] = useState('line');

  useEffect(() => {
    if (isCalculated && errors.length === 0) {
      const forecasts = calculateForecast(historicalData, forecastingParameters);
      setForecastedData(forecasts);
      
      const combined = combineDataForGraph(historicalData, forecasts);
      console.log('Combined Data:', combined); // Debug log
      setCombinedData(combined);
      
      const stats = calculateStatistics(historicalData, forecasts);
      setStatistics(stats);
    }
  }, [historicalData, forecastingParameters, isCalculated, errors]);

  const handleCalculate = () => {
    const validationErrors = validateData(historicalData, forecastingParameters);
    setErrors(validationErrors);
    
    if (validationErrors.length === 0) {
      setIsCalculated(true);
    }
  };

  const handleReset = () => {
    setHistoricalData([
      { year: 2020, sales: 1000 },
      { year: 2021, sales: 1200 },
      { year: 2022, sales: 1400 },
      { year: 2023, sales: 1600 },
      { year: 2024, sales: 1800 }
    ]);
    setForecastingParameters([
      { year: 2025, percentage: 10 },
      { year: 2026, percentage: 20 },
      { year: 2027, percentage: -5 }
    ]);
    setForecastedData([]);
    setCombinedData([]);
    setStatistics({});
    setErrors([]);
    setIsCalculated(false);
    setSelectedGraphType('line');
  };

  const graphTypes = [
    { value: 'line', label: 'Line Chart', icon: '📈' },
    { value: 'bar', label: 'Bar Chart', icon: '📊' },
    { value: 'area', label: 'Area Chart', icon: '📉' }
  ];

  return (
    <div className="app-container">
      <div className="app-content">
        {/* Header */}
        <div className="app-header">
          <h1 className="app-title">FORECASTIFY EDU</h1>
          <p className="app-subtitle">Educational Sales Forecasting System</p>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={handleCalculate}
              className="btn btn-primary"
            >
              📊 Calculate Forecast
            </button>
            <button
              onClick={handleReset}
              className="btn btn-secondary"
            >
              🔄 Reset
            </button>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="error-container">
              <h3 className="error-title">⚠️ Validation Errors:</h3>
              <ul className="error-list">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Input Section */}
          <div className="input-section">
            {/* Historical Data */}
            <div style={{ marginBottom: '30px' }}>
              <HistoricalDataTable
                data={historicalData}
                onDataChange={setHistoricalData}
              />
            </div>

            {/* Forecasting Parameters */}
            <div>
              <ForecastingParameters
                parameters={forecastingParameters}
                onParametersChange={setForecastingParameters}
              />
            </div>
          </div>

          {/* Results Section - Only show when calculated */}
          {isCalculated && (
            <div className="results-section">
              {/* Graph Type Selection */}
              <div className="graph-controls">
                {graphTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedGraphType(type.value)}
                    className={`graph-btn ${selectedGraphType === type.value ? 'active' : ''}`}
                  >
                    {type.icon} {type.label}
                  </button>
                ))}
              </div>

              {/* Chart */}
              {combinedData.length > 0 && (
                <div className="chart-container">
                  <SalesChart 
                    data={combinedData} 
                    graphType={selectedGraphType}
                  />
                </div>
              )}

              {/* Results Display */}
              <ResultsDisplay
                historicalData={historicalData}
                forecastedData={forecastedData}
                statistics={statistics}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
