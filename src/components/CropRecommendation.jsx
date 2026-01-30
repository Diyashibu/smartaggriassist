import { useState } from 'react';
import { Sprout } from 'lucide-react';
import "./CropRecommendation.css";

function CropRecommendation({ onBack }) {
  const [formData, setFormData] = useState({
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    rainfall: '',
    humidity: '',
    temperature: '',
  });

  const [suggestions, setSuggestions] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ph = parseFloat(formData.ph);
    const nitrogen = parseFloat(formData.nitrogen);
    const phosphorus = parseFloat(formData.phosphorus);
    const potassium = parseFloat(formData.potassium);
    const rainfall = parseFloat(formData.rainfall);
    const humidity = parseFloat(formData.humidity);
    const temperature = parseFloat(formData.temperature);

    const crops = getCropRecommendations(
      ph,
      nitrogen,
      phosphorus,
      potassium,
      rainfall,
      humidity,
      temperature
    );

    setSuggestions(crops);
    setSubmitted(true);
  };

  const getCropRecommendations = (
    ph,
    n,
    p,
    k,
    rainfall,
    humidity,
    temp
  ) => {
    const recommendations = [];

    if (ph >= 5.5 && ph <= 7.5 && n > 40 && rainfall > 100 && humidity > 70 && temp >= 20 && temp <= 30) {
      recommendations.push({
        name: 'Rice',
        confidence: 'High',
        description: 'Ideal conditions for rice cultivation with abundant water and suitable climate',
      });
    }

    if (ph >= 6.0 && ph <= 7.5 && n > 50 && p > 20 && temp >= 10 && temp <= 25 && rainfall > 30 && rainfall < 100) {
      recommendations.push({
        name: 'Wheat',
        confidence: 'High',
        description: 'Excellent soil pH and nutrient levels for wheat farming',
      });
    }

    if (ph >= 5.5 && ph <= 8.0 && n > 80 && p > 25 && k > 20 && temp >= 15 && temp <= 30 && rainfall > 50 && rainfall < 150) {
      recommendations.push({
        name: 'Maize',
        confidence: 'High',
        description: 'Strong nitrogen levels and suitable temperature for maize growth',
      });
    }

    if (ph >= 6.0 && ph <= 8.0 && n > 200 && temp >= 21 && temp <= 27 && humidity > 70 && rainfall > 150) {
      recommendations.push({
        name: 'Sugarcane',
        confidence: 'High',
        description: 'High nitrogen content and warm climate ideal for sugarcane',
      });
    }

    if (ph >= 5.8 && ph <= 8.0 && n > 100 && p > 45 && k > 40 && temp >= 18 && temp <= 30 && humidity < 65 && rainfall > 50 && rainfall < 100) {
      recommendations.push({
        name: 'Cotton',
        confidence: 'High',
        description: 'Balanced nutrients and warm, drier conditions suitable for cotton',
      });
    }

    if (ph >= 5.0 && ph <= 6.5 && p > 20 && k > 200 && temp >= 15 && temp <= 20 && humidity >= 70) {
      recommendations.push({
        name: 'Potato',
        confidence: 'High',
        description: 'Slightly acidic soil and cool temperature ideal for potato farming',
      });
    }

    if (ph >= 6.0 && ph <= 7.0 && n > 0 && p > 20 && k > 20 && temp >= 20 && temp <= 30 && rainfall > 50) {
      recommendations.push({
        name: 'Soybean',
        confidence: 'Medium',
        description: 'Good soil conditions for legume cultivation',
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        name: 'Vegetables',
        confidence: 'Medium',
        description: 'Consider growing seasonal vegetables and adjust nutrients accordingly',
      });
    }

    return recommendations;
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
          Enter your soil and environmental parameters to get personalized crop recommendations
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
                placeholder="6.5"
                value={formData.ph}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Temperature (°C)</label>
              <input
                name="temperature"
                type="number"
                step="0.1"
                placeholder="25"
                value={formData.temperature}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Humidity (%)</label>
              <input
                name="humidity"
                type="number"
                step="0.1"
                placeholder="75"
                value={formData.humidity}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Rainfall (mm)</label>
              <input
                name="rainfall"
                type="number"
                step="0.1"
                placeholder="200"
                value={formData.rainfall}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="nutrients-section">
            <h3 className="nutrients-title">Soil Nutrients (kg/ha)</h3>
            <div className="npk-grid">
              <div className="form-group">
                <label>
                  Nitrogen <span className="nutrient-n">(N)</span>
                </label>
                <input
                  name="nitrogen"
                  type="number"
                  step="0.1"
                  placeholder="90"
                  value={formData.nitrogen}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>
                  Phosphorus <span className="nutrient-p">(P)</span>
                </label>
                <input
                  name="phosphorus"
                  type="number"
                  step="0.1"
                  placeholder="40"
                  value={formData.phosphorus}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>
                  Potassium <span className="nutrient-k">(K)</span>
                </label>
                <input
                  name="potassium"
                  type="number"
                  step="0.1"
                  placeholder="50"
                  value={formData.potassium}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn">Get Recommendations</button>
        </form>
      </div>

      <div className="info-card">
        <div className="info-card-icon">
          <Sprout />
        </div>
        <p className="info-card-text">
          Fill in your soil and environmental parameters to get crop recommendations
        </p>
      </div>
    </div>

    {submitted && (
      <div className="result-card">
        <h3>Recommendations</h3>
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
