import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResultsDisplay = ({ historicalData, forecastedData, statistics }) => {
  const [showCalculations, setShowCalculations] = useState(false);

  const exportToPDF = async () => {
    const element = document.getElementById('results-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('forecastify-results.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div id="results-content" style={{ backgroundColor: 'white', color: 'black' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: 'black' }}>📋 Results & Calculations</h3>
        <button
          onClick={exportToPDF}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          📄 Export PDF
        </button>
      </div>

      {/* Summary Statistics */}
      <div style={{ 
        background: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h4 style={{ marginBottom: '15px', fontSize: '1.1rem', color: 'black' }}>📊 Summary Statistics</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ color: 'black' }}>
            <strong>Total Historical Sales:</strong> {statistics.totalHistorical?.toLocaleString()} units
          </div>
          <div style={{ color: 'black' }}>
            <strong>Total Forecasted Sales:</strong> {statistics.totalForecasted?.toLocaleString()} units
          </div>
          <div style={{ color: 'black' }}>
            <strong>Average Growth Rate:</strong> {statistics.averageGrowthRate?.toFixed(2)}%
          </div>
          <div style={{ color: 'black' }}>
            <strong>Projected Growth:</strong> {statistics.projectedGrowth?.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Detailed Results Table */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '15px', fontSize: '1.1rem', color: 'black' }}>📈 Detailed Results</h4>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: 'white',
          border: '1px solid #e9ecef',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{
                padding: '15px',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'black',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderBottom: '1px solid #e9ecef'
              }}>
                Year
              </th>
              <th style={{
                padding: '15px',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'black',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderBottom: '1px solid #e9ecef'
              }}>
                Type
              </th>
              <th style={{
                padding: '15px',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'black',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderBottom: '1px solid #e9ecef'
              }}>
                Sales (Units)
              </th>
              <th style={{
                padding: '15px',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'black',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderBottom: '1px solid #e9ecef'
              }}>
                Change (%)
              </th>
            </tr>
          </thead>
          <tbody>
            {historicalData.map((item, index) => (
              <tr key={`hist-${index}`} style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '15px', fontSize: '0.875rem', color: 'black' }}>{item.year}</td>
                <td style={{ padding: '15px', fontSize: '0.875rem', color: 'black', fontWeight: '500' }}>Historical</td>
                <td style={{ padding: '15px', fontSize: '0.875rem', color: 'black' }}>{item.sales.toLocaleString()}</td>
                <td style={{ padding: '15px', fontSize: '0.875rem', color: 'black' }}>
                  {index > 0 
                    ? (((item.sales - historicalData[index - 1].sales) / historicalData[index - 1].sales) * 100).toFixed(2)
                    : '-'
                  }%
                </td>
              </tr>
            ))}
            {forecastedData.map((item, index) => (
              <tr key={`forecast-${index}`} style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '15px', fontSize: '0.875rem', color: 'black' }}>{item.year}</td>
                <td style={{ padding: '15px', fontSize: '0.875rem', color: 'black', fontWeight: '500' }}>Forecasted</td>
                <td style={{ padding: '15px', fontSize: '0.875rem', color: 'black' }}>{item.sales.toLocaleString()}</td>
                <td style={{ padding: '15px', fontSize: '0.875rem', color: 'black' }}>
                  {item.percentage >= 0 ? '+' : ''}{item.percentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calculations Toggle */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowCalculations(!showCalculations)}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            marginBottom: '15px'
          }}
        >
          {showCalculations ? '🔽 Hide' : '🔼 Show'} Calculation Steps
        </button>

        {showCalculations && (
          <div style={{
            background: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <h4 style={{ marginBottom: '15px', color: 'black' }}>🧮 Calculation Steps</h4>
            {forecastedData.map((item, index) => (
              <div key={index} style={{ 
                marginBottom: '15px',
                padding: '15px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <h5 style={{ marginBottom: '10px', color: 'black' }}>
                  {item.year} Forecast Calculation:
                </h5>
                <p style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'black' }}>
                  {item.calculation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      <div style={{
        background: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '10px',
        padding: '20px'
      }}>
        <h4 style={{ marginBottom: '15px', fontSize: '1.1rem', color: 'black' }}>💡 Insights</h4>
        <ul style={{ listStyle: 'none', padding: 0, color: 'black' }}>
          <li style={{ marginBottom: '8px' }}>• Historical data shows {statistics.averageGrowthRate >= 0 ? 'positive' : 'negative'} growth trend</li>
          <li style={{ marginBottom: '8px' }}>• Forecasted growth rate: {statistics.projectedGrowth >= 0 ? '+' : ''}{statistics.projectedGrowth?.toFixed(2)}%</li>
          <li style={{ marginBottom: '8px' }}>• Total projected sales: {statistics.totalForecasted?.toLocaleString()} units</li>
          <li style={{ marginBottom: '8px' }}>• This represents a {statistics.projectedGrowth >= 0 ? 'growth' : 'decline'} in sales performance</li>
        </ul>
      </div>
    </div>
  );
};

export default ResultsDisplay; 