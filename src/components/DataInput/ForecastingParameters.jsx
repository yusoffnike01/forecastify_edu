import { useState } from 'react';

const ForecastingParameters = ({ parameters, onParametersChange }) => {
  const handleYearChange = (index, value) => {
    const newParameters = [...parameters];
    newParameters[index] = { ...newParameters[index], year: parseInt(value) || 0 };
    onParametersChange(newParameters);
  };

  const handlePercentageChange = (index, value) => {
    const newParameters = [...parameters];
    // Allow empty string and lone minus sign for better typing experience
    if (value === '' || value === '-') {
      newParameters[index] = { ...newParameters[index], percentage: value };
    } else {
      const parsedValue = parseFloat(value);
      newParameters[index] = { ...newParameters[index], percentage: isNaN(parsedValue) ? 0 : parsedValue };
    }
    onParametersChange(newParameters);
  };

  const handleAddYear = () => {
    if (parameters.length < 5) {
      const lastYear = parameters.length > 0 ? parameters[parameters.length - 1].year : 2024;
      const newYear = lastYear + 1;
      const newParameter = {
        year: newYear,
        percentage: 10
      };
      onParametersChange([...parameters, newParameter]);
    }
  };

  const handleRemoveYear = () => {
    if (parameters.length > 1) {
      const newParameters = parameters.slice(0, -1);
      onParametersChange(newParameters);
    }
  };

  return (
    <div>
      <h3 className="section-title">📈 Forecasting Parameters</h3>

      {/* Year Controls */}
      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-3)', 
        marginBottom: 'var(--space-6)',
        flexWrap: 'wrap'
      }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddYear}
          disabled={parameters.length >= 5}
          style={{ color: 'white' }}
        >
          ➕ Add Year
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleRemoveYear}
          disabled={parameters.length <= 1}
          style={{ color: 'var(--danger)' }}
        >
          ➖ Remove Year
        </button>
      </div>

      {/* Parameters Table */}
      <div className="data-table">
        <div className="table-header">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 2fr auto',
            gap: 'var(--space-4)',
            fontWeight: '600',
            color: 'var(--gray-700)'
          }}>
            <div>Year</div>
            <div>Percentage Change</div>
            <div>Description</div>
            <div></div>
          </div>
        </div>
        
        {parameters.map((param, index) => (
          <div key={index} className="table-row">
            <div className="table-cell">
              <input
                type="text"
                value={param.year}
                onChange={(e) => handleYearChange(index, e.target.value)}
                className="table-input"
                placeholder="2025"
              />
            </div>
            <div className="table-cell">
              <input
                type="number"
                value={param.percentage}
                onChange={(e) => handlePercentageChange(index, e.target.value)}
                className="table-input"
                placeholder="10"
                step="0.1"
              />
            </div>
            <div className="table-cell">
              <span style={{ 
                fontSize: '0.875rem', 
                color: 'var(--gray-600)',
                fontStyle: 'italic'
              }}>
                {param.percentage === '' || param.percentage === '-' ? '0% from previous year' : 
                 `${typeof param.percentage === 'number' && param.percentage >= 0 ? '+' : ''}${param.percentage}% from previous year`}
              </span>
            </div>
            <div className="table-cell">
              <span style={{ 
                fontSize: '0.875rem', 
                color: 'var(--gray-500)',
                fontStyle: 'italic'
              }}>
                Row {index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p style={{ 
        fontSize: '0.875rem', 
        color: 'var(--gray-500)', 
        fontStyle: 'italic', 
        marginTop: 'var(--space-4)',
        textAlign: 'center'
      }}>   
        💡 Maximum 5 years allowed. Minimum 1 year required for forecasting.
      </p>

      {/* Example Parameters */}
      <div className="insights-section" style={{ marginTop: 'var(--space-6)' }}>
        <h4 className="insights-title">💡 Example Parameters</h4>
        <ul className="insights-list">
          <li>2025: +10% (10% increase from 2024)</li>
          <li>2026: +20% (20% increase from 2025)</li>
          <li>2027: -5% (5% decrease from 2026)</li>
        </ul>
      </div>
    </div>
  );
};

export default ForecastingParameters; 