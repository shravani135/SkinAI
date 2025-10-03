import React from "react";

function Recommendation({ onBack }) {
  return (
    <div className="flex flex-col items-center p-6 space-y-8">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="self-start bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 shadow mb-4"
        >
          ← Back
        </button>
      )}

      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
        Your Personalized Recommendations
      </h1>

      {/* Skincare Routine Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-3 text-blue-600">
          Skincare Routine
        </h2>
        <p className="text-gray-700 text-sm mb-2">
          Morning: Cleanser → Toner → Moisturizer → Sunscreen
        </p>
        <p className="text-gray-700 text-sm mb-2">
          Evening: Cleanser → Serum → Night Cream
        </p>
        <p className="text-gray-700 text-sm">
          Follow this routine to maintain healthy skin according to your skin type and concerns.
        </p>
      </div>

      {/* Product Recommendation Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-3 text-purple-600">
          Product Recommendations
        </h2>
        <ul className="list-disc list-inside text-gray-700 text-sm">
          <li>Plum Green Tea Cleanser</li>
          <li>Forest Essentials Facial Toner</li>
          <li>Biotique Moisturizer</li>
          <li>Mamaearth Vitamin C Serum</li>
          <li>Khadi Natural Sunscreen</li>
        </ul>
        <p className="text-gray-700 text-sm mt-2">
          Products are suggested based on your skin type, allergies, and conditions.
        </p>
      </div>
    </div>
  );
}

export default Recommendation;
