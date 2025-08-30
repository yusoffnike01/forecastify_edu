import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesChart = ({ data, graphType = 'line', showOriginalValues = true }) => {
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

  // Custom tooltip formatter to show units
  const customTooltipFormatter = (value, name, props) => {
    if (value) {
      return [`${value.toLocaleString()} units`, name];
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
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: window.innerWidth <= 768 ? '20px' : '40px',
        color: '#64748b',
        fontSize: window.innerWidth <= 480 ? '1rem' : '1.1rem',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '2px dashed #cbd5e1'
      }}>
        📊 No data available for chart
      </div>
    );
  }

  return (
    <div>
      <h3 className="section-title">📈 Sales Forecast Chart</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={window.innerWidth <= 768 ? 300 : 400}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart; 