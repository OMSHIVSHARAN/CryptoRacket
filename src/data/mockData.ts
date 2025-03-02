import { Stock, User, Badge } from '../types';

export const mockStocks: Stock[] = [
  {
    symbol: 'GME',
    name: 'GameStop Corp.',
    price: 180.75,
    change: 12.5,
    volume: 15000000,
    sentiment: 0.85,
    hypeScore: 95,
  },
  {
    symbol: 'AMC',
    name: 'AMC Entertainment',
    price: 45.23,
    change: -2.3,
    volume: 8500000,
    sentiment: 0.72,
    hypeScore: 88,
  },
  {
    symbol: 'BB',
    name: 'BlackBerry Limited',
    price: 12.44,
    change: 1.2,
    volume: 5200000,
    sentiment: 0.65,
    hypeScore: 75,
  },
];

export const mockUser: User = {
  id: '1',
  name: 'Diamond Hands Dave',
  avatar: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=100&h=100',
  watchlist: ['GME', 'AMC'],
  badges: [
    {
      id: '1',
      name: 'Diamond Hands',
      icon: '💎',
      description: 'Held through a 50% dip',
      earnedAt: '2024-03-15',
    },
    {
      id: '2',
      name: 'Moon Walker',
      icon: '🚀',
      description: 'First 100% gain',
      earnedAt: '2024-03-10',
    },
  ],
  stats: {
    totalGains: 42.5,
    predictionsAccuracy: 78,
    watchedStocks: 5,
    rank: 420,
  },
};