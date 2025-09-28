import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesChart = ({ 
  data, 
  graphType = 'line', 
  showOriginalValues = true, 
  selectedProduct = '', 
  selectedCountry = '',
  selectedCurrency = 'MYR'
}) => {
  console.log('SalesChart Data:', data); // Debug log

  // Modern color palette matching the new design
  const colors = {
    historical: '#3b82f6', // Blue for historical data
    forecasted: '#dc2626', // Red for forecasted data
    grid: '#e2e8f0',
    text: '#475569',
    tooltip: '#ffffff',
    tooltipBorder: '#cbd5e1'
  };

  // Generate dynamic title based on product and country
  const generateTitle = () => {
    let title = "📈 Sales Forecast Chart";
    
    if (selectedProduct && selectedCountry) {
      title = `📈 ${selectedProduct} Sales Forecast - ${selectedCountry}`;
    } else if (selectedProduct) {
      title = `📈 ${selectedProduct} Sales Forecast`;
    } else if (selectedCountry) {
      title = `📈 Sales Forecast - ${selectedCountry}`;
    }
    
    return title;
  };

  // Generate subtitle for additional context
  const generateSubtitle = () => {
    const parts = [];
    
    if (data && data.length > 0) {
      const historicalCount = data.filter(item => item.historical !== null && item.historical !== undefined).length;
      const forecastedCount = data.filter(item => item.forecasted !== null && item.forecasted !== undefined).length;
      
      if (historicalCount > 0 && forecastedCount > 0) {
        parts.push(`${historicalCount} historical • ${forecastedCount} forecasted data points`);
      } else if (historicalCount > 0) {
        parts.push(`${historicalCount} data points`);
      }
    }
    
    if (selectedCurrency && selectedCurrency !== 'units') {
      parts.push(`Values in ${selectedCurrency}`);
    } else {
      parts.push('Values in units');
    }
    
    return parts.join(' • ');
  };

  // Custom tooltip formatter to show units/currency
  const customTooltipFormatter = (value, name) => {
    if (value) {
      const unit = selectedCurrency && selectedCurrency !== 'units' ? selectedCurrency : 'units';
      return [`${value.toLocaleString()} ${unit}`, name];
    }
    return [null, name];
  };

  const renderChart = () => {
    const commonProps = {
      data: data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
      height: window.innerWidth <= 768 ? 300 : 400
    };

    switch (graphType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis 
              dataKey="year" 
              stroke={colors.text}
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
            />
            <YAxis 
              stroke={colors.text}
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
              label={{ 
                value: selectedCurrency && selectedCurrency !== 'units' ? `Sales (${selectedCurrency})` : 'Sales (units)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: '12px', fill: colors.text }
              }}
            />
            <Tooltip 
              formatter={customTooltipFormatter}
              contentStyle={{
                backgroundColor: colors.tooltip,
                border: `1px solid ${colors.tooltipBorder}`,
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                padding: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{
                fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                paddingTop: '10px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="historical" 
              stroke={colors.historical} 
              strokeWidth={window.innerWidth <= 768 ? 3 : 4}
              name="Historical Data"
              dot={{ 
                fill: colors.historical, 
                strokeWidth: 2, 
                r: window.innerWidth <= 768 ? 5 : 7,
                stroke: '#ffffff'
              }}
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="forecasted" 
              stroke={colors.forecasted} 
              strokeWidth={window.innerWidth <= 768 ? 3 : 4}
              strokeDasharray="5 5"
              name="Forecasted Data"
              dot={{ 
                fill: colors.forecasted, 
                strokeWidth: 2, 
                r: window.innerWidth <= 768 ? 5 : 7,
                stroke: '#ffffff'
              }}
              connectNulls={false}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis 
              dataKey="year" 
              stroke={colors.text}
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
            />
            <YAxis 
              stroke={colors.text}
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
              label={{ 
                value: selectedCurrency && selectedCurrency !== 'units' ? `Sales (${selectedCurrency})` : 'Sales (units)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: '12px', fill: colors.text }
              }}
            />
            <Tooltip 
              formatter={customTooltipFormatter}
              contentStyle={{
                backgroundColor: colors.tooltip,
                border: `1px solid ${colors.tooltipBorder}`,
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                padding: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{
                fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                paddingTop: '10px'
              }}
            />
            <Bar 
              dataKey="historical" 
              fill={colors.historical} 
              name="Historical Data"
              radius={[6, 6, 0, 0]}
            />
            <Bar 
              dataKey="forecasted" 
              fill={colors.forecasted} 
              name="Forecasted Data"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis 
              dataKey="year" 
              stroke={colors.text}
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
            />
            <YAxis 
              stroke={colors.text}
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
              label={{ 
                value: selectedCurrency && selectedCurrency !== 'units' ? `Sales (${selectedCurrency})` : 'Sales (units)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: '12px', fill: colors.text }
              }}
            />
            <Tooltip 
              formatter={customTooltipFormatter}
              contentStyle={{
                backgroundColor: colors.tooltip,
                border: `1px solid ${colors.tooltipBorder}`,
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                padding: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{
                fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                paddingTop: '10px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="historical" 
              stroke={colors.historical} 
              fill={colors.historical} 
              fillOpacity={0.7}
              name="Historical Data"
            />
            <Area 
              type="monotone" 
              dataKey="forecasted" 
              stroke={colors.forecasted} 
              fill={colors.forecasted} 
              fillOpacity={0.7}
              name="Forecasted Data"
            />
          </AreaChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis 
              dataKey="year" 
              stroke={colors.text}
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
            />
            <YAxis 
              stroke={colors.text}
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
              label={{ 
                value: selectedCurrency && selectedCurrency !== 'units' ? `Sales (${selectedCurrency})` : 'Sales (units)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: '12px', fill: colors.text }
              }}
            />
            <Tooltip 
              formatter={customTooltipFormatter}
              contentStyle={{
                backgroundColor: colors.tooltip,
                border: `1px solid ${colors.tooltipBorder}`,
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                padding: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{
                fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                paddingTop: '10px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="historical" 
              stroke={colors.historical} 
              strokeWidth={window.innerWidth <= 768 ? 3 : 4}
              name="Historical Data"
              dot={{ 
                fill: colors.historical, 
                strokeWidth: 2, 
                r: window.innerWidth <= 768 ? 5 : 7,
                stroke: '#ffffff'
              }}
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="forecasted" 
              stroke={colors.forecasted} 
              strokeWidth={window.innerWidth <= 768 ? 3 : 4}
              strokeDasharray="5 5"
              name="Forecasted Data"
              dot={{ 
                fill: colors.forecasted, 
                strokeWidth: 2, 
                r: window.innerWidth <= 768 ? 5 : 7,
                stroke: '#ffffff'
              }}
              connectNulls={false}
            />
          </LineChart>
        );
    }
  };

  if (!data || data.length === 0) {
    const emptyMessage = selectedProduct || selectedCountry 
      ? `📊 No data available for ${selectedProduct ? selectedProduct : ''} ${selectedProduct && selectedCountry ? 'in' : ''} ${selectedCountry ? selectedCountry : ''}`.trim()
      : '📊 No data available for chart';
      
    return (
      <div>
        {/* Title even when no data */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h3 
            className="section-title" 
            style={{ 
              fontSize: window.innerWidth <= 768 ? '1.25rem' : '1.5rem',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '8px',
              lineHeight: '1.2'
            }}
          >
            {generateTitle()}
          </h3>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          padding: window.innerWidth <= 768 ? '20px' : '40px',
          color: '#64748b',
          fontSize: window.innerWidth <= 480 ? '1rem' : '1.1rem',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '2px dashed #cbd5e1'
        }}>
          {emptyMessage}
          <div style={{ 
            fontSize: '0.9rem', 
            marginTop: '8px', 
            opacity: 0.8 
          }}>
            Please add historical data and calculate forecast
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Dynamic Title */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h3 
          className="section-title" 
          style={{ 
            fontSize: window.innerWidth <= 768 ? '1.25rem' : '1.5rem',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '8px',
            lineHeight: '1.2'
          }}
        >
          {generateTitle()}
        </h3>
        
        {/* Subtitle with context information */}
        <div style={{
          fontSize: window.innerWidth <= 768 ? '0.85rem' : '0.95rem',
          color: '#64748b',
          fontWeight: '500',
          lineHeight: '1.4'
        }}>
          {generateSubtitle()}
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={window.innerWidth <= 768 ? 300 : 400}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart; 