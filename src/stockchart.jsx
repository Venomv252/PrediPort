
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const NIFTY_STOCKS = [
  { name: "Reliance", symbol: "RELIANCE.BSE" },
  { name: "TCS", symbol: "TCS.BSE" },
  { name: "Infosys", symbol: "INFY.BSE" },
  { name: "HDFC Bank", symbol: "HDFCBANK.BSE" },
  { name: "ICICI Bank", symbol: "ICICIBANK.BSE" }
];

const API_KEY = "b54aa02658484be29c86bf8e5efe0cf8";

const StockChart = () => {
  const [selectedStock, setSelectedStock] = useState(NIFTY_STOCKS[0].symbol);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      const url = `https://api.twelvedata.com/time_series?symbol=${selectedStock}&interval=1h&outputsize=24&apikey=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.values) {
        const labels = data.values.map(entry => entry.datetime).reverse();
        const prices = data.values.map(entry => parseFloat(entry.close)).reverse();

        setChartData({
          labels: labels,
          datasets: [{
            label: selectedStock,
            data: prices,
            borderColor: 'blue',
            tension: 0.2
          }]
        });
      }
    };

    fetchStockData();
  }, [selectedStock]);

  return (
    <div>
      <h2>Nifty 50 Stock Graph</h2>
      <select value={selectedStock} onChange={(e) => setSelectedStock(e.target.value)}>
        {NIFTY_STOCKS.map(stock => (
          <option key={stock.symbol} value={stock.symbol}>
            {stock.name}
          </option>
        ))}
      </select>

      {chartData && (
        <div style={{ height: '400px' }}>
          <Line data={chartData} options={{ responsive: true }} />
        </div>
      )}
    </div>
  );
};

export default StockChart;
