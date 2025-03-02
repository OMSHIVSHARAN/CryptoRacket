// src/hooks/useCryptoData.ts
import { useState, useEffect } from 'react';

// Define the structure of a cryptocurrency data item
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_7d?: number;
  price_change_percentage_30d?: number;
  price_change_percentage_1y?: number;
}

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const PARAMS = 
  '?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h,24h,7d,30d,1y';

const useCryptoData = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetched, setLastFetched] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      // Check if we've fetched data recently (within 1 minute) to avoid rate limiting
      const now = Date.now();
      if (now - lastFetched < 60000 && cryptoData.length > 0) {
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_URL}${PARAMS}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ensure we have Lido and Staked Ether in our data
        const hasLido = data.some((coin: CryptoData) => coin.name.toLowerCase().includes('lido'));
        const hasStakedEther = data.some((coin: CryptoData) => coin.name.toLowerCase().includes('staked ether'));
        
        // If we don't have them, we'll add them manually with placeholder data
        if (!hasLido || !hasStakedEther) {
          // Try to fetch them specifically
          try {
            const lidoResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=lido-dao,staked-ether&order=market_cap_desc&per_page=100&page=1&sparkline=false');
            if (lidoResponse.ok) {
              const lidoData = await lidoResponse.json();
              // Add any missing coins to our data
              lidoData.forEach((coin: CryptoData) => {
                if (!data.some((c: CryptoData) => c.id === coin.id)) {
                  data.push(coin);
                }
              });
            }
          } catch (lidoError) {
            console.error('Error fetching Lido/Staked Ether data:', lidoError);
          }
        }
        
        setCryptoData(data);
        setLastFetched(now);
      } catch (err) {
        console.error('Error fetching crypto data:', err);
        setError(err as Error);
        
        // If we have no data at all, use fallback data
        if (cryptoData.length === 0) {
          // Load fallback data
          import('../utils/fallbackCryptoData').then(module => {
            setCryptoData(module.default);
            console.log('Using fallback crypto data due to API error');
          }).catch(fallbackErr => {
            console.error('Error loading fallback data:', fallbackErr);
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 2 minutes
    const interval = setInterval(fetchData, 120000);

    return () => clearInterval(interval);
  }, [lastFetched, cryptoData.length]);

  return { cryptoData, loading, error, refetch: () => setLastFetched(0) };
};

export default useCryptoData;