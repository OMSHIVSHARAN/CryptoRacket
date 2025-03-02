import React from "react";

function HypeTracker() {
  const trending = [
    { 
      name: "Dogecoin", 
      symbol: "DOGE", 
      img: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=200&h=200" 
    },
    { 
      name: "Shiba Inu", 
      symbol: "SHIB", 
      img: "https://images.unsplash.com/photo-1647639844531-c14f4e395975?auto=format&fit=crop&q=80&w=200&h=200" 
    },
    { 
      name: "Elon Musk (TSLA)", 
      symbol: "TSLA", 
      img: "https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?auto=format&fit=crop&q=80&w=200&h=200" 
    },
  ];

  return (
    <section>
      <h2>Hype Tracker</h2>
      <div className="hype-cards">
        {trending.map((item) => (
          <div key={item.symbol} className="hype-card">
            <img src={item.img} alt={item.name} />
            <p>{item.name}</p>
            <p className="text-white/60">{item.symbol}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HypeTracker;