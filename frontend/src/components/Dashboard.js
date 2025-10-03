// File: src/components/Dashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ onStart, onBack }) {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center h-screen w-full">
      {/* Profile Icon */}
      <img
        src="/profile-icon.png"
        alt="Profile"
        className="absolute top-4 right-4 w-12 h-12 cursor-pointer"
        onClick={() => navigate("/profile")}
      />

      <div
        className="p-16 rounded-3xl shadow-lg max-w-2xl text-center border border-gray-200"
        style={{
          backgroundImage: "url('/dash.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            ← Back
          </button>
        )}

        <h2 className="text-5xl font-bold mb-6 tracking-wide text-green-600">
          Welcome to SkinAI
        </h2>

        <p className="mb-10 text-gray-800 font-medium italic leading-8 text-lg">
          Your personalized skincare companion ✨  
          Analyze your skin type, explore customized skincare routines, and get
          expert-backed suggestions. Whether you deal with acne, dryness, oiliness,
          or sensitivity, SkinAI is here to help you glow with confidence 🌿.
        </p>

        <button
          onClick={onStart}
          className="px-10 py-4 bg-green-500 text-white font-semibold rounded-xl tracking-wide hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
