// File: src/components/SkinCondition.js
import React, { useState } from "react";

function SkinCondition({ onBack, onNext }) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [detectedCondition, setDetectedCondition] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
      setDetectedCondition(""); // Clear previous result
    }
  };

  const handleDetect = () => {
    if (!uploadedImage) {
      alert("Please upload an image first!");
      return;
    }
    // Example detected condition
    setDetectedCondition("Acne detected"); 
    // You can replace this with actual analysis logic
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setDetectedCondition("");
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-8 w-full">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="self-start bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 shadow mb-4"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-center mb-6">Skin Condition Analysis</h1>

      {/* Image Upload Box */}
      <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl flex flex-col items-center">
        <img
          src="/imgup.png"
          alt="Upload Logo"
          className="h-20 w-20 mb-3"
        />
        <h2 className="text-2xl font-semibold mb-2 text-blue-600">
          Upload Image for Skin Analysis
        </h2>
        <p className="text-gray-600 text-sm mb-4 text-center">
          Upload a clear and stable image of your skin. <br />
          Ensure the background is plain and well-lit for better analysis.
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />
        {uploadedImage && (
          <p className="text-gray-700 text-sm mb-2">Selected file: {uploadedImage.name}</p>
        )}

        {/* Detect Button - top-right */}
        <button
          onClick={handleDetect}
          className="absolute top-4 right-4 bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 shadow"
        >
          Detect
        </button>

        {/* Remove Image Button */}
        {uploadedImage && (
          <button
            onClick={handleRemoveImage}
            className="absolute top-4 right-28 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 shadow"
          >
            Remove
          </button>
        )}
      </div>

      {/* Detected Skin Condition Box */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-2 text-purple-600">
          Detected Skin Condition
        </h2>
        <p className="text-gray-700 text-sm min-h-[50px]">
          {detectedCondition || "Detected condition will appear here after clicking Detect..."}
        </p>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
      >
        Next ➡
      </button>
    </div>
  );
}

export default SkinCondition;
