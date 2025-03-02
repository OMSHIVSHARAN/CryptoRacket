import React from "react";
import { Trophy, Rocket, Star, TrendingUp } from "lucide-react";

function Leaderboard() {
  const traders = [
    {
      rank: 1,
      name: "DiamondHands_Dave",
      avatar: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=100&h=100",
      gains: "+1,420%",
      accuracy: "89%",
      streak: 42,
    },
    {
      rank: 2,
      name: "MoonMaster",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100",
      gains: "+890%",
      accuracy: "82%",
      streak: 28,
    },
    {
      rank: 3,
      name: "CryptoKitten",
      avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=100&h=100",
      gains: "+750%",
      accuracy: "78%",
      streak: 21,
    },
  ];

  const achievements = [
    {
      icon: Trophy,
      title: "Diamond Hands",
      description: "Held through a 50% dip",
    },
    {
      icon: Rocket,
      title: "Moon Walker",
      description: "First 100% gain",
    },
    {
      icon: Star,
      title: "Crypto Lord",
      description: "Created 10 viral predictions",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Top Crypto Traders 🏆</h1>
        <p className="text-xl text-gray-300">The finest diamond hands in the game!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2 bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6">This Month's Leaders</h2>
          <div className="space-y-4">
            {traders.map((trader) => (
              <div
                key={trader.name}
                className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg
                         transform transition-all duration-300 hover:bg-gray-700/40"
              >
                <div className="text-2xl font-bold text-yellow-400 w-8">
                  #{trader.rank}
                </div>
                <img
                  src={trader.avatar}
                  alt={trader.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-grow">
                  <h3 className="font-bold">{trader.name}</h3>
                  <div className="flex gap-4 text-sm text-gray-300">
                    <span>Gains: {trader.gains}</span>
                    <span>Accuracy: {trader.accuracy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                  <span>{trader.streak} streak</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-6">
          <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-6">Latest Achievements</h2>
            <div className="space-y-4">
              {achievements.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg"
                >
                  <Icon className="w-8 h-8 text-yellow-400" />
                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="text-sm text-gray-300">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-400/10 to-pink-500/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4">Your Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Global Rank</span>
                <span className="text-yellow-400">#420</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Monthly Gains</span>
                <span className="text-emerald-400">+69%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Achievements</span>
                <span className="text-purple-400">7/42</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;