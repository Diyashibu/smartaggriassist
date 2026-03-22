import { useState } from "react";
import { Sprout } from "lucide-react";
import "./CropRecommendation.css";

function CropRecommendation({ onBack }) {
  const [formData, setFormData] = useState({
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    rainfall: "",
    humidity: "",
    temperature: "",
  });

  const [suggestions, setSuggestions] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            N: Number(formData.nitrogen),
            P: Number(formData.phosphorus),
            K: Number(formData.potassium),
            temperature: Number(formData.temperature),
            humidity: Number(formData.humidity),
            ph: Number(formData.ph),
            rainfall: Number(formData.rainfall),
          })
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction from model");
      }

      const data = await response.json();

      setSuggestions(
  data.crop.map((c) => ({
    name: c.crop,
    confidence: `${c.confidence}%`,
    description:
      "This recommendation is generated using a trained ML model.",
  }))
);

      setSubmitted(true);
    } catch (err) {
      setError("Unable to connect to prediction server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crop-container">
      <div className="crop-header">
        <div className="crop-icon-box">
          <Sprout />
        </div>
        <div className="crop-header-content">
          <h1 className="crop-title">Crop Recommendation System</h1>
          <p className="crop-subtitle">
            AI-based crop prediction using trained ML model
          </p>
        </div>
      </div>

      <div className="main-content">
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>pH Level</label>
                <input
                  name="ph"
                  type="number"
                  step="0.1"
                  value={formData.ph}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Temperature (°C)</label>
                <input
                  name="temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Humidity (%)</label>
                <input
                  name="humidity"
                  type="number"
                  step="0.1"
                  value={formData.humidity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Rainfall (mm)</label>
                <input
                  name="rainfall"
                  type="number"
                  step="0.1"
                  value={formData.rainfall}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="nutrients-section">
              <h3 className="nutrients-title">Soil Nutrients (kg/ha)</h3>
              <div className="npk-grid">
                <div className="form-group">
                  <label>Nitrogen (N)</label>
                  <input
                    name="nitrogen"
                    type="number"
                    step="0.1"
                    value={formData.nitrogen}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phosphorus (P)</label>
                  <input
                    name="phosphorus"
                    type="number"
                    step="0.1"
                    value={formData.phosphorus}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Potassium (K)</label>
                  <input
                    name="potassium"
                    type="number"
                    step="0.1"
                    value={formData.potassium}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Predicting..." : "Get Recommendation"}
            </button>
          </form>
        </div>

        <div className="info-card">
          <div className="info-card-icon">
            <Sprout />
          </div>
          <p className="info-card-text">
            Prediction is generated using a machine learning model trained on real agricultural data
          </p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {submitted && suggestions && (
        <div className="result-card">
          <h3>Recommended Crop</h3>
          {suggestions.map((crop, i) => (
            <div key={i} className="crop-item">
              <strong>{crop.name}</strong> – {crop.confidence}
              <p>{crop.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CropRecommendation;