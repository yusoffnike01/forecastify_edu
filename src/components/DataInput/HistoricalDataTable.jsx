import { useState } from 'react';

const HistoricalDataTable = ({ data, onDataChange }) => {
  const [years, setYears] = useState(5);

  const handleYearChange = (index, value) => {
    const newData = [...data];
    newData[index] = { ...newData[index], year: parseInt(value) || 0 };
    onDataChange(newData);
  };

  const handleSalesChange = (index, value) => {
    const newData = [...data];
    newData[index] = { ...newData[index], sales: parseInt(value) || 0 };
    onDataChange(newData);
  };

  const addYear = () => {
    if (years < 10) {
      const newData = [...data, { year: 2020 + years, sales: 0 }];
      onDataChange(newData);
      setYears(years + 1);
    }
  };

  const removeYear = () => {
    if (years > 5) {
      const newData = data.slice(0, -1);
      onDataChange(newData);
      setYears(years - 1);
    }
  };

  return (
    <div>
      <h3 className="section-title">📊 Historical Sales Data</h3>

      {/* Year Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={addYear}
          disabled={years >= 10}
          className="btn btn-small btn-add"
          style={{ opacity: years >= 10 ? 0.5 : 1, pointerEvents: years >= 10 ? 'none' : 'auto' }}
        >
          + Add Year
        </button>
        <button
          onClick={removeYear}
          disabled={years <= 5}
          className="btn btn-small btn-remove"
          style={{ opacity: years <= 5 ? 0.5 : 1, pointerEvents: years <= 5 ? 'none' : 'auto' }}
        >
          - Remove Year
        </button>
      </div>

      {/* Data Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Sales (Units)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={item.year}
                    onChange={(e) => handleYearChange(index, e.target.value)}
                    className="input-field input-small"
                    placeholder="2020"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.sales}
                    onChange={(e) => handleSalesChange(index, e.target.value)}
                    className="input-field input-medium"
                    placeholder="1000"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic', marginTop: '10px' }}>
        * Enter historical sales data for 5 years (minimum 5, maximum 10)
      </p>
    </div>
  );
};

export default HistoricalDataTable; 