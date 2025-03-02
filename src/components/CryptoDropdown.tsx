// src/components/CryptoDropdown.tsx
import React from 'react';

interface CryptoDropdownProps {
  cryptoData: Array<{ id: string; name: string }>;
  onSelect: (id: string) => void;
}

const CryptoDropdown: React.FC<CryptoDropdownProps> = ({
  cryptoData,
  onSelect,
}) => {
  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="">Select a cryptocurrency</option>
      {cryptoData.map((coin) => (
        <option key={coin.id} value={coin.id}>
          {coin.name}
        </option>
      ))}
    </select>
  );
};

export default CryptoDropdown;
