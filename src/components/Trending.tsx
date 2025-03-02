// src/components/Trending.tsx
import React, { useState } from 'react';
import useCryptoData from '../hooks/useCryptoData';
import CryptoDropdown from './CryptoDropdown';

const Trending: React.FC = () => {
  const { cryptoData, loading, error } = useCryptoData();
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  const handleSelect = (id: string) => {
    setSelectedCrypto(id);
  };

  const selectedCoin = cryptoData.find((coin) => coin.id === selectedCrypto);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Market Trends</h2>
      <CryptoDropdown cryptoData={cryptoData} onSelect={handleSelect} />
      {selectedCoin && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">{selectedCoin.name}</h3>
          <p>Current Price: ${selectedCoin.current_price}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
};

export default Trending;
