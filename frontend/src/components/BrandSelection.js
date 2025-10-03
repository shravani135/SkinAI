// File: src/components/BrandSelection.js
import React, { useState } from "react";

function BrandSelection({ onNext, onBack }) {
  const [selectedBrand, setSelectedBrand] = useState("");

  // Brand logos and correct names
  const brandOptions = [
    { name: "Plum", logo: "/p.png" },
    { name: "Forest Essentials", logo: "/f.png" },
    { name: "Biotique", logo: "/b.png" },
    { name: "Mamaearth", logo: "/m.png" },
    { name: "Khadi Natural", logo: "/k.png" },
    { name: "The Beauty Company", logo: "/t.png" },
    { name: "Just Herbs", logo: "/j.png" },
    { name: "SoulTree", logo: "/s.png" },
    { name: "Lotus Essentials", logo: "/l.png" },
    { name: "Aroma Magic", logo: "/a.png" },
  ];

  const handleBrandSelect = (brandName) => {
    setSelectedBrand(brandName);
  };

  const handleNext = () => {
    if (selectedBrand) onNext(selectedBrand);
    else alert("Please select a brand!");
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
        Select Your Preferred Brand
      </h1>

      {/* Brand Selection Grid */}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Brand Options</h2>
        <p className="text-gray-600 text-sm mb-4">
          Select the brand you prefer for your skincare products.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brandOptions.map((brand, idx) => (
            <div
              key={idx}
              onClick={() => handleBrandSelect(brand.name)}
              className={`flex flex-col items-center gap-2 p-4 border rounded-xl cursor-pointer shadow hover:scale-105 transition-transform
                ${selectedBrand === brand.name ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
            >
              <img src={brand.logo} alt={brand.name} className="h-12 w-12" />
              <span className="text-gray-700 font-medium text-center">{brand.name}</span>
            </div>
          ))}
        </div>
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

export default BrandSelection;
