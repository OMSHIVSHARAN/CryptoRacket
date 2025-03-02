import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Clock, 
  Search 
} from 'lucide-react';
import useCryptoData from '../hooks/useCryptoData';
import { useCurrency } from '../contexts/CurrencyContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import useHistoricalData from '../hooks/useHistoricalData';
import CustomTooltip from '../components/CustomTooltip';

function TopCryptoList() {
  const { cryptoData, loading, error } = useCryptoData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'descending' });
  const { convertPrice, formatPrice } = useCurrency();
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const { historicalData, loading: histLoading } = useHistoricalData(selectedCoin || '', 30);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <h1 className="text-4xl font-bold mb-8">Loading Top Cryptocurrencies...</h1>
          <div className="h-96 bg-gray-800/50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-500">Error Loading Data</h1>
        <p className="text-xl mb-8">
          We couldn't fetch the latest cryptocurrency data. Please try again later.
        </p>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  const handleSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...cryptoData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredData = sortedData.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 15);

  // Check if Lido and Staked Ether are in the list
  const hasLido = filteredData.some(coin => coin.name.includes('Lido'));
  const hasStakedEther = filteredData.some(coin => coin.name.includes('Staked Ether'));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Top 15 Cryptocurrencies</h1>
        <p className="text-xl text-gray-300 mb-8">
          Real-time data for the top cryptocurrencies by market capitalization
        </p>
        
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      {selectedCoin && (
        <div className="mb-8 bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {cryptoData.find(c => c.id === selectedCoin)?.name} - 30 Day Price History
            </h2>
            <button 
              onClick={() => setSelectedCoin(null)}
              className="text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
          
          <div className="h-[300px]">
            {histLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#fff" 
                    tick={{ fill: '#fff' }}
                  />
                  <YAxis
                    stroke="#fff"
                    tick={{ fill: '#fff' }}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => formatPrice(convertPrice(value))}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#fbbf24" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800/70 text-left">
              <th className="p-4 rounded-tl-lg">#</th>
              <th className="p-4">Name</th>
              <th 
                className="p-4 cursor-pointer hover:text-yellow-400 transition-colors"
                onClick={() => handleSort('current_price')}
              >
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Price
                  {sortConfig.key === 'current_price' && (
                    <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="p-4 cursor-pointer hover:text-yellow-400 transition-colors"
                onClick={() => handleSort('price_change_percentage_24h')}
              >
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  24h %
                  {sortConfig.key === 'price_change_percentage_24h' && (
                    <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="p-4 cursor-pointer hover:text-yellow-400 transition-colors"
                onClick={() => handleSort('market_cap')}
              >
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  Market Cap
                  {sortConfig.key === 'market_cap' && (
                    <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="p-4 cursor-pointer hover:text-yellow-400 transition-colors rounded-tr-lg"
                onClick={() => handleSort('total_volume')}
              >
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Volume (24h)
                  {sortConfig.key === 'total_volume' && (
                    <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="p-4">Chart</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((coin, index) => (
              <tr 
                key={coin.id} 
                className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
              >
                <td className="p-4 text-gray-400">{index + 1}</td>
                <td className="p-4">
                  <Link 
                    to={`/crypto/${coin.id}`}
                    className="flex items-center gap-3 hover:text-yellow-400 transition-colors"
                  >
                    <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-gray-400 text-sm">{coin.symbol.toUpperCase()}</div>
                    </div>
                  </Link>
                </td>
                <td className="p-4 font-medium">
                  {formatPrice(convertPrice(coin.current_price))}
                </td>
                <td className={`p-4 font-medium ${
                  coin.price_change_percentage_24h >= 0 
                    ? 'text-emerald-400' 
                    : 'text-red-400'
                }`}>
                  <div className="flex items-center gap-1">
                    {coin.price_change_percentage_24h >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </div>
                </td>
                <td className="p-4">
                  {formatPrice(convertPrice(coin.market_cap))}
                </td>
                <td className="p-4">
                  {formatPrice(convertPrice(coin.total_volume))}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedCoin(coin.id)}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    View Chart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!hasLido && !hasStakedEther && (
        <div className="mt-8 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
          <p className="text-yellow-400">
            Note: Lido and Staked Ether may not appear in the top 15 cryptocurrencies by market cap. 
            These tokens are specialized staking derivatives and may be ranked lower.
          </p>
        </div>
      )}
    </div>
  );
}

export default TopCryptoList;