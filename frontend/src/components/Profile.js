// File: src/components/Profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) navigate("/login");
    else fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/profile/${username}`);
      if (res.data.status === "success") {
        setProfile(res.data.user);
        setForm(res.data.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/profile/${username}`, form);
      if (res.data.status === "success") {
        setProfile(res.data.user);
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-600">My Profile</h1>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-4">
        {["username", "name", "age", "gender", "location", "skin_tone", "allergies"].map((field) => (
          <div key={field} className="flex items-center space-x-4">
            <label className="w-32 font-semibold text-gray-700">{field.replace("_", " ").toUpperCase()}:</label>
            <input
              className={`flex-1 px-3 py-2 border rounded ${
                isEditing ? "border-pink-400 bg-white" : "border-gray-300 bg-gray-100"
              }`}
              type="text"
              name={field}
              value={form[field] || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        ))}

        <div className="flex justify-end space-x-4 mt-6">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Edit
            </button>
          )}
          {isEditing && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
