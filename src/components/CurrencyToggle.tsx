import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { DollarSign, IndianRupee } from 'lucide-react';

function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setCurrency('usd')}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
          currency === 'usd'
            ? 'bg-gradient-to-r from-yellow-400 to-pink-500 text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <DollarSign className="w-4 h-4" />
        <span>USD</span>
      </button>
      <button
        onClick={() => setCurrency('inr')}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
          currency === 'inr'
            ? 'bg-gradient-to-r from-yellow-400 to-pink-500 text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <IndianRupee className="w-4 h-4" />
        <span>INR</span>
      </button>
    </div>
  );
}

export default CurrencyToggle;