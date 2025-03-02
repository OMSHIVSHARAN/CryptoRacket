import React from "react";
import { TrendingUp, Brain, Users, BarChart as ChartBar } from "lucide-react";

function Features() {
  const features = [
    {
      icon: TrendingUp,
      title: "Real-time Analysis",
      description: "Track crypto movements and social sentiment in real-time"
    },
    {
      icon: Brain,
      title: "AI Predictions",
      description: "Advanced algorithms predict potential moonshots before they happen"
    },
    {
      icon: Users,
      title: "Community Insights",
      description: "Leverage the collective wisdom of experienced crypto traders"
    },
    {
      icon: ChartBar,
      title: "Performance Metrics",
      description: "Detailed analytics and performance tracking for your portfolio"
    }
  ];

  return (
    <section className="py-20 bg-gray-800/50" id="features">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 to-pink-500 text-transparent bg-clip-text">
          How Our Tool Enhances Your Trading
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} 
                   className="p-6 bg-gray-800 rounded-xl backdrop-blur-sm
                            transform transition-all duration-300 hover:-translate-y-2">
                <Icon className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;