import React from "react";
import routineLogo from "../assets/routine.png";
import conditionLogo from "../assets/condition.png";
import guideLogo from "../assets/guide.png";

function MainOptions({ onSelectOption, onBack }) {
  return (
    <div className="relative flex flex-col items-center mt-24 px-4">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute -top-10 left-6 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 shadow"
        >
          ← Back
        </button>
      )}

      {/* Page Heading */}
      <h2 className="text-3xl font-bold text-center text-green-700 tracking-wide mb-12">
        What would you like to do?
      </h2>

      {/* Options Grid */}
      <div className="flex flex-col gap-8 w-full max-w-7xl">
        {/* Option 1 - Skincare Routine Analysis */}
        <div
          onClick={() => onSelectOption("routine")}
          className="bg-white rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform flex items-center p-6 overflow-hidden w-full"
        >
          <img
            src={routineLogo}
            alt="Routine"
            className="h-24 w-24 mr-6 flex-shrink-0"
          />
          <div>
            <h3 className="font-semibold text-xl mb-2">Skincare Routine Analysis</h3>
            <p className="text-gray-600 text-sm leading-relaxed break-words">
              Analyze your current skincare routine and get personalized recommendations based on your skin type and concerns.
            </p>
          </div>
        </div>

        {/* Option 2 - Product Ingredient Allergies */}
        <div
          onClick={() => onSelectOption("allergy")}
          className="bg-white rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform flex items-center p-6 overflow-hidden w-full"
        >
          <img
            src={conditionLogo}
            alt="Allergy"
            className="h-24 w-24 mr-6 flex-shrink-0"
          />
          <div>
            <h3 className="font-semibold text-xl mb-2">Select Product Ingredient Allergies</h3>
            <p className="text-gray-600 text-sm leading-relaxed break-words">
              Select ingredients you are allergic to so we avoid recommending products that may irritate your skin.
            </p>
          </div>
        </div>

        {/* Option 3 - Upload Image for Skin Analysis */}
        <div
          onClick={() => onSelectOption("condition")}
          className="bg-white rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform flex items-center p-6 overflow-hidden w-full"
        >
          <img
            src={guideLogo}
            alt="Upload"
            className="h-24 w-24 mr-6 flex-shrink-0"
          />
          <div>
            <h3 className="font-semibold text-xl mb-2">Upload Image for Skin Analysis</h3>
            <p className="text-gray-600 text-sm leading-relaxed break-words">
              Upload a photo of your skin to detect conditions like acne, eczema, or vitiligo, and get personalized care tips.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainOptions;
