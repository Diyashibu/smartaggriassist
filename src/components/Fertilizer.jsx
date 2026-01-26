import { useState } from "react";
import "./Fertilizer.css";

const fertilizerMap = {
  rice: "Urea + DAP",
  wheat: "Urea + Potash",
  maize: "NPK (20:20:0)",
  cotton: "DAP + Potassium",
  sugarcane: "Urea + SSP",
  potato: "NPK (12:32:16)",
};

const Fertilizer = () => {
  const [crop, setCrop] = useState("");
  const [result, setResult] = useState("");

  const handleCheck = () => {
    const key = crop.toLowerCase().trim();
    if (fertilizerMap[key]) {
      setResult(fertilizerMap[key]);
    } else {
      setResult("No fertilizer data available for this crop.");
    }
  };

  return (
    <div className="fertilizer-page">
      <div className="fertilizer-card">
        <h1>🌱 Fertilizer Recommendation</h1>
        <p className="subtitle">
          Enter the crop name to get recommended fertilizer
        </p>

        <input
          type="text"
          placeholder="e.g. Rice, Wheat, Cotton"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
        />

        <button onClick={handleCheck}>Get Fertilizer</button>

        {result && (
          <div className="result-box">
            <strong>Recommended Fertilizer:</strong>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fertilizer;
