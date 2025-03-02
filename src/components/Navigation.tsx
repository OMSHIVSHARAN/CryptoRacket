import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  TrendingUp,
  Users,
  GraduationCap,
  Trophy,
  Info,
  BarChart,
  Brain,
} from 'lucide-react';

function Navigation() {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/trending', icon: TrendingUp, label: 'Trending' },
    { to: '/top-crypto', icon: BarChart, label: 'Top 15' },
    { to: '/predictive', icon: Brain, label: 'Predictive Analysis' },
    { to: '/community', icon: Users, label: 'Community' },
    { to: '/education', icon: GraduationCap, label: 'Education' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { to: '/about', icon: Info, label: 'About' },
  ];

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm p-4 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
              transform hover:scale-105
              ${
                isActive
                  ? 'bg-gradient-to-r from-yellow-400 to-pink-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;