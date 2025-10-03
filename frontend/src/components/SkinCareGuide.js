import React from 'react';

function SkinCareGuide({ onBack }) {
  return (
    <div className="relative flex items-center justify-center h-screen">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          ← Back
        </button>
      )}

      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-lg max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-4 tracking-wide text-green-700">
          Skin Care Guide
        </h2>
        <p className="text-gray-700 leading-7">
          Here you’ll receive personalized step-by-step recommendations for your
          daily skincare routine — from cleansing to SPF to night care. This guide
          will suggest products and habits based on your skin type and concerns.
        </p>
      </div>
    </div>
  );
}

export default SkinCareGuide;
