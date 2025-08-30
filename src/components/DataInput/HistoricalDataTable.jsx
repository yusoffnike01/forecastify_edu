import { useState } from 'react';

const HistoricalDataTable = ({ data, onDataChange }) => {
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

  const handleAddYear = () => {
    if (data.length < 5) {
      const lastYear = data.length > 0 ? data[data.length - 1].year : 2020;
      const newData = [...data, { year: lastYear + 1, sales: 0 }];
      onDataChange(newData);
    }
  };

  const handleRemoveYear = () => {
    if (data.length > 1) {
      const newData = data.slice(0, -1);
      onDataChange(newData);
    }
  };

  return (
    <div>
      <h3 className="section-title">📊 Historical Sales Data</h3>

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
          disabled={data.length >= 5}
          style={{ color: 'white' }}
        >
          ➕ Add Year
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleRemoveYear}
          disabled={data.length <= 1}
          style={{ color: 'var(--danger)' }}
        >
          ➖ Remove Year
        </button>
      </div>

      {/* Data Table */}
      <div className="data-table">
        <div className="table-header">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr auto',
            gap: 'var(--space-4)',
            fontWeight: '600',
            color: 'var(--gray-700)'
          }}>
            <div>Year</div>
            <div>Sales (Units)</div>
            <div></div>
          </div>
        </div>
        
        {data.map((item, index) => (
          <div key={index} className="table-row">
            <div className="table-cell">
              <input
                type="text"
                value={item.year}
                onChange={(e) => handleYearChange(index, e.target.value)}
                className="table-input"
                placeholder="2020"
              />
            </div>
            <div className="table-cell">
              <input
                type="text"
                value={item.sales}
                onChange={(e) => handleSalesChange(index, e.target.value)}
                className="table-input"
                placeholder="1000"
              />
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
        💡 Maximum 5 years allowed. Minimum 1 year required for calculation.
      </p>
    </div>
  );
};

export default HistoricalDataTable; 