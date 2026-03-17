import React, { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const cards = [
    { title: "Total Sales", value: "₹1,25,000" },
    { title: "Suppliers", value: "42" },
    { title: "Buyers", value: "31" },
    { title: "Pending Payments", value: "₹18,000" },
  ];

  const suppliers = [
    { name: "Ramesh Traders", product: "Rice", status: "Paid" },
    { name: "Kiran Supplies", product: "Wheat", status: "Pending" },
    { name: "Lakshmi Agro", product: "Corn", status: "Paid" },
  ];

  if (!loggedIn) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f3f4f6",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "12px",
            width: "350px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", color: "#d97706" }}>Mandi ERP Login</h2>

          <input
            placeholder="Username"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "20px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={() => setLoggedIn(true)}
            style={{
              width: "100%",
              padding: "10px",
              background: "#facc15",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      
      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          background: "#1f2937",
          color: "white",
          padding: "20px",
        }}
      >
        <h2 style={{ color: "#facc15" }}>Mandi ERP</h2>

        <ul style={{ listStyle: "none", padding: 0, marginTop: "30px" }}>
          {[
            "Dashboard",
            "Suppliers",
            "Buyers",
            "Inventory",
            "Invoices",
            "Reports",
            "Settings",
          ].map((item) => (
            <li
              key={item}
              style={{
                padding: "12px",
                marginBottom: "10px",
                background: "#374151",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "30px",
          }}
        >
          <input
            placeholder="Search..."
            style={{
              padding: "10px",
              width: "300px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <div
            style={{
              background: "white",
              padding: "10px 20px",
              borderRadius: "8px",
            }}
          >
            Admin User
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.title}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              <h3>{card.title}</h3>
              <p style={{ fontSize: "24px", color: "#d97706", fontWeight: "bold" }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Invoice Box */}
        <div
          style={{
            marginTop: "40px",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h2>Invoice Summary</h2>
          <p>Invoice No: INV-1023</p>
          <p>Buyer: Sai Traders</p>
          <p>Total: ₹45,000</p>

          <button
            style={{
              marginTop: "10px",
              padding: "10px 15px",
              background: "#facc15",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Print Invoice
          </button>
        </div>

        {/* Supplier Table */}
        <div
          style={{
            marginTop: "40px",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h2>Supplier Overview</h2>

          <table style={{ width: "100%", marginTop: "20px" }}>
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Product</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {suppliers.map((s, i) => (
                <tr key={i}>
                  <td>{s.name}</td>
                  <td>{s.product}</td>
                  <td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;