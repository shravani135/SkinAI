// File: src/components/Register.js
import React, { useState } from "react";
import axios from "axios";

function Register({ onBack }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    age: "",
    gender: "",
    location: "",
    skin_tone: "",
    allergies: [],
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newAllergy, setNewAllergy] = useState("");

  const genders = ["Male", "Female"];
  const skinTones = ["Fair", "Medium", "Tan/Dark"];
  const locations = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
    "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
    "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
    "Sikkim","Tamil Nadu","Telangana","Tripura","Uttarakhand","Uttar Pradesh","West Bengal",
    "Delhi","Jammu and Kashmir","Ladakh","Puducherry","Chandigarh","Dadra and Nagar Haveli",
    "Daman and Diu","Lakshadweep","Andaman and Nicobar Islands"
  ];

  const [allergyOptions, setAllergyOptions] = useState([
    "Salicylic Acid", "Paraben", "Fragrance", "Niacinamide", "Retinol"
  ]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "allergies") {
      let updated = [...formData.allergies];
      if (checked) {
        updated.push(value);
      } else {
        updated = updated.filter(a => a !== value);
      }
      setFormData({ ...formData, allergies: updated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddAllergy = () => {
    const trimmed = newAllergy.trim();
    if (trimmed && !allergyOptions.includes(trimmed)) {
      setAllergyOptions([...allergyOptions, trimmed]);
      setFormData({ ...formData, allergies: [...formData.allergies, trimmed] });
      setNewAllergy("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/api/register", formData);
      setSuccess(res.data.message);

      setFormData({
        username: "",
        password: "",
        name: "",
        age: "",
        gender: "",
        location: "",
        skin_tone: "",
        allergies: [],
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-2xl shadow-lg w-full max-w-md">
        {onBack && <button onClick={onBack} className="mb-4 text-sm text-gray-600 hover:text-green-600">← Back</button>}
        <h2 className="text-2xl font-bold text-green-600 text-center mb-6">Create Your Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full border px-4 py-2 rounded-lg" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full border px-4 py-2 rounded-lg" />
          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg" />
          <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg" />

          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg">
            <option value="">Select Gender</option>
            {genders.map((g, idx) => <option key={idx} value={g}>{g}</option>)}
          </select>

          <select name="location" value={formData.location} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg">
            <option value="">Select Location</option>
            {locations.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
          </select>

          <select name="skin_tone" value={formData.skin_tone} onChange={handleChange} className="w-full border px-4 py-2 rounded-lg">
            <option value="">Select Skin Tone</option>
            {skinTones.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
          </select>

          {/* Allergies checkboxes */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Select Allergies</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {allergyOptions.map((allergy, idx) => (
                <label key={idx} className="flex items-center gap-1 border px-2 py-1 rounded-lg">
                  <input
                    type="checkbox"
                    name="allergies"
                    value={allergy}
                    checked={formData.allergies.includes(allergy)}
                    onChange={handleChange}
                  />
                  {allergy}
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add new allergy"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                className="flex-1 border px-2 py-1 rounded-lg"
              />
              <button type="button" onClick={handleAddAllergy} className="bg-green-500 text-white px-3 rounded-lg hover:bg-green-600">
                +
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
