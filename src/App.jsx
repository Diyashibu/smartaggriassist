import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CropRecommendation from "./components/CropRecommendation";
import Fertilizer from "./components/Fertilizer";
import LeafDiseasePredict from "./components/LeafDiseasePrediction";
import MarketAnalysis from "./components/MarketAnalysis";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/crop-recommendation" element={<CropRecommendation />} />
      <Route path="/fertilizer" element={<Fertilizer />} />
      <Route path="/leaf-disease" element={<LeafDiseasePredict />} />
      <Route path="/market-analysis" element={<MarketAnalysis />} />
    </Routes>
  );
}

export default App;