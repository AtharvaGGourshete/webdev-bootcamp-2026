import React, { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "password", email: formData.email, password: formData.password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user_id", data.user_id);
      window.location.href = data.role === "admin" ? "/admin/dashboard" : "/staff/dashboard";
    } else {
      alert("Login failed: " + data.detail);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-md border border-slate-200">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
          <p className="text-sm mt-1 text-slate-500">Login to your StockFlow account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
            { label: "Password", name: "password", type: "password", placeholder: "••••••••" }
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1 text-slate-700">{label}</label>
              <input type={type} name={name} value={formData[name]} onChange={handleChange} required
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none border border-slate-200 bg-slate-50 placeholder:text-slate-400" />
            </div>
          ))}
          <button type="submit"
            className="w-full py-2.5 rounded-lg text-white font-semibold text-sm bg-teal-700 hover:bg-teal-800 transition">
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-slate-500">
          Don't have an account? <a href="/register" className="text-teal-700 font-medium">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;