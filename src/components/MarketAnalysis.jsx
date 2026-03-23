import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import "./MarketAnalysis.css";

const chartColors = ["#4caf68", "#36a2eb", "#ffa726", "#ef5350"];

function MarketAnalysis() {
  const [availableCrops, setAvailableCrops] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState(["", "", "", ""]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/available-crops")
      .then(res => res.json())
      .then(data => setAvailableCrops(data.crops || []));
  }, []);

  const fetchAnalysis = async () => {
    setLoading(true);
    const cropsToSend = selectedCrops.filter(c => c !== "");
    const response = await fetch("http://127.0.0.1:8000/market-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crops: cropsToSend }),
    });
    const data = await response.json();
    setResults(data.comparison || []);
    setLoading(false);
  };

  const bestCrop =
    results.length > 0
      ? results.reduce((a, b) => (a.market_score > b.market_score ? a : b))
      : null;

  const scoreClass = (score) =>
    score > 70 ? "ma-score-high" : score > 40 ? "ma-score-mid" : "ma-score-low";

  const formatProfit = (val) =>
    `${val < 0 ? "Loss" : "Profit"} ₹${Math.abs(Math.round(val)).toLocaleString()}`;

  const chartOptions = (extraY = {}) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#7aab82", font: { size: 12 }, boxWidth: 12 } }
    },
    scales: {
      x: { ticks: { color: "#5e8a66" }, grid: { color: "#1e3327" } },
      y: { ticks: { color: "#5e8a66" }, grid: { color: "#1e3327" }, ...extraY },
    },
  });

  return (
    <div className="ma-root">
      {/* Header */}
      <div className="ma-header">
        <div className="ma-header-icon">🌾</div>
        <div className="ma-header-text">
          <h1>Market Analysis</h1>
          <p>Compare crop profitability, demand trends &amp; market scores</p>
        </div>
      </div>

      {/* Crop Selectors */}
      <div className="ma-section-label">Select up to 4 crops</div>
      <div className="ma-crop-grid">
        {selectedCrops.map((crop, index) => (
          <div key={index} className="ma-dropdown-card">
            <label>Crop {index + 1}</label>
            <select
              value={crop}
              onChange={(e) => {
                const updated = [...selectedCrops];
                updated[index] = e.target.value;
                setSelectedCrops(updated);
              }}
            >
              <option value="">— Select —</option>
              {availableCrops
                .filter(c => !selectedCrops.includes(c) || selectedCrops[index] === c)
                .map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
            </select>
          </div>
        ))}
      </div>

      {/* Analyze Button */}
      <button
        className="ma-btn"
        onClick={fetchAnalysis}
        disabled={selectedCrops.filter(c => c !== "").length === 0 || loading}
      >
        {loading ? (
          <><div className="ma-btn-spinner" /> Analyzing...</>
        ) : (
          <><span>📊</span> Analyze Market</>
        )}
      </button>

      {/* Recommended Banner */}
      {bestCrop && (
        <div className="ma-recommended">
          <div className="ma-recommended-emoji">🌱</div>
          <div className="ma-recommended-text">
            <small>Recommended Crop</small>
            <strong>{bestCrop.crop}</strong>
          </div>
        </div>
      )}

      {/* Charts */}
      {results.length > 0 && (
        <div className="ma-charts">
          <div className="ma-chart-card">
            <div className="ma-chart-title">Price Trend</div>
            <div style={{ height: "380px" }}>
              <Line
                data={{
                  labels: ["T-3", "T-2", "T-1", "Future"],
                  datasets: results.map((r, i) => ({
                    label: r.crop,
                    data: r.price_trend,
                    borderColor: chartColors[i],
                    backgroundColor: "transparent",
                    tension: 0,
                    pointBackgroundColor: chartColors[i],
                    pointRadius: 4,
                    borderWidth: 2,
                  })),
                }}
                options={chartOptions()}
              />
            </div>
          </div>
          <div className="ma-chart-card">
            <div className="ma-chart-title">Market Score Comparison</div>
            <div style={{ height: "380px" }}>
              <Bar
                data={{
                  labels: results.map(r => r.crop),
                  datasets: [{
                    label: "Market Score",
                    data: results.map(r => r.market_score),
                    backgroundColor: chartColors.slice(0, results.length),
                    borderRadius: 0,
                    borderSkipped: false,
                  }],
                }}
                options={chartOptions({ max: 100 })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Result Cards */}
      {results.length > 0 && (
        <>
          <div className="ma-section-label" style={{ marginBottom: 16 }}>Crop Breakdown</div>
          <div className="ma-results-grid">
            {results.map((item, idx) => (
              <div
                className="ma-result-card"
                key={item.crop}
                style={{ animationDelay: `${idx * 0.07}s` }}
              >
                <h3>
                  <span className="ma-dot" style={{ background: chartColors[idx] }} />
                  {item.crop}
                </h3>

                <div className={`ma-score-badge ${scoreClass(item.market_score)}`}>
                  ● Market Score: {item.market_score}
                </div>

                <div>
                  {[
                    ["Demand", item.demand],
                    ["Supply", item.supply],
                    ["Volatility", item.volatility],
                  ].map(([label, value]) => (
                    <div className="ma-stat-row" key={label}>
                      <span className="ma-stat-label">{label}</span>
                      <span className="ma-stat-value">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="ma-profit-row">
                  <div className="ma-profit-label">Profit Range</div>
                  <div className="ma-profit-value">
                    {formatProfit(item.profit_range[0])} &ndash; {formatProfit(item.profit_range[1])}
                  </div>
                </div>

                {item.explanation && (
                  <div className="ma-why">
                    <div className="ma-why-label">Why this crop?</div>
                    <ul>
                      {item.explanation.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MarketAnalysis;