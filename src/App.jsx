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

// --- JAMANGO DESIGN SYSTEM ---
const COLORS = {
  primary: "#345344", // Dark Forest Green from SPV text
  secondary: "#2B4538", // Slightly Darker Dark Forest Green
  bg: "#FDFBF4", // Very pleasant warm cream background
  card: "#FFFFFF",
  text: "#345344",
  muted: "#8E9E95",
  success: "#A0B763",
  danger: "#E96A6A",
  accent: "#A0B763",
  sidebar: "#345344"
};

const Card = ({ children, title, subtitle, action, style = {} }) => (
  <div style={{
    background: COLORS.card,
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    border: "1px solid #EBE9E1",
    ...style
  }}>
    {(title || action) && (
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          {title && <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: COLORS.secondary }}>{title}</h3>}
          {subtitle && <p style={{ margin: "4px 0 0 0", color: COLORS.muted, fontSize: "12px", fontWeight: "500" }}>{subtitle}</p>}
        </div>
        {action && action}
      </div>
    )}
    {children}
  </div>
);

const Input = ({ label, placeholder, type = "text", value, onChange }) => (
  <div style={{ marginBottom: "16px" }}>
    {label && <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: COLORS.secondary, fontSize: "12px" }}>{label}</label>}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #EBE9E1",
        background: "#F8F9FA", color: COLORS.text, outline: "none", fontWeight: "500", fontSize: "14px", transition: "all 0.2s"
      }}
      onFocus={(e) => (e.target.style.borderColor = COLORS.primary)}
      onBlur={(e) => (e.target.style.borderColor = "#EBE9E1")}
    />
  </div>
);

const Button = ({ children, onClick, variant = "primary", style = {} }) => {
  const styles = {
    primary: { background: COLORS.primary, color: "#fff" },
    secondary: { background: "#FFFFFF", color: COLORS.primary, border: `1px solid ${COLORS.primary}` },
    success: { background: COLORS.success, color: "#fff" },
    danger: { background: COLORS.danger, color: "#fff" },
    outline: { background: "transparent", color: COLORS.text, border: "1px solid #EBE9E1" }
  };
  return (
    <button onClick={onClick} style={{
      padding: "10px 20px", borderRadius: "8px", border: "none", fontWeight: "600", cursor: "pointer",
      transition: "all 0.2s", fontSize: "13px", ...styles[variant], ...style
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
      if (sRes.status === "SUCCESS") setSuppliers(sRes.data || []);

      const bRes = await MandiService.getBuyers();
      if (bRes.status === "SUCCESS") setBuyers(bRes.data || []);

      const lRes = await MandiService.getLots();
      if (lRes.status === "SUCCESS") setLots(lRes.data || []);

      const dRes = await MandiService.getDocuments();
      if (dRes.status === "SUCCESS") setDocuments(dRes.data || []);
    } catch (err) {
      console.error("API Connectivity Error:", err);
    }
  };

  const handleFileUpload = async (event, docType = "Other", relatedToType = "Other", relatedTo = null) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) return alert("VAULT LIMIT: Max size 10MB");

    setUploading(true);
    const res = await MandiService.uploadFile(file, docType, relatedToType, relatedTo);
    setUploading(false);

    if (res.status === "SUCCESS") {
      alert("ARCHIVED: File secured in Vault");
      fetchData();
    } else {
      alert(`VAULT ERROR: ${res.message}`);
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
    const res = await MandiService.login(authForm.username, authForm.password);
    if (res?.status === "SUCCESS") {
      setLoggedIn(true);
      setUser(res.data.user);
    } else {
      alert(`LOGIN FAILED: ${res?.message || 'Invalid Credentials'}`);
    }
  };

  const handleLogout = () => {
    MandiService.logout();
    setLoggedIn(false);
    setUser(null);
    setActiveSection("Dashboard");
  };

  // --- FORM HANDLERS ---
  const handleRegisterSupplier = async () => {
    if (!supplierForm.name || !supplierForm.phone) return alert("Name and Phone are required");
    const res = await MandiService.addSupplier(supplierForm);
    if (res?.status === "SUCCESS") {
      alert("SUCCESS: Supplier saved to database!");
      setSupplierForm({ name: "", phone: "", address: "", govIdNumber: "", idType: "Aadhaar", bankDetails: "", notes: "" });
      fetchData();
    } else {
      alert(`FAILED: ${res?.message || "Database Error"}`);
    }
  };

  const handleOnboardBuyer = async () => {
    if (!buyerForm.name || !buyerForm.phone) return alert("Name and Phone are required");
    const res = await MandiService.addBuyer(buyerForm);
    if (res.status === "SUCCESS") {
      alert("SUCCESS: Buyer details saved to database!");
      setBuyerForm({ name: "", shopName: "", phone: "", address: "", govIdNumber: "", idType: "Aadhaar", creditLimit: "", notes: "" });
      fetchData();
    } else {
      alert(`FAILED: ${res.message || "Database Error"}`);
    }
  };

  const handleCreateLot = async () => {
    if (!intakeForm.product || !intakeForm.quantity) return alert("Product and Qty are required");
    const res = await MandiService.addLot({
      ...intakeForm,
      supplier: intakeForm.supplierId || (suppliers[0]?._id)
    });
    if (res.status === "SUCCESS") {
      alert("SUCCESS: Inventory Lot recorded!");
      setIntakeForm({ supplierId: "", product: "", variety: "", quantity: "", unit: "KG", rate: "" });
      fetchData();
    } else {
      alert(`FAILED: ${res.message || "Database Error"}`);
    }
  };

  // --- MENU CONFIG ---
  const ALL_MENU = [
    { id: "Dashboard", icon: "📊", roles: ["Admin", "Accountant", "Operations Staff"] },
    { id: "User Roles", icon: "👥", roles: ["Admin"] },
    { id: "Supplier Management", icon: "🏢", roles: ["Admin", "Operations Staff"] },
    { id: "Buyer Management", icon: "💎", roles: ["Admin", "Operations Staff"] },
    { id: "Inventory Intake", icon: "📥", roles: ["Admin", "Operations Staff"] },
    { id: "Inventory Allocation", icon: "📤", roles: ["Admin", "Operations Staff"] },
    { id: "Supplier Bill", icon: "📜", roles: ["Admin", "Accountant"] },
    { id: "Buyer Invoice", icon: "📄", roles: ["Admin", "Accountant"] },
    { id: "Ledger System", icon: "📓", roles: ["Admin", "Accountant"] },
    { id: "Payment Management", icon: "💳", roles: ["Admin", "Accountant"] },
    { id: "Expense Management", icon: "💸", roles: ["Admin", "Accountant", "Operations Staff"] },
    { id: "Verification & Compliance", icon: "🛡️", roles: ["Admin"] },
    { id: "Reports", icon: "📋", roles: ["Admin", "Accountant"] },
    { id: "Search & Filters", icon: "🔍", roles: ["Admin", "Accountant", "Operations Staff"] },
    { id: "Document Management", icon: "📁", roles: ["Admin"] }
  ];

  const MENU = user ? ALL_MENU.filter(item => item.roles.includes(user.role)) : [];

  if (loading) return <div style={{ height: "100vh", background: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff" }}><h1>Syncing Matrix...</h1></div>;

  if (!loggedIn) {
    return (
      <div style={{ height: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card style={{ width: "420px", textAlign: "center", padding: "50px 40px", border: "none", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
             <div style={{ background: COLORS.accent, width: "64px", height: "64px", borderRadius: "32px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "24px", fontWeight: "800" }}>SPV</div>
          </div>
          <h1 style={{ margin: "10px 0 5px", fontWeight: "800", color: COLORS.secondary, fontSize: "28px", letterSpacing: "-0.5px" }}>SPV FRUITS</h1>
          <p style={{ color: COLORS.muted, marginBottom: "40px", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "600" }}>Orchard Admin</p>
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
      fontFamily: "'Inter', sans-serif" 
    }}>
      {/* MOBILE HEADER */}
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
          <h2 style={{ color: "#fff", margin: 0, fontSize: "20px" }}>Mandi ERP</h2>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "none", border: "none", color: "#fff", fontSize: "24px", cursor: "pointer" }}
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </div>
      )}

      {/* SIDE NAVIGATION */}
      {loggedIn && (
        <nav style={{ 
          width: isMobile ? "280px" : "260px", 
          background: COLORS.sidebar, 
          padding: "24px 0", 
          display: "flex", 
          flexDirection: "column",
          position: isMobile ? "fixed" : "relative",
          left: isMobile && !sidebarOpen ? "-280px" : "0",
          top: 0,
          bottom: 0,
          zIndex: 1100,
          transition: "left 0.3s ease-in-out",
          boxShadow: isMobile ? "4px 0 16px rgba(0,0,0,0.1)" : "none"
        }}>
          <div style={{ padding: "0 24px 32px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: COLORS.accent, width: "36px", height: "36px", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.secondary, fontSize: "14px", fontWeight: "800" }}>SPV</div>
            <div>
              <h2 style={{ color: "#ffffff", fontWeight: "700", fontSize: "16px", letterSpacing: "0px", margin: 0 }}>SPV FRUITS</h2>
              <p style={{ color: COLORS.accent, fontSize: "10px", margin: "2px 0 0", fontWeight: "600", textTransform: "uppercase" }}>Orchard Admin</p>
            </div>
          </div>
          
          <div style={{ padding: "0 24px", marginBottom: "12px" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", color: "#548265", textTransform: "uppercase", letterSpacing: "1px" }}>Overview</span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0 12px" }}>
            {MENU.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                style={{
                  padding: "10px 16px", borderRadius: "8px", marginBottom: "4px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s",
                  background: activeSection === item.id ? "rgba(255, 255, 255, 0.1)" : "transparent",
                  color: activeSection === item.id ? "#ffffff" : "#AEC4BB",
                  borderLeft: activeSection === item.id ? `4px solid ${COLORS.accent}` : "4px solid transparent"
                }}
              >
                <span style={{ fontSize: "16px", opacity: activeSection === item.id ? 1 : 0.7 }}>{item.icon}</span>
                <span style={{ fontWeight: activeSection === item.id ? "600" : "500", fontSize: "13px" }}>{item.id}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "auto", padding: "24px 24px 0", display: "flex", alignItems: "center", gap: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
             <div style={{ background: COLORS.accent, width: "32px", height: "32px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.secondary, fontSize: "12px", fontWeight: "800" }}>{user?.username?.[0]?.toUpperCase() || "U"}</div>
             <div style={{ flex: 1 }}>
                <p style={{ color: "#ffffff", fontSize: "13px", margin: 0, fontWeight: "600" }}>{user?.username || "Staff"}</p>
                <p style={{ color: "#AEC4BB", fontSize: "11px", margin: 0 }}>{user?.role}</p>
             </div>
             <button onClick={handleLogout} style={{ background: "none", border: "none", color: COLORS.accent, cursor: "pointer" }}>🚪</button>
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

        <header style={{ marginBottom: "60px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: COLORS.secondary, margin: 0 }}>Good morning, {user?.username || 'Admin'}</h1>
            <p style={{ color: COLORS.muted, fontSize: "14px", marginTop: "6px" }}>Here's what's happening at SPV Fruits today</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ background: "#EFECE0", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", color: COLORS.muted }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </header>

        {/* MODULES */}
        <div className="fadeIn">
          {activeSection === "Dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", 
                gap: "24px" 
              }}>
                {[
                  { label: "TOTAL REVENUE", val: "₹2,84,560", trend: "+12.4%", trendLabel: "vs last week", color: COLORS.success },
                  { label: "BOXES SOLD", val: "1,347", trend: "+8.1%", trendLabel: "vs last week", color: COLORS.success },
                  { label: "ORDERS TODAY", val: "218", subtitle: "34 pending", subLabel: "awaiting confirmation", color: "#F59E0B" },
                  { label: "ACTIVE STALLS", val: "6 / 8", subtitle: "2 offline", subLabel: "inventory low", color: COLORS.danger }
                ].map((m, i) => (
                  <Card key={i} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <p style={{ margin: 0, fontWeight: "600", color: COLORS.muted, fontSize: "11px", letterSpacing: "0.5px" }}>{m.label}</p>
                    <h2 style={{ fontSize: "28px", margin: "12px 0 8px", color: COLORS.secondary, fontWeight: "800" }}>{m.val}</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "600" }}>
                      {m.trend && <span style={{ background: "rgba(76, 175, 80, 0.1)", color: m.color, padding: "2px 6px", borderRadius: "4px" }}>{m.trend}</span>}
                      {m.subtitle && <span style={{ color: m.color }}>{m.subtitle}</span>}
                      <span style={{ color: COLORS.muted, fontWeight: "500" }}>{m.trendLabel || m.subLabel}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === "Supplier Management" && (
            <Card title="Supplier Directory" subtitle="Manage registered orchard suppliers">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
                <Input label="Supplier Name" placeholder="Full Name" value={supplierForm.name} onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })} />
                <Input label="Phone Number" placeholder="+91..." value={supplierForm.phone} onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })} />
                <Input label="Source Village" placeholder="Address" value={supplierForm.address} onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })} />
              </div>
              <Button onClick={handleRegisterSupplier}>Add Supplier</Button>
              <table style={{ width: "100%", marginTop: "40px", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#f8fafc", textAlign: "left" }}><th>Name</th><th>Location</th><th>Balance</th><th>Actions</th></tr></thead>
                <tbody>
                  {suppliers.map(s => (
                    <tr key={s._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "20px 0" }}><b>{s.name}</b></td>
                      <td>{s.address}</td>
                      <td style={{ fontWeight: "900", color: COLORS.danger }}>{formatCurrency(s.balance || 0)}</td>
                      <td><Button variant="outline" onClick={() => MandiService.deleteSupplier(s._id).then(fetchData)}>Purge</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {activeSection === "Buyer Management" && (
            <Card title="Buyer Ecosystem" subtitle="Customer profiles and credit tracking">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
                <Input label="Customer Name" placeholder="Full Name" value={buyerForm.name} onChange={(e) => setBuyerForm({ ...buyerForm, name: e.target.value })} />
                <Input label="Shop Name" placeholder="Business Name" value={buyerForm.shopName} onChange={(e) => setBuyerForm({ ...buyerForm, shopName: e.target.value })} />
                <Input label="Mobile" placeholder="Phone" value={buyerForm.phone} onChange={(e) => setBuyerForm({ ...buyerForm, phone: e.target.value })} />
              </div>
              <Button onClick={handleOnboardBuyer}>Register Customer</Button>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "40px" }}>
                {buyers.map(b => (
                  <Card key={b._id} style={{ background: "#f8fafc" }}>
                    <b>{b.shopName || b.name}</b>
                    <p>Debt: <b style={{ color: COLORS.danger }}>{formatCurrency(b.outstanding || 0)}</b></p>
                    <Button variant="outline" onClick={() => MandiService.deleteBuyer(b._id).then(fetchData)}>Delete Record</Button>
                  </Card>
                ))}
              </div>
            </Card>
          )}

          {activeSection === "Inventory Intake" && (
            <Card title="Logistics Intake Form" subtitle="Record vehicle arrivals and produce weight">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <select 
                    style={{ padding: "12px", borderRadius: "10px", border: "1px solid #EBE9E1" }} 
                    value={intakeForm.supplierId} 
                    onChange={e => setIntakeForm({...intakeForm, supplierId: e.target.value})}
                  >
                    <option value="">Choose Supplier...</option>
                    {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <Input label="Product" placeholder="Mango / Apple" value={intakeForm.product} onChange={e => setIntakeForm({...intakeForm, product: e.target.value})} />
                  <Input label="Weight" placeholder="Total Qty" value={intakeForm.quantity} onChange={e => setIntakeForm({...intakeForm, quantity: e.target.value})} />
                  <Button onClick={handleCreateLot}>Initialize Lot</Button>
                </div>
              </div>
            </Card>
          )}

          {activeSection === "Ledger System" && (
            <Card title="Universal Ledger" subtitle="Searchable financial history">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ textAlign: "left", color: "#666", fontSize: "12px" }}><th>DATE</th><th>REF</th><th>TYPE</th><th>DEBIT</th><th>CREDIT</th></tr></thead>
                <tbody>
                   <tr style={{ background: "#fff", borderBottom: "1px solid #eee" }}><td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "#999" }}>Live ledger synchronization active. Select a party to view.</td></tr>
                </tbody>
              </table>
            </Card>
          )}

          {/* ADD OTHER SECTIONS AS NEEDED BASED ON PREVIOUS UI */}
          {!["Dashboard", "Supplier Management", "Buyer Management", "Inventory Intake", "Ledger System"].includes(activeSection) && (
            <Card title={activeSection}>
              <p style={{ color: "#999" }}>The {activeSection} module is being initialized based on your deployment settings.</p>
              <Button onClick={() => setActiveSection("Dashboard")}>Return to Command Deck</Button>
            </Card>
          )}
        </div>

        <footer style={{ marginTop: "100px", padding: "40px 0", borderTop: "1px solid #EBE9E1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <p style={{ color: COLORS.muted, fontSize: "12px" }}>© 2026 SPV FRUITS ERP • Matrix Node: Online</p>
           <div style={{ display: "flex", gap: "24px" }}>
              <a href="https://mandi-biwu3j9e0-saipriya7416s-projects.vercel.app/" target="_blank" rel="noreferrer" style={{ color: COLORS.muted, fontSize: "12px", textDecoration: "none" }}>Deployment URL</a>
              <span style={{ color: COLORS.muted, fontSize: "12px" }}>System v4.1.2</span>
           </div>
        </footer>

      </div>
    </div>
  );
}
