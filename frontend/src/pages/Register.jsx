import React, { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_API_URL;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "", first_name: "", last_name: "", email_id: "", password: "", role: "staff",
  });

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${BACKEND_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Registered successfully!");
      window.location.href = "/login";
    } else {
      alert("Registration failed: " + data.detail);
    }
  };

  const fields = [
    { label: "Username", name: "username", type: "text" },
    { label: "First Name", name: "first_name", type: "text" },
    { label: "Last Name", name: "last_name", type: "text" },
    { label: "Email", name: "email_id", type: "email" },
    { label: "Password", name: "password", type: "password" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: 'var(--color-bg)' }}>
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-md" style={{ border: '1px solid var(--color-border)' }}>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Create your account</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>Join StockFlow today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>{label}</label>
              <input type={type} name={name} required value={formData[name]} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg)' }} />
            </div>
          ))}

          <button type="submit"
            className="w-full py-2.5 rounded-lg text-white font-semibold text-sm mt-2"
            style={{ background: 'var(--color-primary)' }}>
            Create Account
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-muted)' }}>
          Already have an account? <a href="/login" style={{ color: 'var(--color-primary)' }} className="font-medium">Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;