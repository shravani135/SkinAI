// File: src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import logo from '../assets/logo.png';
import bg from '../assets/bg.jpg';

const Login = ({ onLoginSuccess }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/login", form);

      if (res.data.status === "success" && res.data.user) {
        localStorage.setItem("username", res.data.user.username);

        // Call the passed callback safely
        if (onLoginSuccess) onLoginSuccess(res.data.user.username);
        else navigate("/dashboard"); // fallback navigation
      } else {
        setError(res.data.message || "Login failed. Please check your username and password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        <img src={logo} alt="Logo" className="w-24 h-24 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-pink-600">Welcome to SkinAI</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          
          <button
            type="submit"
            className="mt-2 w-full bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600 transition-all"
          >
            Log In
          </button>
        </form>

        <p className="mt-3 text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-pink-500 font-semibold hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
