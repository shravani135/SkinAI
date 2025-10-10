import React, { useState } from "react";
import axios from "axios";

const AllergyChecker = () => {
  const [skinType, setSkinType] = useState("");
  const [skinCondition, setSkinCondition] = useState("");
  const [productAllergies, setProductAllergies] = useState([]);
  const [environmentAllergies, setEnvironmentAllergies] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [results, setResults] = useState([]);

  const brands = [
    "Mama Earth", "Biotique", "Wow Skin Science", "Plum", "Minimalist",
    "Dr. Sheth’s", "Dot & Key", "Piligrim", "Foxtale", "Kama Ayurveda"
  ];

  const productAllergyOptions = [
    "Paraben", "Fragrance", "Alcohol", "Sulfate", "Silicones", "Essential Oils",
    "Salicylic Acid", "Retinol", "Niacinamide"
  ];

  const environmentAllergyOptions = [
    "Sun Allergy Risk", "Environment Allergy Risk", "Pet Allergy Risk", "Pollen Allergy Risk", "Fungal Allergy Risk"
  ];

  const productTypeOptions = [
    "Cleanser", "Toner", "Serum", "Moisturizer", "Exfoliator", "Eye Cream",
    "Face Mask", "Sunscreen", "Mist / Toner", "Essence / Serum", "Serum/Essence", "Toner/Essence", "Toner/Mist"
  ];

  const handleCheckboxChange = (setter, values, value) => {
    if (values.includes(value)) {
      setter(values.filter((v) => v !== value));
    } else {
      setter([...values, value]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/recommend", {
        skin_type: skinType,
        skin_condition: skinCondition,
        product_allergies: productAllergies,
        environment_allergies: environmentAllergies,
        selected_products: productTypes,
        brand_preference: selectedBrand,
      });
      setResults(response.data.recommendations || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  // Helper function to render checkbox lists
  const renderCheckboxes = (options, selectedValues, setter) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
      {options.map((item) => (
        <label key={item} style={{ padding: "6px 10px", borderRadius: "8px", background: "#f1f1f1", cursor: "pointer" }}>
          <input type="checkbox" checked={selectedValues.includes(item)}
            onChange={() => handleCheckboxChange(setter, selectedValues, item)}
            style={{ marginRight: "6px" }}
          />
          {item}
        </label>
      ))}
    </div>
  );

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", maxWidth: "900px", margin: "30px auto", padding: "20px" }}>
      
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#bdc3c7",
          color: "#2c3e50",
          cursor: "pointer",
          fontWeight: 600
        }}
      >
        ← Back
      </button>

      <h1 style={{
        textAlign: "center",
        marginBottom: "30px",
        color: "#2c3e50",
        fontSize: "2.5rem",
        fontWeight: "700",
        borderBottom: "2px solid #27ae60",
        paddingBottom: "10px"
      }}>
        🌿 Smart Skincare Allergy Checker
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Skin Type Box */}
        <div style={{ padding: "20px", borderRadius: "12px", background: "#fff", boxShadow: "0 3px 15px rgba(0,0,0,0.1)" }}>
          <label style={{ fontWeight: 700, fontSize: "1.2rem", color: "#27ae60" }}>Skin Type</label>
          <select value={skinType} onChange={(e) => setSkinType(e.target.value)} required
            style={{ width: "100%", padding: "10px", borderRadius: "8px", marginTop: "10px" }}>
            <option value="">Select Skin Type</option>
            <option value="Dry">Dry</option>
            <option value="Normal">Normal</option>
            <option value="Oily">Oily</option>
            <option value="Combination">Combination</option>
          </select>
        </div>

        {/* Skin Condition Box */}
        <div style={{ padding: "20px", borderRadius: "12px", background: "#fff", boxShadow: "0 3px 15px rgba(0,0,0,0.1)" }}>
          <label style={{ fontWeight: 700, fontSize: "1.2rem", color: "#27ae60" }}>Skin Condition</label>
          <select value={skinCondition} onChange={(e) => setSkinCondition(e.target.value)} required
            style={{ width: "100%", padding: "10px", borderRadius: "8px", marginTop: "10px" }}>
            <option value="">Select Condition</option>
            <option value="Acne">Acne</option>
            <option value="Dark_Spot">Dark Spot</option>
            <option value="Dark_Circle">Dark Circle</option>
            <option value="Wrinkle">Wrinkle</option>
          </select>
        </div>

        {/* Product Allergies Box */}
        <div style={{ padding: "20px", borderRadius: "12px", background: "#fff", boxShadow: "0 3px 15px rgba(0,0,0,0.1)" }}>
          <label style={{ fontWeight: 700, fontSize: "1.2rem", color: "#27ae60" }}>Product Allergies</label>
          {renderCheckboxes(productAllergyOptions, productAllergies, setProductAllergies)}
        </div>

        {/* Environmental Allergies Box */}
        <div style={{ padding: "20px", borderRadius: "12px", background: "#fff", boxShadow: "0 3px 15px rgba(0,0,0,0.1)" }}>
          <label style={{ fontWeight: 700, fontSize: "1.2rem", color: "#27ae60" }}>Environmental Allergies</label>
          {renderCheckboxes(environmentAllergyOptions, environmentAllergies, setEnvironmentAllergies)}
        </div>

        {/* Product Types Box */}
        <div style={{ padding: "20px", borderRadius: "12px", background: "#fff", boxShadow: "0 3px 15px rgba(0,0,0,0.1)" }}>
          <label style={{ fontWeight: 700, fontSize: "1.2rem", color: "#27ae60" }}>Product Types</label>
          {renderCheckboxes(productTypeOptions, productTypes, setProductTypes)}
        </div>

        {/* Brand Selection Box */}
        <div style={{ padding: "20px", borderRadius: "12px", background: "#fff", boxShadow: "0 3px 15px rgba(0,0,0,0.1)" }}>
          <label style={{ fontWeight: 700, fontSize: "1.2rem", color: "#27ae60" }}>Brand Selection</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px", marginTop: "10px" }}>
            {brands.map((brand) => (
              <div
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: selectedBrand === brand ? "#27ae60" : "#ecf0f1",
                  color: selectedBrand === brand ? "#fff" : "#2c3e50",
                  fontWeight: 500,
                  transition: "0.3s"
                }}
              >
                {brand}
              </div>
            ))}
          </div>
        </div>

        {/* Analyze & Recommend Box */}
        <div style={{ padding: "20px", borderRadius: "12px", background: "#fff", boxShadow: "0 5px 25px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
          <button type="submit" style={{
            padding: "14px 25px",
            borderRadius: "10px",
            backgroundColor: "#27ae60",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1.1rem",
            transition: "0.3s",
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2ecc71"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#27ae60"}
          >
            🔍 Analyze & Recommend
          </button>

          {/* Personalized Products Label */}
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#27ae60", margin: "0" }}>Personalized Products Are:</h2>

          {/* Results Section */}
          {results.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "15px", width: "100%" }}>
              {results.map((r, idx) => (
                <div key={idx} style={{ padding: "15px", borderRadius: "12px", background: "#f9f9f9", boxShadow: "0 3px 10px rgba(0,0,0,0.05)" }}>
                  <p><strong>Brand:</strong> {r.Brand}</p>
                  <p><strong>Product Type:</strong> {r.ProductType}</p>
                  <p><strong>Product Name:</strong> {r.ProductName}</p>
                  <p><strong>Link:</strong> <a href={r.ProductLink} target="_blank" rel="noopener noreferrer" style={{ color: "#2980b9" }}>{r.ProductLink}</a></p>
                </div>
              ))}
            </div>
          )}
        </div>

      </form>
    </div>
  );
};

export default AllergyChecker;
