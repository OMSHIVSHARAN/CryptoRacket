export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  sentiment: number;
  hypeScore: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  watchlist: string[];
  badges: Badge[];
  stats: UserStats;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export interface UserStats {
  totalGains: number;
  predictionsAccuracy: number;
  watchedStocks: number;
  rank: number;
}