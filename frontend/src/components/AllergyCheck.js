// File: src/components/AllergyCheck.js
import React, { useState } from "react";

function AllergyCheck({ onNext, onBack }) {
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);

  const allergyOptions = [
    "Salicylic Acid",
    "Sulfate",
    "Paraben",
    "Fragrance",
    "Alcohol",
    "Lanolin",
    "Formaldehyde",
    "Cocamidopropyl Betaine",
    "Dye/Colorants",
    "Essential Oils",
    "Benzoyl Peroxide",
    "Oxybenzone",
    "Retinol",
    "Phthalates",
    "Silicones"
  ];

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedAllergies((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
    }
  };

  const handleNext = () => {
    onNext(selectedAllergies);
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="self-start -mt-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 shadow"
      >
        ← Back
      </button>

      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-center mb-6">
        Allergy & Skin Image Check
      </h1>

      {/* Allergy Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Product Ingredient Allergy Selection</h2>
        <p className="text-gray-600 text-sm mb-4">
          Select ingredients you are allergic to. This helps us avoid recommending products that may irritate your skin.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {allergyOptions.map((allergy, idx) => (
            <label key={idx} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={allergy}
                checked={selectedAllergies.includes(allergy)}
                onChange={handleCheckboxChange}
              />
              {allergy}
            </label>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl flex flex-col items-center">
        <img src="/imgup.png" alt="Upload Logo" className="h-20 w-20 mb-3" />
        <h2 className="text-2xl font-semibold mb-2 text-purple-600">
          Upload Image for Skin Analysis
        </h2>
        <p className="text-gray-600 text-sm mb-4 text-center">
          Upload a clear and stable image of your skin to detect conditions like acne, eczema, or vitiligo, and get personalized care tips.
        </p>
        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
        {uploadedImage && <p className="text-gray-700 text-sm">Selected file: {uploadedImage.name}</p>}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
      >
        Next ➡
      </button>
    </div>
  );
}

export default AllergyCheck;

