import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import "./MarketAnalysis.css";

function MarketAnalysis() {
  const [availableCrops, setAvailableCrops] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [results, setResults] = useState([]);

  const [market, setMarket] = useState("Kolar");
  const [landSize, setLandSize] = useState(1);

  // Fetch crops from backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/available-crops")
      .then(res => res.json())
      .then(data => setAvailableCrops(data.crops || []));
  }, []);

  const fetchAnalysis = async () => {
    const response = await fetch("http://127.0.0.1:8000/market-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        crops: selectedCrops,
        market: market,
        land_size: landSize
      })
    });

    const data = await response.json();
    setResults(data.comparison || []);
  };

  return (
    <div className="market-container">
      <h2>Market Analysis</h2>

      {/* Market selector */}
      <div className="input-group">
        <label>Market:</label>
        <select value={market} onChange={e => setMarket(e.target.value)}>
          <option value="Kolar">Kolar</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Mysore">Mysore</option>
        </select>
      </div>

      {/* Land size */}
      <div className="input-group">
        <label>Land Size (acres):</label>
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={landSize}
          onChange={e => setLandSize(Number(e.target.value))}
        />
      </div>

      {/* Crop selection */}
      <h4>Select crops (max 4)</h4>
      <div className="crop-list">
        {availableCrops.map(crop => (
          <label key={crop}>
            <input
              type="checkbox"
              checked={selectedCrops.includes(crop)}
              onChange={(e) => {
                if (e.target.checked) {
                  if (selectedCrops.length < 4) {
                    setSelectedCrops([...selectedCrops, crop]);
                  }
                } else {
                  setSelectedCrops(selectedCrops.filter(c => c !== crop));
                }
              }}
            />
            {crop}
          </label>
        ))}
      </div>

      <button
        onClick={fetchAnalysis}
        disabled={selectedCrops.length === 0}
      >
        Analyze Market
      </button>

      {/* Charts */}
      {results.length > 0 && (
        <Line
          data={{
            labels: ["T-3", "T-2", "T-1", "Future"],
            datasets: results.map(r => ({
              label: r.crop,
              data: r.price_trend
            }))
          }}
        />
      )}

      {results.length > 0 && (
        <Bar
          data={{
            labels: results.map(r => r.crop),
            datasets: [{
              label: "Market Score",
              data: results.map(r => r.market_score)
            }]
          }}
        />
      )}

      {/* Cards */}
      {results.map(item => (
        <div className="result-card" key={item.crop}>
          <h3>{item.crop}</h3>
          <p>Market Score: {item.market_score}</p>
          <p>Demand: {item.demand}</p>
          <p>Supply: {item.supply}</p>
          <p>Volatility: {item.volatility}</p>
          <p>
            Profit Range: ₹{Math.round(item.profit_range[0])} – ₹
            {Math.round(item.profit_range[1])}
          </p>

          {item.explanation && (
            <>
              <strong>Why this crop?</strong>
              <ul>
                {item.explanation.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default MarketAnalysis;
