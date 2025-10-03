import React, { useState } from "react";
import axios from "axios";
import "../App.css";
import typeIcon from "../assets/icons/type.png"; // Added image import

const SkinTypeAnalysis = ({ onNext, onBack }) => {
  const [selectedType, setSelectedType] = useState("");
  const [answers, setAnswers] = useState({
    Age: "",
    Gender: "",
    Humidity: "",
    Hydration_Level: "",
    Oil_Level: "",
    Sensitivity: "",
    Temperature: ""
  });
  const [result, setResult] = useState("");

  const handleTypeChange = (e) => setSelectedType(e.target.value);

  const setField = (name, value) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyse = async () => {
    const payload = {
      Age: answers.Age || 25,
      Gender: answers.Gender || "Female",
      Humidity: answers.Humidity || 50,
      Hydration_Level: answers.Hydration_Level || "Medium",
      Oil_Level: answers.Oil_Level || "Medium",
      Sensitivity: answers.Sensitivity || "Medium",
      Temperature: answers.Temperature || 25
    };

    try {
      setResult("Predicting...");
      const { data } = await axios.post("http://127.0.0.1:5000/predict", payload);

      if (data?.skin_type) {
        setResult(`Predicted Skin Type: ${data.skin_type}`);
      } else if (data?.prediction !== undefined) {
        setResult(`Predicted Code: ${data.prediction}`);
      } else if (data?.error) {
        setResult(`Error: ${data.error}`);
      } else {
        setResult("No prediction returned.");
      }
    } catch (err) {
      console.error(err);
      setResult(
        "Prediction failed. Ensure Flask backend is running with CORS enabled."
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedType || Object.values(answers).some((v) => v !== "")) {
      onNext?.();
    } else {
      alert("Please select a skin type or enter your details!");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="self-start mb-4 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
      >
        ⬅ Back
      </button>

      <h1 className="text-3xl font-bold mb-6 font-serif">
        What is your skin type?
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col gap-8">
        {/* First Box */}
        <div className="border-2 border-gray-400 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Select your skin type</h2>
          <div className="flex flex-col gap-3">
            {["Normal", "Oily", "Dry", "Combination"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="skinType"
                  value={type}
                  checked={selectedType === type}
                  onChange={handleTypeChange}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Second Box */}
        <div className="border-2 border-gray-400 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Enter your details</h2>
          <div className="flex flex-col gap-4">
            {[{ label: "Age", type: "number" }, { label: "Humidity", type: "number", placeholder: "e.g. 50" }, { label: "Temperature", type: "number", placeholder: "e.g. 25" }].map((item) => (
              <label key={item.label} className="flex flex-col">
                <span className="mb-1">{item.label}</span>
                <input
                  type={item.type}
                  placeholder={item.placeholder || ""}
                  className="border border-gray-300 rounded-lg p-2"
                  value={answers[item.label] || ""}
                  onChange={(e) => setField(item.label, e.target.value)}
                />
              </label>
            ))}

            {[{ label: "Gender", options: ["Male", "Female"] }, { label: "Hydration_Level", options: ["Low", "Medium", "High"] }, { label: "Oil_Level", options: ["Low", "Medium", "High"] }, { label: "Sensitivity", options: ["Low", "Medium", "High"] }].map((item) => (
              <label key={item.label} className="flex flex-col">
                <span className="mb-1">{item.label.replace("_", " ")}</span>
                <select
                  className="border border-gray-300 rounded-lg p-2"
                  value={answers[item.label] || ""}
                  onChange={(e) => setField(item.label, e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {item.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          {/* Analyse Button + Output */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleAnalyse}
              className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700"
            >
              Analyse
            </button>

            {/* Updated result box with image */}
            <div className="w-full border border-gray-300 rounded-lg p-3 flex items-center gap-3 bg-gray-50">
              <img src={typeIcon} alt="Skin Type Icon" className="w-12 h-12" />
              <span className="text-gray-800">{result || "Your skin type result will appear here..."}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
        >
          Next ➡
        </button>
      </form>
    </div>
  );
};

export default SkinTypeAnalysis;
