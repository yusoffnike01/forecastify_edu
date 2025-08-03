// Calculate forecasted sales based on historical data and parameters
export const calculateForecast = (historicalData, parameters) => {
  if (!historicalData || historicalData.length === 0 || !parameters || parameters.length === 0) {
    return [];
  }

  const forecasts = [];
  let previousSales = historicalData[historicalData.length - 1].sales;

  parameters.forEach(param => {
    const forecastedSales = previousSales * (1 + param.percentage / 100);
    forecasts.push({
      year: param.year,
      sales: Math.round(forecastedSales),
      percentage: param.percentage,
      calculation: `${previousSales} × (1 + ${param.percentage}%) = ${Math.round(forecastedSales)}`
    });
    previousSales = forecastedSales;
  });

  return forecasts;
};

// Combine historical and forecasted data for graph
export const combineDataForGraph = (historicalData, forecastedData) => {
  if (!historicalData || historicalData.length === 0) {
    return [];
  }

  // Create a single array with all data points
  const allData = [];
  
  // Add historical data (excluding the last point)
  historicalData.slice(0, -1).forEach(item => {
    allData.push({
      year: item.year,
      historical: item.sales,
      forecasted: null
    });
  });
  
  // Add the transition point (last historical = first forecasted)
  const lastHistorical = historicalData[historicalData.length - 1];
  allData.push({
    year: lastHistorical.year,
    historical: lastHistorical.sales,
    forecasted: lastHistorical.sales
  });
  
  // Add forecasted data (excluding the first point if it's the same year)
  forecastedData.forEach(item => {
    if (item.year !== lastHistorical.year) {
      allData.push({
        year: item.year,
        historical: null,
        forecasted: item.sales
      });
    }
  });
  
  // Sort by year
  allData.sort((a, b) => a.year - b.year);
  
  return allData;
};

// Calculate summary statistics
export const calculateStatistics = (historicalData, forecastedData) => {
  if (!historicalData || historicalData.length === 0) {
    return {};
  }

  const totalHistorical = historicalData.reduce((sum, item) => sum + item.sales, 0);
  const totalForecasted = forecastedData.reduce((sum, item) => sum + item.sales, 0);
  
  // Calculate average growth rate from historical data
  let averageGrowthRate = 0;
  let growthRates = [];
  if (historicalData.length > 1) {
    for (let i = 1; i < historicalData.length; i++) {
      const growth = ((historicalData[i].sales - historicalData[i-1].sales) / historicalData[i-1].sales) * 100;
      growthRates.push(growth.toFixed(2));
    }
    averageGrowthRate = growthRates.reduce((sum, rate) => sum + parseFloat(rate), 0) / growthRates.length;
  }

  // Calculate projected growth from forecasted data
  let projectedGrowth = 0;
  let lastHistorical = 0;
  let firstForecasted = 0;
  if (forecastedData.length > 0 && historicalData.length > 0) {
    lastHistorical = historicalData[historicalData.length - 1].sales;
    firstForecasted = forecastedData[0].sales;
    projectedGrowth = ((firstForecasted - lastHistorical) / lastHistorical) * 100;
  }

  return {
    totalHistorical,
    totalForecasted,
    averageGrowthRate,
    projectedGrowth,
    growthRates,
    lastHistorical,
    firstForecasted
  };
};

// Validate input data
export const validateData = (historicalData, parameters) => {
  const errors = [];

  // Check historical data
  if (!historicalData || historicalData.length < 3) {
    errors.push("Historical data must have at least 3 years");
  }

  if (historicalData) {
    historicalData.forEach((item, index) => {
      if (!item.year || item.year < 1900 || item.year > 2100) {
        errors.push(`Invalid year at row ${index + 1}`);
      }
      if (!item.sales || item.sales < 0) {
        errors.push(`Invalid sales value at row ${index + 1}`);
      }
    });
  }

  // Check parameters
  if (!parameters || parameters.length === 0) {
    errors.push("At least one forecasting parameter is required");
  }

  if (parameters) {
    parameters.forEach((param, index) => {
      if (!param.year || param.year < 1900 || param.year > 2100) {
        errors.push(`Invalid forecast year at row ${index + 1}`);
      }
      if (param.percentage === undefined || param.percentage === null) {
        errors.push(`Invalid percentage at row ${index + 1}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    message: errors.length > 0 ? errors.join(', ') : '',
    errors: errors
  };
}; 