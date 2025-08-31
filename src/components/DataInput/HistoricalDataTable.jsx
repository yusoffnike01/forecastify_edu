import { useState } from 'react';

const HistoricalDataTable = ({ data, onDataChange, selectedCountry, onCountryChange }) => {

  // Hardcoded list of countries
  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia',
    'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium',
    'Bolivia', 'Bosnia and Herzegovina', 'Brazil', 'Brunei', 'Bulgaria', 'Cambodia',
    'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Czech Republic',
    'Denmark', 'Ecuador', 'Egypt', 'Estonia', 'Ethiopia', 'Finland',
    'France', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Hungary',
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
    'Kuwait', 'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg', 'Malaysia',
    'Mexico', 'Morocco', 'Nepal', 'Netherlands', 'New Zealand', 'Nigeria',
    'Norway', 'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia',
    'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden',
    'Switzerland', 'Taiwan', 'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates',
    'United Kingdom', 'United States', 'Uruguay', 'Venezuela', 'Vietnam'
  ];
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

      {/* Country Selection (Optional) */}
      <div style={{ 
        marginBottom: 'var(--space-6)',
        padding: 'var(--space-4)',
        background: 'var(--gray-50)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--gray-200)'
      }}>
        <label style={{ 
          display: 'block',
          fontSize: '0.9rem',
          fontWeight: '600',
          color: 'var(--gray-700)',
          marginBottom: 'var(--space-2)'
        }}>
          🌍 Country/Region (Optional)
        </label>
        <select
          value={selectedCountry || ''}
          onChange={(e) => onCountryChange && onCountryChange(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '300px',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.2s ease',
            background: 'white',
            fontFamily: 'inherit',
            cursor: 'pointer',
            color: selectedCountry ? '#1a202c' : '#a0aec0'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        >
          <option value="" style={{ color: '#a0aec0' }}>Select country/region...</option>
          {countries.map((country) => (
            <option key={country} value={country} style={{ color: '#1a202c' }}>
              {country}
            </option>
          ))}
        </select>
        <p style={{ 
          fontSize: '0.8rem', 
          color: 'var(--gray-500)', 
          marginTop: 'var(--space-2)',
          marginBottom: 0
        }}>
          This field is optional and for reference purposes only
        </p>
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