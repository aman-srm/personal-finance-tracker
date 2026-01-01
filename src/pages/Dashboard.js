import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";
import "../styles.css";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard({ onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState("Income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const token = localStorage.getItem("token");
  const COLORS = ["#10b981", "#ef4444"];

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/transactions`, {
        headers: { Authorization: "Bearer " + token }
      });
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!type || !amount || !category) return alert("Fill all fields");
    try {
      const res = await fetch(`${API_BASE}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ type, amount: Number(amount), category })
      });
      if (res.ok) {
        setAmount(""); setCategory("");
        fetchTransactions();
      }
    } catch (err) {
      alert("Failed to add transaction");
    }
  };

  const pieData = [
    { name: "Income", value: transactions.filter(t => t.type === "Income").reduce((s, x) => s + Number(x.amount), 0) },
    { name: "Expense", value: transactions.filter(t => t.type === "Expense").reduce((s, x) => s + Number(x.amount), 0) }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="dash-buttons">
          <button onClick={() => window.location.href = "/reports"}>Reports</button>
          <button onClick={() => { localStorage.removeItem("token"); window.location.reload(); }}>Logout</button>
        </div>
      </div>

      <form className="transaction-form" onSubmit={submit}>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <div className="chart-container" style={{ height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={80} label>
              {pieData.map((entry, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}