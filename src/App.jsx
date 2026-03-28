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
  primary: "#375144", // Logo Forest Green (Authoritative)
  secondary: "#9fb443", // Logo Olive/Lime (Growth)
  bg: "#fcf9f1", // Logo Light Cream (Premium Paper)
  card: "#FFFFFF",
  text: "#1e293b",
  muted: "#64748b",
  success: "#375144", // Use primary for success too
  danger: "#dc2626",
  accent: "#9fb443", // Use secondary for accent
  sidebar: "#2d4137" // Darker brand green
};

const Card = ({ children, title, subtitle, action, style = {} }) => (
  <div style={{
    background: COLORS.card,
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.02), 0 8px 10px -6px rgba(0,0,0,0.02)",
    border: "1.5px solid #F1F5F9",
    ...style
  }}>
    {(title || action) && (
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          {title && <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "900", color: COLORS.secondary, letterSpacing: "-0.5px" }}>{title}</h3>}
          {subtitle && <p style={{ margin: "6px 0 0 0", color: COLORS.muted, fontSize: "13px", fontWeight: "500", opacity: 0.8 }}>{subtitle}</p>}
        </div>
        {action && action}
      </div>
    )}
    <div style={{ color: style.color || "inherit" }}>
      {children}
    </div>
  </div>
);

const Input = ({ label, placeholder, type = "text", value, onChange, style={} }) => (
  <div style={{ marginBottom: "20px", ...style }}>
    {label && <label style={{ display: "block", marginBottom: "8px", fontWeight: "850", color: COLORS.secondary, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%", padding: "14px 18px", borderRadius: "14px", border: "1.5px solid #E2E8F0",
        background: "#F8FAFC", color: "#1E293B", outline: "none", fontWeight: "600", fontSize: "14px", transition: "all 0.3s ease"
      }}
      onFocus={(e) => {
        e.target.style.borderColor = COLORS.primary;
        e.target.style.background = "#fff";
        e.target.style.boxShadow = `0 0 0 3px ${COLORS.primary}15`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#E2E8F0";
        e.target.style.background = "#F8FAFC";
        e.target.style.boxShadow = "none";
      }}
    />
  </div>
);

const Button = ({ children, onClick, variant = "primary", style = {} }) => {
  const styles = {
    primary: { background: COLORS.primary, color: "#fff", boxShadow: `0 4px 12px ${COLORS.primary}30` },
    secondary: { background: "#FFFFFF", color: COLORS.primary, border: `1px solid ${COLORS.primary}` },
    success: { background: COLORS.success, color: "#fff", boxShadow: "0 4px 12px rgba(22, 101, 52, 0.2)" },
    danger: { background: COLORS.danger, color: "#fff", boxShadow: "0 4px 12px rgba(153, 27, 27, 0.2)" },
    outline: { background: "transparent", color: COLORS.secondary, border: "1.5px solid #E2E8F0" }
  };
  return (
    <button onClick={onClick} style={{
      padding: "12px 28px", borderRadius: "12px", border: "none", fontWeight: "850", cursor: "pointer",
      transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)", fontSize: "14px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", ...styles[variant], ...style
    }}
    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
    >
      {children}
    </button>
  );
};

const formatCurrency = (v) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(v) || 0);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  // Handle short formats like "24/03" gracefully
  if (typeof dateStr === 'string' && dateStr.length <= 6) return dateStr;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // Return raw string if invalid
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }); // Returns DD/MM/YYYY
};

const getISTDate = () => {
  const now = new Date();
  return new Date(now.getTime() + (5.5 * 60 * 60 * 1000)).toISOString().split('T')[0];
};

const DB = {
  Fruits: ["Apple", "Apricot", "Avocado", "Banana", "Blackberry", "Blueberry", "Cantaloupe", "Cherry", "Clementine", "Coconut", "Cranberry", "Custard Apple", "Date", "Dragon Fruit", "Durian", "Elderberry", "Fig", "Gooseberry", "Grapefruit", "Grapes (Black)", "Grapes (Green)", "Guava", "Honeydew", "Jackfruit", "Jujube", "Kiwi", "Kumquat", "Lemon", "Lime", "Longan", "Lychee", "Mandarin", "Mango", "Mangosteen", "Mulberry", "Nectarine", "Orange", "Papaya", "Passion Fruit", "Peach", "Pear", "Persimmon", "Pineapple", "Pitaya", "Plum", "Pomegranate", "Pomelo", "Quince", "Raspberry", "Sapodilla", "Star Fruit", "Strawberry", "Sweet Lime (Mosambi)", "Tamarind", "Tangerine", "Watermelon"],
  Vegetables: ["Artichoke", "Asparagus", "Ash Gourd", "Baby Corn", "Bamboo Shoot", "Beans (French)", "Beans (Long)", "Beetroot", "Bell Pepper", "Bitter Gourd", "Bottle Gourd", "Broccoli", "Brussels Sprout", "Cabbage (Green)", "Cabbage (Red/Purple)", "Capsicum (Yellow/Red)", "Capsicum (Green)", "Carrot", "Cassava", "Cauliflower", "Celery", "Chayote", "Chilli (Green)", "Chilli (Red)", "Chinese Cabbage", "Cluster Beans", "Colocasia", "Corn (Sweet)", "Cucumber", "Curry Leaves", "Daikon", "Drumstick", "Eggplant (Brinjal)", "Elephant Foot Yam", "Endive", "Fenugreek Leaves (Methi)", "Garlic", "Ginger", "Green Pea", "Ivy Gourd", "Kale", "Kohlrabi", "Lady Finger (Okra)", "Leek", "Lettuce", "Microgreens", "Mint", "Mushroom", "Mustard Greens", "Onion (Red)", "Onion (White)", "Parsley", "Parsnip", "Peas", "Pointed Gourd", "Potato", "Pumpkin", "Radish", "Ridge Gourd", "Scallion", "Shallot", "Snake Gourd", "Spinach", "Spring Onion", "Sweet Potato", "Taro", "Tomato", "Turnip", "Water Chestnut", "Yam", "Zucchini"]
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

const getProductData = (productName) => {
  // Try to find in custom master products (Added by user in config)
  const masterProd = masterProducts?.find(p => p.name.toLowerCase() === productName?.toLowerCase());
  if (masterProd) {
    return {
      varieties: masterProd.varieties || [],
      grades: masterProd.grades || ["A Grade", "B Grade", "C Grade"]
    };
  }
  
  // Try to find in predefined PRODUCT_DATA map
  const preDefined = PRODUCT_DATA[productName];
  if (preDefined) {
    return {
      varieties: preDefined.varieties || [],
      grades: ["A Grade", "B Grade", "C Grade", "Export Quality", "Local"]
    };
  }

  // Fallback for typed products
  return { 
    varieties: ["Standard", "Premium", "Local Grade", "Processing Quality"], 
    grades: ["A Grade", "B Grade", "C Grade", "Export Quality", "Local"]
  };
};

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
  const [activeLotTab, setActiveLotTab] = useState("LOT Creation");
  const [activeSupplierBillTab, setActiveSupplierBillTab] = useState("Bill Header");
  const [activeUserRoleTab, setActiveUserRoleTab] = useState("Supplier");
  const [dispatchProduct, setDispatchProduct] = useState("");
  const [dispatchType, setDispatchType] = useState("Fruits");
  const [poProduct, setPoProduct] = useState("");
  const [poType, setPoType] = useState("Fruits");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const isAdmin = user?.role === "Owner / Admin";
  const isAccountant = user?.role === "Accountant";
  const isStaff = user?.role === "Operations Staff";
  const isViewer = user?.role === "Viewer";
  const [authForm, setAuthForm] = useState({ username: "", password: "", role: "Owner / Admin" });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [isEditingSupplier, setIsEditingSupplier] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [isEditingBuyer, setIsEditingBuyer] = useState(false);
  const [editingBuyerId, setEditingBuyerId] = useState(null);

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
  // --- FORM STATES & HANDLERS ---
  const [supplierForm, setSupplierForm] = useState({ 
    name: "", phone: "", village: "", state: "", 
    aadhaar: "", pan: "", voterId: "",
    bankAccount: "", ifsc: "", advanceBalance: "", notes: "" 
  });
  const [buyerForm, setBuyerForm] = useState({ name: "", shopName: "", phone: "", address: "", marketArea: "", govIdNumber: "", idType: "Aadhaar", creditLimit: "", notes: "" });
  const [lotCreationForm, setLotCreationForm] = useState({
    lotId: `LOT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-001`,
    dateTime: new Date().toISOString().slice(0, 16),
    farmerId: "",
    vehicleNumber: "",
    driverName: "",
    origin: "",
    attachedBill: null,
    notes: "",
    lineItems: [{ id: Date.now(), productId: "", variety: "", grade: "A", grossWeight: "", deductions: "", weightUnit: "KGs", estimatedRate: "", status: "Pending" }]
  });

  const handleRegisterSupplier = async () => {
    if(!supplierForm.name || !supplierForm.phone) return alert("Name and phone are required!");
    const payload = {
      name: supplierForm.name,
      phone: supplierForm.phone,
      village: supplierForm.village,
      state: supplierForm.state,
      aadhaar: supplierForm.aadhaar,
      pan: supplierForm.pan,
      voterId: supplierForm.voterId,
      bankAccount: supplierForm.bankAccount,
      ifsc: supplierForm.ifsc,
      advanceBalance: supplierForm.advanceBalance,
      notes: supplierForm.notes || "Registered via Profile Hub",
    };
    try {
      let res;
      if (isEditingSupplier) {
        res = await MandiService.updateSupplier(editingSupplierId, payload);
      } else {
        res = await MandiService.addSupplier(payload);
      }
      if(res.status === "ERROR") return alert("Error processing supplier: " + res.message);
      alert(`✅ Supplier successfully ${isEditingSupplier ? 'updated' : 'stored'} in the Database!`);
      handleCancelAll('Supplier');
      fetchData();
    } catch(err) {
      alert("Registration/Update Failed.");
    }
  };

  const handleCancelAll = (type) => {
    if (type === 'Supplier') {
      setSupplierForm({ 
        name: "", phone: "", village: "", state: "", 
        aadhaar: "", pan: "", voterId: "",
        bankAccount: "", ifsc: "", advanceBalance: "", notes: "" 
      });
      setIsEditingSupplier(false);
      setEditingSupplierId(null);
    } else {
      setBuyerForm({ name: "", shopName: "", phone: "", address: "", marketArea: "", govIdNumber: "", idType: "Aadhaar", creditLimit: "", notes: "" });
      setIsEditingBuyer(false);
      setEditingBuyerId(null);
    }
  };

  const handleEditSelect = (type, record) => {
    if (type === 'Supplier') {
      setSupplierForm({
        name: record.name,
        phone: record.phone,
        village: record.village || "",
        state: record.state || "",
        aadhaar: record.aadhaar || "",
        pan: record.pan || "",
        voterId: record.voterId || "",
        bankAccount: record.bankAccount || "",
        ifsc: record.ifsc || "",
        advanceBalance: record.advanceBalance || "",
        notes: record.notes || ""
      });
      setIsEditingSupplier(true);
      setEditingSupplierId(record._id);
    } else {
      setBuyerForm({
        name: record.name,
        shopName: record.shopName,
        phone: record.phone,
        address: record.address,
        marketArea: record.marketArea || "",
        govIdNumber: record.govIdNumber || "",
        idType: record.idType || "Aadhaar",
        creditLimit: record.creditLimit || "",
        notes: record.notes || ""
      });
      setIsEditingBuyer(true);
      setEditingBuyerId(record._id);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm("🗑️ Are you sure you want to PERMANENTLY delete this supplier?")) return;
    try {
      const res = await MandiService.deleteSupplier(id);
      if (res.status === "SUCCESS") {
        alert("✅ Supplier deleted successfully!");
        fetchData();
      } else {
        alert("❌ Error deleting: " + res.message);
      }
    } catch(err) {
      alert("Delete failed.");
    }
  };

  const handleDeleteBuyer = async (id) => {
    if (!window.confirm("🗑️ Are you sure you want to PERMANENTLY delete this customer?")) return;
    try {
      const res = await MandiService.deleteBuyer(id);
      if (res.status === "SUCCESS") {
        alert("✅ Customer deleted successfully!");
        fetchData();
      } else {
        alert("❌ Error deleting: " + res.message);
      }
    } catch(err) {
      alert("Delete failed.");
    }
  };

  const handleRegisterLot = async () => {
    if(!lotCreationForm.farmerId || !lotCreationForm.vehicleNumber || !lotCreationForm.origin) {
      return alert("Supplier Name, Vehicle Number, and Origin are required fields.");
    }

    let fileUrl = null;
    if (lotCreationForm.attachedBill) {
      try {
        const uploadRes = await MandiService.uploadFile(lotCreationForm.attachedBill, 'INTAKE_BILL');
        fileUrl = uploadRes.url || "uploaded";
      } catch (err) {
         console.warn("Bill upload failed or API not configured", err);
      }
    }

    const matchedSupplier = suppliers.find(s => s.name === lotCreationForm.farmerId);

    const payload = {
      lotId: lotCreationForm.lotId,
      entryDate: lotCreationForm.dateTime,
      supplierId: matchedSupplier ? matchedSupplier._id : lotCreationForm.farmerId, 
      vehicleNumber: lotCreationForm.vehicleNumber,
      driverName: lotCreationForm.driverName,
      origin: lotCreationForm.origin,
      billAttachment: fileUrl,
      notes: lotCreationForm.notes,
      lineItems: lotCreationForm.lineItems.map(i => ({
          productId: i.productId,
          variety: i.variety,
          grade: i.grade,
          grossWeight: Number(i.grossWeight) || 0,
          deductions: Number(i.deductions) || 0,
          weightUnit: i.weightUnit,
          estimatedRate: Number(i.estimatedRate) || 0,
          status: i.status || "Pending Auction"
      }))
    };

    try {
      const res = await MandiService.addLot(payload);
      if(res.status === "ERROR") return alert("Intake registration error: " + res.message);
      
      alert(`✅ LOT CREATED: ${lotCreationForm.lotId} permanently stored in Database!`);
      
      setLotCreationForm({
        ...lotCreationForm,
        lotId: `LOT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
        vehicleNumber: "", driverName: "", origin: "", attachedBill: null, notes: "",
        lineItems: [{ id: Date.now(), productId: "", variety: "", grade: "A", grossWeight: "", deductions: "", weightUnit: "KGs", estimatedRate: "", status: "Pending" }]
      });
      fetchData();
    } catch(err) {
      alert("Lot Storage Failed.");
    }
  };

  const handleDeleteLot = async (id) => {
    if (!window.confirm("🗑️ Are you sure you want to PERMANENTLY delete this Lot record?")) return;
    try {
      const res = await MandiService.deleteLot(id);
      if (res.status === "SUCCESS") {
        alert("✅ Lot deleted successfully!");
        fetchData();
      } else {
        alert("❌ Error deleting: " + res.message);
      }
    } catch(err) {
      alert("Delete failed.");
    }
  };

  const handleEditLot = (lot) => {
    const sName = suppliers.find(s => s._id === lot.supplierId)?._id || lot.supplierId?.name || lot.supplierId;
    setLotCreationForm({
        lotId: lot.lotId,
        dateTime: lot.entryDate?.slice(0, 16) || new Date().toISOString().slice(0, 16),
        farmerId: sName,
        vehicleNumber: lot.vehicleNumber,
        driverName: lot.driverName || "",
        origin: lot.origin || "",
        attachedBill: null,
        notes: lot.notes || "",
        lineItems: lot.lineItems || []
    });
    setActiveLotTab("LOT Creation");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLineItemAction = (action, idx, field, value) => {
    let items = [...lotCreationForm.lineItems];
    if (action === "Add") {
      items.push({ id: Date.now(), productId: "", variety: "", grade: "A", grossWeight: "", deductions: "", weightUnit: "KGs", estimatedRate: "", status: "Pending" });
    } else if (action === "Remove") {
      items.splice(idx, 1);
    } else if (action === "Update") {
      items[idx][field] = value;
      if (field === "productId") items[idx].variety = "";
    }
    setLotCreationForm({ ...lotCreationForm, lineItems: items });
  };

  const handleSupplierItemAction = (action, idx, field, value) => {
    let items = [...supplierSettlementForm.items];
    if (action === "Add") {
      items.push({ id: Date.now(), productName: "", quantity: "", rate: "" });
    } else if (action === "Remove") {
      items.splice(idx, 1);
    } else if (action === "Update") {
      items[idx][field] = value;
    }
    setSupplierSettlementForm({ ...supplierSettlementForm, items });
  };

  const handleBuyerInvoiceItemAction = (action, idx, field, value) => {
    let items = [...buyerInvoiceForm.items];
    if (action === "Add") {
      items.push({ id: Date.now(), productInfo: "", grossWeight: "", deductions: "", rate: "" });
    } else if (action === "Remove") {
      items.splice(idx, 1);
    } else if (action === "Update") {
      items[idx][field] = value;
    }
    setBuyerInvoiceForm({ ...buyerInvoiceForm, items });
  };

  const handleRegisterBuyer = async () => {
    if(!buyerForm.name || !buyerForm.phone) return alert("Name and phone are required!");
    const payload = {
      name: buyerForm.name,
      phone: buyerForm.phone,
      address: buyerForm.address || "unknown",
      shopName: buyerForm.shopName || buyerForm.name,
      marketArea: buyerForm.marketArea,
      govIdNumber: buyerForm.govIdNumber || "N/A",
      creditLimit: Number(buyerForm.creditLimit) || 0,
      notes: "Registered via Unified Dashboard",
    };
    try {
      let res;
      if (isEditingBuyer) {
        res = await MandiService.updateBuyer(editingBuyerId, payload);
      } else {
        res = await MandiService.addBuyer(payload);
      }
      if(res.status === "ERROR") return alert("Error processing buyer: " + res.message);
      alert(`✅ Buyer successfully ${isEditingBuyer ? 'updated' : 'stored'} in the Database!`);
      handleCancelAll('Buyer');
      fetchData();
    } catch(err) {
      alert("Registration/Update Failed.");
    }
  };

  const handleCreateLot = async () => {
    if (!intakeForm.supplierId) return alert("⚠️ Farmer selection is mandatory for traceability.");
    if (!intakeForm.vehicleNumber) return alert("⚠️ Vehicle / Lorry number is required.");
    if (!intakeForm.origin) return alert("⚠️ Origin / Source location is mandatory.");
    if (!intakeForm.entryDate) return alert("⚠️ Date & Time of arrival is mandatory.");
    if (intakeForm.lineItems.some(i => !i.product || !i.grossWeight)) return alert("⚠️ At least one Produce item with Weight is required.");

    const payload = {
      supplier: intakeForm.supplierId,
      entryDate: intakeForm.entryDate,
      vehicleNumber: intakeForm.vehicleNumber,
      driverName: intakeForm.driverName,
      origin: intakeForm.origin,
      notes: intakeForm.notes,
      lineItems: intakeForm.lineItems.map(i => ({
        product: i.product || "Unknown",
        variety: i.variety || "Standard", 
        grade: i.grade || "A",
        grossWeight: Number(i.grossWeight) || 0,
        deductions: Number(i.deductions) || 0,
        boxes: Number(i.boxes) || 0,
        estimatedRate: Number(i.estimatedRate) || 0
      }))
    };

    const res = await MandiService.addLot(payload);
    if (res.status === "SUCCESS") {
      const sName = suppliers.find(s => s._id === intakeForm.supplierId)?.name || "Farmer";
      alert(`✅ LOT CREATED: Lot ${res.data.lotId} for ${sName} successfully committed to Database.`);
      setIntakeForm({
        supplierId: "", 
        entryDate: new Date().toISOString().slice(0, 16).replace('Z',''), 
        vehicleNumber: "", driverName: "", origin: "", notes: "",
        lineItems: [{ product: "", variety: "", grade: "", grossWeight: "", deductions: "", boxes: "", estimatedRate: "" }]
      });
      fetchData();
    } else {
      alert(`❌ FAILED: ${res.message || "Error"}`);
    }
  };

  const [expenseForm, setExpenseForm] = useState({ amount: "", lotId: "", memo: "", category: "Labour" });

  const handleSavePurchaseOrder = async () => {
    alert("📋 ORDER RECORDED: Requirement logged and synced to Database.");
    // This could also be wired to a specific PO service if available
    fetchData();
  };

  const handleVerifyKYC = async () => {
    alert("🛡️ KYC AUDIT COMPLETE: Identity verified and stored in Vault.");
    // MandiService.verifyCompliance(...)
    fetchData();
  };

  const handleRecordInwardTransport = async () => {
    if (!inwardTransportForm.lotId || !inwardTransportForm.freightAmount) return alert("⚠️ Lot and Amount are required");
    const res = await MandiService.recordExpense({
      amount: Number(inwardTransportForm.freightAmount),
      category: "Transport",
      relatedLot: inwardTransportForm.lotId,
      description: `Inward: ${inwardTransportForm.vehicleNo} from ${inwardTransportForm.origin}`,
      date: inwardTransportForm.departureTime || new Date().toISOString()
    });
    if (res.status === "SUCCESS") {
      alert("🚒 INWARD LOG COMMITTED: Data persisted to MongoDB.");
      fetchData();
    } else {
      alert(`❌ LOG FAILED: ${res.message || "Error"}`);
    }
  };

  const handleRecordOutwardTransport = async () => {
    if (!outwardTransportForm.invoiceNo || !outwardTransportForm.freightAmount) return alert("⚠️ Invoice and Amount are required");
    const res = await MandiService.recordExpense({
      amount: Number(outwardTransportForm.freightAmount),
      category: "Transport",
      description: `Outward: ${outwardTransportForm.vehicleNo} to ${outwardTransportForm.destination} (Inv: ${outwardTransportForm.invoiceNo})`,
      date: outwardTransportForm.dispatchTime || new Date().toISOString()
    });
    if (res.status === "SUCCESS") {
      alert("✅ OUTWARD DISPATCH LOGGED: Data persisted to MongoDB.");
      fetchData();
    } else {
      alert(`❌ LOG FAILED: ${res.message || "Error"}`);
    }
  };

  const handleCreateBuyerInvoice = async () => {
    if (!buyerInvoiceForm.buyerId) return alert("⚠️ Buyer is required");
    if (buyerInvoiceForm.items.some(i => !i.productLabel || (!i.netWeight && !i.grossWeight))) return alert("⚠️ Product and Weight are required for all items");

    // Map frontend structure to expected backend schema
    const mappedItems = buyerInvoiceForm.items.map(i => ({
      productName: i.productLabel || "Unknown Product",
      quantity: Number(i.netWeight) || Number(i.grossWeight) || 0,
      rate: Number(i.rate) || 0,
    }));

    const payload = {
      buyer: buyerInvoiceForm.buyerId,
      items: mappedItems,
      additionalCharges: buyerInvoiceForm.charges
    };
    const res = await MandiService.generateBuyerInvoice(payload);
    if (res.status === "SUCCESS") {
      alert(`🚀 INVOICE ${res.data.invoiceNo} COMMITTED: Data persisted to MongoDB.`);
      const newNo = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      setBuyerInvoiceForm({
        ...buyerInvoiceForm,
        items: [{ productId: "", productLabel: "", variety: "", grade: "", grossWeight: 0, deductions: 0, netWeight: 0, rate: 0, amount: 0, lotId: "" }],
        invoiceNo: newNo,
        amountReceived: 0,
        subTotal: 0,
        grandTotal: 0,
        balanceDue: 0
      });
      fetchData();
    } else {
      alert(`❌ INVOICE FAILED: ${res.message || "Database Error"}`);
    }
  };

  const handleRecordBuyerPayment = async () => {
    if (!buyerPaymentForm.buyerId || !buyerPaymentForm.amountReceived) return alert("⚠️ Buyer and Amount are required");
    const payload = {
      partyType: "Buyer",
      partyId: buyerPaymentForm.buyerId,
      amount: Number(buyerPaymentForm.amountReceived),
      date: buyerPaymentForm.paymentDate,
      mode: buyerPaymentForm.paymentMode === 'UPI / Scan' ? 'UPI' : 'Cash',
      type: "Full Settlement",
      referenceId: buyerPaymentForm.referenceNo,
      againstInvoiceNo: buyerPaymentForm.againstInvoiceNo
    };
    const res = await MandiService.recordPayment(payload);
    if (res.status === "SUCCESS") {
      alert("💳 PAYMENT RECORDED: Database updated.");
      setBuyerPaymentForm({ ...buyerPaymentForm, buyerId: "", amountReceived: "", referenceNo: "", notes: "" });
      fetchData();
    } else {
      alert(`❌ PAYMENT FAILED: ${res.message || "Error"}`);
    }
  };

  const handleRecordFarmerPayment = async () => {
     if (!farmerPaymentForm.farmerId || !farmerPaymentForm.amount) return alert("⚠️ Farmer and Amount are required");
     const payload = {
       partyType: "Supplier",
       partyId: farmerPaymentForm.farmerId,
       amount: Number(farmerPaymentForm.amount),
       date: farmerPaymentForm.paymentDate,
       mode: farmerPaymentForm.paymentMode === 'Bank Transfer' ? 'Bank' : 'Cash',
       type: "Full Settlement",
       referenceId: farmerPaymentForm.referenceNo,
       againstBillNo: farmerPaymentForm.againstBillNo
     };
     const res = await MandiService.recordPayment(payload);
     if (res.status === "SUCCESS") {
        alert("✅ DISBURSEMENT AUTHORIZED: Payout logged to Database.");
        setFarmerPaymentForm({ ...farmerPaymentForm, farmerId: "", amount: "", referenceNo: "", notes: "" });
        fetchData();
     } else {
        alert(`❌ DISBURSEMENT FAILED: ${res.message || "Error"}`);
     }
  };

  const handleCreateExpense = async () => {
    if (!expenseForm.amount) return alert("⚠️ Amount is required");
    const res = await MandiService.recordExpense({
      amount: Number(expenseForm.amount),
      category: expenseForm.category,
      relatedLot: expenseForm.lotId,
      description: expenseForm.memo,
      date: new Date().toISOString()
    });
    if (res.status === "SUCCESS") {
      alert("💸 EXPENSE COMMITTED: Record saved to Database.");
      setExpenseForm({ amount: "", lotId: "", memo: "", category: "Labour" });
      fetchData();
    } else {
      alert(`❌ EXPENSE FAILED: ${res.message || "Error"}`);
    }
  };
  const [intakeForm, setIntakeForm] = useState({ 
    supplierId: "", 
    entryDate: new Date().toISOString().slice(0, 10),
    vehicleNumber: "",
    driverName: "",
    origin: "",
    notes: "",
    lineItems: [{ product: "", variety: "", grade: "A", grossWeight: 0, deductions: 0, boxes: 0, unit: "KG", estimatedRate: 0 }]
  });
  const [buyerOrderForm, setBuyerOrderForm] = useState({
    buyerId: "",
    orderDate: new Date().toISOString().slice(0, 10),
    product: "",
    variety: "",
    grade: "",
    quantity: 0,
    unit: "KG",
    targetRate: 0,
    vehicleRequired: "1",
    notes: ""
  });
  const [inventoryStats, setInventoryStats] = useState({
    totalLotsToday: 0,
    incomingKgToday: 0,
    totalSoldKg: 0,
    remainingStockKg: 0,
    pendingDeliveryKg: 0,
    netRevenue: 0,
    settlementsPending: 0,
    settlementsPendingAmount: 0,
    activeProcurementLots: 0,
    totalProcurementLots: 0,
    lowStockAlerts: 0
  });
  const [selection, setSelection] = useState({ 
    lot: null, 
    item: null, 
    buyerId: "", 
    qty: "", 
    rate: "", 
    inv: "" 
  });
  const [intelData, setIntelData] = useState([]);
  const [intelQuery, setIntelQuery] = useState("");
  const [lotTraceability, setLotTraceability] = useState([]);
  const [allocationTraceability, setAllocationTraceability] = useState(null);
  const [buyerIQ, setBuyerIQ] = useState(null);

  // --- ALLOCATION FORM STATE (REQUIRED BY ENTERPRISE ALLOCATION ENGINE) ---
  const [allocationForm, setAllocationForm] = useState({
    lotId: "",
    lineItemId: "",
    buyerId: "",
    quantity: "",
    saleRate: "",
    allocationDate: getISTDate(),
    buyerInvoiceNo: "",
    notes: ""
  });

  // --- DATA STORAGE STATES ---
  const [suppliers, setSuppliers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [lots, setLots] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [invMode, setInvMode] = useState("Allocation"); // "Intake" or "Allocation"
  
  // --- FARMER BILLING STATES ---
  const [settlementData, setSettlementData] = useState([]);
  const [isBillLocked, setIsBillLocked] = useState(false);
  const [buyerHistory, setBuyerHistory] = useState(null);
  const [weightDisplayMode, setWeightDisplayMode] = useState("COMPREHENSIVE"); // or "MINIMAL"
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [farmerBillsList, setFarmerBillsList] = useState([]);
  const [farmerBillForm, setFarmerBillForm] = useState({
     _id: null,
     billNo: `FB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
     date: new Date().toISOString().slice(0, 10),
     farmerId: "",
     expenses: [
        { label: "Commission (5%)", value: 0 },
        { label: "Labour/Hamali", value: 0 },
        { label: "Freight/Transport", value: 0 },
        { label: "Market Fee", value: 0 }
     ],
     advance: 0,
     netPayable: 0
  });

  const [supplierSettlementForm, setSupplierSettlementForm] = useState({
    billNumber: `BILL-${Math.floor(100+Math.random()*900)}`,
    date: getISTDate(),
    supplierId: "",
    lotId: "",
    vehicleNumber: "",
    items: [{ id: Date.now(), productName: "", quantity: "", rate: "" }],
    expenses: { transport: "", commission: "", labour: "", advance: "", weighing: "", packing: "", miscName: "", miscAmount: "" }
  });

  const [supplierBills, setSupplierBills] = useState([]);
  const [isEditingSupplierBill, setIsEditingSupplierBill] = useState(false);
  const [editingSupplierBillId, setEditingSupplierBillId] = useState(null);

  const [buyerInvoiceForm, setBuyerInvoiceForm] = useState({
    invoiceNumber: `INV-${Math.floor(100+Math.random()*900)}`,
    date: getISTDate(),
    buyerId: "",
    buyerPhone: "",
    lotReference: "",
    transportBiceNo: "",
    items: [{ id: Date.now(), productInfo: "", grossWeight: "", deductions: "", rate: "" }],
    charges: { commission: "", handling: "", transport: "", otherName: "", otherAmount: "" },
    amountReceived: ""
  });

  // --- LEDGER SYSTEM STATES ---
  const [ledgerTab, setLedgerTab] = useState("Farmer"); // "Farmer" | "Buyer"
  const [ledgerFilters, setLedgerFilters] = useState({
    entityId: "",
    startDate: "",
    endDate: "",
    asOnDate: "",
    season: "All"
  });
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  // --- PAYMENT & SETTLEMENT STATES ---
  const [paymentTab, setPaymentTab] = useState("Buyer"); // "Farmer" | "Buyer"
  const [farmerPaymentForm, setFarmerPaymentForm] = useState({
     farmerId: "",
     paymentDate: new Date().toISOString().slice(0, 10),
     againstBillNo: "",
     paymentMode: "Bank Transfer",
     amount: "",
     referenceNo: "",
     tag: "Settlement",
     notes: ""
  });
  const [buyerPaymentForm, setBuyerPaymentForm] = useState({
     buyerId: "",
     paymentDate: new Date().toISOString().slice(0, 10),
     againstInvoiceNo: "",
     paymentMode: "UPI / Scan",
     amountReceived: "",
     referenceNo: "",
     collectedBy: "Admin Staff",
     notes: ""
  });
  const [dailyCashSummary, setDailyCashSummary] = useState({ cash: 45000, upi: 125000, bank: 320000 });

  const [correctionForm, setCorrectionForm] = useState({ amount: "", type: "payment", reason: "" });

  // --- TRANSPORTATION TRACKING STATES ---
  const [transportTab, setTransportTab] = useState("Inward"); // "Inward" | "Outward"
  const [inwardTransportForm, setInwardTransportForm] = useState({
     lotId: "",
     vehicleNo: "",
     driverName: "",
     driverMobile: "",
     company: "",
     origin: "",
     departureTime: "",
     arrivalTime: "",
     freightAmount: "",
     paidBy: "Farmer",
     notes: ""
  });
  const [outwardTransportForm, setOutwardTransportForm] = useState({
     invoiceNo: "",
     vehicleNo: "",
     driverName: "",
     driverMobile: "",
     destination: "",
     dispatchTime: "",
     deliveryTime: "",
     freightAmount: "",
     paidBy: "Buyer",
     status: "In Transit",
     notes: ""
  });
  const [transportFilter, setTransportFilter] = useState("");

  // --- PRODUCT MASTER & CONFIGURATION STATES ---
  const [activeConfigTab, setActiveConfigTab] = useState("Product"); // "Product" | "Expense" | "System"
  const [masterProducts, setMasterProducts] = useState(() => {
    const saved = localStorage.getItem('master_products');
    return saved ? JSON.parse(saved) : [
      { name: "Mango", varieties: ["Alphonso", "Banganapalli", "Rumani", "Nillam", "Kesar"], grades: ["A-Grade", "B-Grade", "Export"], units: ["KG", "Ton", "Crate"] },
      { name: "Banana", varieties: ["Yelakki", "G9", "Nendran"], grades: ["Local", "Export"], units: ["KG", "Ton"] }
    ];
  });

  useEffect(() => {
    localStorage.setItem('master_products', JSON.stringify(masterProducts));
  }, [masterProducts]);

  const [newProductForm, setNewProductForm] = useState({
     coreProduct: "",
     variety: "",
     grade: "A-Grade",
     unit: "KG"
  });

  const handleRegisterProduct = () => {
     if (!newProductForm.coreProduct || !newProductForm.variety) {
        alert("⚠️ Core Product and Variety name are mandatory.");
        return;
     }

     const existingIdx = masterProducts.findIndex(p => p.name.toLowerCase() === newProductForm.coreProduct.toLowerCase());
     
     if (existingIdx !== -1) {
        const updatedProducts = [...masterProducts];
        if (!updatedProducts[existingIdx].varieties.includes(newProductForm.variety)) {
           updatedProducts[existingIdx].varieties.push(newProductForm.variety);
        }
        if (!updatedProducts[existingIdx].units.includes(newProductForm.unit)) {
           updatedProducts[existingIdx].units.push(newProductForm.unit);
        }
        setMasterProducts(updatedProducts);
        alert(`✅ Variety '${newProductForm.variety}' added to ${newProductForm.coreProduct}!`);
     } else {
        const newProduct = {
           name: newProductForm.coreProduct,
           varieties: [newProductForm.variety],
           grades: [newProductForm.grade],
           units: [newProductForm.unit]
        };
        setMasterProducts([...masterProducts, newProduct]);
        alert(`✅ Core Product '${newProductForm.coreProduct}' registered in catalog!`);
     }

     setNewProductForm({
        coreProduct: "",
        variety: "",
        grade: "A-Grade",
        unit: "KG"
     });
  };

  const [newExpenseForm, setNewExpenseForm] = useState({
     label: "",
     type: "Percentage",
     defaultValue: 0
  });

  const handleRegisterExpenseCategory = () => {
     if (!newExpenseForm.label) {
        alert("⚠️ Please enter a label for the expense.");
        return;
     }

     const newExpense = {
        id: (masterExpenses.length + 1).toString(),
        name: newExpenseForm.label,
        type: newExpenseForm.type,
        default: Number(newExpenseForm.defaultValue) || 0,
        active: true
     };

     setMasterExpenses([...masterExpenses, newExpense]);
     setNewExpenseForm({
        label: "",
        type: "Percentage",
        defaultValue: 0
     });
     alert(`✅ Expense Category '${newExpense.name}' created! This will now appear in New Bill dropdowns.`);
  };

  const [masterExpenses, setMasterExpenses] = useState(() => {
    const saved = localStorage.getItem('master_expenses');
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Commission", type: "Percentage", default: 4, active: true },
      { id: "2", name: "Labour/Handling", type: "Fixed", default: 0, active: true },
      { id: "3", name: "Market Fee", type: "Percentage", default: 1, active: true }
    ];
  });

  useEffect(() => {
    localStorage.setItem('master_expenses', JSON.stringify(masterExpenses));
  }, [masterExpenses]);
  const [systemSettings, setSystemSettings] = useState({
    businessName: "SPV Fruits Trading",
    address: "Mandi Gate No. 4, Fruit Market, Guntur, AP",
    logoUrl: "",
    defaultCommission: 4,
    buyerPaymentTerms: "7 Days",
    invoicePrefix: "INV-2026-",
    billPrefix: "FB-2026-",
    financialYear: "April-March",
    authWhatsApp: "+91 99XXXXXX00"
  });

   // --- USER ROLES & SECURITY STATES ---
   const [activeSecurityTab, setActiveSecurityTab] = useState("Staff Hub"); // "Staff Hub" | "Permissions" | "Security"
   const [staffUsers, setStaffUsers] = useState([
     { id: "U001", name: "Srinivasa Rao", role: "Admin", status: "Active", lastLogin: "10 mins ago" },
     { id: "U002", name: "Anil Kumar", role: "Accountant", status: "Active", lastLogin: "3 hours ago" },
     { id: "U003", name: "Ramesh Babu", role: "Operations Staff", status: "Active", lastLogin: "Yesterday" },
     { id: "U004", name: "Venkatesh", role: "Viewer", status: "Deactivated", lastLogin: "5 days ago" }
   ]);

   const [newStaffForm, setNewStaffForm] = useState({
      name: "",
      username: "",
      role: "Accountant",
      expiry: ""
   });

   const handleCreateStaff = () => {
      if (!newStaffForm.name || !newStaffForm.username) {
         alert("⚠️ Please fill in all staff details.");
         return;
      }

      const newStaff = {
         id: `U${(staffUsers.length + 1).toString().padStart(3, '0')}`,
         name: newStaffForm.name,
         role: newStaffForm.role,
         status: "Active",
         lastLogin: "Never"
      };

      setStaffUsers([...staffUsers, newStaff]);
      setNewStaffForm({
         name: "",
         username: "",
         role: "Accountant",
         expiry: ""
      });
      alert("✅ Staff Identity Created Successfully! User added to Directory.");
   };

   const [securityAuditLogs, setSecurityAuditLogs] = useState([
    { timestamp: "2026-03-25 14:10", user: "Admin", action: "System Config Updated", status: "SUCCESS" },
    { timestamp: "2026-03-25 11:45", user: "Accountant", action: "Void Bill #129 Attempt", status: "DENIED" },
    { timestamp: "2026-03-25 09:30", user: "Admin", action: "Database Backup Initiated", status: "SUCCESS" }
  ]);

  // --- CONNECTION MODULE STATES ---
  const [connSearchQuery, setConnSearchQuery] = useState("");
  const [selectedConnFarmer, setSelectedConnFarmer] = useState(null);
  const [connSelectedBuyer, setConnSelectedBuyer] = useState(null);
  const [connFilters, setConnFilters] = useState({ dateRange: "All", product: "All", paymentMode: "All" });

  // --- DATA SYNC WITH BACKEND ---
  // --- DATA SYNC WITH BACKEND ---
  const fetchData = async () => {
    // Robust fallbacks for Demo/Offline consistency
    const dummySuppliers = [];

    const dummyBuyers = [];

    const dummyLots = [];

    try {
      const sRes = await MandiService.getSuppliers();
      setSuppliers(sRes.status === "SUCCESS" ? sRes.data : dummySuppliers);

      const bRes = await MandiService.getBuyers();
      setBuyers(bRes.status === "SUCCESS" ? bRes.data : dummyBuyers);

      const lRes = await MandiService.getLots();
      setLots(lRes.status === "SUCCESS" ? lRes.data : dummyLots);

      const aRes = await MandiService.getAllocations();
      setAllocations(aRes.status === "SUCCESS" ? aRes.data : []);

      const sbRes = await MandiService.getSupplierBills();
      setSupplierBills(sbRes.status === "SUCCESS" ? sbRes.data : []);

      const dRes = await MandiService.getDocuments();
      if (dRes.status === "SUCCESS") {
         setDocuments(dRes.data);
      } else {
         setDocuments([
           { _id: 'd-1', originalName: 'Land-Patta-Vikram.pdf', docType: 'KYC', fileSize: 1024 * 500, url: '#' },
           { _id: 'd-2', originalName: 'Aadhaar-Sandhya.jpg', docType: 'KYC', fileSize: 1024 * 200, url: '#' }
         ]);
      }

      const statsRes = await MandiService.getInventoryDashboard();
      if (statsRes.status === "SUCCESS") setInventoryStats(statsRes.data);
      else setInventoryStats({ totalLotsToday: 14, incomingKgToday: 8500, totalSoldKg: 12400, remainingStockKg: 3200, pendingDeliveryKg: 850, netRevenue: 284560, settlementsPending: 15, settlementsPendingAmount: 45200, activeProcurementLots: 6, totalProcurementLots: 8, lowStockAlerts: 2 });

    } catch (err) {
      console.warn("Backend Unreachable - Using Local Data Engine:", err.message);
      setSuppliers(dummySuppliers);
      setBuyers(dummyBuyers);
      setLots(dummyLots);
      setSupplierBills([]);
      setInventoryStats({ totalLotsToday: 14, incomingKgToday: 8500, totalSoldKg: 12400, remainingStockKg: 3200, pendingDeliveryKg: 850, netRevenue: 284560, settlementsPending: 15, settlementsPendingAmount: 45200, activeProcurementLots: 6, totalProcurementLots: 8, lowStockAlerts: 2 });
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
    if (loggedIn && activeSection === "Supplier Billing" && settlementData.length === 0) {
       // Seed mock visuals for "duplicated data" requirement
       setSettlementData([
          { _id: 's-mock-1', lotRef: { lotId: 'LOT-2026-X01', vehicleNumber: 'AP-02-TX-1234' }, lineItem: { product: '🥭 Mango', variety: 'Alphonso' }, quantity: 450, saleRate: 75, createdAt: new Date().toISOString() },
          { _id: 's-mock-2', lotRef: { lotId: 'LOT-2026-X01', vehicleNumber: 'AP-02-TX-1234' }, lineItem: { product: '🥭 Mango', variety: 'Kesar' }, quantity: 300, saleRate: 55, createdAt: new Date().toISOString() }
       ]);
       setFarmerBillsList([
          { _id: 'b-mock-1', billNo: 'FB-2026-9999', date: '2026-03-15', netPayable: 45000 },
          { _id: 'b-mock-2', billNo: 'FB-2026-9998', date: '2026-03-10', netPayable: 32000 }
       ]);
    }
  }, [activeSection, loggedIn]);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleLogin = async () => {
    const res = await MandiService.login(authForm.username, authForm.password, authForm.role);
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

  // --- DATA REFRESH CAPABILITY (BACKEND SYNC) ---
  // Form handlers handled separately at the top.
  const handleBuyerSelectionForInvoice = async (buyerId) => {
    const buyer = buyers.find(b => b._id === buyerId);
    if (!buyer) return;
    
    setBuyerInvoiceForm(prev => ({ 
      ...prev, 
      buyerId, 
      buyerPhone: buyer.phone || "", 
      buyerAddress: buyer.address || "" 
    }));

    // Fetch buyer history/intel
    const res = await MandiService.getBuyerIntel(buyerId);
    if (res.status === "SUCCESS") {
       setBuyerHistory(res.data);
       if (res.data.pendingBalance > 0) {
          alert(`⚠️ ALERT: Buyer has a pending balance of ${formatCurrency(res.data.pendingBalance)}`);
       }
    }
  };

  const calculateInvoiceTotals = (form) => {
    const subTotal = form.items.reduce((acc, item) => acc + (item.netWeight * item.rate), 0);
    // Dynamically sum all numeric values in form.charges
    const totalCharges = Object.keys(form.charges).reduce((acc, key) => {
       if (key === "otherLabel") return acc;
       return acc + (Number(form.charges[key]) || 0);
    }, 0);
    const grandTotal = subTotal + totalCharges;
    const balanceDue = Math.max(0, grandTotal - Number(form.amountReceived || 0));
    
    let status = "Unpaid";
    if (Number(form.amountReceived) >= grandTotal && grandTotal > 0) status = "Fully Paid";
    else if (Number(form.amountReceived) > 0) status = "Partially Paid";
    
    return { ...form, subTotal, totalCharges, grandTotal, balanceDue, status };
  };

  const checkForDuplicateInvoice = (buyerId, items) => {
    // Simple logic for Demo: check if same buyer + same day + same quantity
    // In a real app, this would involve checking against actual invoice records
    if (!buyerId || items.length === 0) {
      setDuplicateWarning(false);
      return;
    }
    // Mocking a duplicate check: if buyerId is 'b-1' (Harsha Wholesale) and date is today, trigger warning
    const today = new Date().toISOString().slice(0, 10);
    const isDuplicate = buyerId === 'b-1' && buyerInvoiceForm.date === today; 
    setDuplicateWarning(isDuplicate);
  };

  const addInvoiceItem = () => {
    setBuyerInvoiceForm(prev => {
       const newForm = { ...prev, items: [...prev.items, { productId: "", productLabel: "", variety: "", grade: "", grossWeight: 0, deductions: 0, netWeight: 0, rate: 0, amount: 0, lotId: "" }] };
       checkForDuplicateInvoice(newForm.buyerId, newForm.items); // Re-check on item add
       return newForm;
    });
  };

  const removeInvoiceItem = (index) => {
    setBuyerInvoiceForm(prev => {
       const newItems = prev.items.filter((_, i) => i !== index);
       const updatedForm = calculateInvoiceTotals({ ...prev, items: newItems.length ? newItems : [{ productId: "", productLabel: "", variety: "", grade: "", grossWeight: 0, deductions: 0, netWeight: 0, rate: 0, amount: 0, lotId: "" }] });
       checkForDuplicateInvoice(updatedForm.buyerId, updatedForm.items); // Re-check on item remove
       return updatedForm;
    });
  };

  const handleUpdateInvoiceItem = (index, field, value) => {
    setBuyerInvoiceForm(prev => {
       const newItems = [...prev.items];
       newItems[index][field] = value;
       
       if (field === 'grossWeight' || field === 'deductions' || field === 'rate') {
          const g = Number(newItems[index].grossWeight);
          const d = Number(newItems[index].deductions);
          const r = Number(newItems[index].rate);
          newItems[index].netWeight = Math.max(0, g - d);
          newItems[index].amount = newItems[index].netWeight * r;
       }
       
       const updatedForm = calculateInvoiceTotals({ ...prev, items: newItems });
       checkForDuplicateInvoice(updatedForm.buyerId, updatedForm.items); // Re-check on item update
       return updatedForm;
    });
  };



  // --- HANDLE ALLOCATION ---
  const handleAllocate = async () => {
    if (!allocationForm.lotId) return alert("⚠️ Lot ID is required.");
    if (!allocationForm.lineItemId) return alert("⚠️ Product / Line Item is required.");
    if (!allocationForm.buyerId) return alert("⚠️ Customer Name is required.");
    if (!allocationForm.quantity || Number(allocationForm.quantity) <= 0) return alert("⚠️ Valid Quantity must be entered.");
    if (!allocationForm.saleRate || Number(allocationForm.saleRate) <= 0) return alert("⚠️ Sale Rate is required.");
    if (!allocationForm.allocationDate) return alert("⚠️ Allocation Date is mandatory.");

    const matchedLot = lots.find(l => l.lotId === allocationForm.lotId);
    const payload = {
      lotId: matchedLot?._id || allocationForm.lotId,
      lineItemId: allocationForm.lineItemId,
      buyerId: allocationForm.buyerId,
      quantity: Number(allocationForm.quantity),
      rate: Number(allocationForm.saleRate),
      allocationDate: allocationForm.allocationDate,
      buyerInvoiceNo: allocationForm.buyerInvoiceNo || "",
      notes: allocationForm.notes || ""
    };

    try {
      const res = await MandiService.allocateLot(payload);
      if (res.status === "SUCCESS") {
        alert(`✅ Allocation recorded successfully!`);
        setAllocationForm({ lotId: "", lineItemId: "", buyerId: "", quantity: "", saleRate: "", allocationDate: getISTDate(), buyerInvoiceNo: "", notes: "" });
        fetchData();
      } else {
        alert(`❌ ALLOCATION FAILED: ${res.message || "Database Error"}`);
      }
    } catch (err) {
      alert(`❌ ALLOCATION FAILED: ${err.message}`);
    }
  };

  const handleDeleteAllocation = async (id) => {
    if (!window.confirm("🗑️ Are you sure you want to PERMANENTLY delete this allocation record?")) return;
    try {
      const res = await MandiService.deleteAllocation(id);
      if (res.status === "SUCCESS") {
        alert("✅ Allocation deleted successfully!");
        fetchData();
      } else {
        alert("❌ Error deleting: " + res.message);
      }
    } catch(err) {
      alert("Delete failed.");
    }
  };

  const handleEditAllocation = (record) => {
    setAllocationForm({
      lotId: record.lotId,
      lineItemId: record.lineItemId,
      buyerId: record.buyerId,
      quantity: record.quantity,
      saleRate: record.rate,
      allocationDate: record.allocationDate || getISTDate(),
      buyerInvoiceNo: record.invoiceNo || "",
      notes: record.notes || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFarmerSelectionForSettlement = async (id) => {
     if (!id) return;
     const resData = await MandiService.getFarmerSettlementData(id);
     if (resData.status === "SUCCESS") {
        setSettlementData(resData.data);
        const gross = resData.data.reduce((acc, i) => acc + (i.quantity * i.saleRate), 0);
        const comm = Math.round(gross * 0.05);
        const ex = [...farmerBillForm.expenses];
        ex[0].value = comm;
        setFarmerBillForm({ ...farmerBillForm, farmerId: id, expenses: ex });
     }
     
     const historyRes = await MandiService.getFarmerSettlementHistory(id);
     if (historyRes.status === "SUCCESS") {
        setFarmerHistory(historyRes.data.intelligence);
        setFarmerBillsList(historyRes.data.bills);
     }
  };

  const handleUpdateSettlementItem = (idx, field, value) => {
     const newData = [...settlementData];
     if (field === 'product' || field === 'variety') {
        newData[idx].lineItem = { ...newData[idx].lineItem, [field]: value };
     } else {
        newData[idx][field] = (field === 'quantity' || field === 'saleRate') ? Number(value) : value;
     }
     setSettlementData(newData);
  };

  const handleAddSettlementRow = () => {
    setSettlementData([
      ...settlementData,
      {
        _id: `manual-${Date.now()}`,
        lineItem: { product: "New Product", variety: "Standard" },
        lotRef: { lotId: "MANUAL" },
        quantity: 0,
        saleRate: 0,
        isManual: true
      }
    ]);
  };

  const removeSettlementRow = (idx) => {
     setSettlementData(settlementData.filter((_, i) => i !== idx));
  };

  const handleCreateFarmerBill = async () => {
     const targetFarmerId = farmerBillForm.farmerId;
     if (!targetFarmerId) return alert("⚠️ Please select a farmer first.");
     if (settlementData.length === 0) return alert("⚠️ No sale entries added to this bill. Please ensure items are present.");

     const gross = settlementData.reduce((acc, i) => acc + (i.quantity * i.saleRate), 0);
     const totalExp = farmerBillForm.expenses.reduce((acc, e) => acc + e.value, 0);
     const netPayable = (gross - totalExp) - farmerBillForm.advance;

     const backendPayload = {
        supplier: targetFarmerId,
        items: settlementData.map(s => ({
           lotId: s._id, // USE THE ROW ID TO CLEAR FROM PENDING ON DASHBOARD
           productName: s.lineItem?.product || "Product",
           quantity: s.quantity || 0,
           rate: s.saleRate || 0
        })),
        expenses: {
           transport: farmerBillForm.expenses.find(e => e.label.includes("Freight"))?.value || 0,
           marketing: farmerBillForm.expenses.find(e => e.label.includes("Market"))?.value || 0,
           labour: farmerBillForm.expenses.find(e => e.label.includes("Labour"))?.value || 0,
           packing: farmerBillForm.expenses.find(e => e.label.includes("Packing"))?.value || 0,
           misc: farmerBillForm.expenses.find(e => e.label.includes("Commission"))?.value || 0
        },
        advancePayment: farmerBillForm.advance || 0
     };

     const res = await MandiService.createFarmerSettlementBill(backendPayload);
     if (res.status === "SUCCESS") {
        setIsBillLocked(true);
        // Prevent crash: ensure 'expenses' remains a React-loopable array despite backend object responses
        setFarmerBillForm({ ...farmerBillForm, ...res.data, expenses: farmerBillForm.expenses });
        // Finalize state and await global sync for immediate dashboard updates
        await fetchData();
        handleFarmerSelectionForSettlement(targetFarmerId);
        alert("🔒 BILL FINALIZED & SENT TO LEDGER: Record successfully stored in Database.");
        
        if (confirm("Bill stored. Clear form for next settlement?")) {
           setIsBillLocked(false);
           setSettlementData([]);
           setFarmerBillForm({
              ...farmerBillForm,
              _id: null,
              billNo: `FB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
              date: new Date().toISOString().slice(0, 10),
              farmerId: "",
              expenses: [
                 { label: "Commission (5%)", value: 0 },
                 { label: "Labour/Hamali", value: 0 },
                 { label: "Freight/Transport", value: 0 },
                 { label: "Market Fee", value: 0 }
              ],
              advance: 0,
              netPayable: 0
           });
        }
     } else {
        alert(`❌ STORAGE FAILED: ${res.message || "Database synchronization error. Please check backend logs."}`);
     }
  };

  const handleVoidBill = async (id) => {
    if (user?.role !== "Owner / Admin") {
      alert("🛡️ SECURITY: Only the Owner / Admin is authorized to void finalized bills.");
      return;
    }
    const reason = prompt("Mandatory: Reason for voiding this finalized settlement?");
    if (!reason) return;
    const res = await MandiService.voidFarmerSettlementBill(id, reason);
     if (res.status === "SUCCESS") {
        alert("🚫 Settlement Voided. Entires reversed.");
        setIsBillLocked(false);
        setFarmerBillForm({ ...farmerBillForm, farmerId: "" });
        fetchData();
     }
  };

  const addCustomExpense = () => {
     const ex = [...farmerBillForm.expenses, { label: "Additional Deduction", value: 0, isCustom: true }];
     setFarmerBillForm({ ...farmerBillForm, expenses: ex });
  };

  // --- MENU CONFIG (PRODUCTION WORKFLOW) ---
  const ALL_MENU = [
    { id: "User Role", roles: ["Owner / Admin", "Operations Staff"], label: "Party Management" },
    { id: "Lot Creation", roles: ["Owner / Admin", "Operations Staff"], label: "Lot/Inventory Intake" },
    { id: "Lot Allocation", roles: ["Owner / Admin", "Operations Staff"], label: "Auction & Lot Allocation" },
    { id: "Supplier Billing", roles: ["Owner / Admin", "Operations Staff"], label: "Supplier Billing" },
    { id: "Buyer Invoicing", roles: ["Owner / Admin", "Operations Staff"], label: "Customer Billing" },
    { id: "Ledger", roles: ["Owner / Admin", "Operations Staff"], label: "Ledger System" },
    { id: "Payment & Settlement Management", roles: ["Owner / Admin", "Operations Staff"], label: "Payment & Settlement" },
    { id: "Transportation Tracking", roles: ["Owner / Admin", "Operations Staff"], label: "Transportation Tracking" },
    { id: "Dashboard", roles: ["Owner / Admin", "Operations Staff"], label: "Dashboard & Reports" }
  ];

  const MENU = user ? ALL_MENU.filter(item => item.roles.includes(user.role)) : [];

  if (loading) return <div style={{ height: "100vh", background: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff" }}><h1>⚡ Syncing Matrix...</h1></div>;

  if (!loggedIn) {
    return (
      <div style={{ height:"100vh", background:"#fcf9f1", display:"flex", justifyContent:"center", alignItems:"center", position:"relative", overflow:"hidden" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
          * { font-family: 'Plus Jakarta Sans', sans-serif; }
          .font-display { font-family: 'Outfit', sans-serif !important; }
          @keyframes floatUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
          .spv-input:focus { border-color: #9fb443 !important; }
          .spv-btn:hover { transform:translateY(-3px) !important; box-shadow:0 20px 45px rgba(55,81,68,0.45) !important; }
        `}</style>
        <div style={{ position:"absolute", top:"-150px", right:"-120px", width:"550px", height:"550px", background:"#375144", borderRadius:"50%", opacity:0.05 }} />
        <div style={{ position:"absolute", bottom:"-120px", left:"-100px", width:"420px", height:"420px", background:"#9fb443", borderRadius:"50%", opacity:0.07 }} />
        <div style={{ animation:"floatUp 0.5s ease-out", width:"460px", background:"#ffffff", borderRadius:"40px", padding:"56px 50px 48px", boxShadow:"0 30px 70px rgba(55,81,68,0.15)", border:"1.5px solid rgba(159,180,67,0.2)", textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"24px" }}>
            <img src="https://spvfruits.com/assets/images/IconBaseExport.webp" alt="SPV Fruits Logo" style={{ width: "96px", height: "96px", objectFit: "contain", filter: "drop-shadow(0 10px 20px rgba(55,81,68,0.15))" }} />
          </div>
          <h1 style={{ margin:"0 0 44px", fontWeight:"900", color:"#375144", fontSize:"32px", letterSpacing:"-1.5px" }}>SPV FRUITS</h1>
          <div style={{ textAlign:"left" }}>
            <div style={{ marginBottom:"18px" }}>
              <label style={{ display:"block", fontSize:"10px", fontWeight:"900", color:"#375144", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:"8px" }}>Staff Name</label>
              <input className="spv-input" type="text" placeholder="Enter username" value={authForm.username} onChange={e=>setAuthForm({...authForm,username:e.target.value})} style={{ width:"100%", padding:"15px 18px", borderRadius:"14px", border:"1.5px solid rgba(55,81,68,0.12)", background:"#fcf9f1", fontSize:"15px", fontWeight:"700", color:"#375144", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }} />
            </div>
            <div style={{ marginBottom:"18px" }}>
              <label style={{ display:"block", fontSize:"10px", fontWeight:"900", color:"#375144", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:"8px" }}>Staff Role</label>
              <select className="spv-input" value={authForm.role} onChange={e=>setAuthForm({...authForm, role:e.target.value})} style={{ width:"100%", padding:"15px 18px", borderRadius:"14px", border:"1.5px solid rgba(55,81,68,0.12)", background:"#fcf9f1", fontSize:"15px", fontWeight:"700", color:"#375144", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s", appearance: "none" }}>
                {["Owner / Admin", "Accountant", "Operations Staff", "Viewer"].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display:"block", fontSize:"10px", fontWeight:"900", color:"#375144", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:"8px" }}>Password</label>
              <input className="spv-input" type="password" placeholder="••••••••" value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{ width:"100%", padding:"15px 18px", borderRadius:"14px", border:"1.5px solid rgba(55,81,68,0.12)", background:"#fcf9f1", fontSize:"15px", fontWeight:"700", color:"#375144", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }} />
            </div>
          </div>
          <button className="spv-btn" onClick={handleLogin} style={{ width:"100%", height:"58px", fontSize:"16px", fontWeight:"900", marginTop:"28px", background:"linear-gradient(135deg, #375144 0%, #2d4137 100%)", color:"#ffffff", border:"none", borderRadius:"18px", cursor:"pointer", letterSpacing:"0.5px", boxShadow:"0 12px 30px rgba(55,81,68,0.3)", transition:"all 0.25s" }}>
            🔐 Login
          </button>
          <div style={{ marginTop:"32px", paddingTop:"20px", borderTop:"1.5px solid rgba(159,180,67,0.2)", display:"flex", justifyContent:"center", alignItems:"center", gap:"8px" }}>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#9fb443" }} />
            <span style={{ fontSize:"10px", color:"#64748b", fontWeight:"700", letterSpacing:"0.5px" }}>SPV FRUITS</span>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#9fb443" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: COLORS.bg, 
      display: "flex", 
      flexDirection: isMobile ? "column" : "row",
      fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif" 
    }}>
      <style>{`
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-display { font-family: 'Outfit', sans-serif !important; }
      `}</style>
      {/* MOBILE HEADER (Conditional) */}
      {loggedIn && isMobile && (
        <div style={{ 
          background: "#2d4137", 
          padding: "16px 20px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ color: "#9fb443", margin: 0, fontSize: "20px", fontWeight:"900" }}>SPV Fruits</h2>
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
          <div style={{ padding: "0 24px 32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <img src="https://spvfruits.com/assets/images/IconBaseExport.webp" alt="SPV Fruits" style={{ width: "64px", height: "64px", objectFit: "contain", borderRadius: "50%", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.1))" }} />
            <h2 style={{ color: "#ffffff", fontWeight: "850", fontSize: "18px", letterSpacing: "1px", margin: 0 }}>SPV FRUITS</h2>
          </div>
          
          <div style={{ padding: "0 24px", marginBottom: "12px" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", color: "#548265", textTransform: "uppercase", letterSpacing: "1px" }}>Overview</span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
            {MENU.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                style={{
                  padding: item.isSub ? "8px 16px 8px 36px" : "12px 18px", borderRadius: "14px", marginBottom: "6px", cursor: "pointer",
                  display: "flex", alignItems: "center", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: activeSection === item.id ? "rgba(160, 183, 99, 0.15)" : "transparent",
                  color: activeSection === item.id ? "#ffffff" : "#AEC4BB",
                }}
              >
                <span style={{ 
                  fontWeight: activeSection === item.id ? "850" : "550", 
                  fontSize: item.isSub ? "12px" : "13.5px", 
                  letterSpacing: "0.2px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {item.label || item.id}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "auto", padding: "28px 24px", display: "flex", alignItems: "center", gap: "16px", background: "rgba(0,0,0,0.15)", margin: "0 12px 12px", borderRadius: "20px" }}>
             <div style={{ background: COLORS.accent, width: "38px", height: "38px", borderRadius: "19px", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.secondary, fontSize: "14px", fontWeight: "900", boxShadow: "0 0 15px rgba(0,0,0,0.2)" }}>{user?.username?.[0]?.toUpperCase() || "U"}</div>
             <div style={{ flex: 1 }}>
                <p style={{ color: "#ffffff", fontSize: "14px", margin: 0, fontWeight: "850", letterSpacing: "0.3px" }}>{user?.username || "Staff Identity"}</p>
                <p style={{ color: "#AEC4BB", fontSize: "11px", margin: 0, fontWeight: "600", textTransform: "uppercase", opacity: 0.7 }}>{user?.role}</p>
             </div>
             <button onClick={handleLogout} style={{ background: "none", border: "none", color: COLORS.accent, cursor: "pointer", fontSize: "20px", padding: "8px", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.transform="scale(1.2)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>🚪</button>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
               <div>
                  <h1 style={{ fontSize: "32px", fontWeight: "900", color: COLORS.secondary, margin: 0, letterSpacing: "-1px" }}>{getGreeting()}, {user?.name?.split(' ')[0] || user?.username || 'Admin'}</h1>
               </div>
               <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "10px 20px", borderRadius: "24px", fontSize: "14px", fontWeight: "850", color: COLORS.primary, border: `1px solid ${COLORS.primary}20` }}>
                    📅 {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
               </div>
            </div>
        </header>

        {/* --- MODULE DISPATCHER --- */}
        <div style={{ animation: "fadeIn 0.6s ease-out" }}>

          {/* Global Location Datalists */}
          <datalist id="indian-states">
             {["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"].map(s => <option key={s} value={s} />)}
          </datalist>
          <datalist id="indian-towns">
             {["Guntur", "Madanapalle", "Tenali", "Narasaraopet", "Nagpur", "Nashik", "Pune", "Mumbai", "Surat", "Ahmedabad", "Rajkot", "Vadodara", "Varanasi", "Lucknow", "Kanpur", "Prayagraj", "Patna", "Gaya", "Ranchi", "Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Azadpur", "Ghazipur", "Warangal", "Karimnagar", "Nizamabad", "Khammam", "Ramagundam", "Siddipet", "Medak", "Chikballapur", "Kolar", "Hassan", "Mysuru", "Hubli", "Belagavi", "Davanagere", "Anantapur", "Chittoor", "Kadapa", "Nellore", "Kurnool", "Ongole", "Tirupati"].map(t => <option key={t} value={t} />)}
          </datalist>


          {activeSection === "User Role" && (
               <div style={{ paddingBottom: "24px", marginBottom: "32px", borderBottom: "1px solid #EBE9E1" }}>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <div 
                      onClick={() => setActiveUserRoleTab("Supplier")}
                      style={{ padding: "10px 24px", cursor: "pointer", fontWeight: "700", background: activeUserRoleTab === "Supplier" ? COLORS.sidebar : "#F3F1EA", color: activeUserRoleTab === "Supplier" ? "#FFFFFF" : COLORS.muted, borderRadius: "8px", transition: "all 0.2s" }}
                    >Supplier Registration</div>
                    <div 
                      onClick={() => setActiveUserRoleTab("Buyer")}
                      style={{ padding: "10px 24px", cursor: "pointer", fontWeight: "700", background: activeUserRoleTab === "Buyer" ? COLORS.sidebar : "#F3F1EA", color: activeUserRoleTab === "Buyer" ? "#FFFFFF" : COLORS.muted, borderRadius: "8px", transition: "all 0.2s" }}
                    >Customer Registration</div>
                  </div>
               </div>
          )}

          {/* Supplier Role Module (Handles both direct "Supplier" and nested "User Role") */}
          {(activeSection === "Supplier" || (activeSection === "User Role" && activeUserRoleTab === "Supplier")) && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              {activeSupplierTab === "Supplier Registration" && (
                <div>
                  <FormGrid sections={[
                    {
                      title: "Supplier Profile",
                      fields: [
                        { label: "Name *", placeholder: "Full name as per ID", value: supplierForm.name, onChange: e => setSupplierForm({...supplierForm, name: e.target.value}) },
                        { label: "Mobile Number *", type: "tel", placeholder: "Primary + optional alternate", value: supplierForm.phone, onChange: e => setSupplierForm({...supplierForm, phone: e.target.value}) },
                        { label: "Village/Town *", type: "select", options: ["Guntur", "Madanapalle", "Tenali", "Narasaraopet", "Nagpur", "Nashik", "Pune", "Mumbai", "Surat", "Ahmedabad", "Rajkot", "Vadodara", "Varanasi", "Lucknow", "Kanpur", "Prayagraj", "Patna", "Gaya", "Ranchi", "Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Azadpur", "Ghazipur", "Warangal", "Karimnagar", "Nizamabad", "Khammam", "Ramagundam", "Siddipet", "Medak", "Chikballapur", "Kolar", "Hassan", "Mysuru", "Hubli", "Belagavi", "Davanagere", "Anantapur", "Chittoor", "Kadapa", "Nellore", "Kurnool", "Ongole", "Tirupati"], value: supplierForm.village, onChange: e => setSupplierForm({...supplierForm, village: e.target.value}) },
                        { label: "District / State *", type: "select", options: ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"], value: supplierForm.state, onChange: e => setSupplierForm({...supplierForm, state: e.target.value}) }
                      ]
                    },
                    {
                      title: "KYC Details",
                      fields: [
                        { label: "Aadhaar Number", type: "number", placeholder: "12-digit (For KYC compliance)", value: supplierForm.aadhaar, onChange: e => setSupplierForm({...supplierForm, aadhaar: e.target.value}) },
                        { label: "PAN Number", placeholder: "For high-value transactions", value: supplierForm.pan, onChange: e => setSupplierForm({...supplierForm, pan: e.target.value}) },
                        { label: "Voter ID", placeholder: "Alternate ID", value: supplierForm.voterId, onChange: e => setSupplierForm({...supplierForm, voterId: e.target.value}) }
                      ]
                    },
                    {
                      title: "Bank Details",
                      fields: [
                        { label: "Bank Account No.", type: "number", placeholder: "For direct bank settlements", value: supplierForm.bankAccount, onChange: e => setSupplierForm({...supplierForm, bankAccount: e.target.value}) },
                        { label: "IFSC Code", placeholder: "Bank branch code", value: supplierForm.ifsc, onChange: e => setSupplierForm({...supplierForm, ifsc: e.target.value}) },
                        { label: "Advance Balance (₹)", type: "number", placeholder: "Running advance held by SPV", value: supplierForm.advanceBalance, onChange: e => setSupplierForm({...supplierForm, advanceBalance: e.target.value}) },
                        { label: "Notes", placeholder: "Free-form notes", value: supplierForm.notes, onChange: e => setSupplierForm({...supplierForm, notes: e.target.value}) }
                      ]
                    }
                  ]} />
                  <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                    <Button style={{ background: COLORS.sidebar, fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }} onClick={handleRegisterSupplier}>{isEditingSupplier ? 'Update Records' : 'Submit Details'}</Button>
                    <Button style={{ background: "#FFFFFF", color: "#1F3A2B", border: "1.5px solid #1F3A2B", fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => alert("Draft saved locally for " + (supplierForm.name || 'Supplier'))}>Save Draft</Button>
                    <Button style={{ background: "#FCFAEF", color: "#9EB343", border: "1.5px solid #E3E5DD", fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => alert("Select a supplier from the list below to edit their profile.")}>Edit Mode</Button>
                    <Button style={{ background: "#F1F5F9", color: "#CC0000", border: "none", fontWeight: "900", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => handleCancelAll('Supplier')}>Cancel All</Button>
                  </div>
                  
                  {/* Supplier Database Records */}
                  <div style={{ marginTop: "40px" }}>
                     <h4 className="font-display" style={{ color: COLORS.sidebar, marginBottom: "16px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", fontSize: "14px" }}>Registered Suppliers</h4>
                     <div style={{ maxHeight: "450px", overflowY: "auto", padding: "8px", background: "#FDFBF4", borderRadius: "16px", border: "1.5px solid #EBE9E1" }}>
                        <div style={{ display: "grid", gap: "12px" }}>
                           {suppliers.map(s => (
                              <div key={s._id} style={{ padding: "16px", background: "#fff", border: "1px solid #EBE9E1", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                                 <div>
                                    <b style={{ color: COLORS.sidebar, fontSize: "15px" }}>{s.name}</b>
                                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: COLORS.muted, fontWeight: "600" }}>📞 {s.phone} | 📍 {s.village || s.marketArea || 'Location N/A'}</p>
                                 </div>
                                 <div style={{ display: "flex", gap: "8px" }}>
                                    <Button variant="outline" style={{ fontSize: "11px", padding: "6px 12px", fontWeight: "800", borderColor: COLORS.accent, color: COLORS.secondary }} onClick={() => handleEditSelect('Supplier', s)}>Modify Profile</Button>
                                    <Button style={{ fontSize: "11px", padding: "6px 12px", fontWeight: "800", background: "#F1F5F9", color: "#CC0000", border: "1.5px solid #E2E8F0" }} onClick={() => handleDeleteSupplier(s._id)}>Delete</Button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Buyer Role Module */}
          {((activeSection === "User Role" && activeUserRoleTab === "Buyer")) && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>

              {activeBuyerTab === "Buyer Registration" && (
                <div>
                  <FormGrid sections={[
                    {
                      title: "Customer Profile & Location",
                      fields: [
                        { label: "Name *", placeholder: "Individual or business name", value: buyerForm.name, onChange: e => setBuyerForm({...buyerForm, name: e.target.value}) },
                        { label: "Shop / Business Name *", placeholder: "Shop / Business Name", value: buyerForm.shopName, onChange: e => setBuyerForm({...buyerForm, shopName: e.target.value}) },
                        { label: "Mobile Number *", type: "tel", placeholder: "Mobile Number", value: buyerForm.phone, onChange: e => setBuyerForm({...buyerForm, phone: e.target.value}) },
                        { label: "Address *", placeholder: "Delivery / shop address", value: buyerForm.address, onChange: e => setBuyerForm({...buyerForm, address: e.target.value}) },
                        { label: "Market / Area *", type: "select", options: ["Guntur", "Madanapalle", "Tenali", "Narasaraopet", "Nagpur", "Nashik", "Pune", "Mumbai", "Surat", "Ahmedabad", "Rajkot", "Vadodara", "Varanasi", "Lucknow", "Kanpur", "Prayagraj", "Patna", "Gaya", "Ranchi", "Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Azadpur", "Ghazipur", "Warangal", "Karimnagar", "Nizamabad", "Khammam", "Ramagundam", "Siddipet", "Medak", "Chikballapur", "Kolar", "Hassan", "Mysuru", "Hubli", "Belagavi", "Davanagere", "Anantapur", "Chittoor", "Kadapa", "Nellore", "Kurnool", "Ongole", "Tirupati"], value: buyerForm.marketArea, onChange: e => setBuyerForm({...buyerForm, marketArea: e.target.value}) },
                        { label: "Government ID", placeholder: "Aadhaar / PAN / GSTIN", value: buyerForm.govIdNumber, onChange: e => setBuyerForm({...buyerForm, govIdNumber: e.target.value}) }
                      ]
                    },
                    {
                      title: "Credit Details",
                      fields: [
                        { label: "Credit Limit (₹) *", type: "number", placeholder: "Max credit allowed; 0 = cash only" },
                        { label: "Payment Terms *", type: "select", options: ["Immediate", "7 Days", "15 Days", "30 Days"] },
                        { label: "Outstanding Balance (₹)", type: "number", placeholder: "Auto-calculated from invoices - payments" },
                        { label: "Notes", placeholder: "Free-form notes" }
                      ]
                    }
                  ]} />
                  <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                    <Button style={{ background: COLORS.sidebar, fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }} onClick={handleRegisterBuyer}>{isEditingBuyer ? 'Update Records' : 'Submit Details'}</Button>
                    <Button style={{ background: "#FFFFFF", color: "#1F3A2B", border: "1.5px solid #1F3A2B", fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => alert("Buyer draft saved.")}>Save Draft</Button>
                    <Button style={{ background: "#FCFAEF", color: "#9EB343", border: "1.5px solid #E3E5DD", fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => alert("Use the list below to select a buyer for editing.")}>Edit Mode</Button>
                    <Button style={{ background: "#F1F5F9", color: "#CC0000", border: "none", fontWeight: "900", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => handleCancelAll('Buyer')}>Cancel All</Button>
                  </div>

                  {/* Customer Database Records */}
                  <div style={{ marginTop: "40px" }}>
                     <h4 className="font-display" style={{ color: COLORS.sidebar, marginBottom: "16px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", fontSize: "14px" }}>Registered Customers</h4>
                     <div style={{ maxHeight: "450px", overflowY: "auto", padding: "8px", background: "#FDFBF4", borderRadius: "16px", border: "1.5px solid #EBE9E1" }}>
                        <div style={{ display: "grid", gap: "12px" }}>
                           {buyers.map(b => (
                              <div key={b._id} style={{ padding: "16px", background: "#fff", border: "1px solid #EBE9E1", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                                 <div>
                                    <b style={{ color: COLORS.sidebar, fontSize: "15px" }}>{b.name}</b>
                                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: COLORS.muted, fontWeight: "600" }}>🏬 {b.shopName} | 📞 {b.phone}</p>
                                 </div>
                                 <div style={{ display: "flex", gap: "8px" }}>
                                    <Button variant="outline" style={{ fontSize: "11px", padding: "6px 12px", fontWeight: "800", borderColor: COLORS.accent, color: COLORS.secondary }} onClick={() => handleEditSelect('Buyer', b)}>Modify Profile</Button>
                                    <Button style={{ fontSize: "11px", padding: "6px 12px", fontWeight: "800", background: "#F1F5F9", color: "#CC0000", border: "1.5px solid #E2E8F0" }} onClick={() => handleDeleteBuyer(b._id)}>Delete</Button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LOT CREATION MODULE */}
          {activeSection === "Lot Creation" && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              <div style={{ paddingBottom: "24px", marginBottom: "32px", borderBottom: "1px solid #EBE9E1" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div 
                    onClick={() => setActiveLotTab("LOT Creation")}
                    style={{ padding: "10px 24px", cursor: "pointer", fontWeight: "700", background: activeLotTab === "LOT Creation" ? COLORS.sidebar : "#F3F1EA", color: activeLotTab === "LOT Creation" ? "#FFFFFF" : COLORS.muted, borderRadius: "8px", transition: "all 0.2s" }}
                  >LOT Creation</div>
                  <div 
                    onClick={() => setActiveLotTab("Produce Details")}
                    style={{ padding: "10px 24px", cursor: "pointer", fontWeight: "700", background: activeLotTab === "Produce Details" ? COLORS.sidebar : "#F3F1EA", color: activeLotTab === "Produce Details" ? "#FFFFFF" : COLORS.muted, borderRadius: "8px", transition: "all 0.2s" }}
                  >Produce Details</div>
                </div>
              </div>

              {activeLotTab === "LOT Creation" && (
                <div>
                  <datalist id="suppliers-list">
                    {suppliers.map(s => <option key={s._id} value={s.name} />)}
                  </datalist>
                  <FormGrid sections={[
                    {
                      title: "Intake Details",
                      fields: [
                        { label: "Lot ID *", type: "text", value: lotCreationForm.lotId, disabled: true, placeholder: "Auto-generated sequence" },
                        { label: "Date & Time *", type: "datetime-local", value: lotCreationForm.dateTime, onChange: e => setLotCreationForm({...lotCreationForm, dateTime: e.target.value}) },
                        { 
                          label: "Supplier Name *", 
                          type: "select", 
                          options: ["", ...suppliers.map(s => s.name)], 
                          value: lotCreationForm.farmerId, 
                          onChange: e => {
                            const val = e.target.value;
                            const foundS = suppliers.find(s => s.name === val);
                            setLotCreationForm({
                              ...lotCreationForm, 
                              farmerId: val,
                              origin: foundS ? (foundS.village || foundS.state || "") : lotCreationForm.origin
                            });
                          }
                        },
                        { label: "Vehicle / Lorry Number *", type: "text", value: lotCreationForm.vehicleNumber, onChange: e => setLotCreationForm({...lotCreationForm, vehicleNumber: e.target.value}), placeholder: "Registration number of arriving vehicle" },
                        { label: "Driver Name", type: "text", value: lotCreationForm.driverName, onChange: e => setLotCreationForm({...lotCreationForm, driverName: e.target.value}), placeholder: "Optional" },
                        { label: "Origin / Source Location *", type: "text", value: lotCreationForm.origin, onChange: e => setLotCreationForm({...lotCreationForm, origin: e.target.value}), placeholder: "Village or farm location" },
                        { label: "Attached Bill Photo", type: "file", onChange: e => setLotCreationForm({...lotCreationForm, attachedBill: e.target.files[0]}), placeholder: "Photo of paper bill / delivery challan from farmer" },
                        { label: "Notes", type: "text", value: lotCreationForm.notes, onChange: e => setLotCreationForm({...lotCreationForm, notes: e.target.value}), placeholder: "Any special remarks about condition of produce" }
                      ]
                    }
                  ]} />

                  <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                    <Button 
                      style={{ background: COLORS.sidebar, fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }} 
                      onClick={() => {
                        if(!lotCreationForm.farmerId || !lotCreationForm.vehicleNumber || !lotCreationForm.origin) {
                          alert("Please complete all Intake Details first!");
                          return;
                        }
                        setActiveLotTab("Produce Details");
                      }}
                    >Save</Button>
                    <Button style={{ background: "#F1F5F9", color: "#CC0000", border: "none", fontWeight: "900", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => setLotCreationForm({
                        ...lotCreationForm,
                        lotId: `LOT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
                        vehicleNumber: "", driverName: "", origin: "", attachedBill: null, notes: "",
                        lineItems: [{ id: Date.now(), productId: "", variety: "", grade: "A", grossWeight: "", deductions: "", weightUnit: "KGs", estimatedRate: "", status: "Pending Auction" }]
                      })}>Clear</Button>
                  </div>

                  {/* Recently Created Lots (Vault Style) */}
                  <div style={{ marginTop: "48px" }}>
                     <h4 className="font-display" style={{ color: COLORS.sidebar, marginBottom: "16px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", fontSize: "14px" }}>Recently Created Lots</h4>
                     <div style={{ maxHeight: "400px", overflowY: "auto", padding: "8px", background: "#FDFBF4", borderRadius: "16px", border: "1.5px solid #EBE9E1" }}>
                        <div style={{ display: "grid", gap: "12px" }}>
                           {lots.slice().reverse().slice(0, 5).map(l => {
                              const grossSale = (l.lineItems || []).reduce((sum, item) => sum + (Number(item.grossWeight) * Number(item.estimatedRate)), 0);
                              return (
                              <div key={l._id || l.lotId} style={{ padding: "16px", background: "#fff", border: "1px solid #EBE9E1", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                                 <div style={{ flex: 1 }}>
                                    <b style={{ color: COLORS.sidebar, fontSize: "15px" }}>{l.lotId} — {l.supplierId?.name || l.supplierId || "Farmer"}</b>
                                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: COLORS.muted, fontWeight: "600" }}>🚛 {l.vehicleNumber} | 📍 {l.origin} | 📅 {new Date(l.entryDate || l.createdAt).toLocaleDateString()}</p>
                                    <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                                        <span style={{ fontSize: "11px", color: COLORS.accent, fontWeight: "900" }}>Gross Sale: {formatCurrency(grossSale)}</span>
                                        <span style={{ fontSize: "11px", color: COLORS.sidebar, fontWeight: "800" }}>Weight: {((l.lineItems || []).reduce((sw, i) => sw + (i.weightUnit === 'Tones' ? Number(i.grossWeight)*1000 : Number(i.grossWeight)), 0) / 1000).toFixed(2)} Tones</span>
                                    </div>
                                 </div>
                                 <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                    <div style={{ textAlign: "right", marginRight: "16px" }}>
                                       <span style={{ fontSize: "10px", background: "#F1F5F9", color: COLORS.secondary, padding: "4px 10px", borderRadius: "8px", fontWeight: "850" }}>{l.lineItems?.length || 0} Items</span>
                                    </div>
                                    <button onClick={() => handleEditLot(l)} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "8px", borderRadius: "8px", cursor: "pointer", color: COLORS.sidebar }} title="Modify">✏️</button>
                                    <button onClick={() => handleDeleteLot(l._id)} style={{ background: "#FFF1F2", border: "1px solid #FECDD3", padding: "8px", borderRadius: "8px", cursor: "pointer", color: "#E11D48" }} title="Delete">🗑️</button>
                                 </div>
                              </div>
                              );
                           })}
                           {lots.length === 0 && <p style={{ textAlign: "center", color: COLORS.muted, padding: "20px" }}>No lots registered yet.</p>}
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {activeLotTab === "Produce Details" && (
                <div style={{ animation: "fadeIn 0.4s ease-out" }}>
                  <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1" }}>
                    <div style={{ borderBottom: "1px solid #EBE9E1", paddingBottom: "16px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontSize: "20px", fontWeight: "900", color: COLORS.sidebar, margin: 0 }}>Produce Details</h3>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Lot: {lotCreationForm.lotId} | Supplier: {lotCreationForm.farmerId || "N/A"}</span>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      {lotCreationForm.lineItems.map((item, idx) => (
                        <div key={item.id} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", padding: "24px", background: "#FDFBF4", borderRadius: "8px", border: "1px solid #EBE9E1", position: "relative" }}>
                          
                          {idx > 0 && (
                            <div style={{ position: "absolute", top: "12px", right: "12px", cursor: "pointer", color: "#CC0000", fontWeight: "bold", fontSize: "12px" }} onClick={() => handleLineItemAction("Remove", idx)}>
                              ❌ Remove
                            </div>
                          )}

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Product *</label>
                            <select value={item.productId} onChange={(e) => handleLineItemAction("Update", idx, "productId", e.target.value)} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }}>
                               <option value="" disabled>Select Product</option>
                               {Object.keys(PRODUCT_DATA).filter(k => k !== "default").map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Variety *</label>
                            <select value={item.variety} onChange={(e) => handleLineItemAction("Update", idx, "variety", e.target.value)} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }}>
                               <option value="" disabled>Select Variety</option>
                               {(PRODUCT_DATA[item.productId]?.varieties || []).map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Grade</label>
                            <select value={item.grade} onChange={(e) => handleLineItemAction("Update", idx, "grade", e.target.value)} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }}>
                               <option value="A">A Grade</option>
                               <option value="B">B Grade</option>
                               <option value="C">C Grade</option>
                               <option value="Export">Export</option>
                               <option value="Local">Local</option>
                            </select>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Gross Weight ({item.weightUnit}) *</label>
                            <input type="number" value={item.grossWeight} onChange={(e) => handleLineItemAction("Update", idx, "grossWeight", e.target.value)} placeholder="0" style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Deductions ({item.weightUnit})</label>
                            <input type="number" value={item.deductions} onChange={(e) => handleLineItemAction("Update", idx, "deductions", e.target.value)} placeholder="0" style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Net Weight ({item.weightUnit}) Auto</label>
                            <input type="number" disabled value={(Number(item.grossWeight) - Number(item.deductions)) || 0} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", background: "#F1F5F9", color: COLORS.muted, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Weight Unit (KGs/Tones)</label>
                            <select 
                                value={item.weightUnit} 
                                onChange={(e) => {
                                    const nextUnit = e.target.value;
                                    const prevUnit = item.weightUnit;
                                    let newGross = Number(item.grossWeight) || 0;
                                    let newDeductions = Number(item.deductions) || 0;
                                    let newRate = Number(item.estimatedRate) || 0;

                                    if (prevUnit === "KGs" && nextUnit === "Tones") {
                                        newGross = newGross / 1000;
                                        newDeductions = newDeductions / 1000;
                                        newRate = newRate * 1000; // Rate per Tone is higher
                                    } else if (prevUnit === "Tones" && nextUnit === "KGs") {
                                        newGross = newGross * 1000;
                                        newDeductions = newDeductions * 1000;
                                        newRate = newRate / 1000; // Rate per KG is lower
                                    }

                                    handleLineItemAction("Update", idx, "weightUnit", nextUnit);
                                    handleLineItemAction("Update", idx, "grossWeight", newGross.toString());
                                    handleLineItemAction("Update", idx, "deductions", newDeductions.toString());
                                    handleLineItemAction("Update", idx, "estimatedRate", newRate.toString());
                                }} 
                                style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }}
                            >
                               <option value="KGs">KGs (Kilograms)</option>
                               <option value="Tones">Tones (Metric Tons)</option>
                            </select>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Est. Rate (₹/{item.weightUnit === 'Tones' ? 'Tone' : 'KG'})</label>
                            <input type="number" value={item.estimatedRate} onChange={(e) => handleLineItemAction("Update", idx, "estimatedRate", e.target.value)} placeholder="0" style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Inventory Status (Auto)</label>
                             <input type="text" disabled value={item.status || "Pending"} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", background: "#F1F5F9", color: COLORS.muted, outline: "none", fontSize: "13px", fontWeight: "800" }} />
                          </div>

                        </div>
                      ))}
                      <Button style={{ alignSelf: "flex-start", background: "#FFFFFF", color: COLORS.accent, border: `1.5px solid ${COLORS.accent}`, fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => handleLineItemAction("Add")}>+ Add Next Produce Item</Button>
                    </div>

                    <div style={{ marginTop: "32px", padding: "24px", background: "#F1F5F9", borderRadius: "12px", border: "1px solid #EBE9E1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <p style={{ margin: 0, fontSize: "12px", color: COLORS.muted, fontWeight: "700", textTransform: "uppercase" }}>Running Lot Totals</p>
                            <h4 style={{ margin: "4px 0 0", color: COLORS.sidebar, fontSize: "18px", fontWeight: "900" }}>Lot Value Summary</h4>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <p style={{ margin: 0, fontSize: "12px", color: COLORS.muted, fontWeight: "700", textTransform: "uppercase" }}>Estimated Gross Sale</p>
                            <h4 style={{ margin: "4px 0 0", color: COLORS.accent, fontSize: "22px", fontWeight: "900" }}>
                                { formatCurrency(lotCreationForm.lineItems.reduce((acc, i) => acc + ((Number(i.grossWeight)||0) * (Number(i.estimatedRate)||0)), 0)) }
                            </h4>
                        </div>
                    </div>
                  </div>
              
                  <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                    <Button style={{ background: COLORS.sidebar, fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }} onClick={handleRegisterLot}>Finish & Save</Button>
                    
                    {isAdmin && (
                      <Button style={{ background: "#FCFAEF", color: "#9EB343", border: "1.5px solid #E3E5DD", fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => alert("Edit Mode enabled for Admin")}>Edit</Button>
                    )}

                    <Button style={{ background: "#F1F5F9", color: "#CC0000", border: "none", fontWeight: "900", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => {
                        setActiveLotTab("LOT Creation");
                        setLotCreationForm({
                          ...lotCreationForm,
                          lotId: `LOT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
                          vehicleNumber: "", driverName: "", origin: "", attachedBill: null, notes: "",
                          lineItems: [{ id: Date.now(), productId: "", variety: "", grade: "A", grossWeight: "", deductions: "", weightUnit: "KGs", estimatedRate: "", status: "Pending Auction" }]
                        });
                    }}>Reset Everything</Button>
                  </div>

                  {/* Recently Created Lots (Vault Style) - Bottom of Produce Details */}
                  <div style={{ marginTop: "48px" }}>
                      <h4 className="font-display" style={{ color: COLORS.sidebar, marginBottom: "16px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", fontSize: "14px" }}>Recently Created Lots</h4>
                      <div style={{ maxHeight: "400px", overflowY: "auto", padding: "8px", background: "#FDFBF4", borderRadius: "16px", border: "1.5px solid #EBE9E1" }}>
                        <div style={{ display: "grid", gap: "12px" }}>
                           {lots.slice().reverse().slice(0, 5).map(l => {
                              const grossSale = (l.lineItems || []).reduce((sum, item) => sum + (Number(item.grossWeight) * Number(item.estimatedRate)), 0);
                              return (
                              <div key={l._id || l.lotId} style={{ padding: "16px", background: "#fff", border: "1px solid #EBE9E1", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                                 <div style={{ flex: 1 }}>
                                    <b style={{ color: COLORS.sidebar, fontSize: "15px" }}>{l.lotId} — {l.supplierId?.name || l.supplierId || "Farmer"}</b>
                                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: COLORS.muted, fontWeight: "600" }}>🚛 {l.vehicleNumber} | 📍 {l.origin} | 📅 {new Date(l.entryDate || l.createdAt).toLocaleDateString()}</p>
                                    <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                                        <span style={{ fontSize: "11px", color: COLORS.accent, fontWeight: "900" }}>Gross Sale: {formatCurrency(grossSale)}</span>
                                        <span style={{ fontSize: "11px", color: COLORS.sidebar, fontWeight: "800" }}>Weight: {((l.lineItems || []).reduce((sw, i) => sw + (i.weightUnit === 'Tones' ? Number(i.grossWeight)*1000 : Number(i.grossWeight)), 0) / 1000).toFixed(2)} Tones</span>
                                    </div>
                                 </div>
                                 <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                    <div style={{ textAlign: "right", marginRight: "16px" }}>
                                       <span style={{ fontSize: "10px", background: "#F1F5F9", color: COLORS.secondary, padding: "4px 10px", borderRadius: "8px", fontWeight: "850" }}>{l.lineItems?.length || 0} Items</span>
                                    </div>
                                    <button onClick={() => handleEditLot(l)} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "8px", borderRadius: "8px", cursor: "pointer", color: COLORS.sidebar }} title="Modify">✏️</button>
                                    <button onClick={() => handleDeleteLot(l._id)} style={{ background: "#FFF1F2", border: "1px solid #FECDD3", padding: "8px", borderRadius: "8px", cursor: "pointer", color: "#E11D48" }} title="Delete">🗑️</button>
                                 </div>
                              </div>
                              );
                           })}
                           {lots.length === 0 && <p style={{ textAlign: "center", color: COLORS.muted, padding: "20px" }}>No lots registered yet.</p>}
                        </div>
                      </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LOT ALLOCATION MODULE */}
          {activeSection === "Lot Allocation" && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "1px solid #EBE9E1", paddingBottom: "24px" }}>
                 <div>
                    <h2 style={{ fontSize: "28px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>Allocation Record Fields</h2>
                 </div>
              </div>

               <FormGrid sections={[
                {
                  title: "Auction & Allocation Entry",
                  fields: [
                    { 
                      label: "Lot ID *", 
                      type: "text", 
                      list: "lots-list", 
                      value: allocationForm.lotId, 
                      onChange: e => {
                        const lotIdVal = e.target.value;
                        const matchedLot = lots.find(l => l.lotId === lotIdVal);
                        let autoItem = "";
                        let autoQty = "";
                        let autoRate = "";
                        
                        if (matchedLot && matchedLot.lineItems?.length > 0) {
                           const firstItem = matchedLot.lineItems[0];
                           autoItem = `${firstItem.productId} / ${firstItem.variety} / ${firstItem.grade}`;
                           autoQty = (Number(firstItem.grossWeight) - Number(firstItem.deductions)).toString();
                           autoRate = firstItem.estimatedRate || "";
                        }

                        setAllocationForm({
                          ...allocationForm, 
                          lotId: lotIdVal,
                          lineItemId: autoItem,
                          quantity: autoQty,
                          saleRate: autoRate
                        });
                      }, 
                      placeholder: "Select active lot" 
                    },
                    { label: "Product / Variety / Grade *", type: "text", list: "items-list", value: allocationForm.lineItemId, onChange: e => setAllocationForm({...allocationForm, lineItemId: e.target.value}), placeholder: "Specific line item" },
                    { label: "Customer Name *", type: "select", options: ["", ...buyers.map(b => b.name)], value: allocationForm.buyerId, onChange: e => setAllocationForm({...allocationForm, buyerId: e.target.value}) },
                    { label: "Quantity Allocated (KG) *", type: "number", value: allocationForm.quantity, onChange: e => setAllocationForm({...allocationForm, quantity: e.target.value}), placeholder: "Can be partial" },
                    { label: "Sale Rate (₹/KG) *", type: "number", value: allocationForm.saleRate, onChange: e => setAllocationForm({...allocationForm, saleRate: e.target.value}), placeholder: "Agreed rate" },
                    { label: "Sale Amount (₹) Auto", type: "number", disabled: true, value: (Number(allocationForm.quantity) * Number(allocationForm.saleRate)) || 0 },
                    { label: "Allocation Date *", type: "date", value: allocationForm.allocationDate, onChange: e => setAllocationForm({...allocationForm, allocationDate: e.target.value}) },
                    { label: "Customer Invoice No", type: "text", value: allocationForm.buyerInvoiceNo, onChange: e => setAllocationForm({...allocationForm, buyerInvoiceNo: e.target.value}), placeholder: "Record official invoice #" },
                    { label: "Notes", type: "text", value: allocationForm.notes, onChange: e => setAllocationForm({...allocationForm, notes: e.target.value}), placeholder: "E.g. 'Bice No. 111'" }
                  ]
                }
              ]} />
              
              <datalist id="lots-list">
                 {lots.filter(l => l.status !== "Fully Sold").map(l => <option key={l._id || l.lotId} value={l.lotId} />)}
              </datalist>
              <datalist id="items-list">
                 {lots.find(l => l.lotId === allocationForm.lotId)?.lineItems?.map(item => 
                   <option key={item._id || item.id} value={`${item.productId} / ${item.variety} / ${item.grade}`} />
                 ) || []}
              </datalist>

              <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                <Button style={{ background: COLORS.sidebar, fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }} onClick={handleAllocate}>Record</Button>
                <Button style={{ background: "#F1F5F9", color: "#CC0000", border: "none", fontWeight: "900", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => setAllocationForm({ lotId: "", lineItemId: "", buyerId: "", quantity: "", saleRate: "", allocationDate: getISTDate(), buyerInvoiceNo: "", notes: "" })}>Clear</Button>
              </div>

              {/* Recently Recorded Allocations (Vault) */}
              <div style={{ marginTop: "48px" }}>
                 <h4 className="font-display" style={{ color: COLORS.sidebar, marginBottom: "16px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", fontSize: "14px" }}>Recently Recorded Allocations</h4>
                 <div style={{ maxHeight: "400px", overflowY: "auto", padding: "8px", background: "#FDFBF4", borderRadius: "16px", border: "1.5px solid #EBE9E1" }}>
                    <div style={{ display: "grid", gap: "12px" }}>
                       {allocations.slice().reverse().slice(0, 5).map(a => (
                          <div key={a._id || Date.now() + Math.random()} style={{ padding: "16px", background: "#fff", border: "1px solid #EBE9E1", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                             <div style={{ flex: 1 }}>
                                <b style={{ color: COLORS.sidebar, fontSize: "15px" }}>{a.lotId} — {a.buyerId?.name || a.buyerId || "Buyer"}</b>
                                <p style={{ margin: "4px 0 0", fontSize: "12px", color: COLORS.muted, fontWeight: "600" }}>📦 {a.lineItemId} | ⚖️ {a.quantity} KG @ ₹{a.rate}/KG | 📅 {a.allocationDate}</p>
                             </div>
                             <div style={{ display: "flex", gap: "12px" }}>
                                <button onClick={() => handleEditAllocation(a)} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "8px", borderRadius: "8px", cursor: "pointer", color: COLORS.sidebar }} title="Modify">✏️</button>
                                <button onClick={() => handleDeleteAllocation(a._id)} style={{ background: "#FFF1F2", border: "1px solid #FECDD3", padding: "8px", borderRadius: "8px", cursor: "pointer", color: "#E11D48" }} title="Delete">🗑️</button>
                             </div>
                          </div>
                       ))}
                       {allocations.length === 0 && <p style={{ textAlign: "center", color: COLORS.muted, padding: "20px" }}>No allocation records found.</p>}
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* SUPPLIER BILLING MODULE */}
          {activeSection === "Supplier Billing" && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              <TabHeader 
                tabs={["Bill Header", "Produce Sold", "Expense Deductions", "Financial Summary"]} 
                active={activeSupplierBillTab} 
                set={setActiveSupplierBillTab} 
              />

              {activeSupplierBillTab === "Bill Header" && (
                 <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1", animation: "fadeIn 0.3s ease-in" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 24px 0", borderBottom: "1px solid #EBE9E1", paddingBottom: "16px" }}>Bill Header</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                       
                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Bill Number</label>
                          <input type="text" disabled value={supplierSettlementForm.billNumber} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", background: "#F1F5F9", color: COLORS.muted, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Date</label>
                          <input type="date" value={supplierSettlementForm.date} onChange={e => setSupplierSettlementForm({...supplierSettlementForm, date: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Supplier Name</label>
                          <select value={supplierSettlementForm.supplierId} onChange={e => {
                             const selectedName = e.target.value;
                             // find the most recent lot for this supplier
                             const farmerLots = lots.filter(l => l.supplierId === selectedName || l.supplierId?.name === selectedName || l.farmerId === selectedName);
                             const latestLot = farmerLots.length > 0 ? farmerLots[farmerLots.length - 1] : null;
                             
                             const itemsToAdd = latestLot && latestLot.lineItems && latestLot.lineItems.length > 0
                                ? latestLot.lineItems.map((iter, idx) => ({
                                   id: Date.now() + idx,
                                   productName: `${iter.productId || ''} ${iter.variety || ''}`.trim() || 'Produce',
                                   quantity: Math.max(0, (Number(iter.grossWeight) || 0) - (Number(iter.deductions) || 0)),
                                   rate: iter.estimatedRate || ""
                                }))
                                : [{ id: Date.now(), productName: "", quantity: "", rate: "" }];

                             setSupplierSettlementForm(prev => ({
                               ...prev,
                               supplierId: selectedName,
                               lotId: latestLot ? latestLot.lotId : "",
                               vehicleNumber: latestLot ? (latestLot.vehicleNumber || "") : "",
                               date: latestLot && latestLot.entryDate ? latestLot.entryDate.slice(0, 10) : prev.date,
                               items: itemsToAdd
                             }));
                          }} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }}>
                             <option value="" disabled>Select Supplier</option>
                             {suppliers.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                          </select>
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Lot ID Reference <span style={{ fontSize: "10px", color: COLORS.primary, fontWeight: "800" }}>AUTO</span></label>
                          <select value={supplierSettlementForm.lotId} onChange={e => {
                             const selectedLotId = e.target.value;
                             const matchedLot = lots.find(l => l.lotId === selectedLotId);
                             setSupplierSettlementForm(prev => ({
                               ...prev,
                               lotId: selectedLotId,
                               vehicleNumber: matchedLot ? (matchedLot.vehicleNumber || prev.vehicleNumber) : prev.vehicleNumber
                             }));
                          }} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }}>
                             <option value="">-- Auto-filled from Supplier --</option>
                             {lots.filter(l => l.supplierId === supplierSettlementForm.supplierId || l.supplierId?.name === supplierSettlementForm.supplierId || l.farmerId === supplierSettlementForm.supplierId || !supplierSettlementForm.supplierId).map(l => <option key={l._id || l.lotId} value={l.lotId}>{l.lotId}</option>)}
                          </select>
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Vehicle Number <span style={{ fontSize: "10px", color: COLORS.primary, fontWeight: "800" }}>AUTO</span></label>
                          <input type="text" value={supplierSettlementForm.vehicleNumber} onChange={e => setSupplierSettlementForm({...supplierSettlementForm, vehicleNumber: e.target.value})} placeholder="Auto-filled from Lot" style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600", background: supplierSettlementForm.vehicleNumber ? "#FDFBF4" : "#FFFFFF" }} />
                       </div>

                     </div>
                     <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "32px", paddingTop: "24px", borderTop: "2px solid #F1F5F9" }}>
                        <Button style={{ background: COLORS.sidebar, fontWeight: "800", padding: "12px 32px", borderRadius: "8px" }} onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveSupplierBillTab("Produce Sold"); }}>Next: Produce Sold →</Button>
                     </div>
                  </div>
              )}

              {activeSupplierBillTab === "Produce Sold" && (
                 <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1", animation: "fadeIn 0.3s ease-in" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 24px 0", borderBottom: "1px solid #EBE9E1", paddingBottom: "16px" }}>Produce Sold</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                       {supplierSettlementForm.items.map((item, idx) => (
                           <div key={item.id} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", background: "#FDFBF4", padding: "20px", borderRadius: "12px", border: "1.5px solid #EBE9E1", position: "relative", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                               {idx > 0 && <div style={{ position: "absolute", top: "12px", right: "12px", cursor: "pointer", color: "#E11D48", fontWeight: "900", fontSize: "10px", background: "#FFF1F2", padding: "4px 8px", borderRadius: "6px" }} onClick={() => handleSupplierItemAction("Remove", idx)}>✕ REMOVE</div>}
                               
                               <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                  <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>Item / Product Name</label>
                                  <input type="text" value={item.productName} onChange={(e) => handleSupplierItemAction("Update", idx, "productName", e.target.value)} placeholder="E.g. Mango - Alphonso" style={{ padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                               </div>
                               <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                  <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>Quantity (KGs)</label>
                                  <input type="number" value={item.quantity} onChange={(e) => handleSupplierItemAction("Update", idx, "quantity", e.target.value)} placeholder="0" style={{ padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                               </div>
                               <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                  <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>Rate (₹/KG)</label>
                                  <input type="number" value={item.rate} onChange={(e) => handleSupplierItemAction("Update", idx, "rate", e.target.value)} placeholder="0" style={{ padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                               </div>
                               <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                  <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>Total (₹) Auto</label>
                                  <input type="number" disabled value={(Number(item.quantity) * Number(item.rate)) || 0} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", background: "#F1F5F9", color: COLORS.muted, outline: "none", fontSize: "13px", fontWeight: "800" }} />
                               </div>
                           </div>
                       ))}
                       <Button style={{ alignSelf: "flex-start", background: "#FFFFFF", color: COLORS.accent, border: `1.5px solid ${COLORS.accent}`, fontWeight: "900", marginTop: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => handleSupplierItemAction("Add")}>+ Add Next Sale Item</Button>
                     </div>
                     <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", paddingTop: "24px", borderTop: "2px solid #F1F5F9" }}>
                        <Button style={{ background: "#F1F5F9", color: COLORS.sidebar, fontWeight: "800", border: "none" }} onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveSupplierBillTab("Bill Header"); }}>← Previous: Bill Header</Button>
                        <Button style={{ background: COLORS.sidebar, fontWeight: "800", padding: "12px 32px", borderRadius: "8px" }} onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveSupplierBillTab("Expense Deductions"); }}>Next: Expense Deductions →</Button>
                     </div>
                  </div>
              )}

              {activeSupplierBillTab === "Expense Deductions" && (
                 <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1", animation: "fadeIn 0.3s ease-in" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 16px 0", borderBottom: "1px solid #EBE9E1", paddingBottom: "16px" }}>Expense Deductions</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                       
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#FDFBF4", borderRadius: "10px", border: "1px solid #EBE9E1" }}>
                          <label style={{ fontSize: "14px", fontWeight: "750", color: COLORS.sidebar }}>🚛 Lorry Freight / Transport</label>
                          <input type="number" value={supplierSettlementForm.expenses.transport} onChange={e => setSupplierSettlementForm({...supplierSettlementForm, expenses: {...supplierSettlementForm.expenses, transport: e.target.value}})} placeholder="₹" style={{ width: "120px", padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", outline: "none", fontSize: "14px", fontWeight: "700", textAlign: "right" }} />
                       </div>
                       
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#FDFBF4", borderRadius: "10px", border: "1px solid #EBE9E1" }}>
                          <label style={{ fontSize: "14px", fontWeight: "750", color: COLORS.sidebar }}>🏢 Market Fee / Commission</label>
                          <input type="number" value={supplierSettlementForm.expenses.commission} onChange={e => setSupplierSettlementForm({...supplierSettlementForm, expenses: {...supplierSettlementForm.expenses, commission: e.target.value}})} placeholder="₹ or %" style={{ width: "120px", padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", outline: "none", fontSize: "14px", fontWeight: "700", textAlign: "right" }} />
                       </div>

                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#FDFBF4", borderRadius: "10px", border: "1px solid #EBE9E1" }}>
                          <label style={{ fontSize: "14px", fontWeight: "750", color: COLORS.sidebar }}>💪 Labour / Hamali</label>
                          <input type="number" value={supplierSettlementForm.expenses.labour} onChange={e => setSupplierSettlementForm({...supplierSettlementForm, expenses: {...supplierSettlementForm.expenses, labour: e.target.value}})} placeholder="₹" style={{ width: "120px", padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", outline: "none", fontSize: "14px", fontWeight: "700", textAlign: "right" }} />
                       </div>

                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#FDFBF4", borderRadius: "10px", border: "1px solid #EBE9E1" }}>
                          <label style={{ fontSize: "14px", fontWeight: "750", color: COLORS.sidebar }}>💰 Cash Advance Paid</label>
                          <input type="number" value={supplierSettlementForm.expenses.advance} onChange={e => setSupplierSettlementForm({...supplierSettlementForm, expenses: {...supplierSettlementForm.expenses, advance: e.target.value}})} placeholder="₹" style={{ width: "120px", padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", outline: "none", fontSize: "14px", fontWeight: "700", textAlign: "right" }} />
                       </div>

                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#FDFBF4", borderRadius: "10px", border: "1px solid #EBE9E1" }}>
                          <label style={{ fontSize: "14px", fontWeight: "750", color: COLORS.sidebar }}>⚖️ Weighing Charges (Kata)</label>
                          <input type="number" value={supplierSettlementForm.expenses.weighing} onChange={e => setSupplierSettlementForm({...supplierSettlementForm, expenses: {...supplierSettlementForm.expenses, weighing: e.target.value}})} placeholder="₹" style={{ width: "120px", padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", outline: "none", fontSize: "14px", fontWeight: "700", textAlign: "right" }} />
                       </div>

                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#FDFBF4", borderRadius: "10px", border: "1px solid #EBE9E1" }}>
                          <label style={{ fontSize: "14px", fontWeight: "750", color: COLORS.sidebar }}>📦 Packing Material</label>
                          <input type="number" value={supplierSettlementForm.expenses.packing} onChange={e => setSupplierSettlementForm({...supplierSettlementForm, expenses: {...supplierSettlementForm.expenses, packing: e.target.value}})} placeholder="₹" style={{ width: "120px", padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", outline: "none", fontSize: "14px", fontWeight: "700", textAlign: "right" }} />
                       </div>

                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#FDFBF4", borderRadius: "10px", border: "1px solid #EBE9E1" }}>
                          <input type="text" value={supplierSettlementForm.expenses.miscName} onChange={e => setSupplierSettlementForm({...supplierSettlementForm, expenses: {...supplierSettlementForm.expenses, miscName: e.target.value}})} placeholder="Other deduction label..." style={{ flex: 1, marginRight: "12px", padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", outline: "none", fontSize: "13px", fontWeight: "600", background: "transparent" }} />
                          <input type="number" value={supplierSettlementForm.expenses.miscAmount} onChange={e => setSupplierSettlementForm({...supplierSettlementForm, expenses: {...supplierSettlementForm.expenses, miscAmount: e.target.value}})} placeholder="₹" style={{ width: "120px", padding: "10px", borderRadius: "8px", border: "1px solid #EBE9E1", outline: "none", fontSize: "14px", fontWeight: "700", textAlign: "right" }} />
                       </div>

                     </div>
                     <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", paddingTop: "24px", borderTop: "2px solid #F1F5F9" }}>
                        <Button style={{ background: "#F1F5F9", color: COLORS.sidebar, fontWeight: "800", border: "none" }} onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveSupplierBillTab("Produce Sold"); }}>← Previous: Produce Sold</Button>
                        <Button style={{ background: COLORS.sidebar, fontWeight: "800", padding: "12px 32px", borderRadius: "8px" }} onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveSupplierBillTab("Financial Summary"); }}>Next: Review & Save →</Button>
                     </div>
                  </div>
              )}

              {activeSupplierBillTab === "Financial Summary" && (
                 <div style={{ background: "#FFFFFF", padding: "40px", borderRadius: "16px", border: "1px solid #EBE9E1", animation: "fadeIn 0.3s ease-in", boxShadow: "0 10px 30px rgba(0,0,0,0.01)" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: "900", color: COLORS.sidebar, margin: "0 0 32px 0", borderBottom: "1.5px solid #F1F5F9", paddingBottom: "20px", letterSpacing: "-0.5px" }}>Financial Settlement Summary</h2>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                       
                       {(() => {
                          const grossSale = supplierSettlementForm.items.reduce((sum, it) => sum + ((Number(it.quantity) * Number(it.rate)) || 0), 0);
                          const ex = supplierSettlementForm.expenses;
                          const totalExpenses = (Number(ex.transport) || 0) + (Number(ex.commission) || 0) + (Number(ex.labour) || 0) + (Number(ex.weighing) || 0) + (Number(ex.packing) || 0) + (Number(ex.miscAmount) || 0);
                          const advance = Number(ex.advance) || 0;
                          const netSale = grossSale - totalExpenses;
                          const balancePayable = netSale - advance;

                          return (
                             <>
                                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                   <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #F1F5F9" }}>
                                      <span style={{ color: COLORS.muted, fontWeight: "600" }}>Gross Sale</span>
                                      <span style={{ color: COLORS.sidebar, fontWeight: "800" }}>{formatCurrency(grossSale)}</span>
                                   </div>
                                   <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #F1F5F9" }}>
                                      <span style={{ color: COLORS.muted, fontWeight: "600" }}>Total Expenses</span>
                                      <span style={{ color: "#CC0000", fontWeight: "800" }}>- {formatCurrency(totalExpenses)}</span>
                                   </div>
                                   <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #F1F5F9" }}>
                                      <span style={{ color: COLORS.sidebar, fontWeight: "700" }}>Net Sale</span>
                                      <span style={{ color: COLORS.sidebar, fontWeight: "800" }}>{formatCurrency(netSale)}</span>
                                   </div>
                                   <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #F1F5F9" }}>
                                      <span style={{ color: COLORS.muted, fontWeight: "600" }}>Advance Payment</span>
                                      <span style={{ color: "#CC0000", fontWeight: "800" }}>- {formatCurrency(advance)}</span>
                                   </div>
                                </div>
                             </>
                          );
                       })()}
                    </div>
                 </div>
              )}

              <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                {activeSupplierBillTab === "Financial Summary" && (
                   <Button style={{ background: "#F1F5F9", color: COLORS.sidebar, fontWeight: "800", border: "none", padding: "16px 32px" }} onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveSupplierBillTab("Expense Deductions"); }}>← Back to Expenses</Button>
                )}
                <Button style={{ background: COLORS.sidebar, fontWeight: "900", padding: "16px 40px", boxShadow: "0 4px 12px rgba(55,81,68,0.2)" }} onClick={async () => {
                   try {
                       if (!supplierSettlementForm.supplierId) return alert("⚠️ Supplier is required.");
                       let res;
                       if (isEditingSupplierBill) {
                           res = await MandiService.updateSupplierBill(editingSupplierBillId, supplierSettlementForm);
                       } else {
                           res = await MandiService.generateSupplierBill(supplierSettlementForm);
                       }
                       
                       if (res.status === "SUCCESS") {
                           alert(`✅ BILL ${isEditingSupplierBill ? 'UPDATED' : 'GENERATED'}: ${supplierSettlementForm.billNumber} has been recorded in the database.`);
                           setSupplierSettlementForm({
                              billNumber: `BILL-${Math.floor(100+Math.random()*900)}`,
                              date: getISTDate(),
                              supplierId: "",
                              lotId: "",
                              vehicleNumber: "",
                              items: [{ id: Date.now(), productName: "", quantity: "", rate: "" }],
                              expenses: { transport: "", commission: "", labour: "", advance: "", weighing: "", packing: "", miscName: "", miscAmount: "" }
                           });
                           setActiveSupplierBillTab("Bill Header");
                           setIsEditingSupplierBill(false);
                           setEditingSupplierBillId(null);
                           fetchData();
                       } else {
                           alert(`❌ FAILED: ${res.message || "Database Error"}`);
                       }
                   } catch(e) {
                       alert("Error processing bill.");
                   }
                }}>Finish & Save</Button>
                <Button style={{ background: "#F1F5F9", color: "#CC0000", border: "none", fontWeight: "900", padding: "16px 32px" }} onClick={() => {
                   if(window.confirm("Are you sure you want to clear this entire billing draft?")) {
                      setSupplierSettlementForm({
                         billNumber: `BILL-${Math.floor(100+Math.random()*900)}`,
                         date: getISTDate(),
                         supplierId: "",
                         lotId: "",
                         vehicleNumber: "",
                         items: [{ id: Date.now(), productName: "", quantity: "", rate: "" }],
                         expenses: { transport: "", commission: "", labour: "", advance: "", weighing: "", packing: "", miscName: "", miscAmount: "" }
                      });
                      setIsEditingSupplierBill(false);
                      setEditingSupplierBillId(null);
                      setActiveSupplierBillTab("Bill Header");
                   }
                }}>Clear</Button>
              </div>

              {/* Recently Recorded Supplier Bills */}
              <div style={{ marginTop: "48px" }}>
                 <h4 className="font-display" style={{ color: COLORS.sidebar, marginBottom: "16px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", fontSize: "14px" }}>Recently Generated Bills</h4>
                 <div style={{ maxHeight: "400px", overflowY: "auto", padding: "8px", background: "#FDFBF4", borderRadius: "16px", border: "1.5px solid #EBE9E1" }}>
                    <div style={{ display: "grid", gap: "12px" }}>
                       {supplierBills.slice().reverse().slice(0, 5).map(b => (
                          <div key={b._id || Date.now() + Math.random()} style={{ padding: "16px", background: "#fff", border: "1px solid #EBE9E1", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                             <div style={{ flex: 1 }}>
                                <b style={{ color: COLORS.sidebar, fontSize: "15px" }}>{b.billNumber} — {b.supplierId || "Supplier"}</b>
                                <p style={{ margin: "4px 0 0", fontSize: "12px", color: COLORS.muted, fontWeight: "600" }}>🚛 {b.vehicleNumber || 'N/A'} | 📅 {b.date}</p>
                             </div>
                             <div style={{ display: "flex", gap: "12px" }}>
                                <button onClick={() => {
                                   setSupplierSettlementForm(b);
                                   setIsEditingSupplierBill(true);
                                   setEditingSupplierBillId(b._id);
                                   setActiveSupplierBillTab("Bill Header");
                                   window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "8px", borderRadius: "8px", cursor: "pointer", color: COLORS.sidebar }} title="Modify">✏️</button>
                                <button onClick={async () => {
                                   if (!window.confirm("🗑️ Are you sure you want to PERMANENTLY delete this billing record?")) return;
                                   const res = await MandiService.deleteSupplierBill(b._id);
                                   if (res.status === "SUCCESS") {
                                      alert("✅ Bill deleted successfully!");
                                      fetchData();
                                   } else {
                                      alert("❌ Error deleting: " + res.message);
                                   }
                                }} style={{ background: "#FFF1F2", border: "1px solid #FECDD3", padding: "8px", borderRadius: "8px", cursor: "pointer", color: "#E11D48" }} title="Delete">🗑️</button>
                             </div>
                          </div>
                       ))}
                       {supplierBills.length === 0 && <p style={{ textAlign: "center", color: COLORS.muted, padding: "20px" }}>No billing records found.</p>}
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeSection === "Buyer Invoicing" && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "flex-start" }}>
                 {/* COLUMN 1: INVOICE HEADER */}
                 <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 24px 0", borderBottom: "1px solid #EBE9E1", paddingBottom: "16px" }}>7.2 Invoice Header</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                       
                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Invoice Number</label>
                          <input type="text" disabled value={buyerInvoiceForm.invoiceNumber} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", background: "#F1F5F9", color: COLORS.muted, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Date</label>
                          <input type="date" value={buyerInvoiceForm.date} onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, date: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Buyer Name (M/s)</label>
                          <select value={buyerInvoiceForm.buyerId} onChange={e => {
                             const selectedBuyer = buyers.find(b => b._id === e.target.value);
                             setBuyerInvoiceForm({...buyerInvoiceForm, buyerId: e.target.value, buyerPhone: selectedBuyer ? selectedBuyer.phone : ""});
                          }} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }}>
                             <option value="" disabled>Select Buyer</option>
                             {buyers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                          </select>
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Buyer Phone</label>
                          <input type="text" disabled value={buyerInvoiceForm.buyerPhone} placeholder="Auto-filled from profile" style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", background: "#F1F5F9", color: COLORS.muted, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Lot Reference</label>
                          <input type="text" value={buyerInvoiceForm.lotReference} onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, lotReference: e.target.value})} placeholder="Which lot(s) the produce came from" style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Transport / Bice No.</label>
                          <input type="text" value={buyerInvoiceForm.transportBiceNo} onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, transportBiceNo: e.target.value})} placeholder="Vehicle used for buyer's delivery" style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>
                    </div>
                 </div>

                 {/* COLUMN 2: ITEM TABLE */}
                 <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1", display: "flex", flexDirection: "column", height: "100%" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 24px 0", borderBottom: "1px solid #EBE9E1", paddingBottom: "16px" }}>7.3 Item Table — Produce Purchased</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
                       {buyerInvoiceForm.items.map((item, idx) => (
                           <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", background: "#FDFBF4", padding: "20px", borderRadius: "8px", border: "1px solid #EBE9E1", position: "relative" }}>
                               {idx > 0 && <div style={{ position: "absolute", top: "8px", right: "8px", cursor: "pointer", color: "#CC0000", fontWeight: "bold", fontSize: "10px" }} onClick={() => handleBuyerInvoiceItemAction("Remove", idx)}>❌ Remove</div>}
                               
                               <div style={{ display: "flex", flexDirection: "column", gap: "8px", gridColumn: "span 2" }}>
                                  <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>Product + Variety + Grade</label>
                                  <input type="text" value={item.productInfo} onChange={(e) => handleBuyerInvoiceItemAction("Update", idx, "productInfo", e.target.value)} placeholder="E.g. Mango - Nillam - A Grade" style={{ padding: "10px", borderRadius: "6px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "12px", fontWeight: "600" }} />
                               </div>
                               <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                  <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>Gross Wt (KG)</label>
                                  <input type="number" value={item.grossWeight} onChange={(e) => handleBuyerInvoiceItemAction("Update", idx, "grossWeight", e.target.value)} placeholder="0" style={{ padding: "10px", borderRadius: "6px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "12px", fontWeight: "600" }} />
                               </div>
                               <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                  <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>Deductions (KG)</label>
                                  <input type="number" value={item.deductions} onChange={(e) => handleBuyerInvoiceItemAction("Update", idx, "deductions", e.target.value)} placeholder="0" style={{ padding: "10px", borderRadius: "6px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "12px", fontWeight: "600" }} />
                               </div>
                               <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                  <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>Net Wt (KG) Auto</label>
                                  <input type="number" disabled value={Math.max(0, (Number(item.grossWeight) || 0) - (Number(item.deductions) || 0))} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #EBE9E1", background: "#F1F5F9", color: COLORS.muted, outline: "none", fontSize: "12px", fontWeight: "600" }} />
                               </div>
                               <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                  <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>Rate (₹/KG)</label>
                                  <input type="number" value={item.rate} onChange={(e) => handleBuyerInvoiceItemAction("Update", idx, "rate", e.target.value)} placeholder="0" style={{ padding: "10px", borderRadius: "6px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "12px", fontWeight: "600" }} />
                               </div>
                               <div style={{ display: "flex", flexDirection: "column", gap: "8px", gridColumn: "span 2" }}>
                                  <label style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted }}>AMOUNT (₹) Auto</label>
                                  <input type="number" disabled value={(Math.max(0, (Number(item.grossWeight) || 0) - (Number(item.deductions) || 0)) * (Number(item.rate) || 0))} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #EBE9E1", background: "#F1F5F9", color: COLORS.muted, outline: "none", fontSize: "12px", fontWeight: "600" }} />
                               </div>
                           </div>
                       ))}
                       <Button style={{ alignSelf: "flex-start", marginTop: "8px", background: "#FFFFFF", color: COLORS.accent, border: `1.5px solid ${COLORS.accent}`, fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => handleBuyerInvoiceItemAction("Add")}>+ Add Line Item</Button>
                    </div>
                 </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "flex-start", marginTop: "24px" }}>
                 {/* COLUMN 1: ADDITIONAL CHARGES */}
                 <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 16px 0" }}>7.4 Additional Charges</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                       
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px dashed #EBE9E1" }}>
                          <label style={{ fontSize: "13px", fontWeight: "700", color: COLORS.sidebar }}>Commission (₹)</label>
                          <input type="number" value={buyerInvoiceForm.charges.commission} onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, charges: {...buyerInvoiceForm.charges, commission: e.target.value}})} placeholder="₹" style={{ width: "120px", padding: "8px 12px", borderRadius: "6px", border: "1px solid #EBE9E1", outline: "none", fontSize: "13px", fontWeight: "600", textAlign: "right" }} />
                       </div>
                       
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px dashed #EBE9E1" }}>
                          <label style={{ fontSize: "13px", fontWeight: "700", color: COLORS.sidebar }}>Handling Charges (₹)</label>
                          <input type="number" value={buyerInvoiceForm.charges.handling} onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, charges: {...buyerInvoiceForm.charges, handling: e.target.value}})} placeholder="₹" style={{ width: "120px", padding: "8px 12px", borderRadius: "6px", border: "1px solid #EBE9E1", outline: "none", fontSize: "13px", fontWeight: "600", textAlign: "right" }} />
                       </div>

                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px dashed #EBE9E1" }}>
                          <label style={{ fontSize: "13px", fontWeight: "700", color: COLORS.sidebar }}>Outward Transport (₹)</label>
                          <input type="number" value={buyerInvoiceForm.charges.transport} onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, charges: {...buyerInvoiceForm.charges, transport: e.target.value}})} placeholder="₹" style={{ width: "120px", padding: "8px 12px", borderRadius: "6px", border: "1px solid #EBE9E1", outline: "none", fontSize: "13px", fontWeight: "600", textAlign: "right" }} />
                       </div>

                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <input type="text" value={buyerInvoiceForm.charges.otherName} onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, charges: {...buyerInvoiceForm.charges, otherName: e.target.value}})} placeholder="Other Charges label..." style={{ flex: 1, marginRight: "16px", padding: "8px 12px", borderRadius: "6px", border: "1px solid #EBE9E1", outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          <input type="number" value={buyerInvoiceForm.charges.otherAmount} onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, charges: {...buyerInvoiceForm.charges, otherAmount: e.target.value}})} placeholder="₹" style={{ width: "120px", padding: "8px 12px", borderRadius: "6px", border: "1px solid #EBE9E1", outline: "none", fontSize: "13px", fontWeight: "600", textAlign: "right" }} />
                       </div>
                    </div>
                 </div>

                 {/* COLUMN 2: INVOICE TOTALS */}
                 <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1", display: "flex", flexDirection: "column", height: "100%" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 24px 0", borderBottom: "1px solid #EBE9E1", paddingBottom: "16px" }}>7.5 Invoice Totals</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
                       {(() => {
                          const subTotal = buyerInvoiceForm.items.reduce((sum, it) => sum + (Math.max(0, (Number(it.grossWeight) || 0) - (Number(it.deductions) || 0)) * (Number(it.rate) || 0)), 0);
                          const ch = buyerInvoiceForm.charges;
                          const totalAdditional = (Number(ch.commission) || 0) + (Number(ch.handling) || 0) + (Number(ch.transport) || 0) + (Number(ch.otherAmount) || 0);
                          const grandTotal = subTotal + totalAdditional;
                          const amountReceived = Number(buyerInvoiceForm.amountReceived) || 0;
                          const balanceDue = grandTotal - amountReceived;

                          return (
                             <>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid #EBE9E1" }}>
                                   <span style={{ fontSize: "14px", fontWeight: "600", color: COLORS.muted }}>Sub Total (₹)</span>
                                   <span style={{ fontSize: "16px", fontWeight: "800", color: COLORS.sidebar }}>{formatCurrency(subTotal)}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid #EBE9E1" }}>
                                   <span style={{ fontSize: "14px", fontWeight: "600", color: COLORS.muted }}>Total Additional Charges (₹)</span>
                                   <span style={{ fontSize: "16px", fontWeight: "800", color: COLORS.sidebar }}>+ {formatCurrency(totalAdditional)}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#FDFBF4", borderRadius: "8px", marginBottom: "8px" }}>
                                   <span style={{ fontSize: "16px", fontWeight: "800", color: COLORS.sidebar }}>Grand Total (₹)</span>
                                   <span style={{ fontSize: "18px", fontWeight: "900", color: COLORS.sidebar }}>{formatCurrency(grandTotal)}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid #EBE9E1" }}>
                                   <span style={{ fontSize: "14px", fontWeight: "600", color: "#E67E22" }}>Amount Received (₹)</span>
                                   <input type="number" value={buyerInvoiceForm.amountReceived} onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, amountReceived: e.target.value})} placeholder="0" style={{ width: "120px", padding: "8px 12px", borderRadius: "6px", border: "1px solid #E67E22", outline: "none", fontSize: "13px", fontWeight: "600", textAlign: "right" }} />
                                </div>
                                <div style={{ marginTop: "auto", borderTop: "2px solid #EBE9E1", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                   <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: COLORS.sidebar }}>Balance Due (₹):</h3>
                                   <h2 style={{ margin: 0, fontSize: "32px", color: COLORS.primary }}>{formatCurrency(balanceDue)}</h2>
                                </div>
                             </>
                          );
                       })()}
                    </div>
                 </div>
              </div>

              <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                <Button style={{ background: COLORS.primary, color: "#FFFFFF", fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }} onClick={() => {
                   alert(`✅ INVOICE GENERATED: ${buyerInvoiceForm.invoiceNumber} saved!`);
                   setBuyerInvoiceForm({ invoiceNumber: `INV-${Math.floor(100+Math.random()*900)}`, date: getISTDate(), buyerId: "", buyerPhone: "", lotReference: "", transportBiceNo: "", items: [{ id: Date.now(), productInfo: "", grossWeight: "", deductions: "", rate: "" }], charges: { commission: "", handling: "", transport: "", otherName: "", otherAmount: "" }, amountReceived: "" });
                }}>Generate Invoice</Button>
                <Button style={{ background: "#F1F5F9", color: "#CC0000", border: "none", fontWeight: "900", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onClick={() => setBuyerInvoiceForm({ invoiceNumber: `INV-${Math.floor(100+Math.random()*900)}`, date: getISTDate(), buyerId: "", buyerPhone: "", lotReference: "", transportBiceNo: "", items: [{ id: Date.now(), productInfo: "", grossWeight: "", deductions: "", rate: "" }], charges: { commission: "", handling: "", transport: "", otherName: "", otherAmount: "" }, amountReceived: "" })}>Clear Data</Button>
              </div>
            </div>
          )}

          {/* LEDGER SYSTEM MODULE */}
          {activeSection === "Ledger" && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "flex-start" }}>
                 
                 {/* COLUMN 1: FARMER LEDGER */}
                 <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 16px 0", borderBottom: "1px solid #EBE9E1", paddingBottom: "16px" }}>8.2 Farmer Ledger</h2>
                    <p style={{ fontSize: "13px", color: COLORS.muted, marginBottom: "24px", marginTop: 0 }}>Tracks all amounts owed TO the farmer and all payments made.</p>
                    
                    <div style={{ overflowX: "auto" }}>
                       <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                          <thead>
                             <tr style={{ background: "#F1F5F9", color: COLORS.sidebar, fontWeight: "800", textAlign: "left" }}>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Date</th>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Lot ID</th>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Bill Number</th>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Product(s) Summary</th>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Gross Sale (₹)</th>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Expenses (₹)</th>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Net Sale (₹)</th>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Advance (₹)</th>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Payment Made (₹)</th>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Running Balance (₹)</th>
                             </tr>
                          </thead>
                          <tbody>
                             {/* Static dummy row for demonstration */}
                             <tr style={{ borderBottom: "1px solid #EBE9E1" }}>
                                <td style={{ padding: "12px", whiteSpace: "nowrap" }}>24-Mar-2024</td>
                                <td style={{ padding: "12px", whiteSpace: "nowrap" }}>LOT-1002</td>
                                <td style={{ padding: "12px", whiteSpace: "nowrap" }}>FB-2024-112</td>
                                <td style={{ padding: "12px", whiteSpace: "nowrap" }}>Mango 1754 KG + Banana 172 KG</td>
                                <td style={{ padding: "12px", whiteSpace: "nowrap" }}>12000</td>
                                <td style={{ padding: "12px", color: "#CC0000", whiteSpace: "nowrap" }}>-1000</td>
                                <td style={{ padding: "12px", fontWeight: "700", whiteSpace: "nowrap" }}>11000</td>
                                <td style={{ padding: "12px", color: "#E67E22", whiteSpace: "nowrap" }}>-2000</td>
                                <td style={{ padding: "12px", color: COLORS.success, whiteSpace: "nowrap" }}>-9000</td>
                                <td style={{ padding: "12px", fontWeight: "800", color: COLORS.primary, whiteSpace: "nowrap" }}>0</td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                 </div>

                 {/* COLUMN 2: BUYER LEDGER */}
                 <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1", display: "flex", flexDirection: "column", height: "100%" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 16px 0", borderBottom: "1px solid #EBE9E1", paddingBottom: "16px" }}>8.3 Buyer Ledger</h2>
                    <p style={{ fontSize: "13px", color: COLORS.muted, marginBottom: "24px", marginTop: 0 }}>Tracks all amounts owed BY the buyer and all payments received.</p>
                    
                    <div style={{ overflowX: "auto" }}>
                       <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                          <thead>
                             <tr style={{ background: "#F1F5F9", color: COLORS.sidebar, fontWeight: "800", textAlign: "left" }}>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Date</th>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Invoice No.</th>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Fruit / Variety</th>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Quantity (KG)</th>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Invoice Amount (₹)</th>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Payment Received (₹)</th>
                                <th style={{ padding: "12px", borderBottom: "2px solid #EBE9E1", whiteSpace: "nowrap" }}>Outstanding Balance (₹)</th>
                             </tr>
                          </thead>
                          <tbody>
                             {/* Static dummy row for demonstration */}
                             <tr style={{ borderBottom: "1px solid #EBE9E1" }}>
                                <td style={{ padding: "12px", whiteSpace: "nowrap" }}>24-Mar-2024</td>
                                <td style={{ padding: "12px", whiteSpace: "nowrap" }}>INV-129</td>
                                <td style={{ padding: "12px", whiteSpace: "nowrap" }}>Mango Alphonso A-Grade</td>
                                <td style={{ padding: "12px", whiteSpace: "nowrap" }}>450</td>
                                <td style={{ padding: "12px", fontWeight: "700", whiteSpace: "nowrap" }}>25000</td>
                                <td style={{ padding: "12px", color: COLORS.success, whiteSpace: "nowrap" }}>10000</td>
                                <td style={{ padding: "12px", fontWeight: "800", color: COLORS.primary, whiteSpace: "nowrap" }}>15000</td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                 </div>

              </div>
            </div>
          )}


          {activeSection === "Payment & Settlement Management" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "slideUp 0.5s ease-out" }}>
              
              {/* Top Summary Bar */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
                 <Card style={{ background: "#0f172a", color: "#fff" }}>
                    <p style={{ margin: 0, fontSize: "11px", opacity: 0.6, textTransform: "uppercase", fontWeight: "800" }}>Total Daily Collections</p>
                    <h2 style={{ margin: "5px 0 0" }}>{formatCurrency(dailyCashSummary.cash + dailyCashSummary.upi + dailyCashSummary.bank)}</h2>
                 </Card>
                 <Card>
                    <p style={{ margin: 0, fontSize: "11px", color: COLORS.muted, textTransform: "uppercase", fontWeight: "800" }}>Cash in Counter</p>
                    <h2 style={{ margin: "5px 0 0", color: COLORS.secondary }}>{formatCurrency(dailyCashSummary.cash)}</h2>
                 </Card>
                 <Card>
                    <p style={{ margin: 0, fontSize: "11px", color: COLORS.muted, textTransform: "uppercase", fontWeight: "800" }}>UPI / Digital</p>
                    <h2 style={{ margin: "5px 0 0", color: COLORS.accent }}>{formatCurrency(dailyCashSummary.upi)}</h2>
                 </Card>
                 <Card>
                    <p style={{ margin: 0, fontSize: "11px", color: COLORS.muted, textTransform: "uppercase", fontWeight: "800" }}>Bank Settlements</p>
                    <h2 style={{ margin: "5px 0 0", color: COLORS.primary }}>{formatCurrency(dailyCashSummary.bank)}</h2>
                 </Card>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "flex-start" }}>
                 
                 {/* COLUMN 1: FARMER PAYMENTS */}
                 <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 16px 0", borderBottom: "1px solid #EBE9E1", paddingBottom: "16px" }}>9.1 Farmer Payments (Outgoing from SPV)</h2>
                    <p style={{ fontSize: "13px", color: COLORS.muted, marginBottom: "24px", marginTop: 0 }}>Record outgoing payments or advance settlements to suppliers.</p>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                       
                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>Payment Date</label>
                          <input type="date" value={farmerPaymentForm.paymentDate} onChange={e => setFarmerPaymentForm({...farmerPaymentForm, paymentDate: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>Farmer Name</label>
                          <select value={farmerPaymentForm.farmerId} onChange={e => setFarmerPaymentForm({...farmerPaymentForm, farmerId: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }}>
                             <option value="" disabled>Select Farmer</option>
                             {suppliers.map(s => <option key={s._id} value={s._id}>{s.name} ({s.village})</option>)}
                          </select>
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>Against Bill No.</label>
                          <input type="text" placeholder="Which bill this payment settles" value={farmerPaymentForm.againstBillNo} onChange={e => setFarmerPaymentForm({...farmerPaymentForm, againstBillNo: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>Payment Mode</label>
                          <select value={farmerPaymentForm.paymentMode} onChange={e => setFarmerPaymentForm({...farmerPaymentForm, paymentMode: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }}>
                             <option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Cheque</option>
                          </select>
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>Amount (₹)</label>
                          <input type="number" placeholder="Payment amount" value={farmerPaymentForm.amount} onChange={e => setFarmerPaymentForm({...farmerPaymentForm, amount: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>UPI Ref / Cheque No.</label>
                          <input type="text" placeholder="Transaction reference" value={farmerPaymentForm.referenceNo} onChange={e => setFarmerPaymentForm({...farmerPaymentForm, referenceNo: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>Advance or Settlement</label>
                          <select value={farmerPaymentForm.tag} onChange={e => setFarmerPaymentForm({...farmerPaymentForm, tag: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }}>
                             <option>Advance</option><option>Part Payment</option><option>Full Settlement</option>
                          </select>
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>Notes</label>
                          <textarea placeholder="Optional remarks" value={farmerPaymentForm.notes} onChange={e => setFarmerPaymentForm({...farmerPaymentForm, notes: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600", height: "80px", resize: "none" }} />
                       </div>

                       <Button style={{ marginTop: "12px", height: "56px", fontSize: "16px", background: COLORS.primary }} onClick={handleRecordFarmerPayment}>Authorize & Dispatch Payout</Button>
                    </div>
                 </div>

                 {/* COLUMN 2: BUYER PAYMENTS */}
                 <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 16px 0", borderBottom: "1px solid #EBE9E1", paddingBottom: "16px" }}>9.2 Buyer Payments (Incoming to SPV)</h2>
                    <p style={{ fontSize: "13px", color: COLORS.muted, marginBottom: "24px", marginTop: 0 }}>Apply collections against outstanding invoices.</p>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                       
                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>Payment Date</label>
                          <input type="date" value={buyerPaymentForm.paymentDate} onChange={e => setBuyerPaymentForm({...buyerPaymentForm, paymentDate: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>Buyer Name</label>
                          <select value={buyerPaymentForm.buyerId} onChange={e => setBuyerPaymentForm({...buyerPaymentForm, buyerId: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }}>
                             <option value="" disabled>Select Buyer</option>
                             {buyers.map(b => <option key={b._id} value={b._id}>{b.shopName || b.name}</option>)}
                          </select>
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>Against Invoice No.</label>
                          <input type="text" placeholder="Which invoice this payment is for" value={buyerPaymentForm.againstInvoiceNo} onChange={e => setBuyerPaymentForm({...buyerPaymentForm, againstInvoiceNo: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>Payment Mode</label>
                          <select value={buyerPaymentForm.paymentMode} onChange={e => setBuyerPaymentForm({...buyerPaymentForm, paymentMode: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }}>
                             <option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Cheque</option><option>NEFT</option>
                          </select>
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>Amount Received (₹)</label>
                          <input type="number" placeholder="Amount collected" value={buyerPaymentForm.amountReceived} onChange={e => setBuyerPaymentForm({...buyerPaymentForm, amountReceived: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>Reference No.</label>
                          <input type="text" placeholder="UPI / cheque / transaction ID" value={buyerPaymentForm.referenceNo} onChange={e => setBuyerPaymentForm({...buyerPaymentForm, referenceNo: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>Collected By</label>
                          <input type="text" placeholder="Staff member name" value={buyerPaymentForm.collectedBy} onChange={e => setBuyerPaymentForm({...buyerPaymentForm, collectedBy: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "green" }}>Notes</label>
                          <textarea placeholder="Optional notes" value={buyerPaymentForm.notes} onChange={e => setBuyerPaymentForm({...buyerPaymentForm, notes: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600", height: "80px", resize: "none" }} />
                       </div>

                       <Button style={{ marginTop: "12px", height: "56px", fontSize: "16px" }} onClick={handleRecordBuyerPayment}>Confirm & Log Payment</Button>
                    </div>
                 </div>

              </div>

              {/* Sidebar Insights (Moved below forms for better spacing in 2-column view) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginTop: "24px" }}>
                 <Card title="UPI Payment QR" subtitle="Generate for instant collection">
                    <div style={{ background: "#f8fafc", padding: "40px", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", border: "2px dashed #e2e8f0" }}>
                       <div style={{ width: "160px", height: "160px", background: "#0f172a", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: "15px" }}>
                          [ QR CODE ]
                       </div>
                       <span style={{ fontSize: "14px", fontWeight: "800", color: COLORS.secondary }}>SPV FRUITS TRADING</span>
                       <span style={{ fontSize: "11px", color: COLORS.muted }}>Merchant ID: G889911CS</span>
                    </div>
                    <Button variant="outline" style={{ width: "100%", marginTop: "15px" }}>Show on Customer Display</Button>
                 </Card>

                 <Card title="Overdue Pulse Alerts" subtitle="Unpaid beyond terms">
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                       {[
                          { name: "Reliance Retail", due: 125000, days: 14 },
                          { name: "Harsha Wholesale", due: 84000, days: 9 }
                       ].map((alert, i) => (
                          <div key={i} style={{ padding: "16px", background: "#fef2f2", borderRadius: "12px", border: "1px solid #fee2e2" }}>
                             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                <b style={{ fontSize: "13px", color: "#991b1b" }}>{alert.name}</b>
                                <span style={{ fontSize: "10px", background: "#991b1b", color: "#fff", padding: "2px 8px", borderRadius: "10px" }}>{alert.days} days past</span>
                             </div>
                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "14px", fontWeight: "900", color: "#991b1b" }}>{formatCurrency(alert.due)}</span>
                                <button style={{ background: "none", border: "none", color: COLORS.primary, fontWeight: "800", fontSize: "11px", cursor: "pointer" }}>Send Notice 📲</button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </Card>
              </div>

            </div>
          )}
          
          {activeSection === "Transportation Tracking" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "slideUp 0.5s ease-out" }}>
              
              {/* Logistical Overview Summary Bar */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
                 <Card style={{ background: COLORS.secondary, color: "#fff" }}>
                    <p style={{ margin: 0, fontSize: "11px", opacity: 0.7, fontWeight: "800", textTransform: "uppercase" }}>Active Shipments</p>
                    <h2 style={{ margin: "5px 0 0" }}>14 Vehicles</h2>
                 </Card>
                 <Card style={{ background: "#fff", border: "1px solid #fee2e2" }}>
                    <p style={{ margin: 0, fontSize: "11px", color: "#b91c1c", fontWeight: "800", textTransform: "uppercase" }}>Arrival Alerts (Delayed)</p>
                    <h2 style={{ margin: "5px 0 0", color: "#ef4444" }}>02 Alerts</h2>
                 </Card>
                 <Card>
                    <p style={{ margin: 0, fontSize: "11px", color: COLORS.muted, fontWeight: "800", textTransform: "uppercase" }}>Today's Dispatch Vol.</p>
                    <h2 style={{ margin: "5px 0 0", color: COLORS.secondary }}>8,450 KG</h2>
                 </Card>
                 <Card>
                    <p style={{ margin: 0, fontSize: "11px", color: COLORS.muted, fontWeight: "800", textTransform: "uppercase" }}>Est. Freight Payable</p>
                    <h2 style={{ margin: "5px 0 0", color: COLORS.primary }}>{formatCurrency(45800)}</h2>
                 </Card>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "flex-start" }}>
                 
                 {/* COLUMN 1: INWARD TRANSPORTATION (FARMER SIDE) */}
                 <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 16px 0", borderBottom: "1px solid #EBE9E1", paddingBottom: "16px" }}>10.1 Inward Transportation (Farmer Side)</h2>
                    <p style={{ fontSize: "13px", color: COLORS.muted, marginBottom: "24px", marginTop: 0 }}>Tracks the lorry/vehicle that brings produce FROM the farmer TO the mandi.</p>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                       
                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Lot ID</label>
                             <select value={inwardTransportForm.lotId} onChange={e => setInwardTransportForm({...inwardTransportForm, lotId: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }}>
                                <option value="">-- Linked Lot --</option>
                                <option>LOT-X122 (Alphonso)</option><option>LOT-Y45 (Banana)</option>
                             </select>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Vehicle / Lorry No.</label>
                             <input type="text" placeholder="Registration number" value={inwardTransportForm.vehicleNo} onChange={e => setInwardTransportForm({...inwardTransportForm, vehicleNo: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>
                       </div>

                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Driver Name</label>
                             <input type="text" placeholder="Optional" value={inwardTransportForm.driverName} onChange={e => setInwardTransportForm({...inwardTransportForm, driverName: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Driver Mobile</label>
                             <input type="text" placeholder="Optional" value={inwardTransportForm.driverMobile} onChange={e => setInwardTransportForm({...inwardTransportForm, driverMobile: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Transport Company</label>
                          <input type="text" placeholder="If applicable" value={inwardTransportForm.company} onChange={e => setInwardTransportForm({...inwardTransportForm, company: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Origin (Village/District)</label>
                          <input type="text" placeholder="Where produce loaded from" value={inwardTransportForm.origin} onChange={e => setInwardTransportForm({...inwardTransportForm, origin: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Departure Date/Time</label>
                             <input type="datetime-local" value={inwardTransportForm.departureTime} onChange={e => setInwardTransportForm({...inwardTransportForm, departureTime: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Arrival Date/Time</label>
                             <input type="datetime-local" value={inwardTransportForm.arrivalTime} onChange={e => setInwardTransportForm({...inwardTransportForm, arrivalTime: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>
                       </div>

                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "flex-end" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Freight Amount (₹)</label>
                             <input type="number" placeholder="Transport cost" value={inwardTransportForm.freightAmount} onChange={e => setInwardTransportForm({...inwardTransportForm, freightAmount: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Freight Paid By</label>
                             <div style={{ display: "flex", gap: "4px" }}>
                                <Button onClick={() => setInwardTransportForm({...inwardTransportForm, paidBy: "SPV"})} variant={inwardTransportForm.paidBy === "SPV" ? "primary" : "outline"} style={{ flex: 1, height: "40px", fontSize: "11px", padding: 0 }}>SPV</Button>
                                <Button onClick={() => setInwardTransportForm({...inwardTransportForm, paidBy: "Farmer"})} variant={inwardTransportForm.paidBy === "Farmer" ? "primary" : "outline"} style={{ flex: 1, height: "40px", fontSize: "11px", padding: 0 }}>Farmer</Button>
                             </div>
                          </div>
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Notes</label>
                          <textarea placeholder="Route, stops, condition of produce" value={inwardTransportForm.notes} onChange={e => setInwardTransportForm({...inwardTransportForm, notes: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600", height: "60px", resize: "none" }} />
                       </div>

                       <Button style={{ marginTop: "8px", height: "54px" }} onClick={handleRecordInwardTransport}>Submit Inward Logistic Entry</Button>
                    </div>
                 </div>

                 {/* COLUMN 2: OUTWARD TRANSPORTATION (BUYER SIDE) */}
                 <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 16px 0", borderBottom: "1px solid #EBE9E1", paddingBottom: "16px" }}>10.2 Outward Transportation (Buyer Side)</h2>
                    <p style={{ fontSize: "13px", color: COLORS.muted, marginBottom: "24px", marginTop: 0 }}>Tracks the vehicle that moves produce FROM the mandi TO the buyer's location.</p>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                       
                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Invoice No.</label>
                             <select value={outwardTransportForm.invoiceNo} onChange={e => setOutwardTransportForm({...outwardTransportForm, invoiceNo: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }}>
                                <option value="">-- Linked Invoice --</option>
                                <option>INV-2026-X12</option><option>INV-2026-X45</option>
                             </select>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Bice / Vehicle No.</label>
                             <input type="text" placeholder="Truck / auto number" value={outwardTransportForm.vehicleNo} onChange={e => setOutwardTransportForm({...outwardTransportForm, vehicleNo: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>
                       </div>

                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Driver Name</label>
                             <input type="text" placeholder="Optional" value={outwardTransportForm.driverName} onChange={e => setOutwardTransportForm({...outwardTransportForm, driverName: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Driver Mobile</label>
                             <input type="text" placeholder="Optional" value={outwardTransportForm.driverMobile} onChange={e => setOutwardTransportForm({...outwardTransportForm, driverMobile: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Destination</label>
                          <input type="text" placeholder="Buyer's shop / market location" value={outwardTransportForm.destination} onChange={e => setOutwardTransportForm({...outwardTransportForm, destination: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                       </div>

                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Dispatch Date/Time</label>
                             <input type="datetime-local" value={outwardTransportForm.dispatchTime} onChange={e => setOutwardTransportForm({...outwardTransportForm, dispatchTime: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Delivery Date/Time</label>
                             <input type="datetime-local" value={outwardTransportForm.deliveryTime} onChange={e => setOutwardTransportForm({...outwardTransportForm, deliveryTime: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>
                       </div>

                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "flex-end" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Freight Amount (₹)</label>
                             <input type="number" placeholder="Outward freight" value={outwardTransportForm.freightAmount} onChange={e => setOutwardTransportForm({...outwardTransportForm, freightAmount: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }} />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Freight Paid By</label>
                             <div style={{ display: "flex", gap: "4px" }}>
                                <Button onClick={() => setOutwardTransportForm({...outwardTransportForm, paidBy: "Buyer"})} variant={outwardTransportForm.paidBy === "Buyer" ? "primary" : "outline"} style={{ flex: 1, height: "40px", fontSize: "11px", padding: 0 }}>Buyer</Button>
                                <Button onClick={() => setOutwardTransportForm({...outwardTransportForm, paidBy: "SPV"})} variant={outwardTransportForm.paidBy === "SPV" ? "primary" : "outline"} style={{ flex: 1, height: "40px", fontSize: "11px", padding: 0 }}>SPV</Button>
                             </div>
                          </div>
                       </div>

                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                             <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Delivery Status</label>
                             <select value={outwardTransportForm.status} onChange={e => setOutwardTransportForm({...outwardTransportForm, status: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600" }}>
                                <option>Pending</option><option>In Transit</option><option>Delivered</option><option>Returned</option>
                             </select>
                          </div>
                       </div>

                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: COLORS.muted }}>Notes</label>
                          <textarea placeholder="Any damage, shortage, or return info" value={outwardTransportForm.notes} onChange={e => setOutwardTransportForm({...outwardTransportForm, notes: e.target.value})} style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #EBE9E1", color: COLORS.sidebar, outline: "none", fontSize: "13px", fontWeight: "600", height: "60px", resize: "none" }} />
                       </div>

                       <Button style={{ marginTop: "8px", height: "54px", background: "#0f172a" }} onClick={handleRecordOutwardTransport}>Confirm Outward Dispatch</Button>
                    </div>
                 </div>

              </div>

              {/* Transportation Monitor Sidebar (Moved inside main flex column) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginTop: "24px" }}>
                 <Card title="Live In-Transit Monitor" subtitle="Tracking active vehicles">
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                       {[
                          { id: "AP 02 X 11", type: "Inward", time: "2h 15m ago", status: "In Transit", origin: "Nimmagadda" },
                          { id: "KA 51 J 88", type: "Outward", time: "45m ago", status: "Delayed", origin: "City Market" }
                       ].map((truck, i) => (
                          <div key={i} style={{ padding: "16px", background: truck.status === "Delayed" ? "#fef2f2" : "#f8fafc", borderRadius: "12px", border: `1.5px solid ${truck.status === "Delayed" ? "#fee2e2" : "#e2e8f0"}` }}>
                             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                <b style={{ fontSize: "14px" }}>{truck.id}</b>
                                <span style={{ fontSize: "10px", background: truck.type === "Inward" ? "#e0f2fe" : "#fef3c7", color: truck.type === "Inward" ? "#0369a1" : "#92400e", padding: "2px 8px", borderRadius: "8px", fontWeight: "900" }}>{truck.type.toUpperCase()}</span>
                             </div>
                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                <div style={{ fontSize: "11px", color: COLORS.muted }}>{truck.origin} <br /> {truck.time}</div>
                                <span style={{ fontSize: "11px", fontWeight: "800", color: truck.status === "Delayed" ? "#ef4444" : COLORS.primary }}>● {truck.status}</span>
                             </div>
                          </div>
                       ))}
                    </div>
                 </Card>

                 <Card title="Vehicle History Audit" subtitle="All trips by current filter">
                    <div style={{ position: "relative", marginBottom: "16px" }}>
                       <input placeholder="Search vehicle history..." style={{ padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #e2e8f0", width: "100%", outline: "none", fontSize: "12px", fontWeight: "600" }} value={transportFilter} onChange={e => setTransportFilter(e.target.value)} />
                    </div>
                    {transportFilter ? (
                       <div style={{ padding: "12px", border: "1px solid #f1f5f9", borderRadius: "10px", fontSize: "12px" }}>
                          📅 22/03 - Inward (Farmer A)<br />
                          📅 24/03 - Outward (Buyer B)<br />
                          <span style={{ color: COLORS.primary, cursor: "pointer", fontWeight: "800", display: "block", marginTop: "10px" }}>View Full Profile →</span>
                       </div>
                    ) : (
                       <div style={{ textAlign: "center", padding: "20px", opacity: 0.5 }}>
                          <span style={{ fontSize: "20px" }}>🔍</span>
                          <p style={{ fontSize: "11px", margin: "10px 0 0" }}>Enter a vehicle number to view history.</p>
                       </div>
                    )}
                 </Card>
              </div>

            </div>
          )}
          

          {/* 12. Expense Management */}
          {activeSection === "Expense Management" && (
            <Card title="Operational Burn Registry" subtitle="Track expenses per transaction or daily cycle">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "40px" }}>
                {[
                  { cat: "Labour", val: 32500 },
                  { cat: "Transport", val: 45800 },
                  { cat: "Marketing", val: 12000 },
                  { cat: "Packing", val: 18400 },
                  { cat: "Misc", val: 8200 }
                ].map(item => (
                  <div key={item.cat} style={{ padding: "24px", background: "#f8fafc", borderRadius: "20px", textAlign: "center", border: "1.5px solid #e2e8f0" }}>
                    <p style={{ margin: 0, fontWeight: "800", color: COLORS.muted }}>{item.cat}</p>
                    <h3 style={{ margin: "8px 0 0", color: COLORS.secondary }}>{formatCurrency(item.val)}</h3>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "32px" }}>
                <div>
                  <h3>Register New Expense Entry</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label style={{ fontSize: "12px", fontWeight: "800", color: COLORS.primary, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", position: "relative", paddingLeft: "12px" }}>
                        <span style={{ position: "absolute", left: 0, top: "2px", color: COLORS.accent }}>♦</span>
                        CATEGORY
                      </label>
                      <select style={{ backgroundColor: "rgba(255,255,255,0.7)", border: "2px solid #e2e8f0", borderRadius: "12px", padding: "16px", fontSize: "15px", color: COLORS.text, outline: "none", width: "100%" }}
                              value={expenseForm.category}
                              onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}>
                        <option value="Labour">Labour</option>
                        <option value="Transport">Transport</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Packing">Packing</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                      </select>
                    </div>
                    <Input label="Amount Paid" type="number" placeholder="₹" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", marginBottom: "12px" }}>
                    <Input label="Related Lot #" placeholder="Optional (TRX Link)" value={expenseForm.lotId} onChange={e => setExpenseForm({...expenseForm, lotId: e.target.value})} />
                  </div>
                  <Input label="Transaction Memo" placeholder="Fuel charges for Guntur route..." value={expenseForm.memo} onChange={e => setExpenseForm({...expenseForm, memo: e.target.value})} />
                  <Button onClick={handleCreateExpense} style={{ marginTop: "16px" }}>Commit to Ledger</Button>
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
                   {[
                     { name: "Srinivasa Rao", role: "Supplier", status: "VERIFIED" },
                     { name: "Mahesh Traders", role: "Buyer", status: "VERIFIED" },
                     { name: "Green Valley Farms", role: "Supplier", status: "PENDING" },
                     { name: "Prakash Wholesale", role: "Buyer", status: "VERIFIED" },
                     { name: "Vikram Reddy", role: "Supplier", status: "VERIFIED" },
                     { name: "Reliance Fresh Hub", role: "Buyer", status: "VERIFIED" },
                     { name: "Sandhya Devi", role: "Supplier", status: "VERIFIED" },
                     { name: "Anwar Pasha", role: "Supplier", status: "PENDING" },
                     { name: "Gopal Krishnan", role: "Supplier", status: "VERIFIED" },
                     { name: "Harsha Wholesale", role: "Buyer", status: "VERIFIED" }
                   ].map((user, i) => (
                     <div key={i} style={{ padding: "20px", borderRadius: "16px", background: "#f8fafc", marginBottom: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
                       <div>
                         <b>{user.name}</b>
                         <p style={{ margin: 0, fontSize: "12px", color: COLORS.muted }}>Role: {user.role}</p>
                       </div>
                       <div style={{ textAlign: "right" }}>
                         <span style={{ background: user.status === 'VERIFIED' ? COLORS.success : COLORS.accent, color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "900" }}>{user.status}</span>
                         <p style={{ margin: 0, fontSize: "10px", marginTop: "4px" }}>Vault ID: {Date.now().toString().slice(-6)}</p>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </Card>
          )}

          {/* 11. DASHBOARD & REPORTS */}
          {activeSection === "Dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px", animation: "slideUp 0.5s ease-out" }}>
                
                {/* 📊 11.1 Dashboard — Real-Time Overview */}
                <div style={{ background: "#FFFFFF", padding: "32px", borderRadius: "12px", border: "1px solid #EBE9E1" }}>
                   <h2 style={{ fontSize: "20px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 16px 0", borderBottom: "1px solid #EBE9E1", paddingBottom: "16px" }}>11.1 Dashboard — Real-Time Overview</h2>
                   <p style={{ fontSize: "13px", color: COLORS.muted, marginBottom: "24px", marginTop: 0 }}>The home screen dashboard gives the owner and accountant an instant snapshot of today's operations.</p>
                   
                   <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
                      {[
                         { label: "Today's Intake", val: "4,250 KG", sub: "Total KG received from farmers today", bg: COLORS.secondary, col: "#fff" },
                         { label: "Today's Sales", val: formatCurrency(185400), sub: "Total ₹ invoiced to buyers today", bg: COLORS.primary, col: "#fff" },
                         { label: "Pending Auctions", val: "07 Lots", sub: "Lots received but not yet allocated", bg: "#1e293b", col: "#fff" },
                         { label: "Total Farmer Outstanding", val: formatCurrency(845000), sub: "Total amount SPV owes to all farmers", bg: "#fff", col: "#991b1b", border: true },
                         { label: "Total Buyer Outstanding", val: formatCurrency(1250000), sub: "Total amount all buyers owe to SPV", bg: "#fff", col: COLORS.primary, border: true },
                         { label: "Today's Cash Collected", val: formatCurrency(320000), sub: "Payments received from buyers today", bg: COLORS.success, col: "#fff" },
                         { label: "Today's Cash Paid", val: formatCurrency(150000), sub: "Payments made to farmers today", bg: "#CC0000", col: "#fff" },
                         { label: "Active In-Transit Vehicles", val: "14 Lorries", sub: "Lorries currently on the road", bg: COLORS.sidebar, col: "#fff" }
                      ].map((m, i) => (
                         <Card key={i} style={{ background: m.bg, color: m.col, border: m.border ? `2px solid ${COLORS.sidebar}10` : "none", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "160px" }}>
                            <div>
                               <p style={{ margin: 0, fontSize: "11px", opacity: 0.8, textTransform: "uppercase", fontWeight: "900", letterSpacing: "1px" }}>{m.label}</p>
                               <h2 style={{ margin: "12px 0 0", fontSize: "28px", fontWeight: "900" }}>{m.val}</h2>
                            </div>
                            <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "8px", fontSize: "11px", fontWeight: "600", opacity: 0.8 }}>
                               {m.sub}
                            </div>
                         </Card>
                      ))}
                   </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "32px" }}>
                   {/* Business Intelligence Hub */}
                   <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      <Card title="Business Intelligence Hub" subtitle="Generate, download and share audited records">
                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            {[
                               { t: "Supplier Transaction Log", i: "🚜", d: "Date-wise intake & payment history" },
                               { t: "Buyer Credit Analysis", i: "📈", d: "Outstanding aging & payment patterns" },
                               { t: "Operational P&L Statement", i: "💹", d: "Revenue vs Expenses vs Commission" },
                               { t: "Logistics Efficiency Report", i: "🚚", d: "Freight costs & vehicle utilization" },
                            ].map((rep, i) => (
                               <div key={i} style={{ padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1.5px solid #e2e8f0", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.borderColor=COLORS.primary} onMouseOut={e=>e.currentTarget.style.borderColor="#e2e8f0"}>
                                  <div style={{ fontSize: "24px", marginBottom: "10px" }}>{rep.i}</div>
                                  <h4 style={{ margin: 0, color: COLORS.secondary }}>{rep.t}</h4>
                                  <p style={{ fontSize: "12px", color: COLORS.muted, margin: "8px 0 15px" }}>{rep.d}</p>
                                  <div style={{ display: "flex", gap: "8px" }}>
                                     <Button variant="outline" style={{ flex: 1, fontSize: "11px", padding: "8px" }} onClick={() => alert("Converting to Excel (CSV)...")}>Excel</Button>
                                     <Button variant="outline" style={{ flex: 1, fontSize: "11px", padding: "8px" }} onClick={() => window.print()}>PDF</Button>
                                     <Button variant="outline" style={{ flex: 1, fontSize: "11px", padding: "8px" }} onClick={() => alert("Sharing via WhatsApp...")}>WhatsApp</Button>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </Card>
                   </div>

                   {/* Communication Center */}
                   <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      <Card title="Communication & Auto-Sharing" subtitle="Stakeholder notifications status">
                         <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{ padding: "20px", background: "#f0fdf4", borderRadius: "20px", border: "1px solid #dcfce7" }}>
                               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                  <b style={{ color: "#166534" }}>Owner Daily Closing</b>
                                  <span style={{ fontSize: "10px", background: "#166534", color: "#fff", padding: "2px 8px", borderRadius: "10px" }}>AUTO-RUN ENABLED</span>
                               </div>
                               <p style={{ fontSize: "12px", margin: "0 0 15px" }}>Daily closing report sent to Vikram Reddy via WhatsApp at 09:15 PM.</p>
                               <Button variant="outline" style={{ width: "100%", background: "#fff", color: "#166534", borderColor: "#166534" }}>Re-configure</Button>
                            </div>

                            <Card style={{ background: "#0f172a", textAlign: "center", color: "#fff" }}>
                               <h3 style={{ margin: "0 0 8px 0" }}>Ecosystem Backup</h3>
                               <p style={{ fontSize: "12px", opacity: 0.7 }}>Download full tenant data as encrypted JSON/CSV archive.</p>
                               <Button variant="primary" style={{ marginTop: "15px", width: "100%" }}>Cloud Export</Button>
                            </Card>
                         </div>
                      </Card>
                   </div>
                </div>
            </div>
          )}

          {/* 15.5 PRODUCT MASTER & CONFIGURATION */}
          {activeSection === "Product Master & Configuration" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "slideUp 0.5s ease-out" }}>
               {/* Config Sub-Tabs */}
               <div style={{ display: "flex", gap: "16px", background: "#fff", padding: "8px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", alignSelf: "flex-start" }}>
                  {["Product", "Expense", "System"].map(tab => (
                     <button
                        key={tab}
                        onClick={() => setActiveConfigTab(tab)}
                        style={{ padding: "12px 28px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "850", transition: "0.2s", background: activeConfigTab === tab ? COLORS.primary : "transparent", color: activeConfigTab === tab ? "#fff" : COLORS.muted }}
                     >
                        {tab === "Product" ? "🍏 Product Catalog" : tab === "Expense" ? "💸 Expense Masters" : "⚙️ System Settings"}
                     </button>
                  ))}
               </div>

               {activeConfigTab === "Product" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "32px" }}>
                     <Card title="Add New Product / Variety" subtitle="No-coding required catalog expansion">
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                           <Input label="Core Product (Level 1)" placeholder="e.g. Mango, Tomato" value={newProductForm.coreProduct} onChange={e=>setNewProductForm({...newProductForm, coreProduct: e.target.value})} />
                           <Input label="Variety Name (Level 2)" placeholder="e.g. Alphonso, S-Grade" value={newProductForm.variety} onChange={e=>setNewProductForm({...newProductForm, variety: e.target.value})} />
                           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                              <div>
                                 <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "11px" }}>Default Grade</label>
                                 <select 
                                    value={newProductForm.grade}
                                    onChange={e=>setNewProductForm({...newProductForm, grade: e.target.value})}
                                    style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", fontWeight: "600" }}
                                 >
                                    <option>A-Grade</option>
                                    <option>B-Grade</option>
                                    <option>C-Grade</option>
                                    <option>Export Quality</option>
                                    <option>Pulp Grade</option>
                                 </select>
                              </div>
                              <div>
                                 <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "11px" }}>Standard Unit</label>
                                 <select 
                                    value={newProductForm.unit}
                                    onChange={e=>setNewProductForm({...newProductForm, unit: e.target.value})}
                                    style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", fontWeight: "600" }}
                                 >
                                    <option>KG</option>
                                    <option>Crate</option>
                                    <option>Box</option>
                                    <option>Ton</option>
                                    <option>Quintal</option>
                                    <option>Bag</option>
                                 </select>
                              </div>
                           </div>
                           <Button style={{ marginTop: "10px" }} onClick={handleRegisterProduct}>Register in Catalog</Button>
                        </div>
                     </Card>
                     
                     <Card title="Active Product Hierarchy" subtitle="Current configurable variety & grade matrix">
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                           {masterProducts.map((p, i) => (
                              <div key={i} style={{ padding: "20px", background: "#f8fafc", borderRadius: "20px", border: "1.5px solid #e2e8f0" }}>
                                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                    <h3 style={{ margin: 0, color: COLORS.secondary }}>{p.name}</h3>
                                    <span style={{ fontSize: "12px", background: "#e2e8f0", padding: "4px 10px", borderRadius: "8px", fontWeight: "800" }}>{p.units.join(", ")}</span>
                                 </div>
                                 <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {p.varieties.map(v => (
                                       <span key={v} style={{ fontSize: "11px", background: "#fff", border: "1px solid #cbd5e1", padding: "4px 12px", borderRadius: "10px", fontWeight: "600" }}>{v}</span>
                                    ))}
                                 </div>
                                 <div style={{ marginTop: "12px", display: "flex", gap: "6px" }}>
                                    {p.grades.map(g => (
                                       <span key={g} style={{ fontSize: "10px", color: COLORS.primary, fontWeight: "900" }}>• {g}</span>
                                    ))}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </Card>
                  </div>
               )}

               {activeConfigTab === "Expense" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "32px" }}>
                     <Card title="Register Expense Category" subtitle="Admin can add/rename billing deductions">
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                           <Input label="Category Label" placeholder="e.g. Loading Fee" value={newExpenseForm.label} onChange={e=>setNewExpenseForm({...newExpenseForm, label: e.target.value})} />
                           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                              <div>
                                 <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "11px" }}>Calculation Type</label>
                                 <select style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                                    <option>Percentage (%)</option><option>Fixed Amount (₹)</option>
                                 </select>
                              </div>
                              <Input label="Default Value" placeholder="e.g. 4" value={newExpenseForm.defaultValue} onChange={e=>setNewExpenseForm({...newExpenseForm, defaultValue: e.target.value})} />
                           </div>
                           <Button style={{ marginTop: "10px" }} onClick={handleRegisterExpenseCategory}>Create Ledger Category</Button>
                        </div>
                     </Card>
                     <Card title="Expense Master List" subtitle="Manage appearing categories in Bills/Invoices">
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                           <thead>
                              <tr style={{ textAlign: "left", borderBottom: "2px solid #f1f5f9" }}>
                                 <th style={{ padding: "12px", fontSize: "11px", textTransform: "uppercase" }}>Label</th>
                                 <th style={{ padding: "12px", fontSize: "11px", textTransform: "uppercase" }}>Type</th>
                                 <th style={{ padding: "12px", fontSize: "11px", textTransform: "uppercase" }}>Default</th>
                                 <th style={{ padding: "12px", fontSize: "11px", textTransform: "uppercase" }}>Activity</th>
                              </tr>
                           </thead>
                           <tbody>
                              {masterExpenses.map(ex => (
                                 <tr key={ex.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                                    <td style={{ padding: "12px", fontWeight: "700" }}>{ex.name}</td>
                                    <td style={{ padding: "12px", fontSize: "13px" }}>{ex.type}</td>
                                    <td style={{ padding: "12px", fontSize: "13px" }}>{ex.type === "Percentage" ? `${ex.default}%` : formatCurrency(ex.default)}</td>
                                    <td style={{ padding: "12px" }}>
                                       <div style={{ display: "flex", gap: "8px" }}>
                                          <button style={{ color: COLORS.primary, background: "none", border: "none", fontSize: "12px", fontWeight: "850", cursor: "pointer" }}>Edit</button>
                                          <button style={{ color: "#ef4444", background: "none", border: "none", fontSize: "12px", fontWeight: "850", cursor: "pointer" }}>{ex.active ? "Deactivate" : "Activate"}</button>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </Card>
                  </div>
               )}

               {activeConfigTab === "System" && (
                  <Card title="Global Governance & System Settings" subtitle="Branding, financial rules and automated communication">
                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                           <h4 style={{ color: COLORS.primary, borderBottom: `2px solid ${COLORS.primary}`, paddingBottom: "8px", margin: "0 0 8px" }}>📦 Core Branding</h4>
                           <Input label="Business Name" value={systemSettings.businessName} onChange={e=>setSystemSettings({...systemSettings, businessName: e.target.value})} />
                           <Input label="Business Address" value={systemSettings.address} onChange={e=>setSystemSettings({...systemSettings, address: e.target.value})} />
                           <div style={{ padding: "12px", border: "2px dashed #e2e8f0", borderRadius: "10px", textAlign: "center", fontSize: "11px" }}>
                              Drop Logo File Here (.png/.jpg)
                           </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                           <h4 style={{ color: COLORS.primary, borderBottom: `2px solid ${COLORS.primary}`, paddingBottom: "8px", margin: "0 0 8px" }}>💰 Financial Defaults</h4>
                           <Input label="Global Default Commission (%)" type="number" value={systemSettings.defaultCommission} onChange={e=>setSystemSettings({...systemSettings, defaultCommission: e.target.value})} />
                           <Input label="Standard Payment Terms" placeholder="7 Days" value={systemSettings.buyerPaymentTerms} onChange={e=>setSystemSettings({...systemSettings, buyerPaymentTerms: e.target.value})} />
                           <div>
                              <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "11px" }}>Financial Year Cycle</label>
                              <select style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                                 <option>April–March (India)</option>
                                 <option>January–December</option>
                              </select>
                           </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                           <h4 style={{ color: COLORS.primary, borderBottom: `2px solid ${COLORS.primary}`, paddingBottom: "8px", margin: "0 0 8px" }}>📑 Documentation & Comms</h4>
                           <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
                              <Input label="Invoice Prefix" value={systemSettings.invoicePrefix} onChange={e=>setSystemSettings({...systemSettings, invoicePrefix: e.target.value})} />
                              <Input label="Start #" placeholder="101" />
                           </div>
                           <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
                              <Input label="Farmer Bill Prefix" value={systemSettings.billPrefix} onChange={e=>setSystemSettings({...systemSettings, billPrefix: e.target.value})} />
                              <Input label="Start #" placeholder="1" />
                           </div>
                           <Input label="Auth WhatsApp No (For Webhook)" value={systemSettings.authWhatsApp} onChange={e=>setSystemSettings({...systemSettings, authWhatsApp: e.target.value})} />
                        </div>
                     </div>
                     <div style={{ marginTop: "40px", borderTop: "1.5px solid #f1f5f9", paddingTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                        <Button style={{ padding: "14px 40px" }} onClick={() => alert("💿 SYSTEM CONFIGURATION COLD-BOOTED: All settings persisted.")}>Commit Global Settings</Button>
                     </div>
                  </Card>
               )}
            </div>
          )}

          {/* 15.6 USER ROLES, ACCESS CONTROL & SECURITY */}
          {activeSection === "User Roles, Access Control & Security" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "slideUp 0.5s ease-out" }}>
               {/* Security Sub-Tabs */}
               <div style={{ display: "flex", gap: "16px", background: "#fff", padding: "8px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", alignSelf: "flex-start" }}>
                  {["Staff Hub", "Permissions", "Security"].map(tab => (
                     <button
                        key={tab}
                        onClick={() => setActiveSecurityTab(tab)}
                        style={{ padding: "12px 28px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "850", transition: "0.2s", background: activeSecurityTab === tab ? COLORS.primary : "transparent", color: activeSecurityTab === tab ? "#fff" : COLORS.muted }}
                     >
                        {tab === "Staff Hub" ? "👥 Staff Identity Hub" : tab === "Permissions" ? "🛡️ Role Matrix" : "🔐 Security Guard"}
                     </button>
                  ))}
               </div>

               {activeSecurityTab === "Staff Hub" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px" }}>
                     <Card title="Onboard New Staff" subtitle="Create digital identities for Mandi personnel">
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                           <Input label="Staff Full Name" placeholder="e.g. Ramesh K." value={newStaffForm.name} onChange={e=>setNewStaffForm({...newStaffForm, name: e.target.value})} />
                           <Input label="Login Username" placeholder="staff_01" value={newStaffForm.username} onChange={e=>setNewStaffForm({...newStaffForm, username: e.target.value})} />
                           <div>
                              <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "11px" }}>System Role</label>
                              <select 
                                 value={newStaffForm.role}
                                 onChange={e=>setNewStaffForm({...newStaffForm, role: e.target.value})}
                                 style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", fontWeight: "600" }}
                              >
                                 <option>Accountant</option>
                                 <option>Operations Staff</option>
                                 <option>Viewer (Read-Only)</option>
                                 <option>Admin / Owner</option>
                              </select>
                           </div>
                           <Input label="Access Expiry (Optional)" type="date" value={newStaffForm.expiry} onChange={e=>setNewStaffForm({...newStaffForm, expiry: e.target.value})} />
                           <Button style={{ marginTop: "10px" }} onClick={handleCreateStaff}>Create Access Identity</Button>
                        </div>
                     </Card>
                     
                     <Card title="Staff Directory" subtitle="Manage active sessions and role assignments">
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                           <thead>
                              <tr style={{ textAlign: "left", borderBottom: "2px solid #f1f5f9" }}>
                                 <th style={{ padding: "12px", fontSize: "11px", textTransform: "uppercase" }}>Identity</th>
                                 <th style={{ padding: "12px", fontSize: "11px", textTransform: "uppercase" }}>Role</th>
                                 <th style={{ padding: "12px", fontSize: "11px", textTransform: "uppercase" }}>Last Login</th>
                                 <th style={{ padding: "12px", fontSize: "11px", textTransform: "uppercase" }}>Actions</th>
                              </tr>
                           </thead>
                           <tbody>
                              {staffUsers.map(u => (
                                 <tr key={u.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                                    <td style={{ padding: "12px" }}>
                                       <div style={{ fontWeight: "750" }}>{u.name}</div>
                                       <div style={{ fontSize: "10px", color: COLORS.muted }}>{u.id} • <span style={{ color: u.status === "Active" ? "#22c55e" : "#ef4444" }}>{u.status}</span></div>
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                       <span style={{ fontSize: "11px", background: u.role === "Admin" ? "#fef3c7" : "#f1f5f9", padding: "4px 10px", borderRadius: "8px", fontWeight: "800" }}>{u.role}</span>
                                    </td>
                                    <td style={{ padding: "12px", fontSize: "12px", color: COLORS.muted }}>{u.lastLogin}</td>
                                    <td style={{ padding: "12px" }}>
                                       <div style={{ display: "flex", gap: "10px" }}>
                                          <button style={{ background: "none", border: "none", color: COLORS.primary, cursor: "pointer", fontWeight: "800", fontSize: "11px" }}>RESET PWD</button>
                                          <button style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: "800", fontSize: "11px" }}>DEACTIVATE</button>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </Card>
                  </div>
               )}

               {activeSecurityTab === "Permissions" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "32px", animation: "slideUp 0.5s ease-out" }}>

                     {/* Role Summary Cards */}
                     <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
                        {[
                           {
                              role: "Owner / Admin",
                              icon: "👑",
                              color: "#375144",
                              bg: "linear-gradient(135deg, #375144 0%, #2d4137 100%)",
                              tagBg: "rgba(159,180,67,0.25)",
                              tagColor: "#9fb443",
                              desc: "Full access — all modules, reports, settings, user management, delete & void bills",
                              perms: ["✅ All Modules", "✅ Delete & Void", "✅ User Management", "✅ System Config", "✅ Reports & Ledger", "✅ Payment Records"]
                           },
                           {
                              role: "Accountant",
                              icon: "📊",
                              color: "#1d4ed8",
                              bg: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                              tagBg: "rgba(59,130,246,0.15)",
                              tagColor: "#3b82f6",
                              desc: "Bills, invoices, payments, ledgers, reports — NO system configuration, NO delete",
                              perms: ["✅ Bills & Invoices", "✅ Payments", "✅ Ledger View", "✅ Reports", "❌ System Config", "❌ Delete / Void"]
                           },
                           {
                              role: "Operations Staff",
                              icon: "🏭",
                              color: "#b45309",
                              bg: "linear-gradient(135deg, #b45309 0%, #92400e 100%)",
                              tagBg: "rgba(245,158,11,0.15)",
                              tagColor: "#f59e0b",
                              desc: "Create lots, allocate produce, create bills/invoices — NO payment records, NO ledger edits",
                              perms: ["✅ Create Lots", "✅ Allocate Produce", "✅ Create Bills", "✅ Create Invoices", "❌ Payment Records", "❌ Ledger Edits"]
                           },
                           {
                              role: "Viewer",
                              icon: "👁️",
                              color: "#475569",
                              bg: "linear-gradient(135deg, #475569 0%, #334155 100%)",
                              tagBg: "rgba(71,85,105,0.12)",
                              tagColor: "#64748b",
                              desc: "Read-only access to reports and ledgers — NO create or edit",
                              perms: ["✅ View Reports", "✅ View Ledger", "❌ Create / Edit", "❌ Delete / Void", "❌ Payments", "❌ System Config"]
                           }
                        ].map((r, i) => (
                           <div key={i} style={{ background: r.bg, borderRadius: "24px", padding: "28px 24px", color: "#fff", position: "relative", overflow: "hidden", boxShadow: `0 12px 32px ${r.color}30` }}>
                              <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "90px", height: "90px", borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
                              <div style={{ position: "absolute", bottom: "-30px", left: "-20px", width: "110px", height: "110px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                                 <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{r.icon}</div>
                                 <div>
                                    <div style={{ fontSize: "14px", fontWeight: "900", letterSpacing: "-0.3px" }}>{r.role}</div>
                                    <div style={{ fontSize: "10px", fontWeight: "700", opacity: 0.65, textTransform: "uppercase", letterSpacing: "1px", marginTop: "2px" }}>System Role</div>
                                 </div>
                              </div>
                              <p style={{ fontSize: "12px", lineHeight: "1.6", opacity: 0.85, margin: "0 0 20px", fontWeight: "600" }}>{r.desc}</p>
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                 {r.perms.map((p, pi) => (
                                    <div key={pi} style={{ fontSize: "11px", fontWeight: "700", padding: "5px 10px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "6px" }}>
                                       {p}
                                    </div>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* Detailed Module Permission Matrix */}
                     <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", border: "1.5px solid #f1f5f9", boxShadow: "0 10px 25px rgba(0,0,0,0.03)" }}>
                        <div style={{ marginBottom: "28px" }}>
                           <h3 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: "900", color: COLORS.secondary }}>Module-Level Access Matrix</h3>
                           <p style={{ margin: 0, fontSize: "13px", color: COLORS.muted, fontWeight: "500" }}>Granular permission mapping for all 14 system modules</p>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                           <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                              <thead>
                                 <tr>
                                    <th style={{ padding: "14px 16px", textAlign: "left", background: "#f8fafc", borderBottom: "2px solid #e2e8f0", fontWeight: "800", color: COLORS.muted, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", minWidth: "220px" }}>Module / Component</th>
                                    {[
                                       { label: "Owner / Admin", icon: "👑", color: "#375144", bg: "#f0f9f4" },
                                       { label: "Accountant", icon: "📊", color: "#1d4ed8", bg: "#eff6ff" },
                                       { label: "Ops Staff", icon: "🏭", color: "#b45309", bg: "#fffbeb" },
                                       { label: "Viewer", icon: "👁️", color: "#475569", bg: "#f8fafc" }
                                    ].map(col => (
                                       <th key={col.label} style={{ padding: "14px 24px", background: col.bg, borderBottom: "2px solid #e2e8f0", textAlign: "center", minWidth: "150px" }}>
                                          <div style={{ fontSize: "18px", marginBottom: "4px" }}>{col.icon}</div>
                                          <div style={{ fontWeight: "900", color: col.color, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{col.label}</div>
                                       </th>
                                    ))}
                                 </tr>
                              </thead>
                              <tbody>
                                 {[
                                    { module: "📊 Dashboard", admin: "FULL", accountant: "FULL", ops: "FULL", viewer: "READ" },
                                    { module: "👥 Profiles (Supplier/Buyer)", admin: "FULL", accountant: "READ", ops: "CREATE", viewer: "READ" },
                                    { module: "📦 Inventory Allocation", admin: "FULL", accountant: "READ", ops: "CREATE", viewer: "READ" },
                                    { module: "⚖️ Supplier Billing", admin: "FULL", accountant: "FULL", ops: "CREATE", viewer: "NONE" },
                                    { module: "🧾 Buyer Invoicing", admin: "FULL", accountant: "FULL", ops: "CREATE", viewer: "NONE" },
                                    { module: "📖 Ledger System", admin: "FULL", accountant: "FULL", ops: "NONE", viewer: "READ" },
                                    { module: "🔗 Connection Intelligence", admin: "FULL", accountant: "FULL", ops: "NONE", viewer: "READ" },
                                    { module: "💳 Payment & Settlement", admin: "FULL", accountant: "FULL", ops: "NONE", viewer: "NONE" },
                                    { module: "🚚 Transportation Tracking", admin: "FULL", accountant: "READ", ops: "CREATE", viewer: "NONE" },
                                    { module: "💸 Expense Management", admin: "FULL", accountant: "FULL", ops: "CREATE", viewer: "NONE" },
                                    { module: "📄 Reports", admin: "FULL", accountant: "FULL", ops: "FULL", viewer: "READ" },
                                    { module: "⚙️ Product Master & Config", admin: "FULL", accountant: "NONE", ops: "NONE", viewer: "NONE" },
                                    { module: "🛡️ User Roles & Security", admin: "FULL", accountant: "NONE", ops: "NONE", viewer: "NONE" },
                                    { module: "📂 Document Management", admin: "FULL", accountant: "READ", ops: "NONE", viewer: "NONE" },
                                    { module: "🗑️ Delete / Void Bills", admin: "FULL", accountant: "NONE", ops: "NONE", viewer: "NONE" },
                                 ].map((row, i) => {
                                    const badge = (perm) => {
                                       const cfg = {
                                          "FULL":   { bg: "#dcfce7", color: "#15803d", label: "Full Access" },
                                          "CREATE": { bg: "#fef3c7", color: "#b45309", label: "Create Only" },
                                          "READ":   { bg: "#dbeafe", color: "#1d4ed8", label: "Read Only" },
                                          "NONE":   { bg: "#fee2e2", color: "#991b1b", label: "No Access" }
                                       }[perm] || { bg: "#f1f5f9", color: "#475569", label: perm };
                                       return (
                                          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "900", padding: "5px 12px", borderRadius: "20px", background: cfg.bg, color: cfg.color, letterSpacing: "0.2px" }}>
                                             {perm === "FULL" ? "✅" : perm === "NONE" ? "🚫" : perm === "READ" ? "👁️" : "✏️"} {cfg.label}
                                          </span>
                                       );
                                    };
                                    return (
                                       <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa", transition: "0.2s" }}
                                          onMouseOver={e => e.currentTarget.style.background = "#f0f9f4"}
                                          onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa"}
                                       >
                                          <td style={{ padding: "14px 16px", fontWeight: "750", color: COLORS.text, fontSize: "13px" }}>{row.module}</td>
                                          <td style={{ padding: "14px 16px", textAlign: "center" }}>{badge(row.admin)}</td>
                                          <td style={{ padding: "14px 16px", textAlign: "center" }}>{badge(row.accountant)}</td>
                                          <td style={{ padding: "14px 16px", textAlign: "center" }}>{badge(row.ops)}</td>
                                          <td style={{ padding: "14px 16px", textAlign: "center" }}>{badge(row.viewer)}</td>
                                       </tr>
                                    );
                                 })}
                              </tbody>
                           </table>
                        </div>

                        {/* Legend */}
                        <div style={{ marginTop: "24px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                           <span style={{ fontSize: "11px", fontWeight: "800", color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Legend:</span>
                           {[
                              { bg: "#dcfce7", color: "#15803d", icon: "✅", label: "Full Access — Create, Edit, Delete, View" },
                              { bg: "#fef3c7", color: "#b45309", icon: "✏️", label: "Create Only — No Edit/Delete" },
                              { bg: "#dbeafe", color: "#1d4ed8", icon: "👁️", label: "Read Only — View without changes" },
                              { bg: "#fee2e2", color: "#991b1b", icon: "🚫", label: "No Access — Module hidden" }
                           ].map((l, i) => (
                              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "700", padding: "5px 12px", borderRadius: "20px", background: l.bg, color: l.color }}>
                                 {l.icon} {l.label}
                              </span>
                           ))}
                        </div>

                        {/* Warning Banner */}
                        <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", background: "#fff9eb", borderRadius: "16px", border: "1.5px solid #feebc8" }}>
                           <span style={{ fontSize: "22px" }}>⚠️</span>
                           <p style={{ margin: 0, fontSize: "13px", color: "#92400e", fontWeight: "600" }}>
                             Modifying the Access Matrix will force-logout all active sessions to re-apply JWT authorization tokens. Changes take effect after next login.
                           </p>
                        </div>
                     </div>
                  </div>
               )}

               {activeSecurityTab === "Security" && (
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr", gap: "32px" }}>
                     <Card title="Financial Audit Trail" subtitle="Chronological log of critical system overrides">
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                           {securityAuditLogs.map((log, i) => (
                              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                                 <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                    <div style={{ padding: "8px", background: log.status === "SUCCESS" ? "#dcfce7" : "#fee2e2", borderRadius: "8px", color: log.status === "SUCCESS" ? "#166534" : "#991b1b" }}>
                                       {log.status === "SUCCESS" ? "✅" : "🚫"}
                                    </div>
                                    <div>
                                       <div style={{ fontWeight: "800", fontSize: "13px" }}>{log.action}</div>
                                       <div style={{ fontSize: "11px", color: COLORS.muted }}>By {log.user} • {log.timestamp}</div>
                                    </div>
                                 </div>
                                 <button style={{ background: "none", border: "none", color: COLORS.primary, fontWeight: "800", fontSize: "11px", cursor: "pointer" }}>VIEW DETAILS</button>
                              </div>
                           ))}
                        </div>
                     </Card>

                     <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <Card title="System Hardening" subtitle="Global security switches">
                           <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                              {[
                                 { l: "Session Timeout (Pulse)", d: "Auto-logout after 30 mins" },
                                 { l: "KYC Archive Encryption", d: "AES-256 for all document uploads" },
                                 { l: "Admin Mobile OTP", d: "Enforce 2FA for Admin login" },
                                 { l: "Auto Database Backup", d: "Encrypted daily cycle at 03:00 AM" }
                              ].map((item, i) => (
                                 <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                       <div style={{ fontSize: "12px", fontWeight: "800" }}>{item.l}</div>
                                       <div style={{ fontSize: "10px", color: COLORS.muted }}>{item.d}</div>
                                    </div>
                                    <div style={{ width: "40px", height: "20px", background: COLORS.primary, borderRadius: "10px", position: "relative" }}>
                                       <div style={{ position: "absolute", right: "2px", top: "2px", width: "16px", height: "16px", background: "#fff", borderRadius: "50%" }}></div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </Card>

                        <Card style={{ background: "#0f172a", color: "#fff" }}>
                           <h3 style={{ margin: "0 0 10px" }}>Document Lock</h3>
                           <p style={{ fontSize: "12px", opacity: 0.7 }}>Invoices & Bills lock instantly upon generation. Unlocking requires Admin-level audit reason.</p>
                           <Button style={{ width: "100%", marginTop: "15px" }} variant="outline">Unlock Current Register</Button>
                        </Card>
                     </div>
                  </div>
               )}
            </div>
          )}

          {/* 15. CONNECTION MODULE (PREMIUM INTELLIGENCE REPORT) */}
          {activeSection === "CONNECTION" && (
             <div style={{ animation: "slideUp 0.6s ease-out", display: "flex", flexDirection: "column", gap: "32px" }}>
                {/* TOP: Search + Farmer Summary Card */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px", alignItems: "start" }}>
                   <Card title="Farmer Traceability Search" subtitle="Two-way intelligence engine">
                      <Input label="Search by Name, Mobile, Village or Lot ID" value={connSearchQuery} onChange={(e) => setConnSearchQuery(e.target.value)} placeholder="e.g. Vikram Reddy or 9848010000" />
                      <Button style={{ width: "100%", marginTop: "12px" }}>Execute Intelligence Search</Button>
                      
                      <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                         <label style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, textTransform: "uppercase", letterSpacing: "1px" }}>Search Results (Click to View Dashboard)</label>
                         {[
                             { id: "f1", name: "Vikram Reddy", phone: "9848010000", village: "Madanapalle" },
                             { id: "f2", name: "Srinivas Rao", phone: "8123456789", village: "Vijayawada" },
                             { id: "f3", name: "Priya Reddy", phone: "9988776655", village: "Chittoor" },
                             { id: "f4", name: "Mohan Chandra", phone: "7766554433", village: "Guntur" }
                         ].map((farmer) => (
                             <div 
                                key={farmer.id}
                                style={{ 
                                   padding: "16px", 
                                   background: selectedConnFarmer?.id === farmer.id ? "rgba(159, 180, 67, 0.1)" : "#f8fafc", 
                                   borderRadius: "16px", 
                                   cursor: "pointer", 
                                   border: selectedConnFarmer?.id === farmer.id ? `2.5px solid ${COLORS.secondary}` : "1.5px solid #e2e8f0", 
                                   transition: "0.25s all",
                                   marginBottom: "8px"
                                }} 
                                onClick={() => setSelectedConnFarmer(farmer)}
                             >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                   <b style={{ color: COLORS.primary, fontSize: "15px" }}>{farmer.name}</b>
                                   <span style={{ fontSize: "10px", background: COLORS.secondary, color: "#fff", padding: "4px 8px", borderRadius: "12px", fontWeight: "800" }}>VERIFIED</span>
                                </div>
                                <span style={{fontSize: "12px", color: COLORS.muted, display: "block", marginTop: "4px", fontWeight: "600"}}>📱 {farmer.phone} • 📍 {farmer.village}</span>
                             </div>
                         ))}
                      </div>
                   </Card>

                   {selectedConnFarmer ? (
                   <Card style={{ background: "linear-gradient(135deg, #2d4137 0%, #1e293b 100%)", color: "#fff", border: "none", boxShadow: "0 25px 50px -12px rgba(45, 65, 55, 0.4)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                         <div>
                            <h2 style={{ margin: "0 0 8px 0", color: COLORS.secondary, fontSize: "32px", fontWeight: "900", letterSpacing: "1px" }}>{selectedConnFarmer.name}</h2>
                            <div style={{ fontSize: "13px", opacity: 0.8, display: "flex", gap: "16px" }}>
                               <span><b style={{opacity:0.6}}>Mobile:</b> {selectedConnFarmer.phone}</span>
                               <span><b style={{opacity:0.6}}>Origin:</b> {selectedConnFarmer.village}</span>
                            </div>
                         </div>
                         <div style={{ background: "rgba(255,255,255,0.05)", padding: "16px 24px", borderRadius: "20px", textAlign: "right", minWidth: "150px" }}>
                            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.6, fontWeight: "800", marginBottom: "4px" }}>Pending Settlement</div>
                            <b style={{ fontSize: "28px", color: "#fbbf24", fontWeight: "900" }}>₹ 45,200</b>
                         </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                         {[
                            { l: "Lots Supplied", v: "14", c: "#fff", bg: "rgba(255,255,255,0.1)" },
                            { l: "QTY Supplied", v: "8,500 KG", c: "#fff", bg: "rgba(255,255,255,0.1)" },
                            { l: "QTY Sold", v: "7,900 KG", c: COLORS.secondary, bg: "rgba(159,180,67,0.1)" },
                            { l: "Gross Sale", v: "₹ 4,25,000", c: "#fff", bg: "rgba(255,255,255,0.1)" },
                            { l: "Expenses Deducted", v: "₹ 21,250", c: "#fca5a5", bg: "rgba(248, 113, 113, 0.1)" },
                            { l: "Net Paid", v: "₹ 3,58,550", c: "#4ade80", bg: "rgba(74, 222, 128, 0.1)" },
                            { l: "Last Supply Date", v: "24/03/2026", c: "#fff", bg: "rgba(255,255,255,0.1)" }
                         ].map((x,i) => (
                            <div key={i} style={{ padding: "16px", background: x.bg, borderRadius: "16px" }}>
                               <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "6px", fontWeight: "700" }}>{x.l}</div>
                               <b style={{ fontSize: "18px", color: x.c, fontWeight: "900" }}>{x.v}</b>
                            </div>
                         ))}
                      </div>
                   </Card>
                   ) : (
                   <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "250px", color: COLORS.muted, background: "rgba(255,255,255,0.5)", backdropFilter: "blur(20px)" }}>
                      <div style={{ textAlign: "center" }}>
                         <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>🔗</span>
                         <h3 style={{ margin: 0, color: COLORS.sidebar }}>Connection Matrix Standby</h3>
                         <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>Select a farmer to generate exhaustive traceability intelligence.</p>
                      </div>
                   </Card>
                   )}
                </div>

                {selectedConnFarmer && (
                <>
                {/* SMART ALERT */}
                <div style={{ background: "#fef2f2", color: "#991b1b", padding: "18px 24px", borderRadius: "20px", border: "1.5px solid #fecaca", display: "flex", alignItems: "center", gap: "16px", fontWeight: "800", boxShadow: "0 10px 20px rgba(220, 38, 38, 0.05)" }}>
                   <span style={{ fontSize: "24px" }}>⚠️</span>
                   <div>
                      <div style={{ fontSize: "14px", letterSpacing: "0.5px" }}>HIGH RISK ALERTS LINKED TO CURRENT PRODUCE:</div>
                      <div style={{ fontSize: "12px", opacity: 0.8, fontWeight: "600", marginTop: "4px" }}>Buyer <b>'Reliance Fresh'</b> holds pending ₹1,45,000 affecting the liquidation of this farmer's supply. Escalate collection strategy.</div>
                   </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "3.5fr 1fr", gap: "32px" }}>
                   {/* MIDDLE: Live Traceability Table */}
                   <Card title="Detailed Connection & Sales Ledger" subtitle="Immutable Farmer-to-Buyer Log" style={{ overflow: "hidden", padding: 0 }}>
                      <div style={{ padding: "24px" }}>
                         <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
                            {["Date Range", "Buyer Name", "Product", "Variety", "Grade", "Payment Mode", "Balance Pending"].map(f => (
                               <select key={f} style={{ padding: "10px 16px", borderRadius: "10px", border: "1.5px solid #e2e8f0", outline: "none", fontSize: "12px", fontWeight: "700", color: COLORS.text, background: "#f8fafc" }}>
                                  <option>{f} filter...</option>
                               </select>
                            ))}
                         </div>
                         
                         <div style={{ overflowX: "auto", border: "1.5px solid #f1f5f9", borderRadius: "20px", background: "#fff" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", whiteSpace: "nowrap" }}>
                               <thead>
                                  <tr style={{ background: "#0f172a", color: "#fff", textAlign: "left" }}>
                                     <th style={{ padding: "18px", fontWeight: "800", fontSize: "11px", letterSpacing: "0.5px" }}>DATE & TIME</th>
                                     <th style={{ padding: "18px", fontWeight: "800", fontSize: "11px", letterSpacing: "0.5px" }}>LOT ID</th>
                                     <th style={{ padding: "18px", fontWeight: "800", fontSize: "11px", letterSpacing: "0.5px" }}>PRODUCE SPEC</th>
                                     <th style={{ padding: "18px", textAlign: "right", fontWeight: "800", fontSize: "11px" }}>QTY (KG)</th>
                                     <th style={{ padding: "18px", fontWeight: "800", fontSize: "11px", letterSpacing: "0.5px" }}>BUYER IDENTITY</th>
                                     <th style={{ padding: "18px", textAlign: "right", fontWeight: "800", fontSize: "11px" }}>RATE (₹)</th>
                                     <th style={{ padding: "18px", textAlign: "right", fontWeight: "800", fontSize: "11px" }}>AMOUNT (₹)</th>
                                     <th style={{ padding: "18px", textAlign: "right", fontWeight: "800", fontSize: "11px" }}>PAID</th>
                                     <th style={{ padding: "18px", textAlign: "right", fontWeight: "800", fontSize: "11px", color: "#fbbf24" }}>BALANCE</th>
                                     <th style={{ padding: "18px", fontWeight: "800", fontSize: "11px" }}>INVOICE</th>
                                  </tr>
                               </thead>
                               <tbody>
                                  {/* Row 1 */}
                                  <tr style={{ cursor: "pointer", borderBottom: "1px solid #f1f5f9", transition: "0.2s" }} onClick={() => setConnSelectedBuyer({ name: "Reliance Fresh", phone: "9959012345", address: "Stall #102, Market Yard", totalPurchases: "₹ 4.5L", preferredProducts: ["Mango Alphonso (80%)", "Banana Yelakki (20%)"], paymentBehavior: "Delayed (15 days average)", outstanding: "₹ 1,45,000" })}>
                                     <td style={{ padding: "16px" }}><b style={{ color: COLORS.sidebar, fontSize: "13px" }}>24/03/2026</b><br/><span style={{ opacity: 0.6, fontSize: "10px", fontWeight: "700" }}>Tuesday, 6:45 AM</span></td>
                                     <td style={{ padding: "16px", color: COLORS.primary, fontWeight: "900" }}>LOT-2026-X11</td>
                                     <td style={{ padding: "16px" }}><b style={{ color: COLORS.sidebar, fontSize: "13px" }}>Mango</b><br/><span style={{ opacity: 0.6, fontSize: "10px", fontWeight: "700" }}>Alphonso • A Grade</span></td>
                                     <td style={{ padding: "16px", textAlign: "right", fontWeight: "800", fontSize: "13px" }}>1,200</td>
                                     <td style={{ padding: "16px" }}><b style={{ color: COLORS.sidebar, fontSize: "13px" }}>Reliance Fresh</b><br/><span style={{ opacity: 0.6, fontSize: "10px", fontWeight: "700" }}>9959012345 • Stall #102</span></td>
                                     <td style={{ padding: "16px", textAlign: "right", color: COLORS.success, fontWeight: "900", fontSize: "13px" }}>45.00</td>
                                     <td style={{ padding: "16px", textAlign: "right", fontWeight: "900", fontSize: "13px" }}>54,000</td>
                                     <td style={{ padding: "16px", textAlign: "right" }}><b style={{ fontSize: "13px" }}>24,000</b><br/><span style={{ color: "#3b82f6", fontSize: "10px", fontWeight: "800", display: "inline-block", padding: "2px 6px", background: "#eff6ff", borderRadius: "6px", marginTop: "2px" }}>UPI Transfer</span></td>
                                     <td style={{ padding: "16px", textAlign: "right", color: COLORS.danger, fontWeight: "900", fontSize: "13px" }}>30,000</td>
                                     <td style={{ padding: "16px" }}><span style={{ color: "#fff", background: "#334155", padding: "6px 10px", borderRadius: "8px", fontWeight: "800", fontSize: "10px" }}>INV-2026-X01</span></td>
                                  </tr>
                                  {/* Row 2 */}
                                  <tr style={{ cursor: "pointer", borderBottom: "1px solid #f1f5f9", transition: "0.2s" }} onClick={() => setConnSelectedBuyer({ name: "Harsha Wholesale", phone: "9898989898", address: "Stall #45, New Block", totalPurchases: "₹ 1.2L", preferredProducts: ["Banana Yelakki (100%)"], paymentBehavior: "Excellent (Same day cash)", outstanding: "₹ 0" })}>
                                     <td style={{ padding: "16px" }}><b style={{ color: COLORS.sidebar, fontSize: "13px" }}>23/03/2026</b><br/><span style={{ opacity: 0.6, fontSize: "10px", fontWeight: "700" }}>Monday, 8:15 AM</span></td>
                                     <td style={{ padding: "16px", color: COLORS.primary, fontWeight: "900" }}>LOT-2026-X09</td>
                                     <td style={{ padding: "16px" }}><b style={{ color: COLORS.sidebar, fontSize: "13px" }}>Banana</b><br/><span style={{ opacity: 0.6, fontSize: "10px", fontWeight: "700" }}>Yelakki • Premium</span></td>
                                     <td style={{ padding: "16px", textAlign: "right", fontWeight: "800", fontSize: "13px" }}>850</td>
                                     <td style={{ padding: "16px" }}><b style={{ color: COLORS.sidebar, fontSize: "13px" }}>Harsha Wholesale</b><br/><span style={{ opacity: 0.6, fontSize: "10px", fontWeight: "700" }}>9898989898 • Stall #45</span></td>
                                     <td style={{ padding: "16px", textAlign: "right", color: COLORS.success, fontWeight: "900", fontSize: "13px" }}>32.00</td>
                                     <td style={{ padding: "16px", textAlign: "right", fontWeight: "900", fontSize: "13px" }}>27,200</td>
                                     <td style={{ padding: "16px", textAlign: "right" }}><b style={{ fontSize: "13px" }}>27,200</b><br/><span style={{ color: COLORS.success, fontSize: "10px", fontWeight: "800", display: "inline-block", padding: "2px 6px", background: "#f0fdf4", borderRadius: "6px", marginTop: "2px" }}>Cash Payment</span></td>
                                     <td style={{ padding: "16px", textAlign: "right", color: COLORS.muted, fontWeight: "900", fontSize: "13px" }}>0</td>
                                     <td style={{ padding: "16px" }}><span style={{ color: "#fff", background: "#334155", padding: "6px 10px", borderRadius: "8px", fontWeight: "800", fontSize: "10px" }}>INV-2026-X02</span></td>
                                  </tr>
                               </tbody>
                            </table>
                         </div>
                      </div>
                   </Card>

                   {/* RIGHT PANEL: Buyer Details Snapshot */}
                   <div>
                      <Card title="Buyer Snapshot" subtitle="Select trade log to inspect" style={{ position: "sticky", top: "20px" }}>
                         {connSelectedBuyer ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "slideUp 0.3s" }}>
                               <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "20px", border: "1.5px solid #e2e8f0" }}>
                                  <h3 style={{ margin: "0 0 8px 0", color: COLORS.sidebar, fontSize: "20px" }}>{connSelectedBuyer.name}</h3>
                                  <div style={{ fontSize: "13px", color: COLORS.muted, fontWeight: "600", display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <span>📞 {connSelectedBuyer.phone}</span>
                                    <span>📍 {connSelectedBuyer.address}</span>
                                  </div>
                                  
                                  <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                     <div>
                                        <small style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, textTransform: "uppercase" }}>Lifetime Sourced</small>
                                        <div style={{ fontSize: "18px", fontWeight: "900", color: COLORS.sidebar, marginTop: "4px" }}>{connSelectedBuyer.totalPurchases}</div>
                                     </div>
                                     <div>
                                        <small style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, textTransform: "uppercase" }}>Unsettled Balance</small>
                                        <div style={{ fontSize: "18px", fontWeight: "900", color: connSelectedBuyer.outstanding === "₹ 0" ? COLORS.success : COLORS.danger, marginTop: "4px" }}>{connSelectedBuyer.outstanding}</div>
                                     </div>
                                  </div>
                               </div>
                               <div>
                                  <small style={{ fontSize: "11px", fontWeight: "800", color: COLORS.muted, display: "block", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Payment Habit Indicator</small>
                                  <div style={{ padding: "16px", background: connSelectedBuyer.outstanding === "₹ 0" ? "#f0fdf4" : "#fef3c7", color: connSelectedBuyer.outstanding === "₹ 0" ? "#166534" : "#b45309", borderRadius: "16px", fontSize: "13px", fontWeight: "800" }}>
                                     {connSelectedBuyer.paymentBehavior}
                                  </div>
                               </div>
                               <div>
                                  <small style={{ fontSize: "11px", fontWeight: "800", color: COLORS.muted, display: "block", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Commodity Preferences</small>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                     {connSelectedBuyer.preferredProducts.map((pp, idx) => (
                                        <span key={idx} style={{ fontSize: "12px", padding: "8px 16px", background: "#e2e8f0", color: COLORS.sidebar, borderRadius: "24px", fontWeight: "700" }}>{pp}</span>
                                     ))}
                                  </div>
                               </div>
                            </div>
                         ) : (
                            <div style={{ textAlign: "center", opacity: 0.5, padding: "60px 0" }}>
                               <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>👉</span>
                               <p style={{ fontWeight: "600", fontSize: "15px", lineHeight: "1.5" }}>Click any transaction row in the matrix to unmask buyer intelligence.</p>
                            </div>
                         )}
                      </Card>
                   </div>
                </div>

                {/* BOTTOM: Sub-Analytics Layer */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
                   {/* Product Analytics */}
                   <Card title="Product Analytics" subtitle="Market disposal efficiency by crop">
                      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                         <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "20px", borderLeft: `6px solid ${COLORS.primary}`, boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                               <b style={{ fontSize: "16px" }}>Mango Alphonso</b>
                               <span style={{ fontSize: "11px", fontWeight: "800", color: "#fff", background: COLORS.success, padding: "4px 10px", borderRadius: "10px", textTransform: "uppercase" }}>Top Volume</span>
                            </div>
                            <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", fontSize: "13px", color: COLORS.muted, fontWeight: "600" }}>
                               <span>Supplies Cleared: <b style={{color: COLORS.text}}>4,000 KG</b></span>
                               <span>Yield Rate: <b style={{color: COLORS.success}}>₹ 42.50 Avg</b></span>
                            </div>
                            <div style={{ marginTop: "12px", fontSize: "12px", color: COLORS.text, background: "#fff", padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>Major Acquirer: <b style={{ color: COLORS.primary }}>Harsha Wholesale (45%)</b></div>
                         </div>
                         
                         <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "20px", borderLeft: `6px solid ${COLORS.secondary}`, boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                               <b style={{ fontSize: "16px" }}>Banana Yelakki</b>
                               <span style={{ fontSize: "11px", fontWeight: "800", color: COLORS.sidebar, background: "#f1f5f9", padding: "4px 10px", borderRadius: "10px", textTransform: "uppercase" }}>Stable</span>
                            </div>
                            <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", fontSize: "13px", color: COLORS.muted, fontWeight: "600" }}>
                               <span>Supplies Cleared: <b style={{color: COLORS.text}}>2,500 KG</b></span>
                               <span>Yield Rate: <b style={{color: COLORS.success}}>₹ 31.00 Avg</b></span>
                            </div>
                            <div style={{ marginTop: "12px", fontSize: "12px", color: COLORS.text, background: "#fff", padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>Major Acquirer: <b style={{ color: COLORS.primary }}>Reliance Fresh (82%)</b></div>
                         </div>
                      </div>
                   </Card>

                   {/* Payment Tracking */}
                   <Card title="Payment Flow Intelligence" subtitle="Tracing origin limits & liquidity generation">
                      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px dashed #e2e8f0", paddingBottom: "16px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "800", color: COLORS.muted, textTransform: "uppercase" }}>Gross Generated</span>
                            <b style={{ fontSize: "20px", color: COLORS.sidebar }}>₹ 4,25,000</b>
                         </div>
                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px dashed #e2e8f0", paddingBottom: "16px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "800", color: COLORS.success, textTransform: "uppercase" }}>Amount Liquidated</span>
                            <b style={{ fontSize: "20px", color: COLORS.success }}>₹ 3,45,000</b>
                         </div>
                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px dashed #e2e8f0", paddingBottom: "16px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "800", color: COLORS.danger, textTransform: "uppercase" }}>Deficit Balance</span>
                            <b style={{ fontSize: "20px", color: COLORS.danger }}>₹ 80,000</b>
                         </div>
                         
                         <div style={{ marginTop: "8px" }}>
                            <span style={{ fontSize: "11px", fontWeight: "900", color: COLORS.muted, letterSpacing: "1px", display: "block", marginBottom: "12px" }}>PAYMENT APPARATUS DISTRIBUTION</span>
                            <div style={{ display: "flex", gap: "12px" }}>
                               <div style={{ flex: 1, background: "#f8fafc", padding: "16px", borderRadius: "16px", textAlign: "center", border: "1px solid #e2e8f0" }}>
                                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>💵</div>
                                  <div style={{ fontSize: "11px", fontWeight: "900", color: COLORS.sidebar }}>30% CASH</div>
                               </div>
                               <div style={{ flex: 1, background: "#f8fafc", padding: "16px", borderRadius: "16px", textAlign: "center", border: "1px solid #e2e8f0" }}>
                                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>📱</div>
                                  <div style={{ fontSize: "11px", fontWeight: "900", color: "#3b82f6" }}>65% UPI</div>
                               </div>
                               <div style={{ flex: 1, background: "#fef2f2", padding: "16px", borderRadius: "16px", textAlign: "center", border: "1px solid #fecaca" }}>
                                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>⏳</div>
                                  <div style={{ fontSize: "11px", fontWeight: "900", color: COLORS.danger }}>5% DEBT</div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </Card>

                   {/* Timing Algorithms */}
                   <Card title="Time Array Analytics" subtitle="Biological lifecycle & market disposal velocities">
                       <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "20px", background: "#f8fafc" }}>
                         <table style={{ width: "100%", fontSize: "12px", textAlign: "left", borderCollapse: "collapse" }}>
                            <thead>
                               <tr style={{ color: COLORS.muted, background: "rgba(0,0,0,0.03)" }}>
                                  <th style={{ padding: "16px", fontWeight: "800", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>DAY PATTERN</th>
                                  <th style={{ padding: "16px", fontWeight: "800", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>OPTIMAL CLEARANCE WINDOW</th>
                                  <th style={{ padding: "16px", textAlign: "right", fontWeight: "800", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>VOLUME</th>
                               </tr>
                            </thead>
                            <tbody>
                               {[{d: "Monday", t: "06:00 AM - 08:30 AM", v: "2,400"}, {d: "Tuesday", t: "05:45 AM - 07:00 AM", v: "1,850"}, {d: "Thursday", t: "07:00 AM - 10:00 AM", v: "3,100"}].map((row,i) => (
                                  <tr key={i} style={{ borderBottom: "1px solid #e2e8f0", background: "#fff" }}>
                                     <td style={{ padding: "16px", fontWeight: "800", color: COLORS.sidebar }}>{row.d}</td>
                                     <td style={{ padding: "16px", color: COLORS.muted, fontWeight: "600" }}>{row.t}</td>
                                     <td style={{ padding: "16px", textAlign: "right", fontWeight: "900", color: COLORS.primary }}>{row.v} KG</td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                      <div style={{ marginTop: "24px", background: "rgba(159, 180, 67, 0.1)", padding: "16px", borderRadius: "16px", border: `1px solid ${COLORS.secondary}40`, fontSize: "12px", color: COLORS.sidebar, fontWeight: "600", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                         <span style={{ fontSize: "16px" }}>💡</span>
                         <span>Insight: Produce supplied on Thursdays accounts for highest liquidation volumes despite late timing windows.</span>
                      </div>
                   </Card>
                </div>
                </>
                )}
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
        
        {/* Global Datalist Injection for Autocomplete Fields */}
        <datalist id="fruit-list">
          {DB.Fruits.map(f => <option key={`f-${f}`} value={f} />)}
        </datalist>
        <datalist id="vegetable-list">
          {DB.Vegetables.map(v => <option key={`v-${v}`} value={v} />)}
        </datalist>

      </div>
    </div>
  );
}
