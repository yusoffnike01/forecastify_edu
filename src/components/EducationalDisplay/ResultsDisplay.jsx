import { useState } from 'react';

const ResultsDisplay = ({ historicalData, forecastedData, statistics, selectedCurrency, formatCurrency, onExportClick, selectedProductName }) => {
  const [showCalculations, setShowCalculations] = useState(false);

  const handleExportClick = () => {
    if (onExportClick) {
      onExportClick();
    }
  };

  return (
    <div id="results-content" style={{ backgroundColor: 'white', color: 'black' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'var(--space-6)',
        flexWrap: 'wrap',
        gap: 'var(--space-4)'
      }}>
        <div>
          <h3 className="section-title">📋 Results & Calculations</h3>
          {selectedProductName && (
            <div style={{
              fontSize: '1rem',
              color: '#374151',
              fontWeight: '600',
              marginTop: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              📦 Product: <span style={{ color: '#667eea' }}>{selectedProductName}</span>
            </div>
          )}
          {selectedCurrency && (
            <div style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              marginTop: '-0.5rem',
              marginBottom: '1rem'
            }}>
              Currency: <strong>{selectedCurrency}</strong> • Values automatically converted
            </div>
          )}
        </div>
        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleExportClick}
            className="btn btn-primary"
          >
            📄 Export PDF
          </button>
          <button
            onClick={() => {
              if (onExportClick) {
                onExportClick('excel');
              }
            }}
            className="btn btn-success"
          >
            📊 Export Excel
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Historical Value</div>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>
            {formatCurrency ? formatCurrency(statistics.totalHistorical || 0) : (statistics.totalHistorical?.toLocaleString() + ' units')}
          </div>
          <div className="stat-change">{statistics.totalHistorical?.toLocaleString()} units</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Total Forecasted Value</div>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>
            {formatCurrency ? formatCurrency(statistics.totalForecasted || 0) : (statistics.totalForecasted?.toLocaleString() + ' units')}
          </div>
          <div className="stat-change">{statistics.totalForecasted?.toLocaleString()} units</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Average Growth Rate</div>
          <div className="stat-value">{statistics.averageGrowthRate?.toFixed(2)}%</div>
          <div className={`stat-change ${statistics.averageGrowthRate >= 0 ? 'positive' : 'negative'}`}>
            {statistics.averageGrowthRate >= 0 ? '↗' : '↘'} Historical trend
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Projected Growth</div>
          <div className="stat-value">{statistics.projectedGrowth?.toFixed(2)}%</div>
          <div className={`stat-change ${statistics.projectedGrowth >= 0 ? 'positive' : 'negative'}`}>
            {statistics.projectedGrowth >= 0 ? '↗' : '↘'} Forecasted
          </div>
        </div>
      </div>

      {/* Detailed Results Table */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h4 className="section-title">📈 Detailed Results</h4>
        <div className="results-table">
          <div className="results-table-header">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: 'var(--space-4)',
              fontWeight: '600',
              color: 'var(--gray-700)'
            }}>
              <div>Year</div>
              <div>Type</div>
              <div>Sales Value ({selectedCurrency || 'Units'})</div>
              <div>Change (%)</div>
            </div>
          </div>
          
          {historicalData.map((item, index) => (
            <div key={`hist-${index}`} className="results-table-row">
              <div className="results-table-cell">{item.year}</div>
              <div className="results-table-cell highlight">Historical</div>
              <div className="results-table-cell">
                {formatCurrency ? formatCurrency(item.sales) : item.sales.toLocaleString()}
              </div>
              <div className="results-table-cell">
                {index > 0 
                  ? (((item.sales - historicalData[index - 1].sales) / historicalData[index - 1].sales) * 100).toFixed(2)
                  : '-'
                }%
              </div>
            </div>
          ))}
          
          {forecastedData.map((item, index) => (
            <div key={`forecast-${index}`} className="results-table-row">
              <div className="results-table-cell">{item.year}</div>
              <div className="results-table-cell highlight">Forecasted</div>
              <div className="results-table-cell">
                {formatCurrency ? formatCurrency(item.sales) : item.sales.toLocaleString()}
              </div>
              <div className="results-table-cell">
                {item.percentage >= 0 ? '+' : ''}{item.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calculations Toggle */}
      <div className="toggle-section">
        <div 
          className="toggle-header"
          onClick={() => setShowCalculations(!showCalculations)}
        >
          <div className="toggle-title">🧮 Calculation Steps</div>
          <div className={`toggle-icon ${showCalculations ? 'rotated' : ''}`}>
            {showCalculations ? '🔽' : '🔼'}
          </div>
        </div>

        {showCalculations && (
          <div className="toggle-content">
            {forecastedData.map((item, index) => (
              <div key={index} style={{ 
                marginBottom: 'var(--space-4)',
                padding: 'var(--space-4)',
                background: 'var(--gray-50)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--gray-200)'
              }}>
                <h5 style={{ 
                  marginBottom: 'var(--space-2)', 
                  color: 'var(--gray-800)',
                  fontWeight: '600'
                }}>
                  {item.year} Forecast Calculation:
                </h5>
                <p style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '0.9rem', 
                  color: 'var(--gray-700)',
                  background: 'var(--white)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--gray-200)'
                }}>
                  {item.calculation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formula Display */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div 
          className="toggle-header"
          onClick={() => setShowCalculations(!showCalculations)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-4)',
            background: 'var(--bg-card-light)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            border: '1px solid var(--border-color)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--bg-card)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--bg-card-light)';
          }}
        >
          <h4 className="section-title" style={{ margin: 0 }}>🧮 Calculation Formulas</h4>
          <div style={{ 
            fontSize: '1.2rem',
            transition: 'transform 0.2s ease',
            transform: showCalculations ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            🔽
          </div>
        </div>

        {showCalculations && (
          <div style={{
            background: 'var(--bg-card-light)',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            marginTop: 'var(--space-2)',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0
          }}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <h5 style={{ 
                fontWeight: '600', 
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)'
              }}>
                📈 Projected Growth Formula:
              </h5>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                background: 'var(--white)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)'
              }}>
                Projected Growth = ((First Forecasted - Last Historical) / Last Historical) × 100
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                marginTop: 'var(--space-2)',
                fontStyle: 'italic'
              }}>
                Example: (({statistics?.firstForecasted || 6380} - {statistics?.lastHistorical || 5800}) / {statistics?.lastHistorical || 5800}) × 100 = {statistics?.projectedGrowth?.toFixed(2)}%
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <h5 style={{ 
                fontWeight: '600', 
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)'
              }}>
                📊 Average Growth Rate Formula:
              </h5>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                background: 'var(--white)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)'
              }}>
                Average Growth = Sum of Yearly Growth Rates / Number of Years
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                marginTop: 'var(--space-2)',
                fontStyle: 'italic'
              }}>
                Example: ({statistics?.growthRates?.join(' + ') || '10 + 5.45'}) / {statistics?.growthRates?.length || 2} = {statistics?.averageGrowthRate?.toFixed(2)}%
              </div>
            </div>

            <div>
              <h5 style={{ 
                fontWeight: '600', 
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)'
              }}>
                🔢 Forecast Calculation Formula:
              </h5>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                background: 'var(--white)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)'
              }}>
                Forecasted Sales = Previous Year Sales × (1 + Percentage Change)
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                marginTop: 'var(--space-2)',
                fontStyle: 'italic'
              }}>
                Example: {statistics?.lastHistorical || 5800} × (1 + 0.10) = {statistics?.firstForecasted || 6380} units
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Remove Educational Insights section */}
    </div>
  );
};

export default ResultsDisplay; 