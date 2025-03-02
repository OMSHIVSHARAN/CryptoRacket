import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import {
  Rocket,
  Moon,
  TrendingUp as ArrowTrendingUp,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  DollarSign
} from 'lucide-react';
import useCryptoData from '../hooks/useCryptoData';
import useHistoricalData from '../hooks/useHistoricalData';
import { useCurrency } from '../contexts/CurrencyContext';
import CustomTooltip from '../components/CustomTooltip';

function TrendingAssets() {
  const { cryptoData, loading } = useCryptoData();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1y');
  const { historicalData, loading: histLoading } = useHistoricalData('bitcoin', 365);
  const { convertPrice, formatPrice } = useCurrency();

  // Get trending assets (top 3 by 24h change)
  const trendingAssets = !loading && cryptoData 
    ? [...cryptoData]
        .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
        .slice(0, 3)
        .map(coin => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          hypeScore: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
          icon: coin.image,
          price: coin.current_price,
          change: `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%`,
          mentions: `${Math.floor(Math.random() * 90) + 10}K`,
          toTheMoon: coin.price_change_percentage_24h > 0
        }))
    : [];

  // Check if we have Lido and Staked Ether in the data
  const hasLido = !loading && cryptoData ? cryptoData.some(coin => coin.name.includes('Lido')) : false;
  const hasStakedEther = !loading && cryptoData ? cryptoData.some(coin => coin.name.includes('Staked Ether')) : false;

  // Filter for Lido and Staked Ether if they exist
  const lidoAndStakedEther = !loading && cryptoData 
    ? cryptoData.filter(coin => 
        coin.name.includes('Lido') || 
        coin.name.includes('Staked Ether')
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        🚀 Trending Crypto
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {!loading && trendingAssets.map(
          ({
            id,
            name,
            symbol,
            hypeScore,
            icon,
            price,
            change,
            mentions,
            toTheMoon,
          }) => (
            <div
              key={symbol}
              className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm
                        transform transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center gap-4 mb-4">
                <img src={icon} alt={name} className="w-12 h-12 rounded-full" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{name}</h3>
                    {toTheMoon && (
                      <div className="flex items-center gap-1 bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
                        <Moon className="w-3 h-3" />
                        To the Moon!
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400">{symbol}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Price</span>
                  <span className="text-xl font-bold text-white">{formatPrice(convertPrice(price))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>24h Change</span>
                  <span
                    className={`font-bold ${
                      change.startsWith('+')
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}
                  >
                    {change}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Hype Score</span>
                  <span className="text-yellow-400">{hypeScore}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Mentions</span>
                  <span className="text-purple-400">{mentions}</span>
                </div>

                <div className="mt-4 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { time: '1h', value: 90 },
                        { time: '2h', value: 85 },
                        { time: '3h', value: 95 },
                        { time: '4h', value: 92 },
                        { time: '5h', value: 98 },
                      ]}
                    >
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#fbbf24"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <Link
                    to={`/crypto/${id}`}
                    className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-all duration-300 group"
                  >
                    View Details
                    <ExternalLink className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                  </Link>
                  <a
                    href={`https://www.coingecko.com/en/coins/${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                  >
                    Market Data ↗
                  </a>
                </div>
              </div>
            </div>
          )
        )}
        {loading && (
          <div className="col-span-3 text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-xl">Loading trending assets...</p>
          </div>
        )}
      </div>

      <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6">
          Historical Bitcoin Trends
        </h2>
        <div className="h-[500px]">
          {histLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-xl">Loading historical data...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="colorBitcoin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#fff" tick={{ fill: '#fff' }} />
                <YAxis
                  stroke="#fff"
                  tick={{ fill: '#fff' }}
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => formatPrice(convertPrice(value))}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#fbbf24"
                  fillOpacity={1}
                  fill="url(#colorBitcoin)"
                  name="Bitcoin Price"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-4 p-4 bg-yellow-400/10 rounded-lg">
          <p className="text-yellow-400 text-sm">
            * Data represents historical Bitcoin prices from CoinGecko API
          </p>
        </div>
      </div>

      {/* Live Market Trends Section with Enhanced UI */}
      {!loading && cryptoData && cryptoData.length > 0 && (
        <div className="mt-12 bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6">📈 Live Market Trends</h2>
          
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800/70 text-left">
                  <th className="p-4 rounded-tl-lg">#</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">24h %</th>
                  <th className="p-4">Market Cap</th>
                  <th className="p-4 rounded-tr-lg">Volume (24h)</th>
                </tr>
              </thead>
              <tbody>
                {cryptoData.slice(0, 15).map((coin, index) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Highlight Lido and Staked Ether if they exist */}
          {lidoAndStakedEther.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Featured: Lido & Staked Ether</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lidoAndStakedEther.map(coin => (
                  <div 
                    key={coin.id}
                    className="bg-gradient-to-r from-yellow-400/10 to-pink-500/10 rounded-xl p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <h3 className="text-xl font-bold">{coin.name}</h3>
                        <p className="text-gray-400">{coin.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-gray-400 text-sm mb-1 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Price
                        </div>
                        <div className="text-lg font-bold">{formatPrice(convertPrice(coin.current_price))}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm mb-1 flex items-center gap-1">
                          <ArrowTrendingUp className="w-3 h-3" />
                          24h Change
                        </div>
                        <div className={`text-lg font-bold ${
                          coin.price_change_percentage_24h >= 0 
                            ? 'text-emerald-400' 
                            : 'text-red-400'
                        }`}>
                          {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm mb-1 flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          Market Cap
                        </div>
                        <div className="text-lg font-bold">{formatPrice(convertPrice(coin.market_cap))}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm mb-1 flex items-center gap-1">
                          <Rocket className="w-3 h-3" />
                          Volume (24h)
                        </div>
                        <div className="text-lg font-bold">{formatPrice(convertPrice(coin.total_volume))}</div>
                      </div>
                    </div>
                    
                    <Link
                      to={`/crypto/${coin.id}`}
                      className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      View Detailed Analysis
                      <ArrowTrendingUp className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="h-[300px] mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={cryptoData.slice(0, 10).map((coin) => ({
                  name: coin.name,
                  price: coin.current_price,
                  change: coin.price_change_percentage_24h,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#fff" tick={{ fill: '#fff' }} />
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
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Current Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 text-center">
            <Link
              to="/top-crypto"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              View All Top 15 Cryptocurrencies
              <ArrowTrendingUp className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrendingAssets;