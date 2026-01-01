import React, { useState } from "react";
import { API_BASE } from "../config";

export default function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return alert("Fill all fields");

    try {
      const res = await fetch(`${API_BASE}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        onRegister();
        window.location.href = "/";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Cannot connect to server. Check your internet or backend status.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Create account</h2>
        <form onSubmit={submit}>
          <input className="auth-input" type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="auth-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="auth-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="auth-btn" type="submit">Register</button>
        </form>
        <p style={{ marginTop: 15, color: "#cbd5e1" }}>
          Already registered? <a style={{ color: "#60a5fa" }} href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}