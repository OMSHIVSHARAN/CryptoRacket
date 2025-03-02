import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  showProjected?: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  label,
  showProjected = true
}) => {
  const { convertPrice, formatPrice } = useCurrency();

  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg">
        <p className="text-white font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {formatPrice(convertPrice(entry.value))}
          </p>
        ))}
        {showProjected && payload[0]?.payload?.isProjected && (
          <p className="text-yellow-400 text-xs mt-2 font-medium">*Projected Data</p>
        )}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;