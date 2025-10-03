import React, { useState } from "react";
import axios from "axios";
import bgImage from "../assets/bg.jpg";

// Import icons
import cleanserIcon from "../assets/icons/cleanser.png";
import tonerIcon from "../assets/icons/toner.png";
import serumIcon from "../assets/icons/serum.png";
import moisturizerIcon from "../assets/icons/moisturizer.png";
import sunscreenIcon from "../assets/icons/sunscreen.png";
import exfoliatorIcon from "../assets/icons/exfoliator.png";
import maskIcon from "../assets/icons/mask.png";

const cities = ["Select","Agartala","Agra","Ahmedabad","Aizawl","Ajmer","Alappuzha","Allahabad","Amravati","Amritsar","Anantapur","Asansol","Aurangabad","Bangalore","Bareilly","Belagavi","Bhubaneswar","Bhiwandi","Bhiwani","Bikaner","Bilaspur","Bokaro","Chandigarh","Chennai","Coimbatore","Cuttack","Darbhanga","Dehradun","Dhanbad","Durgapur","Erode","Faridabad","Firozabad","Ghaziabad","Gorakhpur","Guntur","Guwahati","Gwalior","Haridwar","Hubli","Hyderabad","Imphal","Indore","Jabalpur","Jaipur","Jalandhar","Jammu","Jamnagar","Jamshedpur","Jhansi","Jodhpur","Junagadh","Kakinada","Kanpur","Kochi","Kollam","Kota","Kozhikode","Kurnool","Ludhiana","Madurai","Malappuram","Mangalore","Mumbai","Mysore","Nagpur","Nashik","Nellore","Noida","Patna","Pimpri-Chinchwad","Pondicherry","Pune","Raipur","Rajkot","Ranchi","Rourkela","Salem","Sangli","Shillong","Shimla","Sikar","Solapur","Srinagar","Surat","Thane","Thiruvananthapuram","Tiruchirappalli","Tirunelveli","Tirupati","Udaipur","Vadodara","Varanasi","Vijayawada","Visakhapatnam","Warangal"];
const genders = ["Select","Male","Female"];
const skinTypes = ["Select","Dry","Oily","Combination","Normal"];
const yesNo = ["Select","Yes","No"];
const diabetesTypes = ["Select","None","Type 1","Type 2"];
const concerns = ["Select","None","Acne","Dark Circles","Dark Spots","Wrinkles"];
const pollutionLevels = ["Select","Low","Medium","High"];

// Icon mapping
const routineIcons = {
  cleanser: cleanserIcon,
  toner: tonerIcon,
  serum: serumIcon,
  moisturizer: moisturizerIcon,
  sunscreen: sunscreenIcon,
  exfoliator: exfoliatorIcon,
  mask: maskIcon
};

const SkinCareRoutine = ({ onBack }) => {
  const [userInput, setUserInput] = useState({
    Age: "",
    Gender: "Select",
    Skin_Type: "Select",
    Smoking: "Select",
    Alcohol: "Select",
    Diabetes: "Select",
    Diabetes_Type: "Select",
    Location: "Select",
    Common_Concern: "Select",
    Pollution_Level: "Select"
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInput({ ...userInput, [name]: value });
  };

  const handleAnalyse = async () => {
    for (let key in userInput) {
      if (userInput[key] === "Select" || userInput[key] === "") {
        alert(`Please select ${key.replace("_", " ")}`);
        return;
      }
    }

    try {
      setResult({ loading: true });

      const { data } = await axios.post(
        "http://127.0.0.1:5000/api/predict_routine_analysis",
        userInput,
        { headers: { "Content-Type": "application/json" } }
      );

      setResult(data);
    } catch (err) {
      console.error("Axios error:", err.response ? err.response.data : err.message);
      setResult({ error: err.response?.data?.error || "Prediction failed. Check backend." });
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", minHeight: "100vh", padding: "2rem" }}
      className="flex items-center justify-center"
    >
      <div className="bg-white bg-opacity-95 p-6 rounded-lg w-full max-w-6xl shadow-xl">
        {onBack && (
          <button onClick={onBack} className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 shadow">
            ← Back
          </button>
        )}
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Skincare Routine</h1>

        <form className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[120px]">
            <label>Age:</label>
            <input
              type="number"
              name="Age"
              value={userInput.Age}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full bg-white text-black"
            />
          </div>

          {[
            { label: "Gender", name: "Gender", options: genders },
            { label: "Skin Type", name: "Skin_Type", options: skinTypes },
            { label: "Smoking", name: "Smoking", options: yesNo },
            { label: "Alcohol", name: "Alcohol", options: yesNo },
            { label: "Diabetes", name: "Diabetes", options: yesNo },
            { label: "Diabetes Type", name: "Diabetes_Type", options: diabetesTypes },
            { label: "Location", name: "Location", options: cities },
            { label: "Common Concern", name: "Common_Concern", options: concerns },
            { label: "Pollution Level", name: "Pollution_Level", options: pollutionLevels }
          ].map(field => (
            <div className="flex-1 min-w-[140px]" key={field.name}>
              <label>{field.label}:</label>
              <select
                name={field.name}
                value={userInput[field.name]}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full bg-white text-black"
              >
                {field.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          <div className="w-full">
            <button
              type="button"
              onClick={handleAnalyse}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Analyse Routine
            </button>
          </div>
        </form>

        {/* Display Results */}
        <div className="w-full mt-6 grid gap-6">
          {result?.loading && <p className="text-blue-600 font-medium">Predicting...</p>}
          {result?.error && <p className="text-red-600 font-medium">{result.error}</p>}

          {!result?.loading && !result?.error && result && (
            <>
              {result.Morning_Routine && (
                <div className="p-4 bg-yellow-50 rounded shadow">
                  <h2 className="text-2xl font-semibold mb-3">🌞 Morning Routine</h2>
                  <div className="flex flex-wrap gap-4">
                    {result.Morning_Routine.map(item => (
                      <div key={item} className="flex flex-col items-center p-2 bg-yellow-100 rounded shadow hover:scale-105 transform transition">
                        <img src={routineIcons[item]} alt={item} className="w-12 h-12" />
                        <span className="mt-1 capitalize">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.Night_Routine && (
                <div className="p-4 bg-blue-50 rounded shadow">
                  <h2 className="text-2xl font-semibold mb-3">🌙 Night Routine</h2>
                  <div className="flex flex-wrap gap-4">
                    {result.Night_Routine.map(item => (
                      <div key={item} className="flex flex-col items-center p-2 bg-blue-100 rounded shadow hover:scale-105 transform transition">
                        <img src={routineIcons[item]} alt={item} className="w-12 h-12" />
                        <span className="mt-1 capitalize">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.Treatment_Recommendation && (
                <div className="p-4 bg-pink-50 rounded shadow">
                  <h2 className="text-2xl font-semibold mb-3">💊 Treatment Recommendation</h2>
                  <p className="text-gray-800">{result.Treatment_Recommendation}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkinCareRoutine;
