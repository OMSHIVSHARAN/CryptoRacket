import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyType = 'usd' | 'inr';

interface CurrencyContextType {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  exchangeRate: number;
  convertPrice: (priceInUsd: number) => number;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyType>('usd');
  const [exchangeRate, setExchangeRate] = useState<number>(83.5); // Default INR/USD rate

  useEffect(() => {
    // Fetch the latest exchange rate from an API
    const fetchExchangeRate = async () => {
      try {
        // Using a free API to get exchange rates
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        if (data.rates && data.rates.INR) {
          setExchangeRate(data.rates.INR);
        }
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        // Keep the default rate if there's an error
      }
    };

    fetchExchangeRate();
    
    // Refresh exchange rate every hour
    const intervalId = setInterval(fetchExchangeRate, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Convert price from USD to the selected currency
  const convertPrice = (priceInUsd: number): number => {
    if (currency === 'usd') return priceInUsd;
    return priceInUsd * exchangeRate;
  };

  // Format price with currency symbol
  const formatPrice = (price: number): string => {
    if (currency === 'usd') {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `₹${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      exchangeRate, 
      convertPrice,
      formatPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}