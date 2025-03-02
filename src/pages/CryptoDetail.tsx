import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  FileText, 
  Github, 
  Twitter, 
  DollarSign, 
  BarChart3, 
  Clock, 
  Activity,
  AlertTriangle
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
import useHistoricalData from '../hooks/useHistoricalData';
import usePredictiveData from '../hooks/usePredictiveData';
import { useCurrency } from '../contexts/CurrencyContext';
import CustomTooltip from '../components/CustomTooltip';
import useCryptoData, { CryptoData } from '../hooks/useCryptoData';

function CryptoDetail() {
  const { id } = useParams<{ id: string }>();
  const [coinData, setCoinData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeframe, setTimeframe] = useState<number>(365); // Default to 1 year
  const { cryptoData } = useCryptoData();
  const { convertPrice, formatPrice } = useCurrency();
  
  const { historicalData, loading: histLoading } = useHistoricalData(id || '', timeframe);
  const { predictiveData, loading: predLoading } = usePredictiveData(historicalData, 5);

  useEffect(() => {
    const fetchCoinData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // First check if we already have this coin in our cryptoData
        const existingCoin = cryptoData.find(coin => coin.id === id);
        
        if (existingCoin) {
          // If we have basic data, try to fetch more detailed data
          try {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true`);
            
            if (response.ok) {
              const detailedData = await response.json();
              setCoinData({
                ...detailedData,
                // Ensure we have the market data from our existing data if the API doesn't return it
                market_data: {
                  ...detailedData.market_data,
                  current_price: detailedData.market_data.current_price || { usd: existingCoin.current_price },
                  price_change_percentage_24h: detailedData.market_data.price_change_percentage_24h || existingCoin.price_change_percentage_24h,
                  market_cap: detailedData.market_data.market_cap || { usd: existingCoin.market_cap },
                  total_volume: detailedData.market_data.total_volume || { usd: existingCoin.total_volume }
                }
              });
            } else {
              // If detailed fetch fails, use our existing data
              setCoinData(createDetailedCoinFromBasic(existingCoin));
            }
          } catch (err) {
            console.error('Error fetching detailed coin data:', err);
            // Use our existing data as fallback
            setCoinData(createDetailedCoinFromBasic(existingCoin));
          }
        } else {
          // If we don't have the coin in our data, try to fetch it directly
          const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true`);
          
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          
          const data = await response.json();
          setCoinData(data);
        }
      } catch (err) {
        console.error('Error fetching coin data:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [id, cryptoData]);

  // Helper function to create a detailed coin object from basic data
  const createDetailedCoinFromBasic = (basicCoin: CryptoData) => {
    return {
      id: basicCoin.id,
      name: basicCoin.name,
      symbol: basicCoin.symbol,
      image: { large: basicCoin.image },
      market_cap_rank: basicCoin.market_cap_rank,
      links: {
        homepage: ['https://www.coingecko.com/en/coins/' + basicCoin.id],
        blockchain_site: ['https://www.coingecko.com/en/coins/' + basicCoin.id],
        repos_url: { github: [] },
        twitter_screen_name: ''
      },
      market_data: {
        current_price: { usd: basicCoin.current_price },
        price_change_percentage_24h: basicCoin.price_change_percentage_24h,
        price_change_percentage_1h_in_currency: { usd: basicCoin.price_change_percentage_1h_in_currency },
        price_change_percentage_7d: basicCoin.price_change_percentage_7d,
        price_change_percentage_30d: basicCoin.price_change_percentage_30d,
        price_change_percentage_1y: basicCoin.price_change_percentage_1y,
        market_cap: { usd: basicCoin.market_cap },
        total_volume: { usd: basicCoin.total_volume },
        circulating_supply: basicCoin.circulating_supply,
        total_supply: basicCoin.total_supply,
        max_supply: basicCoin.max_supply,
        ath: { usd: basicCoin.ath },
        ath_change_percentage: { usd: basicCoin.ath_change_percentage },
        ath_date: { usd: basicCoin.ath_date },
        atl: { usd: basicCoin.atl },
        atl_change_percentage: { usd: basicCoin.atl_change_percentage },
        atl_date: { usd: basicCoin.atl_date }
      },
      description: { en: `${basicCoin.name} (${basicCoin.symbol.toUpperCase()}) is a cryptocurrency with a market cap rank of #${basicCoin.market_cap_rank}.` }
    };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <h1 className="text-4xl font-bold mb-8">Loading Cryptocurrency Data...</h1>
          <div className="h-96 bg-gray-800/50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !coinData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-500">Error Loading Data</h1>
        <p className="text-xl mb-8">
          We couldn't fetch the cryptocurrency data. Please try again later.
        </p>
        <Link 
          to="/top-crypto"
          className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Top Cryptocurrencies
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link 
        to="/top-crypto"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Top Cryptocurrencies
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Coin Overview */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <img src={coinData.image?.large} alt={coinData.name} className="w-16 h-16" />
              <div>
                <h1 className="text-3xl font-bold">{coinData.name}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{coinData.symbol?.toUpperCase()}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    coinData.market_data?.price_change_percentage_24h >= 0
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {coinData.market_data?.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 inline mr-1" />
                    )}
                    {Math.abs(coinData.market_data?.price_change_percentage_24h || 0).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-gray-400 text-sm mb-1">Current Price</div>
                <div className="text-3xl font-bold">{formatPrice(convertPrice(coinData.market_data?.current_price?.usd || 0))}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Market Cap Rank</div>
                <div className="text-3xl font-bold">#{coinData.market_cap_rank || 'N/A'}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Market Cap
                </div>
                <div className="font-medium">{formatPrice(convertPrice(coinData.market_data?.market_cap?.usd || 0))}</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  24h Volume
                </div>
                <div className="font-medium">{formatPrice(convertPrice(coinData.market_data?.total_volume?.usd || 0))}</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Circulating Supply
                </div>
                <div className="font-medium">{coinData.market_data?.circulating_supply?.toLocaleString() || 'N/A'} {coinData.symbol?.toUpperCase()}</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  All-Time High
                </div>
                <div className="font-medium">{formatPrice(convertPrice(coinData.market_data?.ath?.usd || 0))}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Price Changes */}
        <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-4">Price Changes</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">1h</span>
              <span className={`font-medium ${
                (coinData.market_data?.price_change_percentage_1h_in_currency?.usd || 0) >= 0
                  ? 'text-emerald-400'
                  : 'text-red-400'
              }`}>
                {(coinData.market_data?.price_change_percentage_1h_in_currency?.usd || 0) >= 0 ? '+' : ''}
                {(coinData.market_data?.price_change_percentage_1h_in_currency?.usd || 0)?.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">24h</span>
              <span className={`font-medium ${
                (coinData.market_data?.price_change_percentage_24h || 0) >= 0
                  ? 'text-emerald-400'
                  : 'text-red-400'
              }`}>
                {(coinData.market_data?.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                {(coinData.market_data?.price_change_percentage_24h || 0).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">7d</span>
              <span className={`font-medium ${
                (coinData.market_data?.price_change_percentage_7d || 0) >= 0
                  ? 'text-emerald-400'
                  : 'text-red-400'
              }`}>
                {(coinData.market_data?.price_change_percentage_7d || 0) >= 0 ? '+' : ''}
                {(coinData.market_data?.price_change_percentage_7d || 0).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">30d</span>
              <span className={`font-medium ${
                (coinData.market_data?.price_change_percentage_30d || 0) >= 0
                  ? 'text-emerald-400'
                  : 'text-red-400'
              }`}>
                {(coinData.market_data?.price_change_percentage_30d || 0) >= 0 ? '+' : ''}
                {(coinData.market_data?.price_change_percentage_30d || 0).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">1y</span>
              <span className={`font-medium ${
                (coinData.market_data?.price_change_percentage_1y || 0) >= 0
                  ? 'text-emerald-400'
                  : 'text-red-400'
              }`}>
                {(coinData.market_data?.price_change_percentage_1y || 0) >= 0 ? '+' : ''}
                {(coinData.market_data?.price_change_percentage_1y || 0)?.toFixed(2) || 'N/A'}%
              </span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-medium mb-3">Links</h3>
            <div className="grid grid-cols-2 gap-3">
              {coinData.links?.homepage?.[0] && (
                <a 
                  href={coinData.links.homepage[0]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}
              {coinData.links?.blockchain_site?.[0] && (
                <a 
                  href={coinData.links.blockchain_site[0]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Explorer</span>
                </a>
              )}
              {coinData.links?.repos_url?.github?.[0] && (
                <a 
                  href={coinData.links.repos_url.github[0]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {coinData.links?.twitter_screen_name && (
                <a 
                  href={`https://twitter.com/${coinData.links.twitter_screen_name}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Historical Chart */}
      <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">Price History & Predictions</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setTimeframe(30)}
              className={`px-3 py-1 rounded-lg text-sm ${
                timeframe === 30 
                  ? 'bg-yellow-400 text-gray-900 font-medium' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              30D
            </button>
            <button 
              onClick={() => setTimeframe(90)}
              className={`px-3 py-1 rounded-lg text-sm ${
                timeframe === 90 
                  ? 'bg-yellow-400 text-gray-900 font-medium' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              90D
            </button>
            <button 
              onClick={() => setTimeframe(365)}
              className={`px-3 py-1 rounded-lg text-sm ${
                timeframe === 365 
                  ? 'bg-yellow-400 text-gray-900 font-medium' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              1Y
            </button>
            <button 
              onClick={() => setTimeframe(1825)}
              className={`px-3 py-1 rounded-lg text-sm ${
                timeframe === 1825 
                  ? 'bg-yellow-400 text-gray-900 font-medium' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              5Y
            </button>
            <button 
              onClick={() => setTimeframe(3650)}
              className={`px-3 py-1 rounded-lg text-sm ${
                timeframe === 3650 
                  ? 'bg-yellow-400 text-gray-900 font-medium' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              10Y
            </button>
          </div>
        </div>
        
        {histLoading || predLoading ? (
          <div className="h-[500px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-xl">Loading chart data...</p>
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
                    tickFormatter={(value) => {
                      // Show fewer ticks for readability
                      return value;
                    }}
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
                    stroke={(d) => d && d.isProjected ? "#ec4899" : "#fbbf24"}
                    fill={(d) => d && d.isProjected ? "url(#colorPredicted)" : "url(#colorHistorical)"}
                    name="Price"
                    activeDot={{ r: 8 }}
                    dot={false}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-400/10 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-medium">Price Prediction Disclaimer</p>
                <p className="text-sm text-gray-300 mt-1">
                  The price predictions shown are generated using AI/ML models based on historical data patterns. 
                  These projections are for informational purposes only and should not be considered as financial advice. 
                  Cryptocurrency markets are highly volatile and unpredictable.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Description */}
      {coinData.description?.en && (
        <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4">About {coinData.name}</h2>
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: coinData.description.en }}
          />
        </div>
      )}
    </div>
  );
}

export default CryptoDetail;