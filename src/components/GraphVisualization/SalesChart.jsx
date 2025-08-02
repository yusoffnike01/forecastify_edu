import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesChart = ({ data, graphType = 'line' }) => {
  console.log('SalesChart Data:', data); // Debug log

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
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="year" 
              stroke="#666"
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
            />
            <YAxis 
              stroke="#666"
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontSize: window.innerWidth <= 480 ? '12px' : '14px'
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
              stroke="#3498db" 
              strokeWidth={window.innerWidth <= 768 ? 2 : 3}
              name="Historical Data"
              dot={{ fill: '#3498db', strokeWidth: 2, r: window.innerWidth <= 768 ? 4 : 6 }}
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="forecasted" 
              stroke="#e74c3c" 
              strokeWidth={window.innerWidth <= 768 ? 2 : 3}
              strokeDasharray="5 5"
              name="Forecasted Data"
              dot={{ fill: '#e74c3c', strokeWidth: 2, r: window.innerWidth <= 768 ? 4 : 6 }}
              connectNulls={false}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="year" 
              stroke="#666"
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
            />
            <YAxis 
              stroke="#666"
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontSize: window.innerWidth <= 480 ? '12px' : '14px'
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
              fill="#3498db" 
              name="Historical Data"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="forecasted" 
              fill="#e74c3c" 
              name="Forecasted Data"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="year" 
              stroke="#666"
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
            />
            <YAxis 
              stroke="#666"
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontSize: window.innerWidth <= 480 ? '12px' : '14px'
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
              stroke="#3498db" 
              fill="#3498db" 
              fillOpacity={0.6}
              name="Historical Data"
            />
            <Area 
              type="monotone" 
              dataKey="forecasted" 
              stroke="#e74c3c" 
              fill="#e74c3c" 
              fillOpacity={0.6}
              name="Forecasted Data"
            />
          </AreaChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="year" 
              stroke="#666"
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
            />
            <YAxis 
              stroke="#666"
              fontSize={window.innerWidth <= 480 ? 10 : 12}
              tick={{ fontSize: window.innerWidth <= 480 ? 10 : 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontSize: window.innerWidth <= 480 ? '12px' : '14px'
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
              stroke="#3498db" 
              strokeWidth={window.innerWidth <= 768 ? 2 : 3}
              name="Historical Data"
              dot={{ fill: '#3498db', strokeWidth: 2, r: window.innerWidth <= 768 ? 4 : 6 }}
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="forecasted" 
              stroke="#e74c3c" 
              strokeWidth={window.innerWidth <= 768 ? 2 : 3}
              strokeDasharray="5 5"
              name="Forecasted Data"
              dot={{ fill: '#e74c3c', strokeWidth: 2, r: window.innerWidth <= 768 ? 4 : 6 }}
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
        color: '#666',
        fontSize: window.innerWidth <= 480 ? '1rem' : '1.1rem'
      }}>
        📊 No data available for chart
      </div>
    );
  }

  return (
    <div>
      <h3 className="section-title">📈 Sales Forecast Chart</h3>
      <div style={{ 
        background: 'white', 
        borderRadius: '10px', 
        padding: window.innerWidth <= 768 ? '15px' : '20px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
      }}>
        <ResponsiveContainer width="100%" height={window.innerWidth <= 768 ? 300 : 400}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart; 