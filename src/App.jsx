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
  bg: "#FDFBF4", // Very pleasant warm cream background from the logo
  card: "#FFFFFF",
  text: "#345344", // Matching logo text color
  muted: "#8E9E95", // Muted light green-grey
  success: "#A0B763",
  danger: "#E96A6A",
  accent: "#A0B763", // Light Olive/Mango Green from graphic
  sidebar: "#345344" // Exact Logo SPV Dark Green for the left menu
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

const DB = {
  Fruits: ["Apple", "Apricot", "Avocado", "Banana", "Blackberry", "Blueberry", "Cherry", "Coconut", "Dragon Fruit", "Fig", "Grapes", "Guava", "Kiwi", "Lemon", "Mango", "Orange", "Papaya", "Peach", "Pear", "Pineapple", "Plum", "Pomegranate", "Strawberry", "Watermelon"],
  Vegetables: ["Ash Gourd", "Beetroot", "Brinjal", "Broccoli", "Cabbage", "Capsicum", "Carrot", "Cauliflower", "Cucumber", "Drumstick", "Garlic", "Ginger", "Green Chilli", "Lady Finger", "Onion", "Potato", "Pumpkin", "Radish", "Spinach", "Sweet Corn", "Tomato"]
};

const PRODUCT_DATA = {
  "Apple": {
    varieties: ["Fuji", "Gala", "Granny Smith", "Red Delicious", "Golden Delicious", "Honeycrisp", "Ambrosia", "Pink Lady", "McIntosh", "Empire"],
    sizes: ["Small", "Medium", "Large", "Extra Large"],
    colors: ["Dark Red", "Light Red", "Green", "Yellow", "Mixed"]
  },
  "Mango": {
    varieties: ["Alphonso", "Kesar", "Banganapalli", "Langra", "Dasheri", "Totapuri", "Sindhura", "Neelam"],
    sizes: ["Small (150g)", "Medium (250g)", "Large (350g+)", "Jumbo"],
    colors: ["Yellow", "Orange", "Light Green", "Green", "Reddish"]
  },
  "Banana": {
    varieties: ["Cavendish", "Robusta", "Red Banana", "Poovan", "Nendran"],
    sizes: ["Small", "Medium", "Large", "Extra Large (Hands)"],
    colors: ["Green", "Yellow", "Yellow-Green", "Red"]
  },
  "Tomato": {
    varieties: ["Roma", "Cherry", "Beefsteak", "Heirloom", "Grape"],
    sizes: ["Small", "Medium", "Large"],
    colors: ["Red", "Orange", "Yellow", "Green"]
  },
  "Onion": {
    varieties: ["Red Onion", "White Onion", "Yellow Onion", "Sweet Onion", "Shallot"],
    sizes: ["Small (< 40mm)", "Medium (40-60mm)", "Large (60-80mm)", "Jumbo (> 80mm)"],
    colors: ["Red", "White", "Yellow", "Brown"]
  },
  "Grapes": {
    varieties: ["Thompson Seedless", "Flame Seedless", "Sharad Seedless", "Crimson", "Black Globe"],
    sizes: ["Small Berry", "Medium Berry", "Large Berry"],
    colors: ["Green", "Black", "Red", "Mixed"]
  },
  "default": {
    varieties: ["Standard", "Premium", "Local", "Hybrid"],
    sizes: ["Small", "Medium", "Large", "Extra Large"],
    colors: ["Standard", "Mixed", "Green", "Red", "Yellow", "Orange"]
  }
};

const getProductData = (productName) => PRODUCT_DATA[productName] || PRODUCT_DATA["default"];

const TabHeader = ({ tabs, active, set }) => (
  <div style={{ display: "flex", gap: "32px", borderBottom: "1px solid #EBE9E1", marginBottom: "32px", overflowX: "auto" }}>
    {tabs.map(t => (
      <div key={t} onClick={() => set(t)} style={{ padding: "0 0 12px 0", cursor: "pointer", fontWeight: "700", fontSize: "14px", color: active === t ? COLORS.sidebar : COLORS.muted, borderBottom: active === t ? `3px solid ${COLORS.accent}` : "3px solid transparent", transition: "all 0.2s", whiteSpace: "nowrap" }}>{t}</div>
    ))}
  </div>
);

const FormGrid = ({ sections }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
    {sections.map((sec, i) => (
      <div key={i} style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "800", color: COLORS.sidebar, borderBottom: "1px solid #EBE9E1", paddingBottom: "16px", marginBottom: "24px", marginTop: 0 }}>{sec.title}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
          {sec.fields.map((f, j) => (
            <div key={j} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>{f.label}</label>
              {f.type === 'select' ? (
                <select value={f.value} defaultValue={f.value === undefined ? f.defaultValue : undefined} onChange={f.onChange} disabled={f.disabled} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", background: f.disabled ? "#FDFBF4" : "#FFFFFF", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600", appearance: "none" }}>
                  <option value="" disabled selected={f.value === undefined}>Select {f.label}</option>
                  {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type || 'text'} list={f.list} placeholder={f.placeholder || ''} disabled={f.disabled} value={f.value} defaultValue={f.value === undefined ? f.defaultValue : undefined} onChange={f.onChange} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", background: f.disabled ? "#FDFBF4" : "#FFFFFF", color: f.disabled ? COLORS.muted : COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// --- MAIN ARCHITECTURE ---
export default function App() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [activeSupplierTab, setActiveSupplierTab] = useState("Supplier Registration");
  const [activeBuyerTab, setActiveBuyerTab] = useState("Buyer Registration");
  const [activeUserRoleTab, setActiveUserRoleTab] = useState("Supplier");
  const [dispatchProduct, setDispatchProduct] = useState("");
  const [poProduct, setPoProduct] = useState("");
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
    const res = await MandiService.login(authForm.username, authForm.password);
    if (res?.status === "SUCCESS") {
      setLoggedIn(true);
      setUser(res.data.user);
    } else {
      alert(`❌ LOGIN FAILED: ${res?.message || 'Invalid Credentials'}`);
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
    if (res?.status === "SUCCESS") {
      alert("💾 SUCCESS: Supplier saved to MongoDB!");
      setSupplierForm({ name: "", phone: "", address: "", govIdNumber: "", idType: "Aadhaar", bankDetails: "", notes: "" });
      fetchData();
    } else {
      alert(`❌ FAILED: ${res?.message || "Database Error"}`);
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
    const res = await MandiService.addLot({
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
        <Card style={{ width: "420px", textAlign: "center", padding: "50px 40px" }}>
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
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" 
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

      {/* 1. SIDE NAVIGATION (Jamango Style) */}
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
                  padding: item.isSub ? "8px 16px 8px 36px" : "10px 16px", borderRadius: "8px", marginBottom: "4px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s",
                  background: activeSection === item.id ? "rgba(255, 255, 255, 0.1)" : "transparent",
                  color: activeSection === item.id ? "#ffffff" : "#AEC4BB",
                  borderLeft: activeSection === item.id ? `4px solid ${COLORS.accent}` : "4px solid transparent"
                }}
              >
                <span style={{ fontSize: item.isSub ? "14px" : "16px", opacity: activeSection === item.id ? 1 : 0.7 }}>{item.icon}</span>
                <span style={{ fontWeight: activeSection === item.id ? "600" : "500", fontSize: item.isSub ? "12px" : "13px" }}>{item.id}</span>
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

        <header style={{ marginBottom: "60px", display: "flex", justifyContent: "space-between", alignItems: "end" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "700", color: COLORS.secondary, margin: 0 }}>Good morning, {user?.name?.split(' ')[0] || user?.username || 'Admin'}</h1>
              <p style={{ color: COLORS.muted, fontSize: "14px", marginTop: "6px" }}>Here's what's happening at SPV Fruits today</p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ background: "#EFECE0", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", color: COLORS.muted }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <div style={{ background: "#FFFFFF", border: "1px solid #EBE9E1", width: "36px", height: "36px", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: COLORS.sidebar, boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                 🔔
              </div>
            </div>
          </div>
        </header>

        {/* --- MODULE DISPATCHER --- */}
        <div style={{ animation: "fadeIn 0.6s ease-out" }}>

          {/* 14. Dashboard */}
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
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr", gap: "24px", marginTop: "0px" }}>
                {/* Recent Orders */}
                <Card action={<span style={{ color: COLORS.sidebar, fontWeight: "600", fontSize: "12px", cursor: "pointer" }}>View all &rarr;</span>} title="Recent Orders" style={{ padding: "24px 0 0 0" }}>
                  <div className="menu-scroll" style={{ marginTop: "20px", maxHeight: "380px", overflowY: "auto", paddingRight: "8px" }}>
                    {[
                      { initials: "PR", name: "Priya Reddy", desc: "2 x Alphonso Box • Hyderabad", amount: "₹1,240", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "SM", name: "Sanjay Mehta", desc: "5 x Kesar Box • Secunderabad", amount: "₹3,100", status: "In Transit", statusCol: "#3B82F6" },
                      { initials: "AK", name: "Ananya Kumar", desc: "1 x Langra Box • Banjara Hills", amount: "₹580", status: "Pending", statusCol: "#F59E0B" },
                      { initials: "VS", name: "Vikram Sharma", desc: "3 x Alphonso Box • Jubilee Hills", amount: "₹1,860", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "DM", name: "Deepa Menon", desc: "4 x Kesar Box • Madhapur", amount: "₹2,480", status: "In Transit", statusCol: "#3B82F6" },
                      { initials: "SR", name: "Srinivas Rao", desc: "1 x Alphonso Box • Gachibowli", amount: "₹620", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "LN", name: "Lakshmi Narayana", desc: "10 x Kesar Box • Kukatpally", amount: "₹6,200", status: "Pending", statusCol: "#F59E0B" },
                      { initials: "VB", name: "Venkatesh Babu", desc: "3 x Langra Box • Ameerpet", amount: "₹1,740", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "SK", name: "Sai Krishna", desc: "2 x Dasheri Box • Kondapur", amount: "₹1,100", status: "In Transit", statusCol: "#3B82F6" },
                      { initials: "BP", name: "Bhanu Prakash", desc: "5 x Alphonso Box • Miyapur", amount: "₹3,100", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "RS", name: "Ramya Sri", desc: "1 x Kesar Box • Dilsukhnagar", amount: "₹620", status: "Pending", statusCol: "#F59E0B" },
                      { initials: "HN", name: "Harika Naidu", desc: "8 x Badami Box • SR Nagar", amount: "₹3,840", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "KV", name: "Karthik Varma", desc: "2 x Langra Box • RTC X Roads", amount: "₹1,160", status: "In Transit", statusCol: "#3B82F6" },
                      { initials: "PR", name: "Prasad Reddy", desc: "4 x Alphonso Box • LB Nagar", amount: "₹2,480", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "SC", name: "Swapna Chowdary", desc: "3 x Kesar Box • KPHB", amount: "₹1,860", status: "Pending", statusCol: "#F59E0B" },
                      { initials: "TG", name: "Tejaswini Goud", desc: "1 x Banganapalli Box • Begumpet", amount: "₹450", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "SK", name: "Shiva Kumar", desc: "6 x Alphonso Box • Uppal", amount: "₹3,720", status: "In Transit", statusCol: "#3B82F6" },
                      { initials: "MB", name: "Mahesh Babu", desc: "2 x Kesar Box • Panjagutta", amount: "₹1,240", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "PA", name: "Pavani Akula", desc: "3 x Langra Box • Somajiguda", amount: "₹1,740", status: "Pending", statusCol: "#F59E0B" },
                      { initials: "SD", name: "Sujatha Devi", desc: "1 x Alphonso Box • Tarnaka", amount: "₹620", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "MC", name: "Mohan Chandra", desc: "7 x Kesar Box • ECIL", amount: "₹4,340", status: "In Transit", statusCol: "#3B82F6" },
                      { initials: "SG", name: "Suresh Goud", desc: "4 x Banganapalli Box • Bowenpally", amount: "₹1,800", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "DS", name: "Divya Sree", desc: "2 x Alphonso Box • Malkajgiri", amount: "₹1,240", status: "Pending", statusCol: "#F59E0B" },
                      { initials: "RR", name: "Rajeshwar Rao", desc: "5 x Kesar Box • Alwal", amount: "₹3,100", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "AK", name: "Anil Kumar", desc: "1 x Langra Box • Tolichowki", amount: "₹580", status: "In Transit", statusCol: "#3B82F6" },
                      { initials: "SN", name: "Surya Narayana", desc: "3 x Alphonso Box • Mehdipatnam", amount: "₹1,860", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "KR", name: "Kalyani Rani", desc: "2 x Kesar Box • Attapur", amount: "₹1,240", status: "Pending", statusCol: "#F59E0B" },
                      { initials: "MY", name: "Manoj Yadav", desc: "4 x Banganapalli Box • Chandanagar", amount: "₹1,800", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "RR", name: "Rakesh Reddy", desc: "6 x Alphonso Box • Gachibowli", amount: "₹3,720", status: "In Transit", statusCol: "#3B82F6" },
                      { initials: "SR", name: "Swathi Reddy", desc: "1 x Kesar Box • Hitech City", amount: "₹620", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "MC", name: "Mounika Chowdary", desc: "3 x Langra Box • Madhapur", amount: "₹1,740", status: "Pending", statusCol: "#F59E0B" },
                      { initials: "NB", name: "Nani Babu", desc: "2 x Alphonso Box • Jubilee Hills", amount: "₹1,240", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "PK", name: "Praveen Kumar", desc: "5 x Kesar Box • Banjara Hills", amount: "₹3,100", status: "In Transit", statusCol: "#3B82F6" },
                      { initials: "KR", name: "Koteswara Rao", desc: "1 x Banganapalli Box • Nanakramguda", amount: "₹450", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "RN", name: "Ramesh Naidu", desc: "4 x Alphonso Box • Manikonda", amount: "₹2,480", status: "Pending", statusCol: "#F59E0B" },
                      { initials: "NR", name: "Nagarjuna Raju", desc: "3 x Kesar Box • Gachibowli", amount: "₹1,860", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "GM", name: "Geetha Madhuri", desc: "2 x Langra Box • Kondapur", amount: "₹1,160", status: "In Transit", statusCol: "#3B82F6" },
                      { initials: "HK", name: "Hari Krishna", desc: "1 x Alphonso Box • Hafeezpet", amount: "₹620", status: "Confirmed", statusCol: "#4CAF50" },
                      { initials: "VB", name: "Veera Babu", desc: "5 x Kesar Box • Miyapur", amount: "₹3,100", status: "Pending", statusCol: "#F59E0B" },
                      { initials: "SV", name: "Sandeep Varma", desc: "4 x Banganapalli Box • Chandanagar", amount: "₹1,800", status: "Confirmed", statusCol: "#4CAF50" },
                    ].map((order, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderTop: "1px solid #EBE9E1", borderBottom: i === 39 ? "none" : "" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <div style={{ background: "#F1F5EB", color: COLORS.sidebar, width: "36px", height: "36px", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700" }}>{order.initials}</div>
                          <div>
                            <p style={{ margin: 0, fontWeight: "600", color: COLORS.text, fontSize: "14px" }}>{order.name}</p>
                            <p style={{ margin: "2px 0 0", color: COLORS.muted, fontSize: "12px" }}>{order.desc}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ margin: 0, fontWeight: "700", color: COLORS.text, fontSize: "14px" }}>{order.amount}</p>
                          <p style={{ margin: "4px 0 0", color: order.statusCol, fontSize: "11px", fontWeight: "600" }}>{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Stall Inventory */}
                <Card action={<span style={{ color: COLORS.sidebar, fontWeight: "600", fontSize: "12px", cursor: "pointer" }}>Manage &rarr;</span>} title="Stall Inventory">
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                    {[
                      { name: "Jubilee Hills", units: "142", border: "#EBE9E1", bar: COLORS.success, pct: "75%" },
                      { name: "Banjara Hills", units: "89", border: "#EBE9E1", bar: COLORS.success, pct: "50%" },
                      { name: "Madhapur", units: "203", border: "#EBE9E1", bar: COLORS.success, pct: "85%" },
                      { name: "Secunderabad", units: "12", border: "#FAD8D8", bar: COLORS.danger, pct: "15%", bg: "#FFF5F5" }
                    ].map((stall, i) => (
                      <div key={i} style={{ border: `1px solid ${stall.border}`, background: stall.bg || "#FAFAF8", borderRadius: "8px", padding: "16px" }}>
                        <p style={{ margin: 0, fontWeight: "700", color: COLORS.text, fontSize: "13px" }}>{stall.name}</p>
                        <h2 style={{ margin: "10px 0 2px", fontWeight: "800", color: stall.border === "#FAD8D8" ? COLORS.danger : COLORS.sidebar, fontSize: "24px" }}>{stall.units}</h2>
                        <p style={{ margin: "0 0 12px", color: COLORS.muted, fontSize: "11px", fontWeight: "500" }}>units remaining</p>
                        <div style={{ height: "4px", background: "#E2E8F0", borderRadius: "2px", width: "100%", overflow: "hidden" }}>
                          <div style={{ height: "100%", background: stall.bar, width: stall.pct, borderRadius: "2px" }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr", gap: "24px", marginTop: "-16px" }}>
                {/* Boxes Sold Chart */}
                <Card title="Boxes Sold — This Week">
                  <div style={{ height: "200px", marginTop: "24px", width: "100%" }}>
                    <Bar 
                      data={{ 
                        labels: ["", "", "", "", "", "", ""], 
                        datasets: [{ 
                          label: "Sales", 
                          data: [65, 45, 80, 75, 120, 60, 40], 
                          backgroundColor: ["#CDE09C", "#CDE09C", "#CDE09C", "#CDE09C", COLORS.sidebar, "#CDE09C", "#CDE09C"],
                          borderRadius: 4,
                          borderSkipped: false,
                          barPercentage: 0.95,
                          categoryPercentage: 0.95
                        }] 
                      }} 
                      options={{ 
                        maintainAspectRatio: false, 
                        plugins: { legend: { display: false }, tooltip: { enabled: false } },
                        scales: {
                          x: { grid: { display: false }, border: { display: false }, ticks: { display: false } },
                          y: { grid: { display: false }, border: { display: false }, ticks: { display: false } }
                        }
                      }} 
                    />
                  </div>
                </Card>

                {/* Today's Staff */}
                <Card action={<span style={{ color: COLORS.sidebar, fontWeight: "600", fontSize: "12px", cursor: "pointer" }}>Schedule &rarr;</span>} title="Today's Staff">
                  <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "28px" }}>
                    {[
                      { name: "Ravi Kumar", role: "Delivery Driver", time: "08:00–16:00" },
                      { name: "Meera Devi", role: "Stall Manager", time: "09:00–17:00" },
                      { name: "Sunil Varma", role: "Store keeper", time: "06:00–14:00" },
                      { name: "Kiran Bhai", role: "Logistics", time: "10:00–18:00" }
                    ].map((staff, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "4px", background: COLORS.accent }}></div>
                          <div>
                            <p style={{ margin: 0, fontWeight: "600", color: COLORS.sidebar, fontSize: "13px" }}>{staff.name}</p>
                            <p style={{ margin: "2px 0 0", color: COLORS.muted, fontSize: "11px" }}>{staff.role}</p>
                          </div>
                        </div>
                        <p style={{ margin: 0, fontWeight: "500", color: COLORS.muted, fontSize: "12px" }}>{staff.time}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* 3. Global Entity Roles Router */}
          {activeSection === "User Roles" && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "1px solid #EBE9E1", paddingBottom: "24px" }}>
               <div>
                  <h2 style={{ fontSize: "28px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>Business Profile Ecosystem</h2>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <div 
                      onClick={() => setActiveUserRoleTab("Supplier")}
                      style={{ padding: "10px 24px", cursor: "pointer", fontWeight: "700", background: activeUserRoleTab === "Supplier" ? COLORS.sidebar : "#F3F1EA", color: activeUserRoleTab === "Supplier" ? "#FFFFFF" : COLORS.muted, borderRadius: "8px", transition: "all 0.2s" }}
                    >🏢 Supplier Pipeline</div>
                    <div 
                      onClick={() => setActiveUserRoleTab("Buyer")}
                      style={{ padding: "10px 24px", cursor: "pointer", fontWeight: "700", background: activeUserRoleTab === "Buyer" ? COLORS.sidebar : "#F3F1EA", color: activeUserRoleTab === "Buyer" ? "#FFFFFF" : COLORS.muted, borderRadius: "8px", transition: "all 0.2s" }}
                    >💎 Buyer Pipeline</div>
                  </div>
               </div>
            </div>
          )}

          {/* Supplier Role Module */}
          {activeSection === "User Roles" && activeUserRoleTab === "Supplier" && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              
              <TabHeader tabs={["Supplier Registration", "Dispatch Entry", "Supplier Accounts"]} active={activeSupplierTab} set={setActiveSupplierTab} />

              {activeSupplierTab === "Supplier Registration" && (
                <div>
                  <FormGrid sections={[
                    {
                      title: "Basic Details",
                      fields: [
                        { label: "Supplier ID", disabled: true, value: "SUP-A2890" },
                        { label: "Full Name", placeholder: "Enter name" },
                        { label: "Mobile Number", type: "tel" },
                        { label: "Alternate Mobile / Landline", type: "tel" },
                        { label: "WhatsApp Number", type: "tel" },
                        { label: "Email", type: "email" },
                        { label: "Local / Non-Local", type: "select", options: ["Local", "Non-Local"] },
                        { label: "Address", placeholder: "Street/Village" },
                        { label: "City" },
                        { label: "District" },
                        { label: "Pincode" },
                        { label: "State" },
                        { label: "Country", value: "India" },
                        { label: "GST Number" },
                        { label: "Aadhaar / PAN Number" },
                        { label: "Business Name" },
                        { label: "Registration Date", type: "date", value: new Date().toISOString().slice(0, 10) }
                      ]
                    },
                    {
                      title: "Additional Business Details",
                      fields: [
                        { label: "Preferred Payment Method", type: "select", options: ["Bank Transfer (RTGS/NEFT)", "UPI", "Cash", "Cheque"] },
                        { label: "Credit Limit (₹)", type: "number", placeholder: "0.00" },
                        { label: "Supplier Category", type: "select", options: ["Farmer", "Wholesaler", "Broker", "Agent"] },
                        { label: "Transport Availability", type: "select", options: ["Yes - Own Transport", "No - Requires Pickup"] },
                        { label: "Remarks / Notes" }
                      ]
                    }
                  ]} />
                  <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                    <Button style={{ background: COLORS.sidebar }}>Submit Details</Button>
                    <Button variant="secondary">Save Draft</Button>
                    <Button variant="outline">Edit</Button>
                    <Button variant="danger" style={{ background: "#F1F5F9", color: COLORS.danger, border: "none" }}>Cancel All</Button>
                  </div>
                </div>
              )}

              {activeSupplierTab === "Dispatch Entry" && (
                <div>
                  <FormGrid sections={[
                    {
                      title: "Product Identity & Dispatch",
                      fields: [
                        { label: "Dispatch ID", disabled: true, value: "DSP-55921" },
                        { label: "Supplier Name", type: "select", options: ["Srinivas Rao", "Priya Reddy", "Mohan Chandra", "Harika Naidu"] },
                        { label: "Product Type", type: "select", options: ["Fruits", "Vegetables"] },
                        { label: "Product Name", list: "product-list", placeholder: "Type to search...", value: dispatchProduct, onChange: (e) => setDispatchProduct(e.target.value) },
                        { label: "Variety", type: "select", options: getProductData(dispatchProduct).varieties },
                        { label: "Size Grade", type: "select", options: getProductData(dispatchProduct).sizes },
                        { label: "Color Grade", type: "select", options: getProductData(dispatchProduct).colors },
                        { label: "Quality Grade", type: "select", options: ["A Grade (Premium)", "B Grade", "C Grade"] },
                        { label: "Category", type: "select", options: ["Organic", "Inorganic"] }
                      ]
                    },
                    {
                      title: "Logistics & Commercials",
                      fields: [
                        { label: "Unit Cost (₹)", type: "number", placeholder: "0.00" },
                        { label: "Quantity", type: "number", placeholder: "0" },
                        { label: "Unit Type", type: "select", options: ["KG", "Box", "Ton", "Crate"] },
                        { label: "Number of Trucks", type: "number", placeholder: "1" },
                        { label: "Truck Number", placeholder: "TS 09 EU 1234" },
                        { label: "Driver Name" },
                        { label: "Driver Mobile", type: "tel" },
                        { label: "Loading Date", type: "date", value: new Date().toISOString().slice(0, 10) },
                        { label: "Destination" },
                        { label: "Total Cost (₹)", type: "number", disabled: true, value: "Auto-calculated" },
                        { label: "Tax (%)", type: "number", value: "5" },
                        { label: "Extra Charges (₹)", type: "number", placeholder: "0.00" },
                        { label: "Net Total (₹)", type: "number", disabled: true, value: "Auto-calculated" },
                        { label: "Remarks" }
                      ]
                    }
                  ]} />
                  <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                    <Button style={{ background: COLORS.sidebar }}>Save Record</Button>
                    <Button variant="secondary">Update Record</Button>
                    <Button style={{ background: COLORS.success }}>Generate Invoice</Button>
                    <Button variant="outline">Cancel Action</Button>
                  </div>

                  <div style={{ marginTop: "40px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "800", color: COLORS.sidebar, marginBottom: "16px", borderBottom: "1px solid #EBE9E1", paddingBottom: "12px" }}>Recent Dispatches</h3>
                    <div style={{ overflowX: "auto", background: "#FFFFFF", borderRadius: "12px", border: "1px solid #EBE9E1" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                        <thead>
                          <tr style={{ background: "#FDFBF4", textAlign: "left", color: COLORS.muted }}>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Dispatch ID</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Supplier</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Product Info</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Logistics</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Net Total</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { id: "DSP-55920", supplier: "Priya Reddy", product: "Apple (Fuji) • Premium", logistics: "20 Box • TS09 EU 1234", amount: "₹45,000", status: "In Transit" },
                            { id: "DSP-55919", supplier: "Srinivas Rao", product: "Mango (Alphonso) • A Grade", logistics: "50 Box • AP28 BW 9091", amount: "₹82,500", status: "Delivered" },
                            { id: "DSP-55918", supplier: "Mohan Chandra", product: "Tomato (Roma) • Standard", logistics: "15 Ton • TS07 CD 4455", amount: "₹18,000", status: "Delivered" }
                          ].map((d, i) => (
                            <tr key={i} style={{ borderBottom: i === 2 ? "none" : "1px solid #EBE9E1" }}>
                              <td style={{ padding: "16px", fontWeight: "600", color: COLORS.sidebar }}>{d.id}</td>
                              <td style={{ padding: "16px", color: COLORS.text }}>{d.supplier}</td>
                              <td style={{ padding: "16px", color: COLORS.text }}>{d.product}</td>
                              <td style={{ padding: "16px", color: COLORS.text }}>{d.logistics}</td>
                              <td style={{ padding: "16px", fontWeight: "700", color: COLORS.sidebar }}>{d.amount}</td>
                              <td style={{ padding: "16px" }}><span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: d.status === 'Delivered' ? '#DCFCE7' : '#FEF3C7', color: d.status === 'Delivered' ? '#166534' : '#92400E' }}>{d.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <datalist id="product-list">
                    {DB.Fruits.map(f => <option key={f} value={f} />)}
                    {DB.Vegetables.map(v => <option key={v} value={v} />)}
                  </datalist>
                  <datalist id="variety-list">
                    {DB.AppleVars.map(a => <option key={a} value={a} />)}
                    <option value="Alphonso" />
                    <option value="Kesar" />
                    <option value="Banganapalli" />
                  </datalist>
                </div>
              )}

              {activeSupplierTab === "Supplier Accounts" && (
                <div>
                  <FormGrid sections={[
                    {
                      title: "Account Overview",
                      fields: [
                        { label: "Supplier Name", type: "select", options: ["Srinivas Rao", "Sanjay Mehta"] },
                        { label: "Total Amount (₹)", type: "number", placeholder: "0.00" },
                        { label: "Paid Amount (₹)", type: "number", placeholder: "0.00" },
                        { label: "Balance Amount (₹)", disabled: true, value: "Auto-calculated" },
                        { label: "Credit Status", type: "select", options: ["Good Standing", "Overdue", "Locked"] }
                      ]
                    },
                    {
                      title: "Payment Processing",
                      fields: [
                        { label: "Payment Date", type: "date", value: new Date().toISOString().slice(0, 10) },
                        { label: "Payment Method", type: "select", options: ["Bank Transfer (RTGS/NEFT)", "UPI", "Cash", "Cheque"] },
                        { label: "Transaction ID", placeholder: "UTR or Txn Hash" },
                        { label: "Pending Days", type: "number", placeholder: "0" },
                        { label: "Last Payment Date", type: "date" },
                        { label: "Next Due Date", type: "date", value: new Date(Date.now() + 86400000*30).toISOString().slice(0, 10) },
                        { label: "Notes" }
                      ]
                    }
                  ]} />
                  <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                    <Button style={{ background: COLORS.sidebar }}>Save Payment</Button>
                    <Button variant="secondary">Update Details</Button>
                    <Button variant="outline">Print Statement</Button>
                  </div>

                  <div style={{ marginTop: "40px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "800", color: COLORS.sidebar, marginBottom: "16px", borderBottom: "1px solid #EBE9E1", paddingBottom: "12px" }}>Recent Transactions</h3>
                    <div style={{ overflowX: "auto", background: "#FFFFFF", borderRadius: "12px", border: "1px solid #EBE9E1" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                        <thead>
                          <tr style={{ background: "#FDFBF4", textAlign: "left", color: COLORS.muted }}>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Date</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Supplier</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Transaction ID</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Method</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Amount Paid</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { date: "Oct 24, 2026", supplier: "Srinivas Rao", txn: "UTR-SBIN00489912", method: "Bank Transfer (RTGS)", amount: "₹1,50,000", status: "Completed" },
                            { date: "Oct 22, 2026", supplier: "Sanjay Mehta", txn: "TXN-UPI-992011", method: "UPI", amount: "₹25,000", status: "Completed" },
                            { date: "Oct 20, 2026", supplier: "Harika Naidu", txn: "CHQ-009212", method: "Cheque", amount: "₹80,000", status: "Pending Clearance" }
                          ].map((t, i) => (
                            <tr key={i} style={{ borderBottom: i === 2 ? "none" : "1px solid #EBE9E1" }}>
                              <td style={{ padding: "16px", color: COLORS.text }}>{t.date}</td>
                              <td style={{ padding: "16px", fontWeight: "600", color: COLORS.sidebar }}>{t.supplier}</td>
                              <td style={{ padding: "16px", color: COLORS.muted }}>{t.txn}</td>
                              <td style={{ padding: "16px", color: COLORS.text }}>{t.method}</td>
                              <td style={{ padding: "16px", fontWeight: "700", color: COLORS.danger }}>{t.amount}</td>
                              <td style={{ padding: "16px" }}><span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: t.status === 'Completed' ? '#DCFCE7' : '#F1F5F9', color: t.status === 'Completed' ? '#166534' : '#475569' }}>{t.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Buyer Role Module */}
          {activeSection === "User Roles" && activeUserRoleTab === "Buyer" && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              
              <TabHeader tabs={["Buyer Registration", "Purchase Order", "Buyer Accounts"]} active={activeBuyerTab} set={setActiveBuyerTab} />

              {activeBuyerTab === "Buyer Registration" && (
                <div>
                  <FormGrid sections={[
                    {
                      title: "Buyer Basic Details",
                      fields: [
                        { label: "Buyer ID", disabled: true, value: "BUY-9042" },
                        { label: "Buyer Name", placeholder: "Full Name" },
                        { label: "Business Name", placeholder: "Company / Shop Name" },
                        { label: "Buyer Type", type: "select", options: ["Wholesaler", "Retailer", "Exporter", "Supermarket Chain"] },
                        { label: "Preferred Product Category", type: "select", options: ["Fruits Only", "Vegetables Only", "Mixed/Both"] },
                        { label: "Mobile Number", type: "tel" },
                        { label: "Alternate Number", type: "tel" },
                        { label: "WhatsApp Number", type: "tel" },
                        { label: "Email", type: "email" }
                      ]
                    },
                    {
                      title: "Location & Compliance",
                      fields: [
                        { label: "Address", placeholder: "Primary location" },
                        { label: "City" },
                        { label: "District" },
                        { label: "State" },
                        { label: "Pincode" },
                        { label: "GST Number" },
                        { label: "Credit Limit (₹)", type: "number", placeholder: "0.00" },
                        { label: "Registration Date", type: "date", value: new Date().toISOString().slice(0, 10) }
                      ]
                    }
                  ]} />
                  <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                    <Button style={{ background: COLORS.sidebar }}>Submit Details</Button>
                    <Button variant="secondary">Save Draft</Button>
                    <Button variant="outline">Edit</Button>
                    <Button variant="danger" style={{ background: "#F1F5F9", color: COLORS.danger, border: "none" }}>Cancel All</Button>
                  </div>
                </div>
              )}

              {activeBuyerTab === "Purchase Order" && (
                <div>
                  <FormGrid sections={[
                    {
                      title: "Order Requirements",
                      fields: [
                        { label: "Order ID", disabled: true, value: "ORD-PO-149" },
                        { label: "Buyer Name", type: "select", options: ["Reliance Retail", "Kisan Markets", "BigBasket", "More Supermarkets"] },
                        { label: "Product Type", type: "select", options: ["Fruits", "Vegetables"] },
                        { label: "Product Name", list: "product-list", placeholder: "Type to search...", value: poProduct, onChange: (e) => setPoProduct(e.target.value) },
                        { label: "Required Variety", type: "select", options: getProductData(poProduct).varieties },
                        { label: "Required Size", type: "select", options: getProductData(poProduct).sizes },
                        { label: "Required Color", type: "select", options: getProductData(poProduct).colors },
                        { label: "Required Quality", type: "select", options: ["A Grade (Premium)", "B Grade", "C Grade"] }
                      ]
                    },
                    {
                      title: "Fulfillment Details",
                      fields: [
                        { label: "Required Quantity", type: "number", placeholder: "0" },
                        { label: "Unit Type", type: "select", options: ["KG", "Box", "Ton", "Crate"] },
                        { label: "Number of Trucks Required", type: "number", placeholder: "1" },
                        { label: "Packing Type", type: "select", options: ["Standard Corrugated", "Plastic Crates", "Wooden Boxes", "Loose Loads"] },
                        { label: "Delivery Date", type: "date", value: new Date().toISOString().slice(0, 10) },
                        { label: "Delivery Location", placeholder: "Destination Hub" },
                        { label: "Preferred Rate (₹)", type: "number", placeholder: "Target max price" },
                        { label: "Urgency Level", type: "select", options: ["Normal", "High", "Critical (Same Day)"] },
                        { label: "Notes" }
                      ]
                    }
                  ]} />
                  <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                    <Button style={{ background: COLORS.sidebar }}>Save Order</Button>
                    <Button variant="secondary">Edit Order</Button>
                    <Button style={{ background: COLORS.success }}>Generate Order Slip</Button>
                    <Button variant="outline">Cancel Order</Button>
                  </div>
                </div>
              )}

              {activeBuyerTab === "Buyer Accounts" && (
                <div>
                  <FormGrid sections={[
                    {
                      title: "Billing Cycle",
                      fields: [
                        { label: "Buyer Name", type: "select", options: ["Reliance Retail", "Kisan Markets"] },
                        { label: "Rate per Unit (₹)", type: "number", placeholder: "0.00" },
                        { label: "Quantity", type: "number", placeholder: "0" },
                        { label: "Total Amount (₹)", disabled: true, value: "Auto-calculated" },
                        { label: "Tax (%)", type: "number", placeholder: "5" },
                        { label: "Discount (₹)", type: "number", placeholder: "0.00" }
                      ]
                    },
                    {
                      title: "Payment Receipts",
                      fields: [
                        { label: "Paid Amount (₹)", type: "number", placeholder: "0.00" },
                        { label: "Payment Mode", type: "select", options: ["Bank Transfer (RTGS/NEFT)", "UPI", "Cash", "Cheque", "Credit Account"] },
                        { label: "Transaction ID", placeholder: "UTR or Txn" },
                        { label: "Due Date", type: "date", value: new Date(Date.now() + 86400000*30).toISOString().slice(0, 10) },
                        { label: "Outstanding Amount (₹)", disabled: true, value: "Auto-calculated" },
                        { label: "Balance Amount (₹)", disabled: true, value: "Auto-calculated" },
                        { label: "Remarks" }
                      ]
                    }
                  ]} />
                  <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                    <Button style={{ background: COLORS.sidebar }}>Save Record</Button>
                    <Button variant="secondary">Update File</Button>
                    <Button variant="outline">Print Invoice</Button>
                  </div>
                </div>
              )}
            </div>
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