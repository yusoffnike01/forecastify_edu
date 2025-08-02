import { useState } from 'react';

const ForecastingParameters = ({ parameters, onParametersChange }) => {
  const [forecastYears, setForecastYears] = useState(3);

  const handleYearChange = (index, value) => {
    const newParameters = [...parameters];
    newParameters[index] = { ...newParameters[index], year: parseInt(value) || 0 };
    onParametersChange(newParameters);
  };

  const handlePercentageChange = (index, value) => {
    const newParameters = [...parameters];
    newParameters[index] = { ...newParameters[index], percentage: parseFloat(value) || 0 };
    onParametersChange(newParameters);
  };

  const addForecastYear = () => {
    if (forecastYears < 5) {
      const lastYear = parameters[parameters.length - 1]?.year || 2024;
      const newParameters = [...parameters, { year: lastYear + 1, percentage: 0 }];
      onParametersChange(newParameters);
      setForecastYears(forecastYears + 1);
    }
  };

  const removeForecastYear = () => {
    if (forecastYears > 1) {
      const newParameters = parameters.slice(0, -1);
      onParametersChange(newParameters);
      setForecastYears(forecastYears - 1);
    }
  };

  return (
    <div>
      <h3 className="section-title">📈 Forecasting Parameters</h3>

      {/* Year Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={addForecastYear}
          disabled={forecastYears >= 5}
          className="btn btn-small btn-add"
          style={{ opacity: forecastYears >= 5 ? 0.5 : 1, pointerEvents: forecastYears >= 5 ? 'none' : 'auto' }}
        >
          + Add Year
        </button>
        <button
          onClick={removeForecastYear}
          disabled={forecastYears <= 1}
          className="btn btn-small btn-remove"
          style={{ opacity: forecastYears <= 1 ? 0.5 : 1, pointerEvents: forecastYears <= 1 ? 'none' : 'auto' }}
        >
          - Remove Year
        </button>
      </div>

      {/* Parameters Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Percentage Change</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={param.year}
                    onChange={(e) => handleYearChange(index, e.target.value)}
                    className="input-field input-small"
                    placeholder="2025"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={param.percentage}
                    onChange={(e) => handlePercentageChange(index, e.target.value)}
                    className="input-field input-medium"
                    placeholder="10"
                  />
                </td>
                <td style={{ color: '#6b7280' }}>
                  {param.percentage >= 0 ? '+' : ''}{param.percentage}% from previous year
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Example Parameters */}
      <div className="example-box">
        <h4 className="example-title">💡 Example Parameters:</h4>
        <ul className="example-list">
          <li>2025: +10% (10% increase from 2024)</li>
          <li>2026: +20% (20% increase from 2025)</li>
          <li>2027: -5% (5% decrease from 2026)</li>
        </ul>
      </div>
    </div>
  );
};

export default ForecastingParameters; 