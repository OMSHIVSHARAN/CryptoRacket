import React from "react";
import { MessageSquare, ThumbsUp, Share2, Users } from "lucide-react";

function Community() {
  const discussions = [
    {
      id: 1,
      author: "Omzilla",
      avatar: "https://i.pinimg.com/736x/ec/54/b3/ec54b374821a6ba05058db7727672ac4.jpg",
      title: "GME Technical Analysis: Where Shorts Cry and Apes Fly",
      content: "Just analyzed the latest short interest and damn, it's hotter than a crypto coin in a Reddit thread!! 🔥",
      likes: 15099,
      comments: 2329,
      shares: 909,
      tags: ["GME", "Kneesurgery", "7atenine"],
    },
    {
      id: 2,
      author: "CryptoAshy Boi",
      avatar: "https://i.pinimg.com/736x/09/07/32/090732be5de50c0e727e2b6157f30fee.jpg",
      title: "DOGE to $1? Rizzing my way through the market like it's a TikTok dance. LFG!",
      content: "The crypto coins are powerful—analysis level: giga-brain. Much hype, very gainz 🐕",
      likes: 1000,
      comments: 200,
      shares: 90,
      tags: ["DOGE", "Crypto", "RizzmeUp"],
    },
    {
      id: 3,
      author: "MoonMasterAjey",
      avatar: "https://i.pinimg.com/736x/f8/e5/f7/f8e5f7451ac1fbab8a18269530f7c075.jpg",
      title: "I swear, this stock's got more crypto currency than my Reddit feed at 3 AM. LFG to the moon!",
      content: "Found this hidden gem that's ready to explode—like my brain after 12 hours of researching crypto coins on Reddit.! 🚀",
      likes: 8789,
      comments: 323,
      shares: 196,
      tags: ["Research", "CryptoCoins", "MOON"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Community Hub 🌟</h1>
        <p className="text-xl text-gray-300">Join the discussion with fellow crypto enthusiasts!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {discussions.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm
                       transform transition-all duration-300 hover:bg-gray-800/40"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-bold text-lg">{post.author}</h3>
                  <p className="text-gray-400 text-sm">2 hours ago</p>
                </div>
              </div>
              
              <h2 className="text-xl font-bold mb-3">{post.title}</h2>
              <p className="text-gray-300 mb-4">{post.content}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-6 text-gray-400">
                <button className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>{post.shares}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4">Community Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Members</span>
                <span className="text-yellow-400">42,069</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Online</span>
                <span className="text-emerald-400">1,337</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Posts Today</span>
                <span className="text-purple-400">420</span>
              </div>
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4">Top Contributors</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-yellow-400" />
                <span>DiamondHands_Dave</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <span>CryptoKitten</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-yellow-700" />
                <span>MoonMaster</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;