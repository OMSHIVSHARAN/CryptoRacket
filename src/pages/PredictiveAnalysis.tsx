import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Brain,
  AlertTriangle,
  ArrowRight,
  Calendar,
  DollarSign,
  Clock,
  Search
} from 'lucide-react';
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
import useCryptoData from '../hooks/useCryptoData';
import useHistoricalData from '../hooks/useHistoricalData';
import usePredictiveData from '../hooks/usePredictiveData';
import { useCurrency } from '../contexts/CurrencyContext';
import CustomTooltip from '../components/CustomTooltip';

function PredictiveAnalysis() {
  const { cryptoData, loading: cryptoLoading } = useCryptoData();
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [predictionTimeframe, setPredictionTimeframe] = useState<number>(5); // 5 years
  const [searchTerm, setSearchTerm] = useState('');
  const { convertPrice, formatPrice } = useCurrency();
  
  const { historicalData, loading: histLoading } = useHistoricalData(selectedCoin, 3650); // 10 years
  const { predictiveData, loading: predLoading } = usePredictiveData(historicalData, predictionTimeframe);

  // Set Bitcoin as default when data loads
  useEffect(() => {
    if (!cryptoLoading && cryptoData.length > 0 && !selectedCoin) {
      setSelectedCoin(cryptoData[0].id);
    }
  }, [cryptoLoading, cryptoData, selectedCoin]);

  const filteredCoins = cryptoData.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCoinData = cryptoData.find(coin => coin.id === selectedCoin);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">AI-Powered Predictive Analysis</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Explore potential future price movements based on historical data patterns and advanced machine learning algorithms
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-yellow-400" />
              Select Cryptocurrency
            </h2>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2">
              {cryptoLoading ? (
                <div className="animate-pulse space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-700/50 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                filteredCoins.map(coin => (
                  <button
                    key={coin.id}
                    onClick={() => setSelectedCoin(coin.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      selectedCoin === coin.id
                        ? 'bg-gradient-to-r from-yellow-400/20 to-pink-500/20 border border-yellow-400/30'
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                    <div className="text-left">
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-xs text-gray-400">{coin.symbol.toUpperCase()}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-400" />
              Prediction Timeframe
            </h2>
            <div className="space-y-2">
              {[1, 2, 3, 5, 10].map(years => (
                <button
                  key={years}
                  onClick={() => setPredictionTimeframe(years)}
                  className={`w-full p-3 rounded-lg transition-colors ${
                    predictionTimeframe === years
                      ? 'bg-gradient-to-r from-yellow-400/20 to-pink-500/20 border border-yellow-400/30'
                      : 'bg-gray-700/50 hover:bg-gray-700'
                  }`}
                >
                  {years} {years === 1 ? 'Year' : 'Years'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-yellow-400/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-400">Disclaimer</h3>
                <p className="text-sm text-gray-300 mt-2">
                  Predictions are based on historical data patterns and should not be considered as financial advice. 
                  Cryptocurrency markets are highly volatile and unpredictable.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Selected Coin Overview */}
          {selectedCoinData && (
            <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img src={selectedCoinData.image} alt={selectedCoinData.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCoinData.name}</h2>
                    <div className="text-gray-400">{selectedCoinData.symbol.toUpperCase()}</div>
                  </div>
                </div>
                <Link
                  to={`/crypto/${selectedCoinData.id}`}
                  className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Current Price
                  </div>
                  <div className="text-xl font-bold">{formatPrice(convertPrice(selectedCoinData.current_price))}</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    24h Change
                  </div>
                  <div className={`text-xl font-bold ${
                    selectedCoinData.price_change_percentage_24h >= 0
                      ? 'text-emerald-400'
                      : 'text-red-400'
                  }`}>
                    {selectedCoinData.price_change_percentage_24h >= 0 ? '+' : ''}
                    {selectedCoinData.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Market Cap
                  </div>
                  <div className="text-xl font-bold">{formatPrice(convertPrice(selectedCoinData.market_cap))}</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Prediction Chart */}
          <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-yellow-400" />
              {predictionTimeframe}-Year Price Prediction
            </h2>
            
            {histLoading || predLoading ? (
              <div className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                  <p className="text-xl">Generating AI predictions...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={predictiveData}>
                      <defs>
                        <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#fff" 
                        tick={{ fill: '#fff' }} 
                        tickFormatter={(value) => value}
                      />
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
                        name="Price"
                        stroke={(d) => d && d.isProjected ? "#ec4899" : "#fbbf24"}
                        fill={(d) => d && d.isProjected ? "url(#colorPredicted)" : "url(#colorHistorical)"}
                        fillOpacity={1}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                        isAnimationActive={true}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Analysis Insights</h3>
                  <p className="text-gray-300">
                    Based on historical price patterns, market trends, and our AI prediction models, 
                    {selectedCoinData?.name} shows a {predictiveData[predictiveData.length - 1]?.price > selectedCoinData?.current_price ? 'positive' : 'negative'} trend 
                    over the next {predictionTimeframe} {predictionTimeframe === 1 ? 'year' : 'years'}.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Current Price</h4>
                      <p className="text-lg font-bold">{formatPrice(convertPrice(selectedCoinData?.current_price || 0))}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Predicted Price ({predictionTimeframe} {predictionTimeframe === 1 ? 'year' : 'years'})</h4>
                      <p className="text-lg font-bold text-yellow-400">
                        {formatPrice(convertPrice(predictiveData[predictiveData.length - 1]?.price || 0))}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Prediction Methodology */}
          <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4">Prediction Methodology</h2>
            <p className="text-gray-300 mb-4">
              Our AI-powered price predictions use a combination of advanced algorithms and historical data analysis:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-yellow-400" />
                  Linear Regression
                </h3>
                <p className="text-sm text-gray-300">
                  Identifies long-term trends by finding the best-fitting straight line through historical price data.
                </p>
              </div>
              
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  Exponential Smoothing
                </h3>
                <p className="text-sm text-gray-300">
                  Applies more weight to recent observations to capture short-term market movements and volatility.
                </p>
              </div>
              
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-yellow-400" />
                  Hybrid Model Approach
                </h3>
                <p className="text-sm text-gray-300">
                  Combines multiple prediction models with adaptive weighting to improve accuracy across different timeframes.
                </p>
              </div>
              
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  Volatility Adjustment
                </h3>
                <p className="text-sm text-gray-300">
                  Incorporates market volatility factors to account for the unpredictable nature of cryptocurrency markets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictiveAnalysis;