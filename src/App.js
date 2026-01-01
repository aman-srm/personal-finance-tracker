import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
// FIXED: Import the production URL from your config file
import { API_BASE } from "./config"; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) { 
        setIsLoggedIn(false); 
        setChecking(false); 
        return; 
      }

      try {
        // FIXED: Using API_BASE which points to Render
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: "Bearer " + token }
        });
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Verification failed:", err);
        setIsLoggedIn(false);
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, []);

  if (checking) return null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Dashboard onLogout={() => setIsLoggedIn(false)} /> : <Navigate to="/login" />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register onRegister={() => setIsLoggedIn(true)} />} />
        <Route path="/reports" element={isLoggedIn ? <Reports /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;