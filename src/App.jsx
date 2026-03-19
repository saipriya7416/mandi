import React, { useState, useEffect } from "react";
import "./index.css";
import { MandiService } from "./services/api";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

// --- ELITE DESIGN SYSTEM ---
const COLORS = {
  primary: "#facc15", // Gold
  secondary: "#0f172a", // Navy
  bg: "#f1f5f9",
  card: "#ffffff",
  text: "#334155",
  muted: "#94a3b8",
  success: "#22c55e",
  danger: "#ef4444",
  accent: "#6366f1"
};

const Card = ({ children, title, subtitle, style = {} }) => (
  <div style={{
    background: COLORS.card,
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
    border: "1px solid #e2e8f0",
    ...style
  }}>
    {title && (
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "900", color: COLORS.secondary }}>{title}</h3>
        {subtitle && <p style={{ margin: "4px 0 0 0", color: COLORS.muted, fontSize: "14px" }}>{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

const Input = ({ label, placeholder, type = "text", value, onChange }) => (
  <div style={{ marginBottom: "20px" }}>
    {label && <label style={{ display: "block", marginBottom: "8px", fontWeight: "800", color: COLORS.secondary, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%", padding: "14px 18px", borderRadius: "14px", border: "2.5px solid #f1f5f9",
        background: "#fff", color: COLORS.text, outline: "none", fontWeight: "600", fontSize: "15px", transition: "all 0.2s"
      }}
      onFocus={(e) => (e.target.style.borderColor = COLORS.primary)}
      onBlur={(e) => (e.target.style.borderColor = "#f1f5f9")}
    />
  </div>
);

const Button = ({ children, onClick, variant = "primary", style = {} }) => {
  const styles = {
    primary: { background: COLORS.primary, color: COLORS.secondary },
    secondary: { background: COLORS.secondary, color: "#fff" },
    success: { background: COLORS.success, color: "#fff" },
    danger: { background: COLORS.danger, color: "#fff" }
  };
  return (
    <button onClick={onClick} style={{
      padding: "14px 28px", borderRadius: "14px", border: "none", fontWeight: "800", cursor: "pointer",
      transition: "all 0.2s", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", ...styles[variant], ...style
    }}>
      {children}
    </button>
  );
};

const formatCurrency = (v) => "₹" + (Number(v) || 0).toLocaleString("en-IN");

// --- MAIN ARCHITECTURE ---
export default function App() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // --- INITIALIZE SESSION ---
  useEffect(() => {
    const savedToken = localStorage.getItem("mandi_token");
    const savedUser = localStorage.getItem("mandi_user");
    if (savedToken && savedUser) {
      setLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // --- RESPONSIVE STATE MONITOR ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- FORM STATES ---
  const [supplierForm, setSupplierForm] = useState({ name: "", phone: "", address: "", govIdNumber: "", idType: "Aadhaar", bankDetails: "", notes: "" });
  const [buyerForm, setBuyerForm] = useState({ name: "", shopName: "", phone: "", address: "", govIdNumber: "", idType: "Aadhaar", creditLimit: "", notes: "" });
  const [intakeForm, setIntakeForm] = useState({ supplierId: "", product: "", variety: "", quantity: "", unit: "KG", rate: "" });

  // --- DATA STORAGE STATES ---
  const [suppliers, setSuppliers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [lots, setLots] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);

  // --- DATA SYNC WITH BACKEND ---
  const fetchData = async () => {
    try {
      const sRes = await MandiService.getSuppliers();
      if (sRes.status === "SUCCESS") setSuppliers(sRes.data);

      const bRes = await MandiService.getBuyers();
      if (bRes.status === "SUCCESS") setBuyers(bRes.data);

      const lRes = await MandiService.getLots();
      if (lRes.status === "SUCCESS") setLots(lRes.data);

      const dRes = await MandiService.getDocuments();
      if (dRes.status === "SUCCESS") setDocuments(dRes.data);
    } catch (err) {
      console.error("API Connectivity Error:", err);
    }
  };

  const handleFileUpload = async (event, docType = "Other", relatedToType = "Other", relatedTo = null) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) return alert("❌ CLIP REACHED: Max size 10MB");

    setUploading(true);
    const res = await MandiService.uploadFile(file, docType, relatedToType, relatedTo);
    setUploading(false);

    if (res.status === "SUCCESS") {
      alert("☁️ ARCHIVED: File secured in Vault");
      fetchData();
    } else {
      alert(`❌ VAULT ERROR: ${res.message}`);
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm("Purge this document permanently?")) return;
    const res = await MandiService.deleteDocument(id);
    if (res.status === "SUCCESS") fetchData();
  };

  useEffect(() => {
    if (loggedIn) fetchData();
  }, [loggedIn, activeSection]);

  const handleLogin = async () => {
    if (!authForm.username || !authForm.password) return alert("⚠️ Identity and Lock are required");
    const res = await MandiService.login(authForm.username, authForm.password);
    if (res.status === "SUCCESS") {
      setLoggedIn(true);
      setUser(res.data.user);
    } else {
      alert(`❌ LOGIN FAILED: ${res.message || "Invalid Credentials"}`);
    }
  };

  const handleLogout = () => {
    MandiService.logout();
    setLoggedIn(false);
    setUser(null);
    setActiveSection("Dashboard");
  };

  // --- FORM HANDLERS (BACKEND SYNC) ---
  const handleRegisterSupplier = async () => {
    if (!supplierForm.name || !supplierForm.phone) return alert("⚠️ Name and Phone are required");
    const res = await MandiService.addSupplier(supplierForm);
    if (res.status === "SUCCESS") {
      alert("💾 SUCCESS: Supplier saved to MongoDB!");
      setSupplierForm({ name: "", phone: "", address: "", govIdNumber: "", idType: "Aadhaar", bankDetails: "", notes: "" });
      fetchData();
    }
  };

  const handleOnboardBuyer = async () => {
    if (!buyerForm.name || !buyerForm.phone) return alert("⚠️ Name and Phone are required");
    const res = await MandiService.addBuyer(buyerForm);
    if (res.status === "SUCCESS") {
      alert("💾 SUCCESS: Buyer details saved to MongoDB!");
      setBuyerForm({ name: "", shopName: "", phone: "", address: "", govIdNumber: "", idType: "Aadhaar", creditLimit: "", notes: "" });
      fetchData();
    } else {
      alert(`❌ FAILED: ${res.message || "Database Error"}`);
    }
  };

  const handleCreateLot = async () => {
    if (!intakeForm.product || !intakeForm.quantity) return alert("⚠️ Product and Qty are required");
    const res = await MandiService.createLot({
      ...intakeForm,
      supplier: intakeForm.supplierId || (suppliers[0]?._id) // Fallback to first if empty
    });
    if (res.status === "SUCCESS") {
      alert("💾 SUCCESS: Inventory Lot recorded in Database!");
      setIntakeForm({ supplierId: "", product: "", variety: "", quantity: "", unit: "KG", rate: "" });
      fetchData();
    } else {
      alert(`❌ FAILED: ${res.message || "Database Error"}`);
    }
  };

  // --- MENU CONFIG with RBAC ---
  const ALL_MENU = [
    { id: "Dashboard", icon: "📊", roles: ["Admin", "Accountant", "Operations Staff"] },
    { id: "User Roles", icon: "👥", roles: ["Admin"] },
    { id: "Supplier Management", icon: "🏢", roles: ["Admin", "Operations Staff"] },
    { id: "Buyer Management", icon: "💎", roles: ["Admin", "Operations Staff"] },
    { id: "Inventory Intake", icon: "📥", roles: ["Admin", "Operations Staff"] },
    { id: "Inventory Allocation", icon: "📤", roles: ["Admin", "Operations Staff"] },
    { id: "Supplier Bill", icon: "🧾", roles: ["Admin", "Accountant"] },
    { id: "Buyer Invoice", icon: "📑", roles: ["Admin", "Accountant"] },
    { id: "Ledger System", icon: "📖", roles: ["Admin", "Accountant"] },
    { id: "Payment Management", icon: "💳", roles: ["Admin", "Accountant"] },
    { id: "Expense Management", icon: "💸", roles: ["Admin", "Accountant", "Operations Staff"] },
    { id: "Verification & Compliance", icon: "🛡", roles: ["Admin"] },
    { id: "Reports", icon: "📄", roles: ["Admin", "Accountant"] },
    { id: "Search & Filters", icon: "🔍", roles: ["Admin", "Accountant", "Operations Staff"] },
    { id: "Document Management", icon: "📂", roles: ["Admin"] }
  ];

  const MENU = user ? ALL_MENU.filter(item => item.roles.includes(user.role)) : [];

  if (loading) return <div style={{ height: "100vh", background: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff" }}><h1>⚡ Syncing Matrix...</h1></div>;

  if (!loggedIn) {
    return (
      <div style={{ height: "100vh", background: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card style={{ width: "420px", textAlign: "center", padding: "60px 40px" }}>
          <span style={{ fontSize: "64px" }}>🥭</span>
          <h1 style={{ margin: "20px 0 10px", fontWeight: "900", color: "#0f172a" }}>Mandi ERP</h1>
          <p style={{ color: "#64748b", marginBottom: "40px" }}>Enterprise Logistics Portal</p>
          <Input 
            placeholder="Staff Identity" 
            value={authForm.username} 
            onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })} 
          />
          <Input 
            type="password" 
            placeholder="Access Lock" 
            value={authForm.password} 
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} 
          />
          <Button onClick={handleLogin} style={{ width: "100%", height: "56px", fontSize: "16px" }}>Initialize System</Button>
          <div style={{ marginTop: "20px", fontSize: "12px", color: "#94a3b8" }}>
            v4.1.0 Secured by JWT & RBAC
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: COLORS.bg, 
      display: "flex", 
      flexDirection: isMobile ? "column" : "row",
      fontFamily: "'Outfit', sans-serif" 
    }}>
      {/* MOBILE HEADER (Conditional) */}
      {loggedIn && isMobile && (
        <div style={{ 
          background: "#0f172a", 
          padding: "16px 20px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ color: COLORS.primary, margin: 0, fontSize: "20px" }}>Mandi ERP</h2>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "none", border: "none", color: "#fff", fontSize: "24px", cursor: "pointer" }}
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </div>
      )}

      {/* 1. SIDE NAVIGATION (Adaptive Drawer) */}
      {loggedIn && (
        <nav style={{ 
          width: isMobile ? "280px" : "340px", 
          background: COLORS.secondary, 
          padding: "40px 24px", 
          display: "flex", 
          flexDirection: "column",
          position: isMobile ? "fixed" : "relative",
          left: isMobile && !sidebarOpen ? "-340px" : "0",
          top: 0,
          bottom: 0,
          zIndex: 1100,
          transition: "left 0.3s ease-in-out",
          boxShadow: isMobile ? "12px 0 32px rgba(0,0,0,0.2)" : "10px 0 40px rgba(0,0,0,0.2)"
        }}>
          <div style={{ padding: "0 8px 32px 8px" }}>
            <h2 style={{ color: COLORS.primary, fontWeight: "900", fontSize: "28px", letterSpacing: "-1px", margin: 0 }}>{user?.username?.toUpperCase() || "STAFF"}</h2>
            <div style={{ height: "4px", width: "40px", background: COLORS.primary, marginTop: "12px", borderRadius: "10px" }}></div>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "12px", fontWeight: "700" }}>{user?.role}</p>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0 0 20px" }}>
            {MENU.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                style={{
                  padding: "18px 24px", borderRadius: "20px", marginBottom: "6px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "18px", transition: "all 0.3s",
                  background: activeSection === item.id ? "rgba(250, 204, 21, 0.1)" : "transparent",
                  color: activeSection === item.id ? COLORS.primary : "#94a3b8",
                  borderLeft: activeSection === item.id ? `5px solid ${COLORS.primary}` : "5px solid transparent"
                }}
              >
                <span style={{ fontSize: "22px" }}>{item.icon}</span>
                <span style={{ fontWeight: activeSection === item.id ? "900" : "600", fontSize: "15px" }}>{item.id}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "auto", borderTop: "1px solid #1e293b", paddingTop: "24px" }}>
             <Button variant="danger" style={{ width: "100%", padding: "12px" }} onClick={handleLogout}>Secure Logoff</Button>
          </div>
        </nav>
      )}

      {/* Sidebar Overlay for Mobile */}
      {isMobile && sidebarOpen && loggedIn && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        />
      )}

      {/* Main Command Deck */}
      <div style={{ 
        flex: 1, 
        overflowY: "auto", 
        padding: isMobile ? "24px 16px" : "60px", 
        scrollBehavior: "smooth" 
      }}>

        <header style={{ marginBottom: "60px", display: "flex", justifyContent: "space-between", alignItems: "end" }}>
          <div>
            <h1 style={{ fontSize: "42px", fontWeight: "900", color: COLORS.secondary, margin: 0 }}>{activeSection}</h1>
            <p style={{ color: COLORS.muted, fontSize: "18px", marginTop: "4px" }}>Real-time Mandi Administration / {activeSection}</p>
          </div>
          <div style={{ background: "#fff", padding: "12px 24px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", fontWeight: "900", color: COLORS.secondary }}>
            📅 {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </header>

        {/* --- MODULE DISPATCHER --- */}
        <div style={{ animation: "fadeIn 0.6s ease-out" }}>

          {/* 14. Dashboard */}
          {activeSection === "Dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: isMobile ? "12px" : "24px" 
              }}>
                {[
                  { label: "Intake Today", val: "12,400 KG", color: "#fef3c7", bg: "#f59e0b", roles: ["Admin", "Operations Staff"] },
                  { label: "Sales Today", val: "₹ 8.24L", color: "#dcfce7", bg: "#16a34a", roles: ["Admin", "Accountant"] },
                  { label: "Outstanding", val: "₹ 14.5L", color: "#fee2e2", bg: "#dc2626", roles: ["Admin", "Accountant"] },
                  { label: "Payments rec.", val: "₹ 2.1L", color: "#dbeafe", bg: "#2563eb", roles: ["Admin", "Accountant"] },
                  { label: "Expenses", val: "₹ 42K", color: "#f3e8ff", bg: "#7c3aed", roles: ["Admin", "Accountant"] }
                ].filter(m => m.roles.includes(user.role)).map((m, i) => (
                  <Card key={i} style={{ background: m.color, border: "none", textAlign: "center", padding: isMobile ? "16px" : "24px" }}>
                    <p style={{ margin: 0, fontWeight: "800", color: m.bg, textTransform: "uppercase", fontSize: isMobile ? "10px" : "12px" }}>{m.label}</p>
                    <h2 style={{ fontSize: isMobile ? "20px" : "28px", margin: "12px 0 0", color: "#1e293b" }}>{m.val}</h2>
                  </Card>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1.2fr", gap: "32px" }}>
                <Card title="📈 Revenue Trajectory">
                  <div style={{ height: "350px" }}><Line data={{ labels: ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM"], datasets: [{ label: "Sales", data: [1.2, 3.4, 5.1, 4.8, 6.2, 8.2], borderColor: COLORS.accent, tension: 0.4 }] }} options={{ maintainAspectRatio: false }} /></div>
                </Card>
                <Card title="📦 Category Weightage">
                  <div style={{ height: "350px" }}><Pie data={{ labels: ["Mango", "Apple", "Grapes", "Citrus"], datasets: [{ data: [45, 25, 20, 10], backgroundColor: [COLORS.primary, COLORS.danger, COLORS.accent, COLORS.success] }] }} options={{ maintainAspectRatio: false }} /></div>
                </Card>
              </div>
            </div>
          )}

          {/* 3. User Roles */}
          {activeSection === "User Roles" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px" }}>
              {[
                { r: "Admin / Owner", f: ["Full Access Control", "System Configuration", "Strategic Reports & Analytics"] },
                { r: "Accountant", f: ["Manage Bills & Invoices", "Payment Processing", "Digital Ledger Reconciliation"] },
                { r: "Operations Staff", f: ["Supplier Inventory Entry", "Buyer Invoice Creation", "Lot ID & Stock Updates"] }
              ].map((role, i) => (
                <Card key={i} title={role.r} subtitle="Assigned Privileges">
                  <ul style={{ padding: 0, listStyle: "none" }}>
                    {role.f.map((feat, j) => <li key={j} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9", fontWeight: "600", color: COLORS.text }}>● {feat}</li>)}
                  </ul>
                  <Button variant="secondary" style={{ width: "100%", marginTop: "32px" }}>Edit Permissions</Button>
                </Card>
              ))}
            </div>
          )}

          {/* 4. Supplier Management */}
          {activeSection === "Supplier Management" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: "32px" }}>
              <Card title="Supplier Directory" subtitle="Manage high-volume marketplace suppliers">
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                  <Button variant="secondary" onClick={() => MandiService.exportExcel('suppliers')}>📊 Export to Excel</Button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "32px" }}>
                  <Input label="Supplier Name" placeholder="Full Identity" value={supplierForm.name} onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })} />
                  <Input label="Phone Number" placeholder="+91 xxxx..." value={supplierForm.phone} onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })} />
                  <Input label="Village / Address" placeholder="Source Origin" value={supplierForm.address} onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })} />
                  <Input label="Government ID" placeholder="Gov ID Number" value={supplierForm.govIdNumber} onChange={(e) => setSupplierForm({ ...supplierForm, govIdNumber: e.target.value })} />
                  <select
                    style={{ height: "54px", background: "#f8fafc", borderRadius: "14px", border: "2.5px solid #f1f5f9", padding: "0 14px", fontWeight: "700" }}
                    value={supplierForm.idType}
                    onChange={(e) => setSupplierForm({ ...supplierForm, idType: e.target.value })}
                  >
                    <option>Aadhaar</option><option>PAN Card</option><option>Voter ID</option>
                  </select>
                  <Input label="Bank Details" placeholder="IFSC / ACC #" value={supplierForm.bankDetails} onChange={(e) => setSupplierForm({ ...supplierForm, bankDetails: e.target.value })} />
                </div>
                <Input label="Admin Notes" placeholder="Trust level, quality history..." value={supplierForm.notes} onChange={(e) => setSupplierForm({ ...supplierForm, notes: e.target.value })} />
                <div style={{ display: "flex", gap: "12px" }}>
                  <Button onClick={handleRegisterSupplier} style={{ background: COLORS.success }}>💾 Save Supplier to Database</Button>
                </div>
                <table style={{ width: "100%", marginTop: "40px", borderCollapse: "collapse" }}>
                  <thead><tr style={{ background: "#f8fafc", textAlign: "left" }}><th>Name</th><th>Verification</th><th>Balance</th><th>Actions</th></tr></thead>
                  <tbody>
                    {suppliers.map(s => (
                      <tr key={s._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "20px 0" }}><b>{s.name}</b><br /><small>{s.address}</small></td>
                        <td><span style={{ padding: "4px 10px", background: "#dcfce7", color: "#166534", borderRadius: "20px", fontSize: "12px", fontWeight: "800" }}>AUTHENTICATED</span></td>
                        <td style={{ fontWeight: "900", color: COLORS.danger }}>₹ {s.balance || 0}</td>
                        <td><Button variant="secondary" style={{ padding: "6px 14px" }}>📜 History</Button></td>
                      </tr>
                    ))}
                    {suppliers.length === 0 && <tr><td colSpan="4" style={{ padding: "40px", textAlign: "center", color: COLORS.muted }}>No suppliers found. Add one above!</td></tr>}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* 5. Buyer Management */}
          {activeSection === "Buyer Management" && (
            <Card title="Buyer Ecosystem" subtitle="Customer profiles and credit tracking">
               <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                  <Button variant="secondary" onClick={() => MandiService.exportExcel('buyers')}>📊 Export to Excel</Button>
                </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
                <Input label="Buyer Name" placeholder="Full Name" value={buyerForm.name} onChange={(e) => setBuyerForm({ ...buyerForm, name: e.target.value })} />
                <Input label="Shop Name" placeholder="Business Entity" value={buyerForm.shopName} onChange={(e) => setBuyerForm({ ...buyerForm, shopName: e.target.value })} />
                <Input label="Phone" placeholder="Mobile" value={buyerForm.phone} onChange={(e) => setBuyerForm({ ...buyerForm, phone: e.target.value })} />
                <Input label="Credit Limit" placeholder="Max Debt" value={buyerForm.creditLimit} onChange={(e) => setBuyerForm({ ...buyerForm, creditLimit: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: "12px", marginBottom: "40px" }}>
                <Button onClick={handleOnboardBuyer} style={{ background: COLORS.success }}>💾 Save Buyer to Database</Button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {buyers.map(b => (
                  <div key={b._id} style={{ padding: "24px", background: "#f8fafc", borderRadius: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0" }}>
                    <div>
                      <b style={{ fontSize: "18px" }}>{b.shopName || b.name}</b>
                      <p style={{ margin: 0, color: COLORS.muted }}>Balance: <b style={{ color: COLORS.danger }}>{formatCurrency(b.outstanding)}</b></p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Button variant="secondary" style={{ padding: "8px 14px", fontSize: "12px" }}>History</Button>
                      <Button variant="secondary" style={{ padding: "8px 14px", fontSize: "12px" }}>Ledger</Button>
                    </div>
                  </div>
                ))}
                {buyers.length === 0 && <p style={{ color: COLORS.muted }}>No buyers onboarded.</p>}
              </div>
            </Card>
          )}

          {/* 6. Inventory Intake */}
          {activeSection === "Inventory Intake" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "32px" }}>
              <Card title="📥 Intake Form">
                <Input label="📅 Entry Date" type="date" value={new Date().toISOString().slice(0, 10)} />
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "800", color: COLORS.secondary, fontSize: "14px" }}>🏢 Select Supplier</label>
                  <select
                    style={{ height: "54px", width: "100%", background: "#f8fafc", borderRadius: "14px", border: "2.5px solid #f1f5f9", padding: "0 14px", fontWeight: "700" }}
                    value={intakeForm.supplierId}
                    onChange={(e) => setIntakeForm({ ...intakeForm, supplierId: e.target.value })}
                  >
                    <option value="">-- Choose Registered Supplier --</option>
                    {suppliers.map(s => <option key={s._id} value={s._id}>{s.name} ({s.address})</option>)}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Input label="📦 Product" placeholder="Mango / Apple" value={intakeForm.product} onChange={(e) => setIntakeForm({ ...intakeForm, product: e.target.value })} />
                  <Input label="🏷 Grade" placeholder="A+ / Export" value={intakeForm.variety} onChange={(e) => setIntakeForm({ ...intakeForm, variety: e.target.value })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Input label="⚖️ Quantity" placeholder="e.g. 50" value={intakeForm.quantity} onChange={(e) => setIntakeForm({ ...intakeForm, quantity: e.target.value })} />
                  <select
                    style={{ height: "54px", width: "100%", background: "#f8fafc", borderRadius: "14px", border: "2.5px solid #f1f5f9", padding: "0 14px", fontWeight: "700" }}
                    value={intakeForm.unit}
                    onChange={(e) => setIntakeForm({ ...intakeForm, unit: e.target.value })}
                  >
                    <option>KG</option><option>Metric Ton</option><option>Boxes</option>
                  </select>
                </div>
                <Input label="💰 Rate (Unit)" placeholder="Optional Market Rate" value={intakeForm.rate} onChange={(e) => setIntakeForm({ ...intakeForm, rate: e.target.value })} />
                <p style={{ color: COLORS.muted, fontSize: "12px" }}>Lot ID: <b style={{ color: COLORS.accent }}>LOT-{Date.now().toString().slice(-4)}</b> (Auto-Generated)</p>
                <div style={{ padding: "20px", border: "2px dashed #e2e8f0", borderRadius: "16px", textAlign: "center", cursor: "pointer", marginBottom: "20px" }}>
                  📷 Drop Produce or Bill Photos
                </div>
                <Button onClick={handleCreateLot} style={{ width: "100%" }}>Create Inventory Records</Button>
              </Card>
              <Card title="📦 Live Stock Intake" subtitle="Unallocated inventory awaiting buyer link">
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                  <Button variant="secondary" onClick={() => MandiService.exportExcel('inventory')} style={{ fontSize: "12px", padding: "8px 16px" }}>📊 Export Stock</Button>
                </div>
                {lots.map(lot => (
                  <div key={lot._id} style={{ padding: "20px", background: "#f8fafc", borderRadius: "16px", marginBottom: "16px", border: "1.5px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <b>{lot.lotId} / {lot.product}</b>
                      <span style={{ fontSize: "12px", background: COLORS.primary, padding: "2px 8px", borderRadius: "8px", fontWeight: "800" }}>{lot.remaining > 0 ? "IN STOCK" : "SOLD"}</span>
                    </div>
                    <p style={{ margin: "10px 0", fontSize: "14px" }}>Source: <b>{lot.supplier?.name}</b> | ⚖️ {lot.remaining} {lot.unit}</p>
                    <Button variant="secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>Link to Buyer</Button>
                  </div>
                ))}
                {lots.length === 0 && <p style={{ color: COLORS.muted }}>No inventory lots recorded.</p>}
              </Card>
            </div>
          )}

          {/* 7. Inventory Allocation */}
          {activeSection === "Inventory Allocation" && (
            <Card title="📤 Allocation Marketplace" subtitle="Track supplier-to-buyer distribution chain">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px" }}>
                <div style={{ borderRight: "1px solid #f1f5f9", paddingRight: "32px" }}>
                  <h4>Select Source Lot</h4>
                  {[1, 2].map(i => (
                    <div key={i} style={{ padding: "16px", background: i === 1 ? COLORS.secondary : "#f8fafc", color: i === 1 ? "#fff" : COLORS.text, borderRadius: "14px", marginBottom: "10px", cursor: "pointer" }}>
                      <b>LOT-992{i}</b><br /><small>{i === 1 ? "1,250 KG Available" : "3,000 KG Available"}</small>
                    </div>
                  ))}
                </div>
                <div>
                  <h4>Buyer Distribution (Split Lot Logic)</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "10px", alignItems: "end" }}>
                    <Input label="Target Buyer" placeholder="Search buyer..." />
                    <Input label="Qty to Allocate" placeholder="0" />
                    <Input label="Agreed Rate" placeholder="₹" />
                    <Button onClick={() => alert("📤 Allocation Mapping Sent to Matrix")} style={{ marginBottom: "20px" }}>Allocate</Button>
                  </div>
                  <table style={{ width: "100%", marginTop: "32px" }}>
                    <thead><tr style={{ textAlign: "left" }}><th>Lot ID</th><th>Buyer</th><th>Weight</th><th>Relationship</th></tr></thead>
                    <tbody>
                      <tr><td>LOT-9921</td><td>Suri Traders</td><td>500 KG</td><td><span style={{ color: COLORS.success }}>● Mapped</span></td></tr>
                      <tr><td>LOT-9921</td><td>Kalyan Wholesale</td><td>750 KG</td><td><span style={{ color: COLORS.success }}>● Mapped</span></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          )}

          {/* 8. Supplier Bill */}
          {activeSection === "Supplier Bill" && (
            <Card title="🧾 Digital Bill Composer" subtitle="Automatic calculations for physical mandi bills">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "32px" }}>
                <Input label="Bill Number" value="BL-00441" />
                <Input label="Entry Date" type="date" value={new Date().toISOString().slice(0, 10)} />
                <Input label="Supplier Identity" placeholder="Select registered supplier" />
              </div>
              <Card style={{ border: "2px solid #0f172a", marginBottom: "32px", padding: "40px" }}>
                <h2 style={{ textAlign: "center", textDecoration: "underline" }}>MANDI BILL STATEMENT</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", borderBottom: "2px solid #eee", paddingBottom: "10px", marginBottom: "20px", fontWeight: "900" }}>
                  <div>Product</div><div>Qty</div><div>Rate</div><div>Amt</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "32px" }}>
                  <div>🥭 Mango</div><div>1250</div><div>₹ 110</div><div>₹ 1,37,500</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
                  <div>
                    <h4>Expense Deductions</h4>
                    {[
                      { l: "Transport / Freight", v: 4200 },
                      { l: "Marketing Fees", v: 500 },
                      { l: "Labour / Coolie", v: 1200 },
                      { l: "Packing", v: 800 },
                      { l: "Miscellaneous", v: 300 }
                    ].map((ex, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                        <span>{ex.l}</span><b style={{ color: COLORS.danger }}>- {formatCurrency(ex.v)}</b>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>Gross Sale:</span> <b>{formatCurrency(137500)}</b></div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>Total Exp:</span> <b style={{ color: COLORS.danger }}>- {formatCurrency(7000)}</b></div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>Advance:</span> <b>- {formatCurrency(25000)}</b></div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", borderTop: "2px solid #334155", paddingTop: "12px", fontSize: "20px", fontWeight: "900", color: COLORS.success }}>
                      <span>Payable Net:</span> <span>{formatCurrency(105500)}</span>
                    </div>
                  </div>
                </div>
              </Card>
              <div style={{ display: "flex", gap: "16px" }}>
                <Button onClick={() => alert("💾 Bill saved! Use backend IDs to test PDF download.")}>💾 Save Data</Button>
                <Button variant="success" onClick={() => MandiService.downloadBillPDF('TEST_ID')} style={{ opacity: 0.6 }}>📄 Download PDF Bill</Button>
                <Button variant="secondary">🖨 Print</Button>
              </div>
            </Card>
          )}

          {/* 9. Buyer Invoice */}
          {activeSection === "Buyer Invoice" && (
            <Card title="📑 Buyer Dispatch Invoice" subtitle="Commission-integrated sales billing">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
                <Input label="Invoice ID" value="INV-9921" />
                <Input label="Dispatch Date" type="date" value={new Date().toISOString().slice(0, 10)} />
                <Input label="Buyer Mapping" placeholder="Search active buyers..." />
              </div>
              <div style={{ padding: "24px", background: "#f8fafc", borderRadius: "20px", marginBottom: "32px" }}>
                <h4 style={{ margin: "0 0 16px 0" }}>Additional Dispatch Charges</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  <Input label="Commission (%)" placeholder="e.g. 5" />
                  <Input label="Transport" placeholder="₹ 0.00" />
                  <Input label="Handling/Misc" placeholder="₹ 0.00" />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <Button variant="outline">Discard Draft</Button>
                <Button>Generate Invoice PDF</Button>
              </div>
            </Card>
          )}

          {/* 10. Ledger System */}
          {activeSection === "Ledger System" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <Button style={{ borderRadius: "40px" }}>Supplier Ledgers</Button>
                <Button variant="outline" style={{ borderRadius: "40px" }}>Buyer Ledgers</Button>
              </div>
              <Card title="Digital Ledger Feed" subtitle="Track supplier-to-buyer sales link in every entry">
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
                  <thead><tr style={{ textAlign: "left", color: COLORS.muted }}><th>Date</th><th>DOC #</th><th>Qty</th><th>Debit (-)</th><th>Credit (+)</th><th>Balance</th></tr></thead>
                  <tbody>
                    {[1, 2, 3].map(i => (
                      <tr key={i} style={{ background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                        <td style={{ padding: "20px", borderRadius: "16px 0 0 16px" }}>18/03/2026</td>
                        <td>TRX-00{i} <br /> <small style={{ color: COLORS.accent }}>LOT-9921</small></td>
                        <td>1,250 KG</td>
                        <td style={{ color: COLORS.danger }}>- ₹ 45,000</td>
                        <td style={{ color: COLORS.success }}>+ ₹ 1,20,000</td>
                        <td style={{ fontWeight: "900", borderRadius: "0 16px 16px 0" }}>{formatCurrency(i * 75000)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* 11. Payment Management */}
          {activeSection === "Payment Management" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              <Card title="Incoming Collections (Buyers)">
                <Input label="Source Entity" placeholder="Search Buyer Name..." />
                <Input label="Settlement Amount" placeholder="₹ 0.00" type="number" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <Button variant="outline" style={{ padding: "12px", fontSize: "13px" }}>💵 Cash</Button>
                  <Button variant="outline" style={{ padding: "12px", fontSize: "13px" }}>📲 UPI / Scan</Button>
                  <Button variant="outline" style={{ padding: "12px", fontSize: "13px" }}>🏦 Bank Transfer</Button>
                </div>
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                  <span style={{ padding: "6px 14px", background: "#f1f5f9", borderRadius: "10px", fontSize: "12px" }}>Partial</span>
                  <span style={{ padding: "6px 14px", background: "#f1f5f9", borderRadius: "10px", fontSize: "12px" }}>Advance</span>
                  <span style={{ padding: "6px 14px", background: COLORS.secondary, color: "white", borderRadius: "10px", fontSize: "12px" }}>Full Settlement</span>
                </div>
                <Button style={{ width: "100%" }}>Log Payment Entry</Button>
              </Card>
              <Card title="Outgoing Disbursements (Suppliers)">
                <Input label="Target Supplier" placeholder="Search Supplier Name..." />
                <Input label="Transfer Amount" placeholder="₹ 0.00" type="number" />
                <p style={{ color: COLORS.muted, fontSize: "12px" }}>Pending Net Payable: <b>₹ 1,05,500</b></p>
                <Button variant="secondary" style={{ width: "100%", marginTop: "24px" }}>Authorize Payout</Button>
              </Card>
            </div>
          )}

          {/* 12. Expense Management */}
          {activeSection === "Expense Management" && (
            <Card title="Operational Burn Registry" subtitle="Track expenses per transaction or daily cycle">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "40px" }}>
                {["Labour", "Transport", "Marketing", "Packing", "Misc"].map(cat => (
                  <div key={cat} style={{ padding: "24px", background: "#f8fafc", borderRadius: "20px", textAlign: "center", border: "1.5px solid #e2e8f0" }}>
                    <p style={{ margin: 0, fontWeight: "800", color: COLORS.muted }}>{cat}</p>
                    <h3 style={{ margin: "8px 0 0", color: COLORS.secondary }}>₹ 24,000</h3>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "32px" }}>
                <div>
                  <h3>Register New Expense Entry</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <Input label="Amount Paid" placeholder="₹" />
                    <Input label="Related Lot #" placeholder="Optional (TRX Link)" />
                  </div>
                  <Input label="Transaction Memo" placeholder="Fuel charges for Guntur route..." />
                  <Button>Commit to Ledger</Button>
                </div>
                <Card style={{ background: COLORS.secondary, color: "#fff" }}>
                  <h3>Audit Insights</h3>
                  <p>Operational costs are within <b>7.2%</b> of total sales volume today. Transport costs are peaking due to monsoon logistics.</p>
                  <Button variant="primary" style={{ marginTop: "20px", width: "100%" }}>View Expense Report</Button>
                </Card>
              </div>
            </Card>
          )}

          {/* 13. Verification & Compliance */}
          {activeSection === "Verification & Compliance" && (
            <Card title="Shield & Compliance Hub" subtitle="Identity verification for mandatory India KYC">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "40px" }}>
                <div>
                  <h3>New Identity Verification</h3>
                  <Input label="Aadhaar Number" placeholder="12-digit UID" />
                  <Input label="PAN Number" placeholder="Alpha-Numeric PAN" />
                  <Input label="Voter ID (Optional)" placeholder="Election ID #" />
                  <div style={{ padding: "40px", border: "3px dashed #f1f5f9", borderRadius: "20px", textAlign: "center", cursor: "pointer", marginBottom: "20px" }}>
                    📁 Upload Identity Documents (Scan/Photo)
                  </div>
                  <Button style={{ width: "100%" }}>Run KYC Audit</Button>
                </div>
                <div>
                  <h3>Onboarded KYC Status</h3>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ padding: "20px", borderRadius: "16px", background: "#f8fafc", marginBottom: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <b>{i === 1 ? "Srinivasa Rao" : i === 2 ? "Kalyan Wholesale" : "Venkatesh Mandi"}</b>
                        <p style={{ margin: 0, fontSize: "12px", color: COLORS.muted }}>Role: {i === 1 ? "Supplier" : "Buyer"}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ background: COLORS.success, color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "900" }}>VERIFIED</span>
                        <p style={{ margin: 0, fontSize: "10px", marginTop: "4px" }}>Vault ID: {Date.now().toString().slice(-6)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* 15. Reports */}
          {activeSection === "Reports" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {[
                { t: "Supplier Transaction Report", i: "🚚", d: "Deep dive into intake history & payouts" },
                { t: "Buyer Sales Report", i: "🛍", d: "Analyze buyer volume & credit patterns" },
                { t: "Inventory Movement Report", i: "📦", d: "Track stock flow from gate to dispatch" },
                { t: "Expense Audit Report", i: "💸", d: "Detailed category-wise burn analysis" },
                { t: "Financial Summary", i: "💹", d: "Consolidated P&L statement for owner" }
              ].map((rep, i) => (
                <Card key={i} style={{ textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: "40px", marginBottom: "16px" }}>{rep.i}</div>
                  <h3 style={{ margin: 0 }}>{rep.t}</h3>
                  <p style={{ fontSize: "13px", color: COLORS.muted, margin: "12px 0 20px" }}>{rep.d}</p>
                  <Button variant="outline" style={{ width: "100%" }}>Generate Record</Button>
                </Card>
              ))}
            </div>
          )}

          {/* 16. Search & Filters */}
          {activeSection === "Search & Filters" && (
            <Card title="Matrix Search Terminal" subtitle="Universal lookup for the Mandi ecosystem">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
                <Input placeholder="By Supplier Identity..." />
                <Input placeholder="By Buyer Name..." />
                <Input placeholder="By Core Product..." />
                <Input type="date" label="By Transaction Date" />
                <Input placeholder="By Invoice/Bill #" label="Document Number" />
                <Input placeholder="By Auto Lot ID" label="Tracking Reference" />
              </div>
              <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
                <Button variant="outline">Clear Matrix</Button>
                <Button>Execute Lookup</Button>
              </div>
              <div style={{ padding: "100px", textAlign: "center", border: "2px solid #f1f5f9", borderRadius: "32px", marginTop: "40px", color: COLORS.muted }}>
                <span style={{ fontSize: "48px" }}>🔎</span>
                <p>Results will populate here after a lookup is initialized.</p>
              </div>
            </Card>
          )}

          {/* 17. Document Management */}
          {activeSection === "Document Management" && (
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "32px" }}>
              <Card title="Repository Vault" subtitle="Archive for physical bill scans and KYC docs">
                <div style={{ padding: "60px", border: "4px dashed #f1f5f9", borderRadius: "32px", textAlign: "center", color: COLORS.muted, position: "relative" }}>
                  <span style={{ fontSize: "64px" }}>📂</span>
                  <h3 style={{ color: "#0f172a" }}>{uploading ? "⚡ Syncing Entry..." : "Vault Archive Queue"}</h3>
                  <p>Click to browse or drag documents into storage.</p>
                  <input 
                    type="file" 
                    onChange={handleFileUpload} 
                    style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} 
                    disabled={uploading}
                  />
                  <Button style={{ marginTop: "24px", width: "100%" }}>
                    {uploading ? "Synchronizing..." : "Initialize Batch Upload"}
                  </Button>
                </div>
              </Card>
              <Card title="Vault Records feed">
                <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                  {documents.length === 0 ? (
                    <p style={{ textAlign: "center", color: COLORS.muted, padding: "40px" }}>No documents in vault.</p>
                  ) : (
                    documents.map((doc) => (
                      <div key={doc._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#f8fafc", borderRadius: "16px", marginBottom: "12px", border: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                          <span style={{ fontSize: "28px" }}>{doc.docType === "Produce Photo" ? "🖼️" : "📄"}</span>
                          <div>
                            <p style={{ margin: 0, fontWeight: "800", fontSize: "14px" }}>{doc.originalName}</p>
                            <small style={{ color: COLORS.muted }}>{doc.docType} • {(doc.fileSize / 1024).toFixed(1)} KB</small>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <a href={doc.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                            <Button variant="secondary" style={{ padding: "8px 12px", fontSize: "12px" }}>View</Button>
                          </a>
                          <Button variant="danger" onClick={() => handleDeleteDoc(doc._id)} style={{ padding: "8px 12px", fontSize: "12px" }}>🗑️</Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}