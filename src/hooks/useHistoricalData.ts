// src/hooks/useHistoricalData.ts
import { useState, useEffect } from 'react';

export interface HistoricalDataPoint {
  date: string;
  price: number;
  timestamp: number;
}

const useHistoricalData = (coinId: string, days: number = 365) => {
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetched, setLastFetched] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!coinId) {
        setLoading(false);
        return;
      }
      
      // Create a cache key based on coinId and days
      const cacheKey = `${coinId}-${days}`;
      
      // Check if we've fetched this data recently (within 5 minutes)
      const now = Date.now();
      if (lastFetched[cacheKey] && now - lastFetched[cacheKey] < 300000 && historicalData.length > 0) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Use a proxy or direct API based on availability
        const apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.prices || !Array.isArray(data.prices)) {
          throw new Error('Invalid data format received from API');
        }
        
        // Process the data to format it for our chart
        const formattedData = data.prices.map((priceData: [number, number]) => {
          const timestamp = priceData[0];
          const date = new Date(timestamp);
          return {
            timestamp,
            date: formatDate(date, days),
            price: parseFloat(priceData[1].toFixed(2)),
          };
        });
        
        // Take a sample of points to avoid overwhelming the chart
        const sampledData = sampleData(formattedData, getSampleSize(days));
        
        setHistoricalData(sampledData);
        setLastFetched(prev => ({...prev, [cacheKey]: now}));
        setError(null);
      } catch (err) {
        console.error(`Error fetching historical data for ${coinId}:`, err);
        setError(err as Error);
        
        // Generate fallback data if we have an error
        if (historicalData.length === 0) {
          const fallbackData = generateFallbackData(coinId, days);
          setHistoricalData(fallbackData);
          console.log(`Using fallback historical data for ${coinId} due to API error`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [coinId, days]);

  // Format date based on the timeframe
  const formatDate = (date: Date, days: number): string => {
    if (days <= 1) {
      // For 1 day, show hours
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days <= 30) {
      // For up to 30 days, show day and month
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (days <= 365) {
      // For up to 1 year, show month and year
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } else {
      // For more than 1 year, show just month and year
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  };

  // Determine appropriate sample size based on timeframe
  const getSampleSize = (days: number): number => {
    if (days <= 1) return 24; // Hourly for 1 day
    if (days <= 7) return 42; // ~6 points per day for a week
    if (days <= 30) return 60; // ~2 points per day for a month
    if (days <= 365) return 52; // ~1 point per week for a year
    return 60; // ~1 point per 2 months for multiple years
  };

  // Function to sample data points to reduce chart density
  const sampleData = (data: HistoricalDataPoint[], sampleSize: number): HistoricalDataPoint[] => {
    if (data.length <= sampleSize) return data;
    
    const result: HistoricalDataPoint[] = [];
    const step = Math.floor(data.length / sampleSize);
    
    for (let i = 0; i < data.length; i += step) {
      result.push(data[i]);
    }
    
    // Ensure we include the most recent data point
    if (result[result.length - 1] !== data[data.length - 1]) {
      result.push(data[data.length - 1]);
    }
    
    return result;
  };

  // Generate fallback data if API fails
  const generateFallbackData = (coinId: string, days: number): HistoricalDataPoint[] => {
    const result: HistoricalDataPoint[] = [];
    const now = Date.now();
    const startPrice = getStartPriceForCoin(coinId);
    const volatility = getVolatilityForCoin(coinId);
    
    // Generate data points
    const points = getSampleSize(days);
    const msPerPoint = (days * 24 * 60 * 60 * 1000) / points;
    
    let currentPrice = startPrice;
    
    for (let i = 0; i < points; i++) {
      const timestamp = now - (points - i) * msPerPoint;
      const date = new Date(timestamp);
      
      // Add some random movement to the price
      const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
      currentPrice = Math.max(0.01, currentPrice + change);
      
      result.push({
        timestamp,
        date: formatDate(date, days),
        price: parseFloat(currentPrice.toFixed(2))
      });
    }
    
    return result;
  };

  // Get a reasonable starting price for fallback data
  const getStartPriceForCoin = (coinId: string): number => {
    switch (coinId.toLowerCase()) {
      case 'bitcoin': return 30000;
      case 'ethereum': return 2000;
      case 'tether': return 1;
      case 'binancecoin': return 300;
      case 'ripple': return 0.5;
      case 'cardano': return 0.3;
      case 'solana': return 100;
      case 'dogecoin': return 0.07;
      case 'polkadot': return 5;
      case 'lido-dao': return 2;
      case 'staked-ether': return 2000;
      default: return 10;
    }
  };

  // Get volatility factor for fallback data
  const getVolatilityForCoin = (coinId: string): number => {
    switch (coinId.toLowerCase()) {
      case 'bitcoin': return 0.03;
      case 'ethereum': return 0.04;
      case 'tether': return 0.001;
      case 'binancecoin': return 0.03;
      case 'ripple': return 0.05;
      case 'cardano': return 0.06;
      case 'solana': return 0.07;
      case 'dogecoin': return 0.08;
      case 'polkadot': return 0.05;
      case 'lido-dao': return 0.06;
      case 'staked-ether': return 0.04;
      default: return 0.05;
    }
  };

  return { historicalData, loading, error };
};

export default useHistoricalData;