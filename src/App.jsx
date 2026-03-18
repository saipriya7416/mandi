import React, { useState } from "react";
import "./index.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// ===== Premium Design Helpers =====
const Card = ({ children, style = {} }) => (
  <div style={{
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "default",
    ...style
  }}
  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)"; }}
  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)"; }}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", style = {} }) => {
  const variants = {
    primary: { background: "linear-gradient(135deg, #facc15, #eab308)", color: "#1f2937" },
    danger: { background: "linear-gradient(135deg, #f87171, #ef4444)", color: "white" },
    success: { background: "linear-gradient(135deg, #4ade80, #22c55e)", color: "white" },
    secondary: { background: "#374151", color: "white" }
  };
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 24px",
        borderRadius: "12px",
        border: "none",
        fontWeight: "700",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ...variants[variant],
        ...style
      }}
      onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "scale(1.02)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.transform = "scale(1)"; }}
    >
      {children}
    </button>
  );
};

const formatCurrency = (v) => "₹" + (Number(v) || 0).toLocaleString("en-IN");

function App() {
  const [activeSection, setActiveSection] = useState("dashboard"); // Default first menu item
  const [loggedIn, setLoggedIn] = useState(false);

  // --- Real State ---
  const [products, setProducts] = useState([
    { name: "🥭 Alfonso Mango", quantity: 1500, rate: 120 },
    { name: "🍎 Kashmir Apple", quantity: 800, rate: 85 },
  ]);

  const [supplierBill, setSupplierBill] = useState({
    billNumber: "INV-" + Date.now().toString().slice(-6),
    date: new Date().toISOString().slice(0, 10),
    items: [{ name: "🥭 Alfonso", quantity: 100, rate: 120 }],
    expenses: { freight: 500, labour: 200, misc: 100 },
    advance: 1000
  });

  // --- Calculation Logic ---
  const gross = supplierBill.items.reduce((s, i) => s + (i.quantity * i.rate), 0);
  const totalExp = Object.values(supplierBill.expenses).reduce((a, b) => a + b, 0);
  const net = gross - totalExp - supplierBill.advance;

  // --- Chart Setup ---
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Revenue",
      data: [45000, 52000, 38000, 65000, 48000, 22000, 55000],
      backgroundColor: "rgba(250, 204, 21, 0.8)",
      borderRadius: 10,
    }]
  };

  if (!loggedIn) {
    return (
      <div style={{
        height: "100vh",
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        display: "flex", justifyContent: "center", alignItems: "center",
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{
          background: "white", padding: "48px", borderRadius: "32px", width: "400px",
          textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
        }}>
          <h1 style={{ color: "#eab308", marginBottom: "8px" }}>🥭 Mandi ERP</h1>
          <p style={{ color: "#64748b", marginBottom: "32px" }}>Premium Trade Operations Portal</p>
          <input placeholder="Username" style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "16px" }} />
          <input type="password" placeholder="Password" style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }} />
          <Button onClick={() => setLoggedIn(true)} style={{ width: "100%" }}>Access Dashboard</Button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: "📊 Overview Dashboard", key: "dashboard", icon: "📈" },
    { label: "🛒 Product Entry", key: "product-entry", icon: "📦" },
    { label: "🚚 Supplier Matrix", key: "suppliers", icon: "🏢" },
    { label: "🛍 Buyer Portal", key: "buyers", icon: "💎" },
    { label: "🧾 Digital Billing", key: "billing", icon: "📑" },
    { label: "💸 Expense Tracker", key: "expenses", icon: "💰" },
    { label: "🛡 Compliance (ID)", key: "verification", icon: "🛡" },
    { label: "📂 Archive Vault", key: "documents", icon: "📂" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      
      {/* --- ELITE SIDEBAR --- */}
      <div style={{
        width: "280px", background: "#0f172a", color: "white", padding: "32px 20px",
        height: "100vh", position: "fixed", display: "flex", flexDirection: "column",
        boxShadow: "4px 0 24px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px", paddingLeft: "12px" }}>
          <div style={{ fontSize: "28px" }}>🥭</div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#facc15", letterSpacing: "-0.5px" }}>SPV ERP</h2>
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {menuItems.map((item) => (
              <li
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                style={{
                  padding: "16px 20px",
                  borderRadius: "16px",
                  marginBottom: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: activeSection === item.key ? "linear-gradient(90deg, #334155, #1e293b)" : "transparent",
                  color: activeSection === item.key ? "#facc15" : "#94a3b8",
                  boxShadow: activeSection === item.key ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
                  borderLeft: activeSection === item.key ? "4px solid #facc15" : "4px solid transparent"
                }}
              >
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                <span style={{ fontWeight: activeSection === item.key ? "700" : "500" }}>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ marginTop: "auto", borderTop: "1px solid #334155", paddingTop: "24px", textAlign: "center" }}>
          <p style={{ color: "#64748b", fontSize: "12px" }}>v4.0.0 Stable Build</p>
          <p style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "600", marginTop: "4px" }}>&copy; 2026 SPV Mandi Ltd.</p>
        </div>
      </div>

      {/* --- DYNAMIC CONTENT AREA (RIGHT SIDE) --- */}
      <div style={{ marginLeft: "280px", flex: 1, padding: "40px" }}>
        
        {/* Header Ribbon */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", margin: 0 }}>
              {menuItems.find(i => i.key === activeSection)?.label.split(" ").slice(1).join(" ")}
            </h1>
            <p style={{ color: "#64748b", marginTop: "4px" }}>Welcome back, Administrator</p>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
             <div style={{ background: "white", padding: "10px 20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", fontWeight: "600" }}>
               📅 {new Date().toDateString()}
             </div>
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" style={{ width: "45px", borderRadius: "12px" }} />
          </div>
        </div>

        {/* Matter Display based on Active Section */}
        <div style={{ opacity: 1, transition: "opacity 0.3s ease" }}>
          
          {activeSection === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                <Card>
                  <p style={{ color: "#64748b", fontWeight: "600" }}>Daily Turnover</p>
                  <h2 style={{ fontSize: "32px", margin: "12px 0", color: "#0f172a" }}>{formatCurrency(gross)}</h2>
                  <span style={{ color: "#22c55e", fontWeight: "700" }}>+12.5% from yesterday</span>
                </Card>
                <Card>
                  <p style={{ color: "#64748b", fontWeight: "600" }}>Net Position</p>
                  <h2 style={{ fontSize: "32px", margin: "12px 0", color: "#0f172a" }}>{formatCurrency(net)}</h2>
                  <span style={{ color: "#ef4444", fontWeight: "700" }}>-₹2,400 in expenses</span>
                </Card>
                <Card>
                  <p style={{ color: "#64748b", fontWeight: "600" }}>Stock Volume</p>
                  <h2 style={{ fontSize: "32px", margin: "12px 0", color: "#0f172a" }}>2,300 KG</h2>
                  <span style={{ color: "#3b82f6", fontWeight: "700" }}>84% Capacity</span>
                </Card>
              </div>
              
              <Card style={{ padding: "40px" }}>
                <h3 style={{ marginBottom: "24px" }}>📉 Revenue Streams (Weekly Analysis)</h3>
                <div style={{ height: "300px" }}>
                   <Bar data={chartData} options={{ maintainAspectRatio: false }} />
                </div>
              </Card>
            </div>
          )}

          {activeSection === "product-entry" && (
            <Card>
              <h2 style={{ marginBottom: "24px", color: "#d97706" }}>📦 Master Product Inventory</h2>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px" }}>
                 <thead>
                   <tr style={{ textAlign: "left", color: "#64748b" }}>
                     <th style={{ padding: "12px" }}>Item Name</th>
                     <th style={{ padding: "12px" }}>Stock (KG)</th>
                     <th style={{ padding: "12px" }}>Market Rate</th>
                     <th style={{ padding: "12px" }}>Market Value</th>
                     <th style={{ padding: "12px" }}>Action</th>
                   </tr>
                 </thead>
                 <tbody>
                    {products.map((p, i) => (
                      <tr key={i} style={{ background: "#f8fafc", borderRadius: "12px" }}>
                        <td style={{ padding: "16px", fontWeight: "700", borderRadius: "12px 0 0 12px" }}>{p.name}</td>
                        <td style={{ padding: "16px" }}>{p.quantity}</td>
                        <td style={{ padding: "16px" }}>{formatCurrency(p.rate)}</td>
                        <td style={{ padding: "16px", color: "#16a34a", fontWeight: "800" }}>{formatCurrency(p.quantity*p.rate)}</td>
                        <td style={{ padding: "16px", borderRadius: "0 12px 12px 0" }}>
                          <Button variant="danger" style={{ padding: "6px 12px", fontSize: "14px" }}>Delete</Button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
              <Button style={{ marginTop: "24px" }}>➕ Register New Product</Button>
            </Card>
          )}

          {activeSection === "billing" && (
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "32px" }}>
              <Card>
                <h2 style={{ marginBottom: "24px" }}>🧾 Invoice Stream</h2>
                <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                   <input placeholder="Bill ID" value={supplierBill.billNumber} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
                   <input type="date" value={supplierBill.date} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
                </div>
                {supplierBill.items.map((item, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr auto", gap: "12px", marginBottom: "12px" }}>
                    <input value={item.name} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                    <input value={item.quantity} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                    <input value={item.rate} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                    <Button variant="danger" style={{ padding: "10px" }}>❌</Button>
                  </div>
                ))}
                <Button variant="success" style={{ marginTop: "12px" }}>➕ Add Line Item</Button>
              </Card>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <Card style={{ background: "#0f172a", color: "white" }}>
                  <h3>Billing Summary</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                    <span>Gross Amount:</span>
                    <span style={{ fontWeight: "800" }}>{formatCurrency(gross)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                    <span>Total Tax/Exp:</span>
                    <span style={{ color: "#f87171" }}>- {formatCurrency(totalExp)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", borderTop: "1px solid #334155", paddingTop: "16px" }}>
                    <span style={{ fontSize: "18px" }}>Net Payable:</span>
                    <span style={{ fontSize: "22px", fontWeight: "900", color: "#facc15" }}>{formatCurrency(net)}</span>
                  </div>
                  <Button style={{ width: "100%", marginTop: "24px" }}>🖨 Finalize & Print</Button>
                </Card>
              </div>
            </div>
          )}

          {/* Fallback for undeveloped matters */}
          {!["dashboard", "product-entry", "billing"].includes(activeSection) && (
             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", opacity: 0.6 }}>
                <span style={{ fontSize: "64px" }}>🏗️</span>
                <h2 style={{ marginTop: "20px" }}>Matter Optimization in Progress</h2>
                <p>The related data and controls for "{activeSection.replace("-", " ")}" are being calibrated for this terminal.</p>
                <Button onClick={() => setActiveSection("dashboard")} variant="secondary" style={{ marginTop: "24px" }}>Return to Command Center</Button>
             </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default App;