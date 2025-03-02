// src/hooks/usePredictiveData.ts
import { useState, useEffect } from 'react';
import { linearRegression, exponentialSmoothing } from '../utils/predictiveModels';
import { HistoricalDataPoint } from './useHistoricalData';

export interface PredictiveDataPoint {
  date: string;
  price: number;
  isProjected: boolean;
  timestamp: number;
}

const usePredictiveData = (historicalData: HistoricalDataPoint[], yearsToPredict: number = 5) => {
  const [predictiveData, setPredictiveData] = useState<PredictiveDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!historicalData || historicalData.length === 0) {
      setLoading(false);
      return;
    }

    // Generate predictions
    const generatePredictions = () => {
      setLoading(true);

      try {
        // Prepare historical data for prediction models
        const prices = historicalData.map(item => item.price);
        const timestamps = historicalData.map(item => item.timestamp);

        // Generate future dates (based on yearsToPredict)
        const lastTimestamp = timestamps[timestamps.length - 1];
        const lastDate = new Date(lastTimestamp);
        
        // Calculate points to predict based on historical data density
        const dataSpan = timestamps[timestamps.length - 1] - timestamps[0];
        const dataPoints = historicalData.length;
        const pointsPerMs = dataPoints / dataSpan;
        
        // Calculate how many milliseconds in the years to predict
        const msToPredict = yearsToPredict * 365 * 24 * 60 * 60 * 1000;
        
        // Calculate how many points to predict based on the same density
        const futurePoints = Math.ceil(msToPredict * pointsPerMs);
        
        // Limit to a reasonable number
        const limitedPoints = Math.min(futurePoints, yearsToPredict * 12); // Monthly points
        
        // Generate future timestamps
        const futureTimestamps = [];
        const msPerPoint = msToPredict / limitedPoints;
        
        for (let i = 1; i <= limitedPoints; i++) {
          futureTimestamps.push(lastTimestamp + i * msPerPoint);
        }

        // Use linear regression for long-term trend
        const linearPredictions = linearRegression(prices, limitedPoints);
        
        // Use exponential smoothing for short-term adjustments
        const exponentialPredictions = exponentialSmoothing(prices, limitedPoints);

        // Combine models (weighted average)
        const combinedPredictions = linearPredictions.map((linear, i) => {
          // Weight more towards exponential for near-term, more towards linear for long-term
          const weight = i / limitedPoints; // 0 to 1
          return linear * weight + exponentialPredictions[i] * (1 - weight);
        });

        // Format the predicted data
        const predictedData = combinedPredictions.map((price, i) => {
          const timestamp = futureTimestamps[i];
          const date = new Date(timestamp);
          return {
            timestamp,
            date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            price: Math.max(0.01, parseFloat(price.toFixed(2))), // Ensure no negative prices
            isProjected: true
          };
        });

        // Combine historical and predicted data
        const formattedHistorical = historicalData.map(item => ({
          ...item,
          isProjected: false
        }));

        setPredictiveData([...formattedHistorical, ...predictedData]);
      } catch (error) {
        console.error('Error generating predictions:', error);
        // If prediction fails, just use historical data
        setPredictiveData(historicalData.map(item => ({
          ...item,
          isProjected: false
        })));
      } finally {
        setLoading(false);
      }
    };

    generatePredictions();
  }, [historicalData, yearsToPredict]);

  return { predictiveData, loading };
};

export default usePredictiveData;