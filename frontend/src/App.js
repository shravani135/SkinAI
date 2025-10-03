// File: src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import MainOptions from "./components/MainOptions";
import SkinCondition from "./components/SkinCondition";
import SkinTypeAnalysis from "./components/SkinTypeAnalysis";
import AllergyCheck from "./components/AllergyCheck";
import BrandSelection from "./components/BrandSelection";
import Recommendation from "./components/Recommendation";
import SkinCareRoutine from "./components/SkinCareRoutine"; // Matches your file name
import Profile from "./components/Profile";
import bgImage from "./assets/bg.jpg";

function App() {
  const [skinType, setSkinType] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [brand, setBrand] = useState("");
  const [step, setStep] = useState(0); // Current dashboard step

  // Back button logic
  const handleBack = () => {
    switch (step) {
      case 1: setStep(3); break; // From SkinCareRoutine back to MainOptions
      case 2: setStep(0); break; // From SkinTypeAnalysis back to Dashboard
      case 3: setStep(2); break; // From MainOptions back to SkinTypeAnalysis
      case 4: setStep(3); break; // From AllergyCheck back to MainOptions
      case 5: setStep(3); break; // From SkinCondition back to MainOptions
      case 6: setStep(4); break; // From BrandSelection back to AllergyCheck
      case 7: setStep(6); break; // From Recommendation back to BrandSelection
      default: break;
    }
  };

  // Render dashboard based on current step
  const renderDashboardSteps = () => {
    switch (step) {
      case 0:
        return <Dashboard onStart={() => setStep(2)} onBack={handleBack} />;

      case 2:
        return (
          <SkinTypeAnalysis
            onNext={(type) => { setSkinType(type || ""); setStep(3); }}
            onBack={handleBack}
          />
        );

      case 3:
        return (
          <MainOptions
            onBack={handleBack}
            onSelectOption={(option) => {
              if (option === "routine") setStep(1);       // SkinCareRoutine Analysis
              else if (option === "allergy") setStep(4);  // Allergy Check
              else if (option === "condition") setStep(5); // Skin Condition Analysis
            }}
          />
        );

      case 1:
        return (
          <SkinCareRoutine
            onBack={handleBack}
            onNext={() => setStep(6)} // After routine, move to BrandSelection
          />
        );

      case 4:
        return (
          <AllergyCheck
            onBack={handleBack}
            onNext={(selectedAllergies) => { setAllergies(selectedAllergies || []); setStep(6); }}
          />
        );

      case 5:
        return (
          <SkinCondition
            onBack={handleBack}
            onNext={() => setStep(6)}
          />
        );

      case 6:
        return (
          <BrandSelection
            onBack={handleBack}
            onNext={(selectedBrand) => { setBrand(selectedBrand || ""); setStep(7); }}
          />
        );

      case 7:
        return (
          <Recommendation
            skinType={skinType}
            allergies={allergies}
            brand={brand}
            onBack={handleBack}
          />
        );

      default:
        return <Dashboard onStart={() => setStep(2)} onBack={handleBack} />;
    }
  };

  return (
    <Router>
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="w-full max-w-2xl p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
              path="/login"
              element={
                <Login
                  onLoginSuccess={(username) => {
                    console.log("Logged in:", username);
                    window.location.href = "/dashboard";
                  }}
                />
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={renderDashboardSteps()} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

