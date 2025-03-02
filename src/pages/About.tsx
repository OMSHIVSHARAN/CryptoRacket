import React from "react";
import { Rocket, Sparkles, Brain, Target } from "lucide-react";

function About() {
  const features = [
    {
      icon: Rocket,
      title: "Crypto-Powered Analysis",
      description: "We combine the power of crypto currency with cutting-edge market analysis to predict the next moonshot."
    },
    {
      icon: Sparkles,
      title: "Community-Driven",
      description: "Join thousands of fellow crypto enthusiasts in discussing and tracking the latest market trends."
    },
    {
      icon: Brain,
      title: "AI-Enhanced",
      description: "Our advanced algorithms analyze social media sentiment and market data to generate predictions."
    },
    {
      icon: Target,
      title: "Precision Tracking",
      description: "Track crypto coins and cryptocurrencies with real-time updates and detailed analytics."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Crypto Coin Predictor</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          We're a community of crypto-loving traders who believe that the future of
          finance is powered by internet culture and collective wisdom. 🚀
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm
                                    transform transition-all duration-300 hover:-translate-y-2">
            <Icon className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-300">{description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-yellow-400/10 to-pink-500/10 rounded-xl p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-lg text-gray-300 mb-6">
          To democratize financial analysis by combining the power of crypto currency,
          community insights, and advanced technology. We believe that the best
          investment decisions are made when you combine data-driven analysis
          with the collective wisdom of the internet.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="bg-yellow-400/20 rounded-lg px-4 py-2">
            #ToTheMoon 🚀
          </div>
          <div className="bg-pink-500/20 rounded-lg px-4 py-2">
            #DiamondHands 💎
          </div>
          <div className="bg-purple-500/20 rounded-lg px-4 py-2">
            #HODL 🌕
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;