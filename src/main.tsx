import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import useCryptoData from './hooks/useCryptoData';

const Dashboard = () => {
  const { cryptoData, loading, error } = useCryptoData();

  if (loading) return <p>Loading crypto data...</p>;
  if (error) return <p>Error fetching data!</p>;

  return (
    <div className="crypto-dashboard">
      <h2 className="text-2xl font-bold mb-4">📊 Live Crypto Market</h2>
      <div className="grid grid-cols-3 gap-4">
        {cryptoData.map((coin) => (
          <div key={coin.id} className="p-4 bg-gray-800 rounded-xl">
            <div className="flex items-center space-x-2">
              <img src={coin.image} alt={coin.name} className="w-8 h-8" />
              <h3 className="text-lg font-semibold">
                {coin.name} ({coin.symbol.toUpperCase()})
              </h3>
            </div>
            <p>💰 Price: ${coin.current_price.toLocaleString()}</p>
            <p>
              📉 24h Change:{' '}
              <span
                className={
                  coin.price_change_percentage_24h >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
