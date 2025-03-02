import React from "react";
import { Check } from "lucide-react";

function Plans() {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "Basic trend analysis",
        "Community access",
        "Daily market updates",
        "Basic portfolio tracking"
      ],
      isPremium: false
    },
    {
      name: "Premium",
      price: "$49/month",
      features: [
        "Advanced AI predictions",
        "Real-time alerts",
        "Expert community access",
        "Advanced portfolio analytics",
        "Priority support",
        "Custom watchlists"
      ],
      isPremium: true
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 to-pink-500 text-transparent bg-clip-text">
          Choose Your Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} 
                 className={`p-8 rounded-xl backdrop-blur-sm transform transition-all duration-300 hover:-translate-y-2
                           ${plan.isPremium 
                             ? 'bg-gradient-to-br from-yellow-400/20 to-pink-500/20 border border-yellow-400/20' 
                             : 'bg-gray-800/50'}`}>
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold mb-6 text-yellow-400">{plan.price}</p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300
                              ${plan.isPremium 
                                ? 'bg-gradient-to-r from-yellow-400 to-pink-500 hover:opacity-90' 
                                : 'bg-gray-700 hover:bg-gray-600'}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Plans;