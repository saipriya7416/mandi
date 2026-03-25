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
  const [dispatchType, setDispatchType] = useState("Fruits");
  const [poProduct, setPoProduct] = useState("");
  const [poType, setPoType] = useState("Fruits");
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
  const [intakeForm, setIntakeForm] = useState({ 
    supplierId: "", 
    entryDate: new Date().toISOString().slice(0, 10),
    vehicleNumber: "",
    driverName: "",
    origin: "",
    notes: "",
    lineItems: [{ product: "", variety: "", grade: "", grossWeight: "", deductions: "", boxes: "", estimatedRate: "" }]
  });
  const [inventoryStats, setInventoryStats] = useState({
    totalLotsToday: 0,
    incomingKgToday: 0,
    totalSoldKg: 0,
    remainingStockKg: 0,
    pendingDeliveryKg: 0
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

  // --- DATA STORAGE STATES ---
  const [suppliers, setSuppliers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [lots, setLots] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [invMode, setInvMode] = useState("Allocation"); // "Intake" or "Allocation"
  
  // --- FARMER BILLING STATES ---
  const [settlementData, setSettlementData] = useState([]);
  const [isBillLocked, setIsBillLocked] = useState(false);
  const [farmerHistory, setFarmerHistory] = useState(null);
  const [buyerInvoiceForm, setBuyerInvoiceForm] = useState({
    invoiceNo: "INV-2026-0001",
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    buyerId: "",
    buyerPhone: "",
    buyerAddress: "",
    vehicleNumber: "",
    driverName: "",
    routeNotes: "",
    items: [{ productId: "", productLabel: "", variety: "", grade: "", grossWeight: 0, deductions: 0, netWeight: 0, rate: 0, amount: 0, lotId: "" }],
    charges: { commission: 0, handling: 0, transport: 0, other: [], otherLabel: "Other Misc Charges" },
    subTotal: 0,
    totalCharges: 0,
    grandTotal: 0,
    amountReceived: 0,
    balanceDue: 0,
    status: "Unpaid"
  });
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
        { label: "Association Fee", value: 0 },
        { label: "Market Fee", value: 0 }
     ],
     advance: 0,
     netPayable: 0
  });
  


  // --- DATA SYNC WITH BACKEND ---
  // --- DATA SYNC WITH BACKEND ---
  const fetchData = async () => {
    // Robust fallbacks for Demo/Offline consistency
    const dummySuppliers = [
      "Vikram Reddy", "Sandhya Devi", "Anwar Pasha", "Gopal Krishnan", "Srinivasa Rao",
      "Ramachandra Murthy", "Lakshmi Kanth", "Venkata Raman", "Satyavati Garu", "Rajesh Kumar",
      "Suresh Babu", "Manisha Singh", "Vijay Bhaskar", "Anil Reddy", "Kavita Rao",
      "Shiva Prasad", "Naveen Kumar", "Santosh Hegde", "Padmaja Devi", "Ravi Teja",
      "Mohan Babu", "Girish Gupta", "Aruna Kumari", "Harish Shetty", "Bhaskar Rao",
      "Chandra Mohan", "Durga Prasad", "Eshwar Rao", "Fatima Begum", "Ganapathi Bhat",
      "Himamshu Roy", "Indrani Sharma", "Jagadish Murthy", "Karthik Raja", "Lalitha Goud",
      "Murali Krishna", "Nirmala Devi", "Om Prakash", "Parvathi Amma", "Qasim Khan"
    ].map((n, i) => ({ _id: `s-${i}`, name: n, village: 'Madanapalle', mobile: `98480${10000+i}` }));

    const dummyBuyers = [
       "Harsha Wholesale", "Reliance Fresh", "BigBasket Depot", "Heritage Foods", "Anand Foodworld",
       "Heritage Depot", "BigBasket Hub", "Metro Cash & Carry", "More Retail", "Spencer's Market",
       "Nilgiris Supermarket", "Star Bazaar", "DMart Depot", "Safal Mandi", "Nature's Basket",
       "Amazon Fresh Hub", "Daily Delight", "FreshDirect", "GreenWay Traders", "Quality First",
       "Tasty Trends", "Urban Organic", "Value Mart", "Wholesale Wonders", "Zenith Exports"
    ].map((n, i) => ({ _id: `b-${i}`, name: n, shopName: n, phone: `99590${10000+i}`, mobile: `99590${10000+i}`, address: `Stall #${100+i}, Madanapalle Market` }));

    const dummyLots = [
      { _id: 'l-1', lotId: 'LOT-2026-001', supplier: { name: 'Vikram Reddy' }, entryDate: '2026-03-20', origin: 'Madanapalle', status: 'Partially Sold', totalQuantity: 1500, remainingQuantity: 400, lineItems: [{ product: "Mango", variety: "Alphonso", grade: "A", grossWeight: 500, deductions: 20, netWeight: 480, amount: 20000, rate: 45 }] },
      { _id: 'l-2', lotId: 'LOT-2026-002', supplier: { name: 'Sandhya Devi' }, entryDate: '2026-03-21', origin: 'Guntur', status: 'Pending Auction', totalQuantity: 2000, remainingQuantity: 2000, lineItems: [] },
      { _id: 'l-3', lotId: 'LOT-2026-003', supplier: { name: 'Anwar Pasha' }, entryDate: '2026-03-22', origin: 'Nellore', status: 'Fully Sold', totalQuantity: 1200, remainingQuantity: 0, lineItems: [] }
    ];

    try {
      const sRes = await MandiService.getSuppliers();
      setSuppliers(sRes.status === "SUCCESS" && sRes.data.length > 0 ? sRes.data : dummySuppliers);

      const bRes = await MandiService.getBuyers();
      setBuyers(bRes.status === "SUCCESS" && bRes.data.length > 0 ? bRes.data : dummyBuyers);

      const lRes = await MandiService.getLots();
      setLots(lRes.status === "SUCCESS" && lRes.data.length > 0 ? lRes.data : dummyLots);

      const dRes = await MandiService.getDocuments();
      if (dRes.status === "SUCCESS") {
         setDocuments(dRes.data.length > 0 ? dRes.data : [
           { _id: 'd-1', originalName: 'Land-Patta-Vikram.pdf', docType: 'KYC', fileSize: 1024 * 500, url: '#' },
           { _id: 'd-2', originalName: 'Aadhaar-Sandhya.jpg', docType: 'KYC', fileSize: 1024 * 200, url: '#' }
         ]);
      }

      const statsRes = await MandiService.getInventoryDashboard();
      if (statsRes.status === "SUCCESS") setInventoryStats(statsRes.data);
      else setInventoryStats({ totalLotsToday: 14, incomingKgToday: 8500, totalSoldKg: 12400, remainingStockKg: 3200, pendingDeliveryKg: 850 });

    } catch (err) {
      console.warn("Backend Unreachable - Using Local Data Engine:", err.message);
      setSuppliers(dummySuppliers);
      setBuyers(dummyBuyers);
      setLots(dummyLots);
      setInventoryStats({ totalLotsToday: 14, incomingKgToday: 8500, totalSoldKg: 12400, remainingStockKg: 3200, pendingDeliveryKg: 850 });
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
    if (loggedIn && activeSection === "Farmer Billing (Settlement Bill)" && settlementData.length === 0) {
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
    const miscCharges = form.charges.other.reduce((acc, c) => acc + (c.amount || 0), 0);
    const totalCharges = Number(form.charges.commission || 0) + Number(form.charges.handling || 0) + Number(form.charges.transport || 0) + miscCharges;
    const grandTotal = subTotal + totalCharges;
    const balanceDue = grandTotal - Number(form.amountReceived || 0);
    
    let status = "Unpaid";
    if (form.amountReceived >= grandTotal) status = "Fully Paid";
    else if (form.amountReceived > 0) status = "Partially Paid";
    
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

  const handleCreateLot = async () => {
    if (!intakeForm.supplierId) return alert("⚠️ Supplier is required");
    if (intakeForm.lineItems.some(i => !i.product || !i.grossWeight)) return alert("⚠️ Product and Weight are required for all items");
    
    const res = await MandiService.addLot(intakeForm);
    if (res.status === "SUCCESS") {
      alert(`💾 SUCCESS: Lot ${res.data.lotId} recorded!`);
      setIntakeForm({ 
        supplierId: "", 
        entryDate: new Date().toISOString().slice(0, 10),
        vehicleNumber: "",
        driverName: "",
        origin: "",
        notes: "",
        lineItems: [{ product: "", variety: "", grade: "", grossWeight: "", deductions: "", boxes: "", estimatedRate: "" }]
      });
      fetchData();
    } else {
      alert(`❌ FAILED: ${res.message || "Database Error"}`);
    }
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

  const handleCreateFarmerBill = async () => {
     const gross = settlementData.reduce((acc, i) => acc + (i.quantity * i.saleRate), 0);
     const totalExp = farmerBillForm.expenses.reduce((acc, e) => acc + e.value, 0);
     const netPayable = (gross - totalExp) - farmerBillForm.advance;

     const finalBill = {
        ...farmerBillForm,
        grossAmount: gross,
        totalExpenses: totalExp,
        netPayable: netPayable,
        allocations: settlementData.map(s => s._id)
     };

     const res = await MandiService.createFarmerSettlementBill(finalBill);
     if (res.status === "SUCCESS") {
        setIsBillLocked(true);
        setFarmerBillForm(res.data);
        fetchData();
        alert("🔒 BILL FINALIZED & SENT TO LEDGER");
     }
  };

  const handleVoidBill = async (id) => {
     const reason = prompt("Mandatory: Reason for voiding this finalized settlement?");
     if (!reason) return;
     const res = await MandiService.getVoidBill(id, reason);
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
    { id: "Dashboard", icon: "📊", roles: ["Admin", "Accountant", "Operations Staff"] },
    { id: "User Role", icon: "👥", roles: ["Admin"] },
    { id: "Supplier", icon: "👨‍🌾", roles: ["Admin", "Operations Staff", "Accountant"] },
    { id: "Inventory Allocation", icon: "📦", roles: ["Admin", "Operations Staff"] },
    { id: "Buyer Invoicing", icon: "🧾", roles: ["Admin", "Accountant"] },
    { id: "Farmer Billing", icon: "⚖️", roles: ["Admin", "Accountant"] }, // Linked to Settlement Bill rendering
    { id: "Ledger System", icon: "📖", roles: ["Admin", "Accountant"] },
    { id: "Payment Management", icon: "💳", roles: ["Admin", "Accountant"] },
    { id: "Expense Management", icon: "💸", roles: ["Admin", "Accountant", "Operations Staff"] },
    { id: "Reports", icon: "📄", roles: ["Admin", "Accountant"] },
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
          {activeSection === "User Role" && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "1px solid #EBE9E1", paddingBottom: "24px" }}>
               <div>
                  <h2 style={{ fontSize: "28px", fontWeight: "800", color: COLORS.sidebar, margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>System User Matrix</h2>
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

          {/* Supplier Role Module (Handles both direct "Supplier" and nested "User Role") */}
          {(activeSection === "Supplier" || (activeSection === "User Role" && activeUserRoleTab === "Supplier")) && (
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
                        { label: "Product Type", type: "select", options: ["Fruits", "Vegetables"], value: dispatchType, onChange: (e) => setDispatchType(e.target.value) },
                        { label: "Product Name", list: dispatchType === "Fruits" ? "fruit-list" : "vegetable-list", placeholder: "Type to search...", value: dispatchProduct, onChange: (e) => setDispatchProduct(e.target.value) },
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
          {((activeSection === "User Role" && activeUserRoleTab === "Buyer")) && (
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
                        { label: "Product Type", type: "select", options: ["Fruits", "Vegetables"], value: poType, onChange: (e) => setPoType(e.target.value) },
                        { label: "Product Name", list: poType === "Fruits" ? "fruit-list" : "vegetable-list", placeholder: "Type to search...", value: poProduct, onChange: (e) => setPoProduct(e.target.value) },
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

                  <div style={{ marginTop: "40px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "800", color: COLORS.sidebar, marginBottom: "16px", borderBottom: "1px solid #EBE9E1", paddingBottom: "12px" }}>Recent Purchase Orders</h3>
                    <div style={{ overflowX: "auto", background: "#FFFFFF", borderRadius: "12px", border: "1px solid #EBE9E1" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                        <thead>
                          <tr style={{ background: "#FDFBF4", textAlign: "left", color: COLORS.muted }}>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Order ID</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Buyer</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Product Info</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Qty</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Estimated Rate</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Urgency</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { id: "ORD-PO-148", buyer: "Reliance Retail", product: "Apple (Fuji) • Grade A", qty: "500 KG", rate: "₹120/KG", urgency: "High" },
                            { id: "ORD-PO-147", buyer: "Kisan Markets", product: "Mango (Alphonso) • Premium", qty: "100 Box", rate: "₹650/Box", urgency: "Normal" },
                            { id: "ORD-PO-146", buyer: "BigBasket", product: "Tomato (Grape) • Standard", qty: "2 Ton", rate: "₹15/KG", urgency: "Critical" }
                          ].map((o, i) => (
                            <tr key={i} style={{ borderBottom: i === 2 ? "none" : "1px solid #EBE9E1" }}>
                              <td style={{ padding: "16px", fontWeight: "600", color: COLORS.sidebar }}>{o.id}</td>
                              <td style={{ padding: "16px", color: COLORS.text }}>{o.buyer}</td>
                              <td style={{ padding: "16px", color: COLORS.text }}>{o.product}</td>
                              <td style={{ padding: "16px", color: COLORS.text }}>{o.qty}</td>
                              <td style={{ padding: "16px", fontWeight: "700", color: COLORS.sidebar }}>{o.rate}</td>
                              <td style={{ padding: "16px" }}>
                                <span style={{ 
                                  padding: "4px 8px", 
                                  borderRadius: "6px", 
                                  fontSize: "11px", 
                                  fontWeight: "700", 
                                  background: o.urgency === 'Critical' ? '#FAD8D8' : o.urgency === 'High' ? '#FEF3C7' : '#DCFCE7', 
                                  color: o.urgency === 'Critical' ? COLORS.danger : o.urgency === 'High' ? '#92400E' : '#166534' 
                                }}>{o.urgency}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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

                  <div style={{ marginTop: "40px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "800", color: COLORS.sidebar, marginBottom: "16px", borderBottom: "1px solid #EBE9E1", paddingBottom: "12px" }}>Recent Buyer Transactions</h3>
                    <div style={{ overflowX: "auto", background: "#FFFFFF", borderRadius: "12px", border: "1px solid #EBE9E1" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                        <thead>
                          <tr style={{ background: "#FDFBF4", textAlign: "left", color: COLORS.muted }}>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Date</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Buyer Name</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Inv / Order ID</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Total Amount</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Paid Amount</th>
                            <th style={{ padding: "16px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Outstanding</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { date: "Oct 25, 2026", buyer: "Reliance Retail", inv: "INV-2024-001", total: "₹2,50,000", paid: "₹2,00,000", balance: "₹50,000" },
                            { date: "Oct 23, 2026", buyer: "More Supermarkets", inv: "INV-2024-002", total: "₹85,000", paid: "₹85,000", balance: "₹0" },
                            { date: "Oct 21, 2026", buyer: "BigBasket", inv: "INV-2024-003", total: "₹1,20,000", paid: "₹50,000", balance: "₹70,000" }
                          ].map((b, i) => (
                            <tr key={i} style={{ borderBottom: i === 2 ? "none" : "1px solid #EBE9E1" }}>
                              <td style={{ padding: "16px", color: COLORS.text }}>{b.date}</td>
                              <td style={{ padding: "16px", fontWeight: "600", color: COLORS.sidebar }}>{b.buyer}</td>
                              <td style={{ padding: "16px", color: COLORS.muted }}>{b.inv}</td>
                              <td style={{ padding: "16px", fontWeight: "700", color: COLORS.sidebar }}>{b.total}</td>
                              <td style={{ padding: "16px", color: COLORS.success, fontWeight: "600" }}>{b.paid}</td>
                              <td style={{ padding: "16px", color: COLORS.danger, fontWeight: "700" }}>{b.balance}</td>
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

          {/* 6 & 7. UNIFIED INVENTORY MANAGEMENT MODULE */}
          {activeSection === "Inventory Allocation" &&
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
               <div style={{ display: "flex", gap: "10px", background: "#fff", padding: "8px", borderRadius: "20px", border: "1.5px solid #EBE9E1", width: "fit-content", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                  <button 
                    onClick={() => setInvMode("Allocation")} 
                    style={{ padding: "12px 28px", borderRadius: "14px", border: "none", background: invMode === "Allocation" ? COLORS.primary : "transparent", color: invMode === "Allocation" ? "#fff" : COLORS.text, fontWeight: "800", cursor: "pointer", transition: "all 0.2s" }}
                  >
                    📤 Live Stock & Allocation
                  </button>
                  <button 
                    onClick={() => setInvMode("Intake")} 
                    style={{ padding: "12px 28px", borderRadius: "14px", border: "none", background: invMode === "Intake" ? COLORS.primary : "transparent", color: invMode === "Intake" ? "#fff" : COLORS.text, fontWeight: "800", cursor: "pointer", transition: "all 0.2s" }}
                  >
                    📥 Register New Farmer Arrival
                  </button>
               </div>

               {invMode === "Intake" ? (
                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", animation: "fadeIn 0.4s ease" }}>
                    <Card title="📋 Lot Creation Engine" subtitle="Record new produce arrivals immediately">
                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <Input label="📅 Arrival Date & Time" type="datetime-local" value={intakeForm.entryDate} onChange={e => setIntakeForm({...intakeForm, entryDate: e.target.value})} />
                          <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", marginBottom: "6px", fontWeight: "700", color: COLORS.secondary, fontSize: "12px" }}>👨‍🌾 Farmer Selection</label>
                            <select 
                              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1.5px solid #EBE9E1", background: "#f8fafc" }}
                              value={intakeForm.supplierId}
                              onChange={e => setIntakeForm({...intakeForm, supplierId: e.target.value})}
                            >
                              <option value="">Search Farmer...</option>
                              {suppliers.map(s => <option key={s._id} value={s._id}>{s.name} - {s.village}</option>)}
                            </select>
                          </div>
                       </div>
                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                          <Input label="🚛 Vehicle Number" placeholder="Ex: TS 09..." value={intakeForm.vehicleNumber} onChange={e => setIntakeForm({...intakeForm, vehicleNumber: e.target.value})} />
                          <Input label="📍 Origin Point" placeholder="Ex: Guntur" value={intakeForm.origin} onChange={e => setIntakeForm({...intakeForm, origin: e.target.value})} />
                          <Input label="👷 Driver Contact" placeholder="Optional" value={intakeForm.driverName} onChange={e => setIntakeForm({...intakeForm, driverName: e.target.value})} />
                       </div>
                       <div style={{ marginTop: "24px" }}>
                          <h4 style={{ color: COLORS.secondary, marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            📦 Produce Breakdown
                            <Button variant="secondary" onClick={() => setIntakeForm({...intakeForm, lineItems: [...intakeForm.lineItems, { product: "", variety: "", grade: "", grossWeight: "", deductions: "", boxes: "", estimatedRate: "" }]})} style={{ padding: "6px 16px", fontSize: "12px" }}>+ Add Variant</Button>
                          </h4>
                          {intakeForm.lineItems.map((item, idx) => (
                            <div key={idx} style={{ padding: "20px", background: "#f8FAF8", borderRadius: "16px", marginBottom: "16px", border: "1px solid #E2E8F0" }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                                 <select 
                                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                                    value={item.product}
                                    onChange={e => {
                                      const newList = [...intakeForm.lineItems];
                                      newList[idx].product = e.target.value;
                                      setIntakeForm({...intakeForm, lineItems: newList});
                                    }}
                                 >
                                    <option value="">Choose Fruit/Veg...</option>
                                    {[...DB.Fruits, ...DB.Vegetables].map(p => <option key={p} value={p}>{p}</option>)}
                                 </select>
                                 <Input placeholder="Variety" value={item.variety} onChange={e => {
                                    const newList = [...intakeForm.lineItems];
                                    newList[idx].variety = e.target.value;
                                    setIntakeForm({...intakeForm, lineItems: newList});
                                 }} />
                                 <Input placeholder="Qty (Gross KG)" type="number" value={item.grossWeight} onChange={e => {
                                    const newList = [...intakeForm.lineItems];
                                    newList[idx].grossWeight = e.target.value;
                                    setIntakeForm({...intakeForm, lineItems: newList});
                                 }} />
                              </div>
                              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                 <Input placeholder="Deductions" style={{ width: "120px" }} value={item.deductions} onChange={e => {
                                    const newList = [...intakeForm.lineItems];
                                    newList[idx].deductions = e.target.value;
                                    setIntakeForm({...intakeForm, lineItems: newList});
                                 }} />
                                 <span style={{ fontSize: "12px", color: COLORS.muted }}>Net Calculation: <b style={{ color: COLORS.primary }}>{(Number(item.grossWeight) - Number(item.deductions)) || 0} KG</b></span>
                              </div>
                            </div>
                          ))}
                       </div>
                       <Button style={{ width: "100%", height: "54px", marginTop: "24px" }} onClick={handleCreateLot}>Create Inventory Lot & QR</Button>
                    </Card>
                    <Card title="Incoming Live Stream" subtitle="Queue of inventory pending allocation">
                       <div style={{ maxHeight: "700px", overflowY: "auto" }} className="menu-scroll">
                          {lots.slice(0, 10).map(lot => (
                            <div key={lot._id} style={{ border: "1px solid #EBE9E1", borderRadius: "16px", background: "#FFFFFF", marginBottom: "16px", overflow: "hidden" }}>
                               <div style={{ background: "#F8FAF8", padding: "14px 20px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #EBE9E1" }}>
                                  <b style={{ color: COLORS.sidebar }}>{lot.lotId}</b>
                                  <span style={{ fontSize: "11px", fontWeight: "900", color: COLORS.primary }}>{lot.supplier?.name}</span>
                               </div>
                               <div style={{ padding: "16px 20px" }}>
                                  {lot.lineItems.map((item, i) => (
                                    <div key={i} style={{ fontSize: "13px", color: COLORS.text, marginBottom: "4px", display: "flex", justifyContent: "space-between" }}>
                                       <span>{item.product} ({item.variety})</span>
                                       <b>{item.remainingQuantity} KG</b>
                                    </div>
                                  ))}
                                  <button onClick={() => setInvMode("Allocation")} style={{ width: "100%", marginTop: "12px", padding: "8px", borderRadius: "8px", border: `1px solid ${COLORS.primary}`, color: COLORS.primary, background: "transparent", cursor: "pointer", fontWeight: "700" }}>Execute Allocation »</button>
                               </div>
                            </div>
                          ))}
                       </div>
                    </Card>
                 </div>
               ) : (
                 <div style={{ display: "flex", flexDirection: "column", gap: "32px", animation: "fadeIn 0.4s ease" }}>
                    <Card title="📤 Enterprise Allocation Engine" subtitle="Precision matching of stock to buyer invoices">
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr", gap: "32px", minHeight: "700px" }}>
                          <div style={{ borderRight: "1px solid #f1f5f9", paddingRight: "32px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                                <label style={{ fontSize: "12px", fontWeight: "800", opacity: 0.6 }}>ACTIVE INVENTORY QUEUE</label>
                                <span style={{ fontSize: "10px", background: COLORS.sidebar, color: "#fff", padding: "4px 10px", borderRadius: "20px" }}>{lots.length} UNITS</span>
                              </div>
                              <div style={{ maxHeight: "800px", overflowY: "auto" }} className="menu-scroll">
                                {lots.map(lot => (
                                  <div key={lot._id} style={{ marginBottom: "28px" }}>
                                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
                                        <span style={{ fontSize: "12px", fontWeight: "900", color: COLORS.sidebar }}>{lot.lotId}</span>
                                        <span style={{ fontSize: "10px", background: "#f8fafc", padding: "2px 8px", borderRadius: "4px" }}>{lot.supplier?.name}</span>
                                      </div>
                                      {lot.lineItems.map((item, i) => {
                                        const isSelected = selection.item?._id === item._id;
                                        let statusColor = "#10B981";
                                        if (item.status === 'Partially Sold') statusColor = "#F59E0B";
                                        if (item.status === 'Fully Sold') statusColor = "#EF4444";
                                        return (
                                          <div 
                                            key={i} 
                                            onClick={() => setSelection({ ...selection, item, lot })}
                                            style={{ 
                                              padding: "16px", borderRadius: "16px", background: isSelected ? COLORS.primary : "#fff", 
                                              color: isSelected ? "#fff" : COLORS.text, cursor: item.status === 'Fully Sold' ? "not-allowed" : "pointer", 
                                              marginTop: "10px", border: isSelected ? `2px solid ${COLORS.primary}` : `1.5px solid #EBE9E1`,
                                              opacity: item.status === 'Fully Sold' && !isSelected ? 0.4 : 1, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                            }}
                                          >
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <b>{item.product}</b>
                                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: statusColor }}></div>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "11px", opacity: 0.8 }}>
                                                <span>STOCK: <b>{item.remainingQuantity} KG</b></span>
                                                <span>{item.variety}</span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                ))}
                              </div>
                          </div>
                          <div style={{ paddingLeft: "12px" }}>
                              {selection.item ? (
                                <div style={{ animation: "fadeIn 0.4s ease" }}>
                                  <div style={{ background: COLORS.secondary, color: "#fff", padding: "28px", borderRadius: "24px", marginBottom: "32px", boxShadow: "0 12px 20px -5px rgba(0,0,0,0.2)" }}>
                                      <label style={{ fontSize: "11px", textTransform: "uppercase", opacity: 0.7 }}>EXECUTING ALLOCATION FOR</label>
                                      <h2 style={{ margin: "4px 0", fontSize: "24px" }}>{selection.lot.lotId} » {selection.item.product}</h2>
                                      <div style={{ display: "flex", gap: "20px", marginTop: "16px", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "16px" }}>
                                        <div><small style={{ opacity: 0.8 }}>AVL</small><br /><b>{selection.item.remainingQuantity} KG</b></div>
                                        <div><small style={{ opacity: 0.8 }}>FARMER</small><br /><b>{selection.lot.supplier?.name}</b></div>
                                      </div>
                                  </div>
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                      <div style={{ marginBottom: "20px" }}>
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "700", color: COLORS.secondary, fontSize: "12px" }}>🏙 Target Buyer</label>
                                        <select 
                                          style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1.5px solid #EBE9E1", background: "#f8fafc" }}
                                          value={allocationForm.buyerId}
                                          onChange={e => setAllocationForm({...allocationForm, buyerId: e.target.value})}
                                        >
                                            <option value="">Choose registered buyer...</option>
                                            {buyers.map(b => <option key={b._id} value={b._id}>{b.name} - {b.shopName}</option>)}
                                        </select>
                                      </div>
                                      <Input label="⚖️ Quantity (KG)" type="number" value={allocationForm.quantity} onChange={e => setAllocationForm({...allocationForm, quantity: e.target.value})} />
                                      <Input label="💰 Sale Rate (₹/KG)" type="number" value={allocationForm.saleRate} onChange={e => setAllocationForm({...allocationForm, saleRate: e.target.value})} />
                                      <Input label="📝 Transfer Memo" placeholder="Notes..." value={allocationForm.notes} onChange={e => setAllocationForm({...allocationForm, notes: e.target.value})} />
                                  </div>
                                  <div style={{ background: "#FDFBF4", padding: "24px", borderRadius: "20px", border: "1.5px dashed #D4B106", marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <div><p style={{ margin: 0, fontSize: "12px", color: "#856404" }}>EST VALUE</p><h2 style={{ margin: 0, color: COLORS.secondary }}>{formatCurrency((allocationForm.quantity * allocationForm.saleRate) || 0)}</h2></div>
                                      <div style={{ textAlign: "right" }}><p style={{ margin: 0, fontSize: "12px", color: "#856404" }}>REMAINING</p><h4>{selection.item.remainingQuantity - allocationForm.quantity} KG</h4></div>
                                  </div>
                                  <Button style={{ width: "100%", height: "60px", marginTop: "32px", fontSize: "18px" }} onClick={handleAllocate}>Authorize & Generate Invoice</Button>
                                </div>
                              ) : (
                                <div style={{ padding: "100px 40px", textAlign: "center", background: "#f8fafc", borderRadius: "24px", border: "2px dashed #e2e8f0" }}>
                                  <div style={{ fontSize: "64px", marginBottom: "20px" }}>📦</div>
                                  <h3>Ready for Allocation</h3>
                                  <p style={{ color: COLORS.muted }}>Select an item from the left queue to begin.</p>
                                </div>
                              )}
                          </div>
                        </div>
                    </Card>

                    <Card title="📦 Live Stock Status Engine" subtitle="Real-time tracking of allocations">
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                              <thead>
                                <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                                    <th style={{ padding: "16px" }}>Lot / Item</th>
                                    <th style={{ padding: "16px" }}>Farmer</th>
                                    <th style={{ padding: "16px" }}>Total</th>
                                    <th style={{ padding: "16px" }}>Sold</th>
                                    <th style={{ padding: "16px" }}>Remaining</th>
                                    <th style={{ padding: "16px" }}>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lots.map(lot => lot.lineItems.map((item, idx) => (
                                  <tr key={`${lot._id}-${idx}`} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                      <td style={{ padding: "16px" }}><b>{lot.lotId}</b><br /><small>{item.product}</small></td>
                                      <td style={{ padding: "16px" }}>{lot.supplier?.name}</td>
                                      <td style={{ padding: "16px" }}>{item.netWeight} KG</td>
                                      <td style={{ padding: "16px", color: COLORS.success, fontWeight: "700" }}>{item.soldQuantity} KG</td>
                                      <td style={{ padding: "16px", fontWeight: "700" }}>{item.remainingQuantity} KG</td>
                                      <td style={{ padding: "16px" }}>
                                        <span style={{ 
                                            padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "800",
                                            background: item.status === 'Fully Sold' ? '#DCFCE7' : item.status === 'Partially Sold' ? '#FEF3C7' : '#F1F5F9',
                                            color: item.status === 'Fully Sold' ? '#166534' : item.status === 'Partially Sold' ? '#92400E' : '#475569'
                                        }}>{item.status}</span>
                                      </td>
                                  </tr>
                                )))}
                              </tbody>
                          </table>
                        </div>
                    </Card>

                    <Card title="🤝 Holding Tracker" subtitle="Track undelivered produce currently held by buyers">
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                              <thead>
                                <tr style={{ background: "#FDFBF4", textAlign: "left" }}>
                                    <th style={{ padding: "16px" }}>Current Holder (Buyer)</th>
                                    <th style={{ padding: "16px" }}>Invoice #</th>
                                    <th style={{ padding: "16px" }}>Lot ID</th>
                                    <th style={{ padding: "16px" }}>Allocated Date</th>
                                    <th style={{ padding: "16px" }}>Qty Reserved</th>
                                    <th style={{ padding: "16px" }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lots.map(lot => lot.lineItems.filter(i => i.soldQuantity > i.deliveredQuantity).map((item, idx) => (
                                  <tr key={`${lot._id}-${idx}`} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                      <td style={{ padding: "16px" }}><b>Reliance Retail</b></td>
                                      <td style={{ padding: "16px" }}>INV-2026-001</td>
                                      <td style={{ padding: "16px" }}>{lot.lotId}</td>
                                      <td style={{ padding: "16px" }}>{new Date(lot.createdAt).toLocaleDateString()}</td>
                                      <td style={{ padding: "16px", color: COLORS.danger, fontWeight: "700" }}>{item.soldQuantity - item.deliveredQuantity} KG</td>
                                      <td style={{ padding: "16px" }}>
                                        <Button variant="outline" style={{ padding: "4px 8px", fontSize: "11px" }}>Mark Delivered</Button>
                                      </td>
                                  </tr>
                                )))}
                                {lots.length === 0 && <tr><td colSpan="6" style={{ padding: "20px", textAlign: "center", color: COLORS.muted }}>No pending deliveries.</td></tr>}
                              </tbody>
                          </table>
                        </div>
                    </Card>
                 </div>
               )}
            </div>
          }

          {/* 9. PRODUCTION-GRADE BUYER INVOICING (DISPATCH CONSOLE) */}
          {activeSection === "Buyer Invoicing" && (
            <div style={{ display: "grid", gridTemplateColumns: "2.8fr 1.2fr", gap: "32px", animation: "slideUp 0.6s ease-out" }}>
               {/* LEFT COLUMN: THE BILLING ENGINE */}
               <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  <Card style={{ padding: "0", border: "none", overflow: "hidden", borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}>
                     {/* Invoice Header Section */}
                     <div style={{ background: "#fff", padding: "40px", borderBottom: "1.5px solid #f1f5f9" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                           <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                                 <div style={{ background: COLORS.accent, width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.secondary, fontWeight: "900" }}>SPV</div>
                                 <h2 style={{ margin: 0, fontWeight: "900", letterSpacing: "-0.5px" }}>BUYER INVOICE</h2>
                              </div>
                              <p style={{ margin: 0, color: COLORS.muted, fontSize: "14px", fontWeight: "600" }}>Mandi Dispatch & Traceability Document</p>
                              {duplicateWarning && (
                                <div style={{ background: "#FEF2F2", color: "#991B1B", padding: "8px 16px", borderRadius: "8px", border: "1px solid #FEE2E2", fontSize: "12px", fontWeight: "700", marginTop: "12px", display: "inline-block" }}>⚠️ Possible duplicate invoice detected (Same buyer/day)</div>
                              )}
                           </div>
                           <div style={{ textAlign: "right" }}>
                              <label style={{ fontSize: "11px", fontWeight: "900", opacity: 0.5, textTransform: "uppercase", display: "block" }}>Invoice Identity</label>
                              <h2 style={{ margin: 0, color: COLORS.secondary }}>{buyerInvoiceForm.invoiceNo}</h2>
                              <div style={{ marginTop: "10px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                 <div style={{ background: "#f8fafc", padding: "4px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}><b>DATE:</b> <input type="date" value={buyerInvoiceForm.date} onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, date: e.target.value})} style={{ border: "none", background: "none", fontSize: "11px", fontWeight: "700", outline: "none" }} /></div>
                                 <div style={{ background: "#f8fafc", padding: "4px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}><b>TIME:</b> {buyerInvoiceForm.time}</div>
                              </div>
                           </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "32px" }}>
                           <div>
                              <label style={{ fontSize: "11px", fontWeight: "900", color: COLORS.secondary, marginBottom: "8px", display: "block" }}>BUYER NAME (M/s)</label>
                              <select 
                                 style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "2px solid #0f172a", background: "#f8fafc", fontWeight: "700", outline: "none" }}
                                 value={buyerInvoiceForm.buyerId}
                                 onChange={e => handleBuyerSelectionForInvoice(e.target.value)}
                              >
                                 <option value="">-- SEARCH REGISTERED BUYERS --</option>
                                 {buyers.map(b => <option key={b._id} value={b._id}>{b.shopName || b.name}</option>)}
                              </select>
                              <div style={{ marginTop: "16px", display: "flex", gap: "20px" }}>
                                 <div><small style={{ fontWeight: "800", opacity: 0.5 }}>PHONE:</small> <span style={{ fontWeight: "700" }}>{buyerInvoiceForm.buyerPhone || "---"}</span></div>
                                 <div><small style={{ fontWeight: "800", opacity: 0.5 }}>ADDRESS:</small> <span style={{ fontWeight: "700" }}>{buyerInvoiceForm.buyerAddress || "---"}</span></div>
                              </div>
                           </div>
                           <div>
                              <label style={{ fontSize: "11px", fontWeight: "900", color: COLORS.secondary, marginBottom: "8px", display: "block" }}>VEHICLE / TRASNPORT</label>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                 <input 
                                    placeholder="Lorry #" 
                                    style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1.5px solid #e2e8f0" }}
                                    value={buyerInvoiceForm.vehicleNumber}
                                    onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, vehicleNumber: e.target.value})}
                                 />
                                 <input 
                                    placeholder="Driver" 
                                    style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1.5px solid #e2e8f0" }}
                                    value={buyerInvoiceForm.driverName}
                                    onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, driverName: e.target.value})}
                                 />
                              </div>
                           </div>
                           <div style={{ background: "#FDFBF4", padding: "16px", borderRadius: "16px", border: "1.5px dashed #D4B106" }}>
                              <label style={{ fontSize: "10px", fontWeight: "900", opacity: 0.6, display: "block", marginBottom: "8px" }}>WEIGHT DISPLAY MODE</label>
                              <div style={{ display: "flex", gap: "8px" }}>
                                 <button 
                                    onClick={() => setWeightDisplayMode("COMPREHENSIVE")}
                                    style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", fontSize: "10px", fontWeight: "800", background: weightDisplayMode === "COMPREHENSIVE" ? COLORS.primary : "#eee", color: weightDisplayMode === "COMPREHENSIVE" ? "#fff" : "#000", cursor: "pointer" }}
                                 >FULL</button>
                                 <button 
                                    onClick={() => setWeightDisplayMode("MINIMAL")}
                                    style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", fontSize: "10px", fontWeight: "800", background: weightDisplayMode === "MINIMAL" ? COLORS.primary : "#eee", color: weightDisplayMode === "MINIMAL" ? "#fff" : "#000", cursor: "pointer" }}
                                 >NET ONLY</button>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Item Selection Table */}
                     <div style={{ padding: "40px" }}>
                        <h4 style={{ margin: "0 0 24px 0", color: COLORS.secondary }}>🛒 PRODUCE DISPATCH LIST</h4>
                        <div style={{ overflowX: "auto" }}>
                           <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px" }}>
                              <thead>
                                 <tr style={{ textAlign: "left", color: COLORS.muted, fontSize: "12px", fontWeight: "900" }}>
                                    <th style={{ padding: "0 12px" }}>PRODUCT + VARIETY + GRADE</th>
                                    <th style={{ padding: "0 12px" }}>LINKED LOT</th>
                                    {weightDisplayMode === "COMPREHENSIVE" && <th style={{ padding: "0 12px", textAlign: "right" }}>GROSS</th>}
                                    {weightDisplayMode === "COMPREHENSIVE" && <th style={{ padding: "0 12px", textAlign: "right" }}>DED. (KG)</th>}
                                    <th style={{ padding: "0 12px", textAlign: "right" }}>NET QTY</th>
                                    <th style={{ padding: "0 12px", textAlign: "right" }}>RATE (₹)</th>
                                    <th style={{ padding: "0 12px", textAlign: "right" }}>AMOUNT</th>
                                    <th style={{ padding: "0 12px" }}></th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {buyerInvoiceForm.items.map((item, idx) => (
                                   <tr key={idx} style={{ background: "#f8fafc", transition: "all 0.2s" }}>
                                      <td style={{ padding: "16px", borderRadius: "14px 0 0 14px", width: "250px" }}>
                                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                             <div style={{ display: "flex", gap: "8px" }}>
                                                <input 
                                                   list="fruit-list"
                                                   placeholder="Product" 
                                                   style={{ flex: 1.5, padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                                                   value={item.productLabel}
                                                   onChange={e => handleUpdateInvoiceItem(idx, "productLabel", e.target.value)}
                                                />
                                                <input 
                                                   placeholder="Grd" 
                                                   style={{ width: "45px", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "11px" }}
                                                   value={item.grade}
                                                   onChange={e => handleUpdateInvoiceItem(idx, "grade", e.target.value)}
                                                />
                                             </div>
                                             <input 
                                                placeholder="Variety (Ex: Alphonso)" 
                                                style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "11px", background: "#f1f5f9" }}
                                                value={item.variety}
                                                onChange={e => handleUpdateInvoiceItem(idx, "variety", e.target.value)}
                                             />
                                          </div>
                                      </td>
                                      <td style={{ padding: "16px" }}>
                                         <select 
                                            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                                            value={item.lotId}
                                            onChange={e => handleUpdateInvoiceItem(idx, "lotId", e.target.value)}
                                         >
                                            <option value="">Link Lot...</option>
                                            {lots.map(l => <option key={l._id} value={l.lotId}>{l.lotId} - {l.supplier?.name}</option>)}
                                         </select>
                                      </td>
                                      {weightDisplayMode === "COMPREHENSIVE" && (
                                         <td style={{ padding: "16px", textAlign: "right" }}>
                                            <input type="number" style={{ width: "80px", textAlign: "right", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0" }} value={item.grossWeight} onChange={e => handleUpdateInvoiceItem(idx, "grossWeight", e.target.value)} />
                                         </td>
                                      )}
                                      {weightDisplayMode === "COMPREHENSIVE" && (
                                         <td style={{ padding: "16px", textAlign: "right" }}>
                                            <input type="number" style={{ width: "60px", textAlign: "right", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0" }} value={item.deductions} onChange={e => handleUpdateInvoiceItem(idx, "deductions", e.target.value)} />
                                         </td>
                                      )}
                                      <td style={{ padding: "16px", textAlign: "right", fontWeight: "700" }}>{item.netWeight.toLocaleString()} KG</td>
                                      <td style={{ padding: "16px", textAlign: "right" }}>
                                         <input type="number" style={{ width: "80px", textAlign: "right", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "rgba(34, 197, 94, 0.05)", color: COLORS.success, fontWeight: "800" }} value={item.rate} onChange={e => handleUpdateInvoiceItem(idx, "rate", e.target.value)} />
                                      </td>
                                      <td style={{ padding: "16px", textAlign: "right", fontWeight: "800", color: COLORS.secondary }}>{formatCurrency(item.amount)}</td>
                                      <td style={{ padding: "16px", borderRadius: "0 14px 14px 0", textAlign: "center" }}>
                                         <button onClick={() => removeInvoiceItem(idx)} style={{ background: "none", border: "none", color: COLORS.danger, cursor: "pointer", fontSize: "16px" }}>✕</button>
                                      </td>
                                   </tr>
                                 ))}
                              </tbody>
                           </table>
                           <button onClick={addInvoiceItem} style={{ width: "100%", padding: "16px", border: "2px dashed #cbd5e1", background: "#f8fafc", color: COLORS.primary, fontWeight: "800", borderRadius: "20px", marginTop: "12px", cursor: "pointer" }}>+ ADD PRODUCT LINE ITEM</button>
                        </div>

                        {/* Financials & Charges Block */}
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "48px", borderTop: "2px solid #f1f5f9", paddingTop: "48px" }}>
                           <div style={{ width: "100%", maxWidth: "400px", background: "#0f172a", color: "#fff", padding: "48px", borderRadius: "40px", boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }}>
                              <h4 style={{ margin: "0 0 32px 0", color: COLORS.accent, letterSpacing: "2px" }}>INVOICE SUMMARY</h4>
                              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                 <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.6 }}><span>SUB-TOTAL AMOUNT</span><b>{formatCurrency(buyerInvoiceForm.subTotal)}</b></div>
                                 
                                 <div style={{ borderTop: "1.5px solid rgba(255,255,255,0.12)", paddingTop: "24px", display: "flex", justifyContent: "space-between", fontSize: "32px", fontWeight: "900" }}>
                                    <span style={{ color: COLORS.accent }}>GRAND TOTAL</span>
                                    <span>{formatCurrency(buyerInvoiceForm.grandTotal)}</span>
                                 </div>

                                 <div style={{ background: "rgba(255,255,255,0.06)", padding: "24px", borderRadius: "24px", marginTop: "12px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                       <span style={{ fontSize: "12px", opacity: 0.5, textTransform: "uppercase", fontWeight: "800" }}>Amount Received (Cash/UPI)</span>
                                       <input 
                                          type="number" 
                                          style={{ width: "120px", background: "#fff", color: "#000", border: "none", padding: "12px", borderRadius: "12px", textAlign: "right", fontWeight: "900", fontSize: "18px" }}
                                          value={buyerInvoiceForm.amountReceived}
                                          onChange={e => setBuyerInvoiceForm(calculateInvoiceTotals({...buyerInvoiceForm, amountReceived: e.target.value}))}
                                       />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                       <span style={{ fontSize: "14px", fontWeight: "600" }}>Payer Status</span>
                                       <span style={{ 
                                          padding: "6px 16px", borderRadius: "40px", fontSize: "11px", fontWeight: "900",
                                          background: buyerInvoiceForm.status === 'Fully Paid' ? '#22c55e' : buyerInvoiceForm.status === 'Partially Paid' ? '#f59e0b' : '#ef4444'
                                       }}>{buyerInvoiceForm.status.toUpperCase()}</span>
                                    </div>
                                 </div>

                                 <div style={{ background: COLORS.accent, color: COLORS.secondary, padding: "24px", borderRadius: "24px", textAlign: "center" }}>
                                    <small style={{ fontWeight: "900", opacity: 0.6, letterSpacing: "1px" }}>OUTSTANDING ON THIS INVOICE</small>
                                    <h1 style={{ margin: "5px 0", fontSize: "40px", fontWeight: "900" }}>{formatCurrency(buyerInvoiceForm.balanceDue)}</h1>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </Card>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
                     <Button style={{ height: "72px", fontSize: "18px", borderRadius: "24px" }} onClick={() => alert("✅ INVOICE AUTHORIZED & PRINTING...")}>🚀 AUTHORIZE & PRINT (A4/A5)</Button>
                     <Button variant="secondary" style={{ height: "72px", borderRadius: "24px", background: "#25D366" }}>📱 SHARE ON WHATSAPP</Button>
                     <Button variant="outline" style={{ height: "72px", borderRadius: "24px", border: "2px solid #e2e8f0" }}>💾 SAVE DRAFT</Button>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "32px", padding: "40px", border: "2px dashed #e2e8f0", borderRadius: "24px" }}>
                     <div style={{ textAlign: "center", width: "200px" }}>
                        <div style={{ height: "60px" }}></div>
                        <div style={{ borderTop: "2px solid rgba(15, 23, 42, 0.7)", paddingTop: "10px", fontWeight: "900", fontSize: "12px", color: COLORS.secondary }}>RECEIVER SIGNATURE</div>
                        <small style={{ color: COLORS.muted, fontSize: "10px" }}>For M/s {buyerHistory?.shopName || buyerHistory?.name || "---"}</small>
                     </div>
                  </div>

                  {/* Traceability Panel Footer */}
                  <Card title="📜 INVOICE TRACEABILITY AUDIT" subtitle="Link every product line back to its farmer arrival">
                     <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
                           <thead>
                              <tr style={{ background: "#f8fafc", textAlign: "left", fontSize: "11px", opacity: 0.6 }}>
                                 <th style={{ padding: "12px" }}>PRODUCT</th>
                                 <th style={{ padding: "12px" }}>FARMER SOURCE</th>
                                 <th style={{ padding: "12px" }}>LOT IDENTITY</th>
                                 <th style={{ padding: "12px" }}>MANDI ORIGIN</th>
                                 <th style={{ padding: "12px", textAlign: "right" }}>VOLUME (%)</th>
                              </tr>
                           </thead>
                           <tbody style={{ fontSize: "13px" }}>
                              {buyerInvoiceForm.items.map((item, idx) => (
                                <tr key={idx} style={{ background: "#fff", borderBottom: "1px solid #f1f5f9" }}>
                                   <td style={{ padding: "12px" }}><b>{item.productLabel || "---"}</b></td>
                                   <td style={{ padding: "12px" }}>{lots.find(l => l.lotId === item.lotId)?.supplier?.name || "Multiple Sources"}</td>
                                   <td style={{ padding: "12px" }}><span style={{ color: COLORS.primary, fontWeight: "700" }}>{item.lotId || "N/A"}</span></td>
                                   <td style={{ padding: "12px" }}>{lots.find(l => l.lotId === item.lotId)?.origin || "South Region"}</td>
                                   <td style={{ padding: "12px", textAlign: "right" }}>100%</td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </Card>
               </div>

               {/* RIGHT COLUMN: BUYER INTEL & REGISTER */}
               <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  <div style={{ 
                     background: "rgba(255,255,255,0.7)", 
                     backdropFilter: "blur(20px)", 
                     borderRadius: "32px", 
                     padding: "32px", 
                     border: "1px solid rgba(255,255,255,0.4)"
                  }}>
                     <h3 style={{ margin: "0 0 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        Buyer Intelligence
                        <span style={{ fontSize: "10px", background: COLORS.secondary, color: "#fff", padding: "4px 10px", borderRadius: "10px" }}>LIVE</span>
                     </h3>
                     {buyerHistory ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                           <Card style={{ padding: "24px", background: COLORS.secondary, color: "#fff", border: "none", borderRadius: "24px" }}>
                              <small style={{ fontSize: "10px", opacity: 0.6, fontWeight: "900", letterSpacing: "1px" }}>CURRENT LEDGER BALANCE</small>
                              <h1 style={{ margin: "5px 0", color: COLORS.accent, fontSize: "32px" }}>{formatCurrency(buyerHistory.pendingBalance || 145000)}</h1>
                              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "11px", opacity: 0.8 }}>
                                 <span>Last activity: {buyerHistory.lastActivityDate || "24/03/2026"}</span>
                                 <b style={{ color: COLORS.accent }}>{buyerHistory.paymentBehavior}</b>
                              </div>
                           </Card>

                           <div>
                              <h4 style={{ color: COLORS.secondary, marginBottom: "12px", fontSize: "12px", opacity: 0.6 }}>🌾 HISTORICAL FARMER PURCHASE TRACE</h4>
                              <div style={{ overflowX: "auto", background: "#fff", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
                                 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
                                    <thead>
                                       <tr style={{ textAlign: "left", background: "#f8fafc", color: COLORS.muted }}>
                                          <th style={{ padding: "10px" }}>FARMER</th>
                                          <th style={{ padding: "10px" }}>LOT</th>
                                          <th style={{ padding: "10px" }}>PROD</th>
                                          <th style={{ padding: "10px", textAlign: "right" }}>QTY</th>
                                          <th style={{ padding: "10px", textAlign: "right" }}>RATE</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       {(buyerHistory?.history || [
                                          { farmer: "Vikram Reddy", lot: "LOT-X11", product: "Mango", variety: "Alphonso", grade: "A", qty: 1200, rate: 45, date: "24/03" },
                                          { farmer: "Sandhya Devi", lot: "LOT-X12", product: "Banana", variety: "Yelakki", grade: "B", qty: 850, rate: 32, date: "23/03" }
                                       ]).map((h, i) => (
                                         <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={{ padding: "10px" }}><b>{h?.farmer?.split(' ')[0] || "Unknown"}</b></td>
                                            <td style={{ padding: "10px" }}>{h.lot}</td>
                                            <td style={{ padding: "10px" }}>{h.product}</td>
                                            <td style={{ padding: "10px", textAlign: "right" }}>{h.qty}</td>
                                            <td style={{ padding: "10px", textAlign: "right", color: COLORS.success, fontWeight: "700" }}>₹{h.rate}</td>
                                         </tr>
                                       ))}
                                    </tbody>
                                 </table>
                              </div>
                           </div>

                           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                              {[
                                 { l: "Total Weight", v: `${(buyerHistory.totalWeight || 32400).toLocaleString()} KG`, i: "📈" },
                                 { l: "Total Lifetime", v: formatCurrency((buyerHistory.totalWeight || 32400) * 45), i: "💰" },
                                 { l: "Pref. Product", v: "Mango Alphonso", i: "🥭" },
                                 { l: "Trust Status", v: "Very High", i: "🎯", col: COLORS.success }
                              ].map((x, i) => (
                                 <div key={i} style={{ background: "#fff", padding: "16px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                                    <small style={{ fontWeight: "800", opacity: 0.5, fontSize: "9px", display: "block", marginBottom: "4px" }}>{x.i} {x.l}</small>
                                    <b style={{ fontSize: "12px", color: x.col }}>{x.v}</b>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ) : <p style={{ textAlign: "center", opacity: 0.5, padding: "40px" }}>Link a buyer to view historical purchase intelligence.</p>}
                  </div>

                  <Card title="📑 Recent Invoices" subtitle="History of past 30 days">
                     <div className="menu-scroll" style={{ maxHeight: "500px", overflowY: "auto" }}>
                        {[
                           { no: "INV-2026-X01", buyer: "Harsha Wholesale", amt: 125400, date: "24/03", status: "Paid" },
                           { no: "INV-2026-X02", buyer: "BigBasket Depot", amt: 84500, date: "23/03", status: "Partial" },
                           { no: "INV-2026-X03", buyer: "Reliance Fresh", amt: 210000, date: "22/03", status: "Unpaid" }
                        ].map((hv, i) => (
                           <div key={i} style={{ padding: "16px", background: "#f8fafc", borderRadius: "16px", marginBottom: "12px", border: "1px solid transparent" }} onMouseOver={e => e.currentTarget.style.borderColor=COLORS.primary} onMouseOut={e => e.currentTarget.style.borderColor="transparent"}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                 <b style={{ fontSize: "13px" }}>{hv.no}</b>
                                 <span style={{ fontSize: "10px", opacity: 0.5 }}>{hv.date}</span>
                              </div>
                              <div style={{ fontSize: "12px", fontWeight: "700", color: COLORS.secondary }}>{hv.buyer}</div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", alignItems: "flex-end" }}>
                                 <h4 style={{ margin: 0 }}>{formatCurrency(hv.amt)}</h4>
                                 <span style={{ fontSize: "9px", background: hv.status === 'Paid' ? '#e6f4ea' : '#fff1f0', color: hv.status === 'Paid' ? '#1e7e34' : '#cf1322', padding: "2px 8px", borderRadius: "10px", fontWeight: "900" }}>{hv.status}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </Card>
               </div>
            </div>
          )}

          {/* 9b. PRODUCTION-GRADE FARMER BILLING (SETTLEMENT COMMAND CENTER) */}
          {activeSection === "Farmer Billing" && (
            <div style={{ display: "grid", gridTemplateColumns: "2.8fr 1.2fr", gap: "32px", animation: "slideUp 0.6s ease-out" }}>
               {/* LEFT COLUMN: THE SETTLEMENT ENGINE */}
               <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  <Card style={{ padding: "0", border: "none", overflow: "hidden", borderRadius: "24px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}>
                     {/* Bill Header Section - Dark Ledger Theme */}
                     <div style={{ background: "#0f172a", color: "#fff", padding: "48px", position: "relative" }}>
                        {isBillLocked && (
                          <div style={{ position: "absolute", top: "30px", right: "30px", background: COLORS.accent, color: COLORS.secondary, padding: "10px 24px", borderRadius: "40px", fontWeight: "900", zIndex: 10, fontSize: "14px", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}>🔒 FINALIZED SETTLEMENT</div>
                        )}
                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
                           <div>
                              <h4 style={{ margin: 0, letterSpacing: "6px", opacity: 0.5, fontSize: "12px", textTransform: "uppercase" }}>Audit Provenance</h4>
                              <h1 style={{ margin: "4px 0", fontSize: "42px", fontWeight: "900", letterSpacing: "-1px" }}>SPV <span style={{ color: COLORS.accent }}>FRUITS</span></h1>
                              <p style={{ margin: 0, opacity: 0.7, fontSize: "13px" }}>Mandi HQ, Market Street, Guntur - 522001 | GST: 37AAEFG1234F1Z5</p>
                           </div>
                           <div style={{ textAlign: "right" }}>
                              <p style={{ margin: 0, opacity: 0.6, fontSize: "11px", fontWeight: "800", textTransform: "uppercase" }}>Settlement Document</p>
                              <h2 style={{ margin: 0, color: COLORS.accent, fontSize: "28px" }}>#{farmerBillForm.billNo}</h2>
                              <span style={{ fontSize: "12px" }}>Cycle: {new Date().getFullYear()} - {new Date().getFullYear()+1}</span>
                           </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "32px" }}>
                           <div>
                              <label style={{ fontSize: "10px", fontWeight: "900", opacity: 0.5, display: "block", marginBottom: "8px" }}>FARMER IDENTIFICATION</label>
                              <select 
                                 style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontWeight: "700", outline: "none" }}
                                 value={farmerBillForm.farmerId}
                                 onChange={e => handleFarmerSelectionForSettlement(e.target.value)}
                                 disabled={isBillLocked}
                              >
                                 <option value="" style={{ color: "#000" }}>-- Locate Farmer --</option>
                                 {suppliers.map(s => <option key={s._id} value={s._id} style={{ color: "#000" }}>{s.name} ({s.village})</option>)}
                              </select>
                           </div>
                           <div>
                              <label style={{ fontSize: "10px", fontWeight: "900", opacity: 0.5, display: "block", marginBottom: "8px" }}>CLOSURE DATE</label>
                              <input type="date" value={farmerBillForm.date} onChange={e => setFarmerBillForm({...farmerBillForm, date: e.target.value})} style={{ width: "100%", padding: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", borderRadius: "12px", outline: "none" }} disabled={isBillLocked} />
                           </div>
                           <div style={{ background: "rgba(255,255,255,0.05)", padding: "14px", borderRadius: "12px" }}>
                              <label style={{ fontSize: "10px", fontWeight: "900", opacity: 0.5, display: "block", marginBottom: "4px" }}>LINKED ARRIVALS</label>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                 {settlementData.length > 0 ? Array.from(new Set(settlementData.map(s => s.lotRef?.lotId))).map(lotId => (
                                   <span key={lotId} style={{ background: COLORS.primary, padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }}>{lotId}</span>
                                 )) : <span style={{ opacity: 0.3, fontSize: "11px" }}>No lots linked</span>}
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Main Ledger Content */}
                     <div style={{ padding: "48px", background: "#fff" }}>
                        <div style={{ marginBottom: "40px" }}>
                           <h4 style={{ color: COLORS.secondary, marginBottom: "16px", letterSpacing: "1px" }}>📦 PRODUCE & ALLOCATION DETAILS</h4>
                           <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px" }}>
                              <thead>
                                 <tr style={{ textAlign: "left", color: COLORS.muted }}>
                                    <th style={{ padding: "12px 20px" }}>DESCRIPTION / VARIETY</th>
                                    <th style={{ padding: "12px", textAlign: "right" }}>QUANTITY</th>
                                    <th style={{ padding: "12px", textAlign: "right" }}>UNIT PRICE (AVG)</th>
                                    <th style={{ padding: "12px 20px", textAlign: "right" }}>TOTAL PROCEEDS</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {settlementData.length > 0 ? settlementData.map((item, idx) => (
                                   <tr key={idx} style={{ background: "#f8fafc", transition: "transform 0.2s" }}>
                                      <td style={{ padding: "20px", borderRadius: "16px 0 0 16px" }}>
                                         <b style={{ fontSize: "16px" }}>{item.lineItem?.product}</b><br />
                                         <small style={{ color: COLORS.muted, fontWeight: "600" }}>{item.lineItem?.variety} • Ref: {item.lotRef?.lotId}</small>
                                      </td>
                                      <td style={{ padding: "20px", textAlign: "right", fontWeight: "700" }}>{item.quantity.toLocaleString()} KG</td>
                                      <td style={{ padding: "20px", textAlign: "right", color: COLORS.success, fontWeight: "800" }}>₹ {item.saleRate.toFixed(2)}</td>
                                      <td style={{ padding: "20px", textAlign: "right", fontWeight: "900", borderRadius: "0 16px 16px 0", fontSize: "18px" }}>{formatCurrency(item.quantity * item.saleRate)}</td>
                                   </tr>
                                 )) : (
                                   <tr><td colSpan="4" style={{ padding: "60px", textAlign: "center", opacity: 0.3, background: "#f8fafc", borderRadius: "20px" }}>Select a farmer to generate settlement ledger</td></tr>
                                 )}
                              </tbody>
                              <tfoot>
                                 <tr style={{ fontWeight: "900" }}>
                                    <td style={{ padding: "32px 20px" }}>GROSS SALE REALIZATION</td>
                                    <td style={{ padding: "32px", textAlign: "right", color: COLORS.secondary }}>{(settlementData.reduce((acc, i) => acc + i.quantity, 0)).toLocaleString()} KG</td>
                                    <td></td>
                                    <td style={{ padding: "32px 20px", textAlign: "right", fontSize: "24px", color: COLORS.secondary }}>
                                       {formatCurrency(settlementData.reduce((acc, i) => acc + (i.quantity * i.saleRate), 0))}
                                    </td>
                                 </tr>
                              </tfoot>
                           </table>
                        </div>

                        {/* Deductions & Finalization Grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "64px", borderTop: "2.5px solid #f1f5f9", paddingTop: "48px" }}>
                           <div>
                              <h4 style={{ color: COLORS.danger, marginBottom: "24px", letterSpacing: "1px" }}>📉 MANDI DEDUCTIONS (EXPENSES)</h4>
                              <div style={{ background: "#FDFDFD", borderRadius: "20px", padding: "24px", border: "1px solid #e2e8f0" }}>
                                 {farmerBillForm.expenses.map((exp, i) => (
                                   <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i === farmerBillForm.expenses.length - 1 ? "none" : "1px solid #f1f5f9" }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                         <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: exp.value > 0 ? COLORS.danger : '#ccc' }} />
                                         {exp.isCustom ? (
                                            <input 
                                              placeholder="Expense Label" 
                                              value={exp.label} 
                                              onChange={e => {
                                                const ex = [...farmerBillForm.expenses];
                                                ex[i].label = e.target.value;
                                                setFarmerBillForm({...farmerBillForm, expenses: ex});
                                              }}
                                              style={{ border: "none", fontSize: "14px", fontWeight: "700", width: "150px", outline: "none" }}
                                            />
                                         ) : <span style={{ fontSize: "14px", fontWeight: "700", color: COLORS.secondary }}>{exp.label}</span>}
                                      </div>
                                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                         <span style={{ fontSize: "12px", opacity: 0.5 }}>₹</span>
                                         <input 
                                            type="number"
                                            value={exp.value}
                                            onChange={e => {
                                               const ex = [...farmerBillForm.expenses];
                                               ex[i].value = Number(e.target.value);
                                               setFarmerBillForm({...farmerBillForm, expenses: ex});
                                            }}
                                            style={{ width: "100px", textAlign: "right", border: "none", background: "transparent", padding: "4px", fontWeight: "900", fontSize: "16px", color: COLORS.danger }}
                                            disabled={isBillLocked}
                                         />
                                      </div>
                                   </div>
                                 ))}
                                 <button onClick={addCustomExpense} style={{ marginTop: "20px", background: "#f8fafc", border: "1px dashed #cbd5e1", color: COLORS.primary, cursor: "pointer", fontSize: "12px", fontWeight: "800", width: "100%", padding: "10px", borderRadius: "10px" }}>+ Add Custom Deduction Category</button>
                              </div>
                           </div>

                           <div style={{ background: "#0f172a", color: "#fff", padding: "40px", borderRadius: "32px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
                              <h4 style={{ margin: "0 0 24px 0", color: COLORS.accent, letterSpacing: "2px" }}>SETTLEMENT ABSTRACT</h4>
                              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                 <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.6, fontSize: "14px" }}><span>TOTAL REALIZATION</span><b>{formatCurrency(settlementData.reduce((acc, i) => acc + (i.quantity * i.saleRate), 0))}</b></div>
                                 <div style={{ display: "flex", justifyContent: "space-between", color: "#FFA39E", fontSize: "14px" }}><span>TOTAL DEDUCTIONS (-)</span><b>{formatCurrency(farmerBillForm.expenses.reduce((acc, e) => acc + e.value, 0))}</b></div>
                                 
                                 <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "900" }}>
                                    <span style={{ color: COLORS.accent }}>NET PROCEEDS</span>
                                    <span>{formatCurrency(settlementData.reduce((acc, i) => acc + (i.quantity * i.saleRate), 0) - farmerBillForm.expenses.reduce((acc, e) => acc + e.value, 0))}</span>
                                 </div>

                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.05)", padding: "16px", borderRadius: "16px", marginTop: "12px" }}>
                                    <div>
                                       <span style={{ fontSize: "11px", opacity: 0.5, textTransform: "uppercase" }}>Advance Paid Already</span>
                                       <div style={{ fontSize: "18px", fontWeight: "700" }}>{formatCurrency(farmerBillForm.advance)}</div>
                                    </div>
                                    <input 
                                      type="number" 
                                      placeholder="Edit..."
                                      value={farmerBillForm.advance} 
                                      onChange={e => setFarmerBillForm({...farmerBillForm, advance: Number(e.target.value)})} 
                                      style={{ width: "90px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", textAlign: "right", outline: "none" }}
                                      disabled={isBillLocked}
                                    />
                                 </div>

                                 <div style={{ background: COLORS.accent, color: COLORS.secondary, padding: "24px", borderRadius: "20px", marginTop: "16px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                                    <div style={{ position: "absolute", top: "-10px", right: "-10px", fontSize: "60px", opacity: 0.1, color: "#000" }}>💸</div>
                                    <label style={{ fontSize: "12px", fontWeight: "900", letterSpacing: "1px", opacity: 0.7 }}>FINAL PAYABLE BALANCE</label>
                                    <h1 style={{ margin: "8px 0", fontSize: "42px", fontWeight: "900" }}>
                                       {formatCurrency(
                                          (settlementData.reduce((acc, i) => acc + (i.quantity * i.saleRate), 0) - farmerBillForm.expenses.reduce((acc, e) => acc + e.value, 0)) - farmerBillForm.advance
                                       )}
                                    </h1>
                                    <div style={{ fontSize: "11px", fontWeight: "800", opacity: 0.6 }}>Cleared via Mandi Commission Engine</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </Card>

                  <div style={{ display: "flex", gap: "20px" }}>
                     {!isBillLocked ? (
                       <Button style={{ flex: 2, height: "72px", fontSize: "20px", borderRadius: "20px", background: COLORS.primary }} onClick={handleCreateFarmerBill}>🔥 Authorize Final Settlement & Lock Bill</Button>
                     ) : (
                       <div style={{ display: "flex", gap: "16px", flex: 3 }}>
                          <Button variant="secondary" onClick={() => window.print()} style={{ flex: 1, height: "64px", fontSize: "16px", borderRadius: "18px" }}>🖨 Print Invoice (A4/A5)</Button>
                          <Button onClick={() => alert("Connecting to Cloud SMS Gateway...")} style={{ flex: 1, background: "#25D366", borderRadius: "18px" }}>📱 WhatsApp Details</Button>
                          <Button variant="danger" onClick={() => handleVoidBill(farmerBillForm._id)} style={{ flex: 0.8, borderRadius: "18px" }}>🗑 Void Document</Button>
                       </div>
                     )}
                     <Button variant="outline" onClick={() => { setFarmerBillForm({...farmerBillForm, farmerId: ""}); setSettlementData([]); }} style={{ flex: 0.5, borderRadius: "18px" }}>Restart</Button>
                  </div>

                  {/* Enhanced Traceability Panel */}
                  <Card title="🌾 SOURCE TRACEABILITY MATRIX" subtitle="Verifiable buyer-farmer link log">
                      <div style={{ overflowX: "auto" }}>
                         <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
                            <thead>
                               <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                                  <th style={{ padding: "16px", borderRadius: "12px 0 0 12px" }}>BUYER IDENTITY</th>
                                  <th style={{ padding: "16px" }}>COMMODITY</th>
                                  <th style={{ padding: "16px" }}>LOT #</th>
                                  <th style={{ padding: "16px", textAlign: "right" }}>VOLUME (KG)</th>
                                  <th style={{ padding: "16px", textAlign: "right" }}>SALE RATE</th>
                                  <th style={{ padding: "16px", borderRadius: "0 12px 12px 0" }}>TIMESTAMP</th>
                               </tr>
                            </thead>
                            <tbody>
                               {settlementData.map((row, i) => (
                                 <tr key={i} style={{ background: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" }}>
                                    <td style={{ padding: "16px", borderRadius: "12px 0 0 12px" }}><b>{buyers.find(b => b._id === row.buyerId)?.shopName || "Reliance Fresh Hub"}</b></td>
                                    <td style={{ padding: "16px" }}>{row.lineItem?.product}</td>
                                    <td style={{ padding: "16px" }}><span style={{ color: COLORS.accent, fontWeight: "800" }}>{row.lotRef?.lotId}</span></td>
                                    <td style={{ padding: "16px", textAlign: "right", fontWeight: "700" }}>{row.quantity}</td>
                                    <td style={{ padding: "16px", textAlign: "right", color: COLORS.success }}><b>₹{row.saleRate}</b></td>
                                    <td style={{ padding: "16px", fontSize: "11px", borderRadius: "0 12px 12px 0" }}>{new Date(row.createdAt).toLocaleDateString()}</td>
                                 </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                  </Card>
               </div>

               {/* RIGHT COLUMN: GLASSMORPHIC INTEL CARDS */}
               <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  <div style={{ 
                     background: "rgba(255, 255, 255, 0.7)", 
                     backdropFilter: "blur(20px)", 
                     borderRadius: "32px", 
                     padding: "32px", 
                     border: "1px solid rgba(255,255,255,0.4)",
                     boxShadow: "0 20px 40px rgba(0,0,0,0.05)"
                  }}>
                     <h3 style={{ margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "24px" }}>🧬</span> Farmer Intelligence
                     </h3>
                     {farmerHistory ? (
                       <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {[
                            { label: "Lifetime Volume", value: `${(farmerHistory.totalQty || 12400).toLocaleString()} KG`, icon: "📦" },
                            { label: "Trust Score", value: "98/100", icon: "💎", col: COLORS.success },
                            { label: "Gross Payouts", value: formatCurrency(farmerHistory.totalGross || 850000), icon: "💰" },
                            { label: "Avg Cycle Days", value: "14 Days", icon: "📅" },
                            { label: "Current Liabilities", value: formatCurrency(farmerHistory.pendingBalance || 0), icon: "📉", col: COLORS.danger }
                          ].map((item, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#fff", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
                               <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  <span style={{ fontSize: "18px" }}>{item.icon}</span>
                                  <span style={{ fontSize: "11px", fontWeight: "900", opacity: 0.5, textTransform: "uppercase" }}>{item.label}</span>
                               </div>
                               <b style={{ fontSize: "15px", color: item.col }}>{item.value}</b>
                            </div>
                          ))}
                       </div>
                     ) : <p style={{ textAlign: "center", opacity: 0.5, padding: "40px" }}>Select a producer to visualize bio-metrics.</p>}
                  </div>

                  <Card style={{ borderRadius: "32px", padding: "32px" }}>
                     <h3 style={{ margin: "0 0 24px 0" }}>📜 Archival Records</h3>
                     <div className="menu-scroll" style={{ maxHeight: "600px", overflowY: "auto" }}>
                        {farmerBillsList.length > 0 ? farmerBillsList.map(bill => (
                          <div key={bill._id} style={{ 
                             padding: "20px", 
                             background: "#f8fafc", 
                             borderRadius: "20px", 
                             marginBottom: "16px", 
                             cursor: "pointer",
                             border: "1.5px solid transparent",
                             transition: "all 0.3s"
                          }} 
                          onMouseOver={e => e.currentTarget.style.borderColor = COLORS.primary}
                          onMouseOut={e => e.currentTarget.style.borderColor = "transparent"}
                          onClick={() => { setFarmerBillForm(bill); setIsBillLocked(true); }}>
                             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                <b style={{ fontSize: "14px" }}>{bill.billNo}</b>
                                <span style={{ fontSize: "11px", opacity: 0.7 }}>{bill.date}</span>
                             </div>
                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                <h3 style={{ margin: 0, color: COLORS.secondary }}>{formatCurrency(bill.netPayable || 45000)}</h3>
                                <span style={{ fontSize: "10px", background: "#e6f4ea", color: "#1e7e34", padding: "4px 10px", borderRadius: "40px", fontWeight: "900" }}>AUDITED</span>
                             </div>
                          </div>
                        )) : <p style={{ textAlign: "center", opacity: 0.4 }}>No historical settlements found.</p>}
                     </div>
                  </Card>
               </div>
            </div>
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
                    {[
                      { date: "24/03/2026", doc: "TRX-101", lot: "LOT-X11", qty: "1,200", debit: "45,000", credit: "1,20,000", balance: "75,000" },
                      { date: "25/03/2026", doc: "TRX-102", lot: "LOT-X12", qty: "850", debit: "30,000", credit: "95,000", balance: "1,40,000" },
                      { date: "25/03/2026", doc: "TRX-103", lot: "LOT-X13", qty: "2,000", debit: "80,000", credit: "2,10,000", balance: "2,70,000" }
                    ].map((row, i) => (
                      <tr key={i} style={{ background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                        <td style={{ padding: "20px", borderRadius: "16px 0 0 16px" }}>{row.date}</td>
                        <td>{row.doc} <br /> <small style={{ color: COLORS.accent }}>{row.lot}</small></td>
                        <td>{row.qty} KG</td>
                        <td style={{ color: COLORS.danger }}>- ₹ {row.debit}</td>
                        <td style={{ color: COLORS.success }}>+ ₹ {row.credit}</td>
                        <td style={{ fontWeight: "900", borderRadius: "0 16px 16px 0" }}>₹ {row.balance}</td>
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

          {/* 15. Reports */}
          {activeSection === "Reports" &&
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
          }

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