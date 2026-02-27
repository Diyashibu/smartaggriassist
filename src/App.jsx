import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Fertilizer from "./components/Fertilizer";
import CropRecommendation from "./components/CropRecommendation";
import LeafDiseasePrediction from "./components/LeafDiseasePrediction";
import MarketAnalysis from "./components/MarketAnalysis";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/fertilizer" element={<Fertilizer />} />
      <Route path="/CropRecommendation" element={<CropRecommendation />} />
      <Route path="/LeafDiseasePrediction" element={<LeafDiseasePrediction />} />
      <Route path="/MarketAnalysis" element={<MarketAnalysis />} />
    </Routes>
  );
}

export default App;
