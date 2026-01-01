import React, { useState } from "react";
import { API_BASE } from "../config";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Fill all fields");

    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        onLogin();
        window.location.href = "/";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Server connection failed.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Welcome back</h2>
        <form onSubmit={submit}>
          <input className="auth-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="auth-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="auth-btn" type="submit">Login</button>
        </form>
        <p style={{ marginTop: 15, color: "#cbd5e1" }}>
          Don't have an account? <a style={{ color: "#60a5fa" }} href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}