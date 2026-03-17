import React from "react";

function App() {
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

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Sidebar */}
      <div style={{
        width: "240px",
        background: "#1f2937",
        color: "white",
        padding: "20px"
      }}>
        <h2 style={{ color: "#facc15" }}>Mandi ERP</h2>
        <ul style={{ listStyle: "none", padding: 0, marginTop: "30px" }}>
          {["Dashboard", "Suppliers", "Buyers", "Inventory", "Invoices", "Reports", "Settings"].map(item => (
            <li key={item} style={{
              padding: "12px",
              marginBottom: "10px",
              background: "#374151",
              borderRadius: "8px",
              cursor: "pointer"
            }}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "30px" }}>
        <h1 style={{ marginBottom: "25px" }}>Trade Operations Dashboard</h1>

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px"
        }}>
          {cards.map(card => (
            <div key={card.title} style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <h3>{card.title}</h3>
              <p style={{
                fontSize: "24px",
                color: "#d97706",
                fontWeight: "bold"
              }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Supplier Table */}
        <div style={{
          marginTop: "40px",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <h2>Supplier Overview</h2>

          <table style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse"
          }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ padding: "12px" }}>Supplier</th>
                <th style={{ padding: "12px" }}>Product</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s, i) => (
                <tr key={i}>
                  <td style={{ padding: "12px" }}>{s.name}</td>
                  <td style={{ padding: "12px" }}>{s.product}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      background: s.status === "Paid" ? "#dcfce7" : "#fef3c7",
                      padding: "6px 10px",
                      borderRadius: "8px"
                    }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <button style={{
                      marginRight: "10px",
                      padding: "6px 12px"
                    }}>Edit</button>
                    <button style={{
                      padding: "6px 12px"
                    }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart Placeholder */}
        <div style={{
          marginTop: "40px",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <h2>Weekly Sales</h2>
          <div style={{
            display: "flex",
            gap: "15px",
            alignItems: "end",
            height: "200px",
            marginTop: "20px"
          }}>
            {[80, 120, 60, 150, 100].map((h, i) => (
              <div key={i}>
                <div style={{
                  width: "40px",
                  height: `${h}px`,
                  background: "#facc15"
                }}></div>
                <p style={{ textAlign: "center" }}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri"][i]}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;