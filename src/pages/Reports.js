import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";
import "../styles.css";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

export default function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");

  const fetchTransactions = async () => {
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

  const filtered = transactions.filter(t => {
    const date = new Date(t.createdAt);
    const now = new Date();
    if (filter === "7") return now - date <= 7 * 24 * 60 * 60 * 1000;
    if (filter === "30") return now - date <= 30 * 24 * 60 * 60 * 1000;
    return true;
  });

  const categoryTotals = {};
  filtered.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
  });
  const categoryData = Object.keys(categoryTotals).map(cat => ({ category: cat, total: categoryTotals[cat] }));

  const exportFile = async (fmt) => {
    try {
      const res = await fetch(`${API_BASE}/api/transactions/export/${fmt}`, {
        headers: { Authorization: "Bearer " + token }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report.${fmt}`;
      a.click();
    } catch (err) { alert("Export failed"); }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Financial Reports</h2>
        <button onClick={() => window.location.href = "/"}>Back</button>
      </div>

      <div className="export-buttons">
        <button onClick={() => exportFile("csv")}>Export CSV</button>
        <button onClick={() => exportFile("pdf")}>Export PDF</button>
      </div>

      <div style={{ height: 300, marginTop: "20px" }}>
        <ResponsiveContainer>
          <BarChart data={categoryData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}