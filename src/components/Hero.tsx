import React from "react";
import { Rocket } from "lucide-react";

function Hero() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
      <div className="relative container mx-auto px-4 text-center">
        <Rocket className="w-16 h-16 mx-auto mb-8 text-yellow-400 animate-bounce" />
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-pink-500 text-transparent bg-clip-text">
          We don't time the market, we ride the crypto wave!
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
          Turning blockchain into wealth, trends into treasures, and crypto into pure financial magic with AI-powered insights!
        </p>
        <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold rounded-xl 
                         transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50">
          Less Goo!!
        </button>
      </div>
    </section>
  );
}

export default Hero;