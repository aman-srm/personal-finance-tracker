import React, { useState } from "react";
import { API_BASE } from "../config";
import Sidebar from "../components/Sidebar";

const AddTransaction = () => {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const token = localStorage.getItem("token");

  const handleAdd = async () => {
    if (!amount || !category) return alert("Fill all fields");

    try {
      const res = await fetch(`${API_BASE}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ type, amount: Number(amount), category })
      });

      if (res.ok) {
        setAmount("");
        setCategory("");
        alert("Transaction added!");
      } else {
        alert("Failed to add transaction");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="page-content">
        <h1>Add Transaction</h1>
        <div className="form-box">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <button onClick={handleAdd}>Add Transaction</button>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;