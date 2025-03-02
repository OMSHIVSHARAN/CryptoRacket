// src/utils/predictiveModels.ts

/**
 * Simple linear regression model for price prediction
 * @param prices Historical price data
 * @param pointsToPredict Number of future points to predict
 * @returns Array of predicted prices
 */
export const linearRegression = (prices: number[], pointsToPredict: number): number[] => {
  const n = prices.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  
  // Calculate means
  const meanX = indices.reduce((sum, x) => sum + x, 0) / n;
  const meanY = prices.reduce((sum, y) => sum + y, 0) / n;
  
  // Calculate slope (m) and y-intercept (b)
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (indices[i] - meanX) * (prices[i] - meanY);
    denominator += Math.pow(indices[i] - meanX, 2);
  }
  
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;
  
  // Generate predictions
  const predictions = [];
  for (let i = 1; i <= pointsToPredict; i++) {
    const predictedValue = slope * (n + i - 1) + intercept;
    predictions.push(predictedValue);
  }
  
  return predictions;
};

/**
 * Exponential smoothing for price prediction
 * @param prices Historical price data
 * @param pointsToPredict Number of future points to predict
 * @param alpha Smoothing factor (0 < alpha < 1)
 * @returns Array of predicted prices
 */
export const exponentialSmoothing = (
  prices: number[], 
  pointsToPredict: number, 
  alpha: number = 0.3
): number[] => {
  if (prices.length === 0) return [];
  
  // Initialize with the first observation
  let lastSmoothed = prices[0];
  
  // Apply smoothing to historical data
  for (let i = 1; i < prices.length; i++) {
    lastSmoothed = alpha * prices[i] + (1 - alpha) * lastSmoothed;
  }
  
  // Generate predictions
  const predictions = [];
  let currentPrediction = lastSmoothed;
  
  for (let i = 0; i < pointsToPredict; i++) {
    predictions.push(currentPrediction);
    
    // Add some randomness to simulate market volatility
    const volatility = 0.05; // 5% volatility
    const randomFactor = 1 + (Math.random() * 2 - 1) * volatility;
    currentPrediction *= randomFactor;
  }
  
  return predictions;
};

/**
 * Calculate moving average
 * @param data Array of numbers
 * @param window Window size for moving average
 * @returns Array of moving averages
 */
export const movingAverage = (data: number[], window: number): number[] => {
  const result = [];
  
  for (let i = 0; i < data.length - window + 1; i++) {
    const windowSlice = data.slice(i, i + window);
    const average = windowSlice.reduce((sum, val) => sum + val, 0) / window;
    result.push(average);
  }
  
  return result;
};

/**
 * Calculate Relative Strength Index (RSI)
 * @param prices Array of prices
 * @param period Period for RSI calculation (typically 14)
 * @returns Array of RSI values
 */
export const calculateRSI = (prices: number[], period: number = 14): number[] => {
  if (prices.length <= period) return [];
  
  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }
  
  const rsiValues = [];
  
  for (let i = period; i < changes.length; i++) {
    const gains = changes.slice(i - period, i).filter(change => change > 0);
    const losses = changes.slice(i - period, i).filter(change => change < 0).map(loss => Math.abs(loss));
    
    const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / period;
    const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / period;
    
    if (avgLoss === 0) {
      rsiValues.push(100);
    } else {
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      rsiValues.push(rsi);
    }
  }
  
  return rsiValues;
};