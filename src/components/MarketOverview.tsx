import React from "react";
import StockCard from "./StockCard";

function MarketOverview() {
  const stocks = [
    { symbol: "GME", company: "GameStop", price: 180.75, volume: "15M", sentiment: 85, hype: 90, trend: "+10%" },
    { symbol: "AMC", company: "AMC Entertainment", price: 50.12, volume: "8M", sentiment: 75, hype: 80, trend: "-5%" },
    { symbol: "TSLA", company: "Tesla", price: 700.5, volume: "10M", sentiment: 95, hype: 98, trend: "+15%" },
  ];

  return (
    <section>
      <h2>Market Overview</h2>
      <div className="stock-list">
        {stocks.map((stock) => (
          <StockCard key={stock.symbol} {...stock} />
        ))}
      </div>
    </section>
  );
}

export default MarketOverview;