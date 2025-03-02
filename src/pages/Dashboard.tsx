import React from "react";
import MarketOverview from "../components/MarketOverview";
import HypeTracker from "../components/HypeTracker";

function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Moonshot 🚀</h1>
        <p className="text-xl text-gray-300">Ready to ride the meme wave? 🌊</p>
      </div>
      <MarketOverview />
      <HypeTracker />
    </div>
  );
}

export default Dashboard;