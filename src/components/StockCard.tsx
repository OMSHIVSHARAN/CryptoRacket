import React from "react";
import "./../index.css";

interface StockCardProps {
  symbol: string;
  company: string;
  price: number;
  volume: string;
  sentiment: number;
  hype: number;
  trend: string;
}

const StockCard: React.FC<StockCardProps> = ({
  symbol,
  company,
  price,
  volume,
  sentiment,
  hype,
  trend,
}) => {
  return (
    <div className={`stock-card ${trend.startsWith("-") ? "negative" : "positive"}`}>
      <h2>{symbol}</h2>
      <h3>{company}</h3>
      <p className="price">${price.toFixed(2)}</p>
      <p>Volume: {volume}</p>
      <div className="progress-container">
        <div className="progress-label">Sentiment</div>
        <div className="progress-bar" style={{ width: `${sentiment}%` }}></div>
      </div>
      <div className="progress-container">
        <div className="progress-label">Hype</div>
        <div className="progress-bar hype" style={{ width: `${hype}%` }}></div>
      </div>
      <p className="trend">{trend}</p>
    </div>
  );
};

export default StockCard;