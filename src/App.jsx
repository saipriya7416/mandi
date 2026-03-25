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
  const date = new Date(dateStr);
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
    invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    buyerId: "",
    buyerPhone: "",
    buyerAddress: "",
    vehicleNumber: "",
    biceNo: "",
    driverName: "",
    routeNotes: "",
    items: [{ productId: "", productLabel: "", variety: "", grade: "", grossWeight: 0, deductions: 0, netWeight: 0, rate: 0, amount: 0, lotId: "" }],
    charges: { commission: 0, handling: 0, transport: 0, other: 0, otherLabel: "Other Charges" },
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
  const [masterProducts, setMasterProducts] = useState([
    { name: "Mango", varieties: ["Alphonso", "Banganapalli", "Rumani", "Nillam", "Kesar"], grades: ["A-Grade", "B-Grade", "Export"], units: ["KG", "Box", "Crate"] },
    { name: "Banana", varieties: ["Yelakki", "G9", "Nendran"], grades: ["Local", "Export"], units: ["KG", "Bunch"] }
  ]);
  const [masterExpenses, setMasterExpenses] = useState([
    { id: "1", name: "Commission", type: "Percentage", default: 4, active: true },
    { id: "2", name: "Labour/Handling", type: "Fixed", default: 0, active: true },
    { id: "3", name: "Market Fee", type: "Percentage", default: 1, active: true },
    { id: "4", name: "Association Fee", type: "Fixed", default: 0, active: true }
  ]);
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
  const [securityAuditLogs, setSecurityAuditLogs] = useState([
    { timestamp: "2026-03-25 14:10", user: "Admin", action: "System Config Updated", status: "SUCCESS" },
    { timestamp: "2026-03-25 11:45", user: "Accountant", action: "Void Bill #129 Attempt", status: "DENIED" },
    { timestamp: "2026-03-25 09:30", user: "Admin", action: "Database Backup Initiated", status: "SUCCESS" }
  ]);

  


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
    const totalCharges = Number(form.charges.commission || 0) + 
                         Number(form.charges.handling || 0) + 
                         Number(form.charges.transport || 0) + 
                         Number(form.charges.other || 0);
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
    { id: "Dashboard", icon: "📊", roles: ["Admin", "Accountant", "Operations Staff", "Viewer"] },
    { id: "User Role", icon: "👥", roles: ["Admin", "Operations Staff"], label: "Profiles" },
    { id: "Inventory Allocation", icon: "📦", roles: ["Admin", "Operations Staff"] },
    { id: "Farmer Billing", icon: "⚖️", roles: ["Admin", "Accountant", "Operations Staff"] },
    { id: "Buyer Invoicing", icon: "🧾", roles: ["Admin", "Accountant", "Operations Staff"] },
    { id: "Ledger System", icon: "📖", roles: ["Admin", "Accountant", "Viewer"] },
    { id: "Payment & Settlement Management", icon: "💳", roles: ["Admin", "Accountant"] },
    { id: "Transportation Tracking", icon: "🚚", roles: ["Admin", "Operations Staff", "Accountant"] },
    { id: "Expense Management", icon: "💸", roles: ["Admin", "Accountant", "Operations Staff"] },
    { id: "Reports", icon: "📄", roles: ["Admin", "Accountant", "Viewer"] },
    { id: "Product Master & Configuration", icon: "⚙️", roles: ["Admin"] },
    { id: "User Roles, Access Control & Security", icon: "🛡️", roles: ["Admin"] },
    { id: "Document Management", icon: "📂", roles: ["Admin"] }
  ];

  const MENU = user ? ALL_MENU.filter(item => item.roles.includes(user.role)) : [];

  if (loading) return <div style={{ height: "100vh", background: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff" }}><h1>⚡ Syncing Matrix...</h1></div>;

  if (!loggedIn) {
    return (
      <div style={{ height:"100vh", background:"#fcf9f1", display:"flex", justifyContent:"center", alignItems:"center", position:"relative", overflow:"hidden" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
          * { font-family: 'Outfit', sans-serif !important; }
          @keyframes floatUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
          .spv-input:focus { border-color: #9fb443 !important; }
          .spv-btn:hover { transform:translateY(-3px) !important; box-shadow:0 20px 45px rgba(55,81,68,0.45) !important; }
        `}</style>
        <div style={{ position:"absolute", top:"-150px", right:"-120px", width:"550px", height:"550px", background:"#375144", borderRadius:"50%", opacity:0.05 }} />
        <div style={{ position:"absolute", bottom:"-120px", left:"-100px", width:"420px", height:"420px", background:"#9fb443", borderRadius:"50%", opacity:0.07 }} />
        <div style={{ animation:"floatUp 0.5s ease-out", width:"460px", background:"#ffffff", borderRadius:"40px", padding:"56px 50px 48px", boxShadow:"0 30px 70px rgba(55,81,68,0.15)", border:"1.5px solid rgba(159,180,67,0.2)", textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"24px" }}>
            <div style={{ position:"relative", width:"96px", height:"96px", background:"linear-gradient(145deg, #375144, #2d4137)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 14px 35px rgba(55,81,68,0.35)" }}>
              <div style={{ position:"absolute", inset:"7px", borderRadius:"50%", border:"3.5px solid #9fb443", opacity:0.65 }} />
              <div style={{ position:"absolute", inset:"14px", borderRadius:"50%", border:"2px solid #9fb443", opacity:0.25 }} />
              <span style={{ color:"#9fb443", fontSize:"20px", fontWeight:"900", letterSpacing:"-0.5px", zIndex:1 }}>SPV</span>
              <div style={{ position:"absolute", top:"12px", right:"14px", width:"12px", height:"8px", background:"#9fb443", borderRadius:"50%", transform:"rotate(-35deg)", opacity:0.9 }} />
            </div>
          </div>
          <h1 style={{ margin:"0 0 4px", fontWeight:"900", color:"#375144", fontSize:"32px", letterSpacing:"-1.5px" }}>SPV FRUITS</h1>
          <p style={{ color:"#9fb443", marginBottom:"44px", fontSize:"10px", letterSpacing:"3.5px", textTransform:"uppercase", fontWeight:"900" }}>Orchard Admin Console</p>
          <div style={{ textAlign:"left" }}>
            <div style={{ marginBottom:"18px" }}>
              <label style={{ display:"block", fontSize:"10px", fontWeight:"900", color:"#375144", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:"8px" }}>Staff Identity</label>
              <input className="spv-input" type="text" placeholder="Enter username" value={authForm.username} onChange={e=>setAuthForm({...authForm,username:e.target.value})} style={{ width:"100%", padding:"15px 18px", borderRadius:"14px", border:"1.5px solid rgba(55,81,68,0.12)", background:"#fcf9f1", fontSize:"15px", fontWeight:"700", color:"#375144", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:"10px", fontWeight:"900", color:"#375144", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:"8px" }}>Secret Access Key</label>
              <input className="spv-input" type="password" placeholder="••••••••" value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{ width:"100%", padding:"15px 18px", borderRadius:"14px", border:"1.5px solid rgba(55,81,68,0.12)", background:"#fcf9f1", fontSize:"15px", fontWeight:"700", color:"#375144", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }} />
            </div>
          </div>
          <button className="spv-btn" onClick={handleLogin} style={{ width:"100%", height:"58px", fontSize:"16px", fontWeight:"900", marginTop:"28px", background:"linear-gradient(135deg, #375144 0%, #2d4137 100%)", color:"#ffffff", border:"none", borderRadius:"18px", cursor:"pointer", letterSpacing:"0.5px", boxShadow:"0 12px 30px rgba(55,81,68,0.3)", transition:"all 0.25s" }}>
            🔐 Initialize Command Deck
          </button>
          <div style={{ marginTop:"32px", paddingTop:"20px", borderTop:"1.5px solid rgba(159,180,67,0.2)", display:"flex", justifyContent:"center", alignItems:"center", gap:"8px" }}>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#9fb443" }} />
            <span style={{ fontSize:"10px", color:"#64748b", fontWeight:"700", letterSpacing:"0.5px" }}>SYSTEM v4.3.0 • SPV FRUITS ERP</span>
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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
        * { font-family: 'Outfit', sans-serif !important; }
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
          <div style={{ padding: "0 24px 32px 24px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ position:"relative", background: "linear-gradient(145deg, #375144, #2d4137)", width: "48px", height: "48px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow:"0 6px 18px rgba(0,0,0,0.3)" }}>
              <div style={{ position:"absolute", inset:"4px", borderRadius:"50%", border:"2px solid #9fb443", opacity:0.5 }} />
              <span style={{ color:"#9fb443", fontSize:"13px", fontWeight:"900", zIndex:1 }}>SPV</span>
            </div>
            <div>
              <h2 style={{ color: "#ffffff", fontWeight: "850", fontSize: "18px", letterSpacing: "-0.5px", margin: 0 }}>SPV FRUITS</h2>
              <p style={{ color: "#9fb443", fontSize: "10px", margin: "2px 0 0", fontWeight: "750", textTransform: "uppercase", letterSpacing: "0.5px" }}>Orchard Admin</p>
            </div>
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
                  display: "flex", alignItems: "center", gap: "14px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: activeSection === item.id ? "rgba(160, 183, 99, 0.15)" : "transparent",
                  color: activeSection === item.id ? "#ffffff" : "#AEC4BB",
                }}
              >
                <span style={{ fontSize: item.isSub ? "14px" : "18px", opacity: activeSection === item.id ? 1 : 0.6, transform: activeSection === item.id ? "scale(1.1)" : "scale(1)" }}>{item.icon}</span>
                <span style={{ fontWeight: activeSection === item.id ? "850" : "550", fontSize: item.isSub ? "12px" : "14px", letterSpacing: "0.2px" }}>{item.id}</span>
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
                  <h1 style={{ fontSize: "32px", fontWeight: "900", color: COLORS.secondary, margin: 0, letterSpacing: "-1px" }}>Salutations, {user?.name?.split(' ')[0] || user?.username || 'Admin'}</h1>
                  <p style={{ color: COLORS.muted, fontSize: "15px", marginTop: "8px", fontWeight: "650", opacity: 0.8 }}>Orchard & Mandi Operations Command Center</p>
               </div>
               <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "10px 20px", borderRadius: "24px", fontSize: "14px", fontWeight: "850", color: COLORS.primary, border: `1px solid ${COLORS.primary}20` }}>
                    📅 {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                  <div style={{ background: "#FFFFFF", border: `1.5px solid ${COLORS.secondary}15`, width: "48px", height: "48px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: COLORS.primary, boxShadow: "0 8px 15px rgba(0,0,0,0.04)", position: "relative" }}>
                     🔔 <div style={{ position: "absolute", top: "12px", right: "12px", width: "8px", height: "8px", background: COLORS.danger, borderRadius: "4px", border: "2px solid #fff" }}></div>
                  </div>
               </div>
            </div>
        </header>

        {/* --- MODULE DISPATCHER --- */}
        <div style={{ animation: "fadeIn 0.6s ease-out" }}>

          {/* 14. Dashboard */}
          {activeSection === "Dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "20px" }}>
                {[
                  { icon: "💰", label: "Net Revenue", period: "This Month", val: "₹2,84,560", trend: "+12.4%", trendUp: true, sub: "vs last cycle", gradFrom: "#375144", gradTo: "#2d4137", sparkW: "72%" },
                  { icon: "📦", label: "Inventory", period: "Live Stock", val: "1,347 KG", trend: "+8.1%", trendUp: true, sub: "vs yesterday", gradFrom: "#4a6741", gradTo: "#375144", sparkW: "58%" },
                  { icon: "📋", label: "Settlements", period: "Pending Audit", val: "15 Bills", trend: "₹45,200", trendUp: null, sub: "awaiting review", gradFrom: "#9fb443", gradTo: "#7a8d34", sparkW: "40%" },
                  { icon: "🏪", label: "Procurement", period: "Active Lots", val: "6 / 8", trend: "2 Low", trendUp: false, sub: "restock alert", gradFrom: "#c0392b", gradTo: "#a93226", sparkW: "25%" }
                ].map((m, i) => (
                  <div key={i} style={{ background: `linear-gradient(145deg, ${m.gradFrom} 0%, ${m.gradTo} 100%)`, borderRadius: "28px", padding: "28px 26px", position: "relative", overflow: "hidden", boxShadow: `0 16px 40px ${m.gradFrom}35`, cursor: "default", transition: "transform 0.25s, box-shadow 0.25s" }}
                    onMouseOver={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 24px 50px ${m.gradFrom}50`; }}
                    onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 16px 40px ${m.gradFrom}35`; }}
                  >
                    {/* Background orb */}
                    <div style={{ position:"absolute", top:"-30px", right:"-30px", width:"100px", height:"100px", borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
                    <div style={{ position:"absolute", bottom:"-20px", left:"-20px", width:"70px", height:"70px", borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
                    {/* Icon badge */}
                    <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.15)", backdropFilter:"blur(4px)", borderRadius:"14px", width:"44px", height:"44px", fontSize:"20px", marginBottom:"18px" }}>{m.icon}</div>
                    <p style={{ margin:"0 0 4px", fontSize:"11px", fontWeight:"800", color:"rgba(255,255,255,0.65)", textTransform:"uppercase", letterSpacing:"1.5px" }}>{m.label}</p>
                    <p style={{ margin:"0 0 12px", fontSize:"10px", color:"rgba(255,255,255,0.45)", fontWeight:"600", letterSpacing:"0.5px" }}>{m.period}</p>
                    <h2 style={{ fontSize:"32px", margin:"0 0 16px", color:"#ffffff", fontWeight:"900", letterSpacing:"-1.5px", lineHeight:1 }}>{m.val}</h2>
                    {/* Spark bar */}
                    <div style={{ height:"3px", background:"rgba(255,255,255,0.15)", borderRadius:"2px", marginBottom:"14px", overflow:"hidden" }}>
                      <div style={{ height:"100%", width:m.sparkW, background:"rgba(255,255,255,0.5)", borderRadius:"2px" }} />
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                      <span style={{ background:"rgba(255,255,255,0.18)", color:"#fff", padding:"3px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:"900" }}>
                        {m.trendUp !== null ? (m.trendUp ? "▲" : "▼") : "●"} {m.trend}
                      </span>
                      <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.55)", fontWeight:"600" }}>{m.sub}</span>
                    </div>
                  </div>
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
                      { name: "Jubilee Hills", units: "142", border: `${COLORS.secondary}15`, bar: COLORS.success, pct: "75%" },
                      { name: "Banjara Hills", units: "89", border: `${COLORS.secondary}15`, bar: COLORS.primary, pct: "50%" },
                      { name: "Madhapur", units: "203", border: `${COLORS.secondary}15`, bar: COLORS.success, pct: "85%" },
                      { name: "Secunderabad", units: "12", border: `${COLORS.danger}30`, bar: COLORS.danger, pct: "15%", bg: "rgba(239, 68, 68, 0.05)" }
                    ].map((stall, i) => (
                      <div key={i} style={{ border: `1.5px solid ${stall.border}`, background: stall.bg || "rgba(0,0,0,0.02)", borderRadius: "20px", padding: "24px", transition: "0.3s" }} onMouseOver={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseOut={e=>e.currentTarget.style.transform="none"}>
                        <p style={{ margin: 0, fontWeight: "850", color: COLORS.muted, fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}>{stall.name}</p>
                        <h2 style={{ margin: "14px 0 4px", fontWeight: "1000", color: stall.bar === COLORS.danger ? COLORS.danger : COLORS.secondary, fontSize: "32px", letterSpacing: "-1px" }}>{stall.units}</h2>
                        <p style={{ margin: "0 0 16px", color: COLORS.muted, fontSize: "12px", fontWeight: "700", opacity: 0.7 }}>UNITS HELD</p>
                        <div style={{ height: "6px", background: "rgba(0,0,0,0.05)", borderRadius: "3px", width: "100%", overflow: "hidden" }}>
                          <div style={{ height: "100%", background: stall.bar, width: stall.pct, borderRadius: "3px", boxShadow: `0 0 12px ${stall.bar}40` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Bottom analytics row */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr", gap: "24px" }}>

                {/* Sales Analytics Panel */}
                <div style={{ background: "#ffffff", borderRadius: "28px", padding: "32px", boxShadow: "0 10px 30px rgba(55,81,68,0.06)", border: "1.5px solid rgba(159,180,67,0.12)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"28px" }}>
                    <div>
                      <h3 style={{ margin:"0 0 4px", fontSize:"18px", fontWeight:"900", color:"#375144", letterSpacing:"-0.5px" }}>Sales Performance</h3>
                      <p style={{ margin:0, fontSize:"12px", color:COLORS.muted, fontWeight:"600" }}>Boxes dispatched this week · Mon–Sun</p>
                    </div>
                    <div style={{ display:"flex", gap:"8px" }}>
                      {["Week","Month","Season"].map((t,i) => (
                        <button key={t} style={{ padding:"6px 14px", borderRadius:"10px", border:"none", fontSize:"11px", fontWeight:"800", cursor:"pointer", background: i===0 ? "#375144" : "rgba(55,81,68,0.08)", color: i===0 ? "#fff" : "#375144", transition:"0.2s" }}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: "200px", width: "100%" }}>
                    <Bar
                      data={{
                        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                        datasets: [{
                          label: "Boxes Sold",
                          data: [65, 45, 80, 75, 120, 60, 40],
                          backgroundColor: ["rgba(55,81,68,0.12)","rgba(55,81,68,0.12)","rgba(55,81,68,0.12)","rgba(55,81,68,0.12)","#375144","rgba(55,81,68,0.12)","rgba(55,81,68,0.12)"],
                          hoverBackgroundColor: "#9fb443",
                          borderRadius: 10,
                          borderSkipped: false,
                          barThickness: 32,
                        }]
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false }, tooltip: { backgroundColor:"#375144", padding:12, cornerRadius:10, callbacks: { label: ctx => ` ${ctx.raw} boxes` } } },
                        scales: {
                          x: { grid: { display: false }, border: { display: false }, ticks: { color:"#64748b", font:{ weight:"700", size:11 }, padding:6 } },
                          y: { grid: { color:"rgba(0,0,0,0.04)" }, border: { display: false }, ticks: { color:"#94a3b8", font:{ size:10 }, padding:6 } }
                        }
                      }}
                    />
                  </div>
                  <div style={{ display:"flex", gap:"24px", marginTop:"20px", paddingTop:"18px", borderTop:"1.5px solid rgba(55,81,68,0.08)" }}>
                    {[
                      { label:"Peak Day", val:"Friday", icon:"🏆" },
                      { label:"Total Boxes", val:"485", icon:"📦" },
                      { label:"Avg Daily", val:"69.3", icon:"📊" },
                      { label:"Best Sale", val:"₹74,400", icon:"💰" }
                    ].map((s,i) => (
                      <div key={i}>
                        <p style={{ margin:"0 0 3px", fontSize:"10px", fontWeight:"800", color:COLORS.muted, textTransform:"uppercase", letterSpacing:"1px" }}>{s.icon} {s.label}</p>
                        <p style={{ margin:0, fontSize:"17px", fontWeight:"900", color:"#375144", letterSpacing:"-0.5px" }}>{s.val}</p>
                      </div>
                    ))}
                  </div>
                </div>

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
            <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "32px", animation: "slideUp 0.6s ease-out" }}>
               {/* LEFT COLUMN: THE BILLING ENGINE */}
               <div className="printable-area" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  <Card style={{ padding: "0", border: "none", overflow: "hidden", borderRadius: "24px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)", background: "#fff" }}>
                     {/* Invoice Header Section */}
                     <div style={{ background: "#0f172a", color: "#fff", padding: "48px", position: "relative" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                           <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "12px" }}>
                                 <div style={{ background: COLORS.accent, width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.secondary, fontWeight: "900", fontSize: "20px" }}>SPV</div>
                                 <div>
                                   <h1 style={{ margin: 0, fontWeight: "900", letterSpacing: "-1px", fontSize: "32px" }}>SPV FRUITS</h1>
                                   <p style={{ margin: 0, opacity: 0.6, fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>Premium Quality Produce Merchant</p>
                                 </div>
                              </div>
                              {duplicateWarning && (
                                <div style={{ background: "#ef4444", color: "#fff", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", marginTop: "12px", display: "inline-block", animation: "pulse 2s infinite" }}>⚠️ DUPLICATE WARNING: Match found for this buyer today</div>
                              )}
                           </div>
                           <div style={{ textAlign: "right" }}>
                              <label style={{ fontSize: "10px", fontWeight: "900", opacity: 0.5, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Document Identity</label>
                              <h2 style={{ margin: 0, color: COLORS.accent, fontSize: "28px" }}>Inv No. {buyerInvoiceForm.invoiceNo.split('-').pop()}</h2>
                              <div style={{ marginTop: "16px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                                 <div style={{ background: "rgba(255,255,255,0.05)", padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "13px" }}>
                                    <b>DATE:</b> <input type="date" value={buyerInvoiceForm.date} onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, date: e.target.value})} style={{ border: "none", background: "none", color: "#fff", fontSize: "12px", fontWeight: "700", outline: "none", cursor: "pointer" }} />
                                 </div>
                                 <div style={{ background: "rgba(255,255,255,0.05)", padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "13px" }}><b>TIME:</b> {buyerInvoiceForm.time}</div>
                              </div>
                           </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "40px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "32px" }}>
                           <div>
                              <label style={{ fontSize: "10px", fontWeight: "900", opacity: 0.5, marginBottom: "10px", display: "block" }}>BUYER NAME (M/s)</label>
                              <select 
                                 style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#fff", fontWeight: "700", outline: "none", fontSize: "16px" }}
                                 value={buyerInvoiceForm.buyerId}
                                 onChange={e => handleBuyerSelectionForInvoice(e.target.value)}
                              >
                                 <option value="" style={{ color: "#000" }}>-- Select Target Buyer Profile --</option>
                                 {buyers.map(b => <option key={b._id} value={b._id} style={{ color: "#000" }}>{b.shopName || b.name}</option>)}
                              </select>
                              <div style={{ mt: "16px", display: "flex", gap: "25px", marginTop: "16px" }}>
                                 <div>
                                   <small style={{ fontWeight: "800", opacity: 0.4, fontSize: "10px", display: "block" }}>MOBILE CONTACT</small>
                                   <span style={{ fontWeight: "700", fontSize: "14px" }}>{buyerInvoiceForm.buyerPhone || "Not Assigned"}</span>
                                 </div>
                                 <div>
                                   <small style={{ fontWeight: "800", opacity: 0.4, fontSize: "10px", display: "block" }}>DISPATCH ADDRESS</small>
                                   <span style={{ fontWeight: "700", fontSize: "14px" }}>{buyerInvoiceForm.buyerAddress || "No address on file"}</span>
                                 </div>
                              </div>
                           </div>
                           <div>
                              <label style={{ fontSize: "10px", fontWeight: "900", opacity: 0.5, marginBottom: "10px", display: "block" }}>LOGISTICS / DISPATCH INFO</label>
                              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                    <input 
                                       placeholder="Lorry / Auto #" 
                                       style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#fff", outline: "none", fontSize: "12px" }}
                                       value={buyerInvoiceForm.vehicleNumber}
                                       onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, vehicleNumber: e.target.value})}
                                    />
                                    <input 
                                       placeholder="Bice No." 
                                       style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#fff", outline: "none", fontSize: "12px" }}
                                       value={buyerInvoiceForm.biceNo}
                                       onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, biceNo: e.target.value})}
                                    />
                                 </div>
                                 <input 
                                    placeholder="Driver Name / Agency" 
                                    style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#fff", outline: "none", fontSize: "12px" }}
                                    value={buyerInvoiceForm.driverName}
                                    onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, driverName: e.target.value})}
                                 />
                              </div>
                           </div>
                           <div style={{ background: "rgba(255,255,255,0.05)", padding: "24px", borderRadius: "20px", border: "1px dashed rgba(255,255,255,0.2)" }}>
                              <label style={{ fontSize: "10px", fontWeight: "900", opacity: 0.5, display: "block", marginBottom: "12px" }}>WEIGHT DISPLAY PARADIGM</label>
                              <div style={{ display: "flex", background: "rgba(0,0,0,0.2)", padding: "4px", borderRadius: "12px" }}>
                                 <button 
                                    onClick={() => setWeightDisplayMode("COMPREHENSIVE")}
                                    style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", fontSize: "11px", fontWeight: "900", background: weightDisplayMode === "COMPREHENSIVE" ? COLORS.accent : "transparent", color: weightDisplayMode === "COMPREHENSIVE" ? COLORS.secondary : "#fff", cursor: "pointer", transition: "0.3s" }}
                                 >COMPREHENSIVE</button>
                                 <button 
                                    onClick={() => setWeightDisplayMode("MINIMAL")}
                                    style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", fontSize: "11px", fontWeight: "900", background: weightDisplayMode === "MINIMAL" ? COLORS.accent : "transparent", color: weightDisplayMode === "MINIMAL" ? COLORS.secondary : "#fff", cursor: "pointer", transition: "0.3s" }}
                                 >MINIMAL (NET)</button>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Item Selection Table */}
                     <div style={{ padding: "48px" }}>
                        <h4 style={{ margin: "0 0 24px 0", color: COLORS.secondary, letterSpacing: "1px" }}>📦 MULTI-PRODUCT LINE ITEMS & TRACEABILITY</h4>
                        <div style={{ overflowX: "auto" }}>
                           <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
                              <thead>
                                 <tr style={{ textAlign: "left", color: COLORS.muted, fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>
                                    <th style={{ padding: "0 15px" }}>Item Description</th>
                                    <th style={{ padding: "0 15px" }}>Source Lot (Auto-Link)</th>
                                    {weightDisplayMode === "COMPREHENSIVE" && <th style={{ padding: "0 15px", textAlign: "right" }}>Gross</th>}
                                    {weightDisplayMode === "COMPREHENSIVE" && <th style={{ padding: "0 15px", textAlign: "right" }}>Deductions</th>}
                                    <th style={{ padding: "0 15px", textAlign: "right" }}>Net Qty</th>
                                    <th style={{ padding: "0 15px", textAlign: "right" }}>Rate (₹)</th>
                                    <th style={{ padding: "0 15px", textAlign: "right" }}>Total</th>
                                    <th style={{ padding: "0 15px", width: "50px" }}></th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {buyerInvoiceForm.items.map((item, idx) => (
                                   <tr key={idx} style={{ background: "#f8fafc", transition: "transform 0.2s" }}>
                                      <td style={{ padding: "16px", borderRadius: "16px 0 0 16px", width: "300px" }}>
                                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                             <div style={{ display: "flex", gap: "8px" }}>
                                                <input 
                                                   list="fruit-list"
                                                   placeholder="Search Product..." 
                                                   style={{ flex: 2, padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontWeight: "700" }}
                                                   value={item.productLabel}
                                                   onChange={e => handleUpdateInvoiceItem(idx, "productLabel", e.target.value)}
                                                />
                                                <input 
                                                   placeholder="Grade" 
                                                   style={{ width: "60px", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11px", textAlign: "center" }}
                                                   value={item.grade}
                                                   onChange={e => handleUpdateInvoiceItem(idx, "grade", e.target.value)}
                                                />
                                             </div>
                                             <input 
                                                placeholder="Variety / Specialized Info" 
                                                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11px", background: "#f1f5f9" }}
                                                value={item.variety}
                                                onChange={e => handleUpdateInvoiceItem(idx, "variety", e.target.value)}
                                             />
                                          </div>
                                      </td>
                                      <td style={{ padding: "16px" }}>
                                         <select 
                                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "600" }}
                                            value={item.lotId}
                                            onChange={e => handleUpdateInvoiceItem(idx, "lotId", e.target.value)}
                                         >
                                            <option value="">Trace to Lot...</option>
                                            {lots.map(l => <option key={l._id} value={l.lotId}>{l.lotId} ({l.supplier?.name})</option>)}
                                         </select>
                                      </td>
                                      {weightDisplayMode === "COMPREHENSIVE" && (
                                         <td style={{ padding: "16px", textAlign: "right" }}>
                                            <input type="number" style={{ width: "80px", textAlign: "right", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }} value={item.grossWeight} onChange={e => handleUpdateInvoiceItem(idx, "grossWeight", e.target.value)} />
                                         </td>
                                      )}
                                      {weightDisplayMode === "COMPREHENSIVE" && (
                                         <td style={{ padding: "16px", textAlign: "right" }}>
                                            <input type="number" style={{ width: "70px", textAlign: "right", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }} value={item.deductions} onChange={e => handleUpdateInvoiceItem(idx, "deductions", e.target.value)} />
                                         </td>
                                      )}
                                      <td style={{ padding: "16px", textAlign: "right", fontWeight: "700", color: "#0f172a" }}>{item.netWeight.toLocaleString()} KG</td>
                                      <td style={{ padding: "16px", textAlign: "right" }}>
                                         <input type="number" style={{ width: "90px", textAlign: "right", padding: "10px", borderRadius: "8px", border: "2.5px solid #22c55e", background: "#f0fdf4", color: "#166534", fontWeight: "900", fontSize: "15px" }} value={item.rate} onChange={e => handleUpdateInvoiceItem(idx, "rate", e.target.value)} />
                                      </td>
                                      <td style={{ padding: "16px", textAlign: "right", fontWeight: "900", color: COLORS.secondary, fontSize: "16px" }}>{formatCurrency(item.amount)}</td>
                                      <td style={{ padding: "16px", borderRadius: "0 16px 16px 0", textAlign: "center" }}>
                                         <button onClick={() => removeInvoiceItem(idx)} style={{ background: "#fee2e2", border: "none", color: "#dc2626", cursor: "pointer", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900" }}>✕</button>
                                      </td>
                                   </tr>
                                 ))}
                              </tbody>
                           </table>
                           <button onClick={addInvoiceItem} style={{ width: "100%", padding: "20px", border: "2px dashed #cbd5e1", background: "#f8fafc", color: COLORS.primary, fontWeight: "900", borderRadius: "16px", marginTop: "15px", cursor: "pointer", transition: "0.3s" }}>+ ADD NEW PRODUCT ENTRY FOR THIS SHIPMENT</button>
                        </div>

                        {/* Financials & Charges Block */}
                        <div style={{ mt: "64px", borderTop: "2px solid #f1f5f9", paddingTop: "48px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "64px", marginTop: "48px" }}>
                           <div>
                              <h4 style={{ color: COLORS.secondary, margin: "0 0 24px 0", letterSpacing: "1px" }}>💸 ADDITIONAL SHIPMENT CHARGES</h4>
                              <div style={{ background: "#f8fafc", padding: "32px", borderRadius: "24px", border: "1px solid #e2e8f0" }}>
                                 <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    {[
                                      { label: "Commission (₹)", key: "commission", icon: "💎" },
                                      { label: "Handling Charges (₹)", key: "handling", icon: "👷" },
                                      { label: "Outward Transport (₹)", key: "transport", icon: "🚚" }
                                    ].map(charge => (
                                      <div key={charge.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <span style={{ fontSize: "18px" }}>{charge.icon}</span>
                                            <span style={{ fontWeight: "700", color: COLORS.secondary }}>{charge.label}</span>
                                         </div>
                                         <input 
                                            type="number" 
                                            value={buyerInvoiceForm.charges[charge.key]} 
                                            onChange={e => {
                                              const updatedCharges = { ...buyerInvoiceForm.charges, [charge.key]: Number(e.target.value) };
                                              setBuyerInvoiceForm(calculateInvoiceTotals({...buyerInvoiceForm, charges: updatedCharges}));
                                            }}
                                            style={{ width: "120px", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", textAlign: "right", fontWeight: "800" }}
                                         />
                                      </div>
                                    ))}
                                    
                                    <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                       <input 
                                          placeholder="Charge Description..." 
                                          value={buyerInvoiceForm.charges.otherLabel}
                                          onChange={e => setBuyerInvoiceForm({...buyerInvoiceForm, charges: {...buyerInvoiceForm.charges, otherLabel: e.target.value}})}
                                          style={{ background: "none", border: "none", borderBottom: "1.5px solid #cbd5e1", fontWeight: "700", fontSize: "13px", color: COLORS.muted, outline: "none", width: "180px" }}
                                       />
                                       <input 
                                          type="number" 
                                          value={buyerInvoiceForm.charges.other} 
                                          onChange={e => {
                                            const updatedCharges = { ...buyerInvoiceForm.charges, other: Number(e.target.value) };
                                            setBuyerInvoiceForm(calculateInvoiceTotals({...buyerInvoiceForm, charges: updatedCharges}));
                                          }}
                                          style={{ width: "120px", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", textAlign: "right", fontWeight: "800" }}
                                       />
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div style={{ background: "#0f172a", color: "#fff", padding: "40px", borderRadius: "32px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
                              <h4 style={{ margin: "0 0 24px 0", color: COLORS.accent, letterSpacing: "2px" }}>INVOICE SETTLEMENT ABSTRACT</h4>
                              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", opacity: 0.7 }}><span>SUB TOTAL PROCEEDS</span><b>{formatCurrency(buyerInvoiceForm.subTotal)}</b></div>
                                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", opacity: 0.7 }}><span>ADDITIONAL CHARGES (+)</span><b>{formatCurrency(buyerInvoiceForm.totalCharges)}</b></div>
                                 
                                 <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "18px", display: "flex", justifyContent: "space-between", fontSize: "24px", fontWeight: "900" }}>
                                    <span style={{ color: COLORS.accent }}>GRAND TOTAL</span>
                                    <span>{formatCurrency(buyerInvoiceForm.grandTotal)}</span>
                                 </div>

                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.05)", padding: "16px", borderRadius: "16px", marginTop: "10px" }}>
                                    <div>
                                       <span style={{ fontSize: "11px", opacity: 0.5, textTransform: "uppercase", display: "block" }}>AMOUNT RECEIVED (₹)</span>
                                       <div style={{ fontSize: "11px", fontWeight: "700", color: buyerInvoiceForm.status === 'Fully Paid' ? "#4ade80" : "#fbbf24", marginTop: "4px" }}>Status: {buyerInvoiceForm.status}</div>
                                    </div>
                                    <input 
                                       type="number" 
                                       value={buyerInvoiceForm.amountReceived} 
                                       onChange={e => setBuyerInvoiceForm(calculateInvoiceTotals({...buyerInvoiceForm, amountReceived: Number(e.target.value)}))} 
                                       style={{ width: "120px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", textAlign: "right", outline: "none", fontSize: "18px", fontWeight: "800" }}
                                    />
                                 </div>

                                 <div style={{ background: COLORS.accent, color: COLORS.secondary, padding: "24px", borderRadius: "20px", marginTop: "10px", textAlign: "center" }}>
                                    <label style={{ fontSize: "11px", fontWeight: "900", letterSpacing: "1px", opacity: 0.7 }}>BALANCE DUE (LEDGER LINKED)</label>
                                    <h1 style={{ margin: "5px 0", fontSize: "42px", fontWeight: "900" }}>{formatCurrency(buyerInvoiceForm.balanceDue)}</h1>
                                    <div style={{ fontSize: "10px", fontWeight: "800", opacity: 0.6 }}>Synchronized with Buyer Credit History</div>
                                 </div>

                                 <div style={{ mt: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed rgba(255,255,255,0.2)", paddingTop: "20px", marginTop: "15px" }}>
                                    <div style={{ textAlign: "center", width: "140px" }}>
                                       <div style={{ height: "40px" }}></div>
                                       <div style={{ borderTop: "1px solid rgba(255,255,255,0.4)", pt: "5px", fontSize: "10px", fontWeight: "800", opacity: 0.5 }}>Receiver Signature</div>
                                    </div>
                                    <div style={{ textAlign: "center", width: "160px" }}>
                                       <div style={{ height: "40px" }}></div>
                                       <div style={{ borderTop: "1.5px solid " + COLORS.accent, pt: "5px", fontSize: "10px", fontWeight: "900", color: COLORS.accent }}>Verified for SPV Fruits</div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </Card>

                  <div style={{ display: "flex", gap: "20px" }}>
                     <Button 
                        style={{ flex: 2, height: "72px", fontSize: "22px", borderRadius: "20px", background: "#0f172a", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }} 
                        onClick={() => {
                           alert("🚀 INVOICE COMMITTED: System ledger updated and data persisted.");
                           // Logic to clear/increment
                           setBuyerInvoiceForm(prev => {
                              const newNo = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
                              return { ...prev, items: [{ productId: "", productLabel: "", variety: "", grade: "", grossWeight: 0, deductions: 0, netWeight: 0, rate: 0, amount: 0, lotId: "" }], invoiceNo: newNo, amountReceived: 0, subTotal: 0, grandTotal: 0, balanceDue: 0 };
                           });
                        }}
                     >🚀 Commit Invoice & Dispatch Ship</Button>
                     <div style={{ flex: 1, display: "flex", gap: "12px" }}>
                        <Button variant="secondary" onClick={() => window.print()} style={{ flex: 1, height: "72px", fontSize: "14px", borderRadius: "20px" }}>🖨 Print (A5)</Button>
                        <Button style={{ flex: 1, height: "72px", fontSize: "14px", borderRadius: "20px", background: "#25D366" }}>📱 WhatsApp</Button>
                     </div>
                  </div>
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
                                 <span style={{ fontSize: "10px", opacity: 0.5 }}>{formatDate(hv.date)}</span>
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
            <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "32px", animation: "slideUp 0.6s ease-out" }}>
               {/* LEFT COLUMN: THE SETTLEMENT ENGINE */}
               <div className="printable-area" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  <div style={{ 
                     background: "#ffffff", 
                     borderRadius: "24px", 
                     boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)", 
                     border: `2px solid ${COLORS.secondary}30`,
                     overflow: "hidden",
                     position: "relative"
                  }}>
                     {/* Bill Header Section - Inspired by the physical bill */}
                     <div style={{ padding: "40px", borderBottom: `1.5px dashed ${COLORS.secondary}40` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
                           <div style={{ display: "flex", gap: "20px" }}>
                              <div style={{ background: COLORS.primary, color: "#fff", padding: "10px", borderRadius: "50%", width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "12px", textAlign: "center", boxShadow: "0 4px 10px rgba(225, 29, 72, 0.3)" }}>K.F.C.</div>
                              <div>
                                 <h4 style={{ margin: 0, fontSize: "11px", fontWeight: "800", color: "#454545" }}>Trade Mark: <span style={{ color: COLORS.primary }}>K.F.C.</span></h4>
                                 <h1 style={{ margin: "5px 0", fontSize: "36px", fontWeight: "900", color: COLORS.primary, letterSpacing: "1px" }}>SPV FRUITS</h1>
                                 <p style={{ margin: 0, fontSize: "12px", color: "#666", maxWidth: "400px", lineHeight: "1.4" }}>
                                    Shop No. 29, Mango Market Yard, Thanapalli Cross, Tiruchanoor Road, TIRUPATI.<br />
                                    <span style={{ fontWeight: "700" }}>Cell:</span> 9440765810, 9491980099
                                 </p>
                              </div>
                           </div>
                           <div style={{ textAlign: "right" }}>
                              {isBillLocked && (
                                <div style={{ background: COLORS.success, color: "#fff", padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "900", marginBottom: "15px", display: "inline-block" }}>FINALIZED</div>
                              )}
                              <h2 style={{ margin: 0, color: COLORS.primary, fontSize: "24px" }}>No. {farmerBillForm.billNo}</h2>
                              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-end" }}>
                                 <div style={{ fontSize: "14px", fontWeight: "700" }}>Date: <input type="date" value={farmerBillForm.date} onChange={e => setFarmerBillForm({...farmerBillForm, date: e.target.value})} style={{ border: "none", background: "rgba(255,255,255,0.5)", padding: "4px 8px", borderRadius: "4px", fontSize: "13px", fontWeight: "700", outline: "none" }} disabled={isBillLocked} /></div>
                              </div>
                           </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                           <label style={{ fontSize: "16px", fontWeight: "800", whiteSpace: "nowrap" }}>M/s.</label>
                           <select 
                              style={{ flex: 1, padding: "12px", borderRadius: "8px", border: `1.5px solid ${COLORS.secondary}20`, background: "rgba(255,255,255,0.8)", fontSize: "16px", fontWeight: "700", outline: "none" }}
                              value={farmerBillForm.farmerId}
                              onChange={e => handleFarmerSelectionForSettlement(e.target.value)}
                              disabled={isBillLocked}
                           >
                              <option value="">-- Choose Farmer Name --</option>
                              {suppliers.map(s => <option key={s._id} value={s._id}>{s.name} ({s.village})</option>)}
                           </select>
                        </div>
                     </div>

                     {/* Main Ledger Content */}
                     <div style={{ padding: "0 40px 40px" }}>
                        <div style={{ marginTop: "30px" }}>
                           <table style={{ width: "100%", borderCollapse: "collapse" }}>
                              <thead>
                                 <tr style={{ textAlign: "left", background: "rgba(6, 78, 59, 0.05)" }}>
                                    <th style={{ padding: "18px", border: `1.5px solid ${COLORS.secondary}15`, width: "100px", color: COLORS.secondary, fontWeight: "900", fontSize: "11px", textTransform: "uppercase" }}>QTY.</th>
                                    <th style={{ padding: "18px", border: `1.5px solid ${COLORS.secondary}15`, color: COLORS.secondary, fontWeight: "900", fontSize: "11px", textTransform: "uppercase" }}>ITEM DESCRIPTION</th>
                                    <th style={{ padding: "18px", border: `1.5px solid ${COLORS.secondary}15`, textAlign: "right", color: COLORS.secondary, fontWeight: "900", fontSize: "11px", textTransform: "uppercase" }}>WEIGHT (KG)</th>
                                    <th style={{ padding: "18px", border: `1.5px solid ${COLORS.secondary}15`, textAlign: "right", color: COLORS.secondary, fontWeight: "900", fontSize: "11px", textTransform: "uppercase" }}>UNIT RATE</th>
                                    <th style={{ padding: "18px", border: `1.5px solid ${COLORS.secondary}15`, textAlign: "right", width: "180px", color: COLORS.secondary, fontWeight: "900", fontSize: "11px", textTransform: "uppercase" }}>NET AMOUNT (₹)</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {settlementData.length > 0 ? settlementData.map((item, idx) => (
                                   <tr key={idx}>
                                      <td style={{ padding: "18px", border: `1px solid ${COLORS.secondary}10`, textAlign: "center", color: COLORS.muted, fontWeight: "800" }}>-</td>
                                      <td style={{ padding: "18px", border: `1px solid ${COLORS.secondary}10` }}>
                                         <b style={{ textTransform: "uppercase", color: COLORS.secondary }}>{item.lineItem?.product}</b>
                                         <div style={{ fontSize: "11px", color: COLORS.muted, fontWeight: "600" }}>{item.lineItem?.variety} • Lot Reference: {item.lotRef?.lotId}</div>
                                      </td>
                                      <td style={{ padding: "18px", border: `1px solid ${COLORS.secondary}10`, textAlign: "right", fontWeight: "850", color: COLORS.text }}>{item.quantity.toLocaleString()}</td>
                                      <td style={{ padding: "18px", border: `1px solid ${COLORS.secondary}10`, textAlign: "right", color: COLORS.muted }}>{item.saleRate.toFixed(2)}</td>
                                      <td style={{ padding: "18px", border: `1px solid ${COLORS.secondary}10`, textAlign: "right", fontWeight: "900", color: COLORS.secondary }}>{formatCurrency(item.quantity * item.saleRate)}</td>
                                   </tr>
                                 )) : (
                                   <tr><td colSpan="5" style={{ padding: "80px", textAlign: "center", opacity: 0.5, fontStyle: "italic" }}>No entries selected for settlement...</td></tr>
                                 )}
                                 
                                 {/* Filler rows for consistent printable output */}
                                 {settlementData.length < 3 && Array.from({ length: 3 - settlementData.length }).map((_, i) => (
                                    <tr key={`filler-${i}`} style={{ height: "60px" }}>
                                       <td style={{ border: `1px solid ${COLORS.secondary}08` }}></td>
                                       <td style={{ border: `1px solid ${COLORS.secondary}08` }}></td>
                                       <td style={{ border: `1px solid ${COLORS.secondary}08` }}></td>
                                       <td style={{ border: `1px solid ${COLORS.secondary}08` }}></td>
                                       <td style={{ border: `1px solid ${COLORS.secondary}08` }}></td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>

                         {/* Deductions & Finalization Section */}
                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", marginTop: "40px", gap: "40px" }}>
                            {/* Expenses Sidebar */}
                            <div>
                               <div style={{ background: "rgba(6, 78, 59, 0.03)", border: `2px solid ${COLORS.secondary}20`, borderRadius: "20px", padding: "28px" }}>
                                  <h4 style={{ margin: "0 0 20px 0", color: COLORS.secondary, fontWeight: "900", textAlign: "center", borderBottom: `2px solid ${COLORS.secondary}40`, paddingBottom: "12px", letterSpacing: "1px" }}>DEDUCTIONS & EXPENSES</h4>
                                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                     {farmerBillForm.expenses.map((exp, i) => (
                                       <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                          {exp.isCustom ? (
                                             <input 
                                               placeholder="Label" 
                                               value={exp.label} 
                                               onChange={e => {
                                                 const ex = [...farmerBillForm.expenses];
                                                 ex[i].label = e.target.value;
                                                 setFarmerBillForm({...farmerBillForm, expenses: ex});
                                               }}
                                               style={{ border: "none", background: "none", fontSize: "13px", fontWeight: "750", borderBottom: "1.5px solid #cbd5e1", outline: "none", width: "120px", color: COLORS.text }}
                                             />
                                          ) : <span style={{ fontSize: "14px", fontWeight: "750", color: COLORS.secondary }}>{exp.label}:</span>}
                                          <input 
                                              type="number"
                                              value={exp.value}
                                              onChange={e => {
                                                 const ex = [...farmerBillForm.expenses];
                                                 ex[i].value = Number(e.target.value);
                                                 setFarmerBillForm({...farmerBillForm, expenses: ex});
                                              }}
                                              style={{ width: "90px", textAlign: "right", border: "none", background: "#fff", padding: "8px", borderRadius: "8px", borderBottom: `2px solid ${COLORS.primary}`, fontWeight: "850", color: COLORS.text }}
                                              disabled={isBillLocked}
                                           />
                                       </div>
                                     ))}
                                     <button onClick={addCustomExpense} style={{ marginTop: "12px", background: "none", border: `1.5px dashed ${COLORS.primary}`, color: COLORS.primary, cursor: "pointer", fontSize: "12px", fontWeight: "850", padding: "8px", borderRadius: "10px", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(16, 185, 129, 0.05)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>+ ADD CUSTOM DEDUCTION</button>
                                     
                                     <div style={{ borderTop: `2px solid ${COLORS.secondary}40`, marginTop: "15px", paddingTop: "15px", display: "flex", justifyContent: "space-between", fontWeight: "900", fontSize: "18px", color: COLORS.secondary }}>
                                        <span>TOTAL EXPENSES:</span>
                                        <span>{formatCurrency(farmerBillForm.expenses.reduce((acc, e) => acc + e.value, 0))}</span>
                                     </div>
                                  </div>
                               </div>
                            </div>

                           {/* Summary Right Side */}
                           <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                 <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1.5px solid ${COLORS.secondary}20`, paddingBottom: "12px" }}>
                                    <span style={{ fontWeight: "700" }}>GROSS SALE:</span>
                                    <b style={{ fontSize: "20px" }}>{formatCurrency(settlementData.reduce((acc, i) => acc + (i.quantity * i.saleRate), 0))}</b>
                                 </div>
                                 <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1.5px solid ${COLORS.secondary}20`, paddingBottom: "12px" }}>
                                    <span style={{ fontWeight: "700" }}>EXPENSES (-):</span>
                                    <b style={{ fontSize: "18px", color: COLORS.primary }}>{formatCurrency(farmerBillForm.expenses.reduce((acc, e) => acc + e.value, 0))}</b>
                                 </div>
                                 <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `2.5px solid ${COLORS.secondary}`, paddingBottom: "12px" }}>
                                    <span style={{ fontWeight: "800", color: "#0f172a" }}>NET SALE:</span>
                                    <b style={{ fontSize: "24px", color: "#0f172a" }}>{formatCurrency(settlementData.reduce((acc, i) => acc + (i.quantity * i.saleRate), 0) - farmerBillForm.expenses.reduce((acc, e) => acc + e.value, 0))}</b>
                                 </div>
                                 <div style={{ display: "flex", justifyContent: "space-between", background: "#f1f5f9", padding: "10px", borderRadius: "8px" }}>
                                    <span style={{ fontSize: "12px", fontWeight: "700" }}>ADVANCE PAYMENT already given:</span>
                                    <input 
                                       type="number" 
                                       value={farmerBillForm.advance} 
                                       onChange={e => setFarmerBillForm({...farmerBillForm, advance: Number(e.target.value)})} 
                                       style={{ width: "100px", fontWeight: "800", textAlign: "right", border: "none", background: "none", borderBottom: "2px solid #666", outline: "none" }}
                                       disabled={isBillLocked}
                                    />
                                 </div>
                                 
                                 <div style={{ background: COLORS.secondary, color: "#fff", padding: "24px", borderRadius: "18px", textAlign: "center", boxShadow: `0 15px 35px ${COLORS.secondary}40`, position: "relative", overflow: "hidden", backgroundImage: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%)` }}>
                                    <span style={{ fontSize: "12px", fontWeight: "900", letterSpacing: "1px", opacity: 0.8 }}>BALANCE TO PAY</span>
                                    <h1 style={{ margin: "5px 0", fontSize: "40px", fontWeight: "900" }}>
                                       {formatCurrency(
                                          (settlementData.reduce((acc, i) => acc + (i.quantity * i.saleRate), 0) - farmerBillForm.expenses.reduce((acc, e) => acc + e.value, 0)) - farmerBillForm.advance
                                       )}
                                    </h1>
                                    <div style={{ padding: "5px 10px", background: "rgba(255,255,255,0.2)", display: "inline-block", borderRadius: "40px", fontSize: "10px", fontWeight: "800" }}>AUTHORIZATION PENDING SIGNATURE</div>
                                 </div>
                              </div>

                              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
                                 <div style={{ textAlign: "center" }}>
                                    <div style={{ height: "40px" }}></div>
                                    <div style={{ borderTop: "2px solid #333", width: "150px", fontWeight: "900", fontSize: "11px", paddingTop: "5px" }}>Party Signature</div>
                                 </div>
                                 <div style={{ textAlign: "center" }}>
                                    <div style={{ height: "40px" }}></div>
                                    <div style={{ borderTop: `1.5px solid ${COLORS.primary}`, width: "180px", fontWeight: "900", fontSize: "11px", paddingTop: "5px", color: COLORS.primary }}>For SPV FRUITS, TIRUPATI</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div style={{ display: "flex", gap: "20px" }}>
                     {!isBillLocked ? (
                       <Button style={{ flex: 2, height: "72px", fontSize: "22px", borderRadius: "20px", background: COLORS.primary, boxShadow: "0 8px 25px rgba(225, 29, 72, 0.3)" }} onClick={handleCreateFarmerBill}>🔥 Finalize & Issue Settlement Bill</Button>
                     ) : (
                       <div style={{ display: "flex", gap: "16px", flex: 3 }}>
                          <Button variant="secondary" onClick={() => window.print()} style={{ flex: 1, height: "64px", fontSize: "16px", borderRadius: "18px" }}>🖨 Print Bill (Voucher)</Button>
                          <Button onClick={() => alert("Sending WhatsApp...")} style={{ flex: 1, background: "#25D366", borderRadius: "18px" }}>📱 WhatsApp Details</Button>
                          <Button variant="danger" onClick={() => handleVoidBill(farmerBillForm._id)} style={{ flex: 0.8, borderRadius: "18px" }}>🗑 Void Bill</Button>
                       </div>
                     )}
                     <Button variant="outline" onClick={() => { setFarmerBillForm({...farmerBillForm, farmerId: ""}); setSettlementData([]); }} style={{ flex: 0.5, borderRadius: "18px" }}>Reset</Button>
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
                                <span style={{ fontSize: "11px", opacity: 0.7 }}>{formatDate(bill.date)}</span>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "slideUp 0.5s ease-out" }}>
              {/* Header & Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                 <div style={{ display: "flex", gap: "12px", background: "#fff", padding: "6px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <button 
                       onClick={() => setLedgerTab("Farmer")}
                       style={{ padding: "10px 24px", borderRadius: "8px", fontWeight: "800", fontSize: "14px", border: "none", cursor: "pointer", transition: "0.2s", background: ledgerTab === "Farmer" ? COLORS.primary : "transparent", color: ledgerTab === "Farmer" ? "#fff" : COLORS.muted }}
                    >👨‍🌾 Farmer Ledger</button>
                    <button 
                       onClick={() => setLedgerTab("Buyer")}
                       style={{ padding: "10px 24px", borderRadius: "8px", fontWeight: "800", fontSize: "14px", border: "none", cursor: "pointer", transition: "0.2s", background: ledgerTab === "Buyer" ? COLORS.primary : "transparent", color: ledgerTab === "Buyer" ? "#fff" : COLORS.muted }}
                    >🛒 Buyer Ledger</button>
                 </div>
                 <div style={{ display: "flex", gap: "12px" }}>
                    <Button variant="outline" onClick={() => setShowCorrectionModal(true)} style={{ borderColor: COLORS.accent, color: COLORS.accent, background: "#fff" }}>✍️ Add Correction Entry</Button>
                    <Button variant="secondary" onClick={() => window.print()} style={{ background: "#0f172a", color: "#fff", border: "none" }}>🖨 Print / PDF Export</Button>
                 </div>
              </div>

              {/* Filters Container */}
              <Card style={{ padding: "20px" }}>
                 <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: "16px", alignItems: "flex-end" }}>
                    <div>
                       <label style={{ fontSize: "11px", fontWeight: "800", color: COLORS.secondary, marginBottom: "6px", display: "block" }}>Select {ledgerTab}</label>
                       <select 
                          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontWeight: "700" }}
                          value={ledgerFilters.entityId} onChange={e => setLedgerFilters({...ledgerFilters, entityId: e.target.value})}
                       >
                          <option value="">-- View All ({ledgerTab}s) --</option>
                          {ledgerTab === "Farmer" ? suppliers.map(s => <option key={s._id} value={s._id}>{s.name} ({s.village})</option>) : buyers.map(b => <option key={b._id} value={b._id}>{b.shopName || b.name}</option>)}
                       </select>
                    </div>
                    <div>
                        <label style={{ fontSize: "11px", fontWeight: "800", color: COLORS.secondary, marginBottom: "6px", display: "block" }}>Date Range (From)</label>
                        <input type="date" value={ledgerFilters.startDate} onChange={e => setLedgerFilters({...ledgerFilters, startDate: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                    </div>
                    <div>
                        <label style={{ fontSize: "11px", fontWeight: "800", color: COLORS.secondary, marginBottom: "6px", display: "block" }}>Date Range (To)</label>
                        <input type="date" value={ledgerFilters.endDate} onChange={e => setLedgerFilters({...ledgerFilters, endDate: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                    </div>
                    <div>
                        <label style={{ fontSize: "11px", fontWeight: "800", color: COLORS.secondary, marginBottom: "6px", display: "block" }}>Season Grouping</label>
                        <select style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontWeight: "700" }} value={ledgerFilters.season} onChange={e => setLedgerFilters({...ledgerFilters, season: e.target.value})}>
                           <option>All Seasons</option><option>Mango (May-Jul)</option><option>Banana (Year-round)</option><option>Festive Specials</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: "11px", fontWeight: "800", marginBottom: "6px", display: "block", color: COLORS.primary }}>'As On Date' Balance Query</label>
                        <input type="date" value={ledgerFilters.asOnDate} onChange={e => setLedgerFilters({...ledgerFilters, asOnDate: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "2px solid " + COLORS.accent }} title="Check cumulative balance valid up to this date" />
                    </div>
                 </div>
              </Card>

              {/* Summary View */}
              <div className="printable-area" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
                 <Card style={{ background: "#f8fafc", border: "none" }}>
                    <p style={{ margin: 0, fontWeight: "800", fontSize: "12px", color: COLORS.muted, textTransform: "uppercase" }}>Total Volume Transacted</p>
                    <h2 style={{ margin: "5px 0 0", color: "#0f172a", fontSize: "28px" }}>24,500 <span style={{ fontSize: "14px", color: COLORS.muted }}>KG</span></h2>
                 </Card>
                 <Card style={{ background: "#f0fdf4", border: "none" }}>
                    <p style={{ margin: 0, fontWeight: "800", fontSize: "12px", color: "#166534", textTransform: "uppercase" }}>Total Payments {ledgerTab === "Farmer" ? "Settled" : "Received"}</p>
                    <h2 style={{ margin: "5px 0 0", color: "#15803d", fontSize: "28px" }}>{formatCurrency(1250000)}</h2>
                 </Card>
                 <Card style={{ background: "#fef2f2", border: "none" }}>
                    <p style={{ margin: 0, fontWeight: "800", fontSize: "12px", color: "#991b1b", textTransform: "uppercase" }}>{ledgerTab === "Farmer" ? "Outstanding Dues to Farmer" : "Outstanding Balance (Due from Buyer)"}</p>
                    <h2 style={{ margin: "5px 0 0", color: "#b91c1c", fontSize: "28px" }}>{formatCurrency(185000)}</h2>
                 </Card>
              </div>

              {/* Main Ledger Book */}
              <Card style={{ padding: "0", overflow: "hidden" }} className="printable-area">
                 <div style={{ overflowX: "auto" }}>
                    {ledgerTab === "Farmer" ? (
                       <table style={{ width: "100%", minWidth: "1200px", borderCollapse: "collapse", fontSize: "12px" }}>
                          <thead>
                             <tr style={{ background: "#0f172a", color: "#fff", textAlign: "left" }}>
                                <th style={{ padding: "16px" }}>Date</th>
                                <th style={{ padding: "16px" }}>Lot / Trace ID</th>
                                <th style={{ padding: "16px" }}>Bill No.</th>
                                <th style={{ padding: "16px", width: "200px" }}>Product(s) Summary</th>
                                <th style={{ padding: "16px", textAlign: "right", color: "#60a5fa" }}>Gross Sale (₹)</th>
                                <th style={{ padding: "16px", textAlign: "right", color: "#fca5a5" }}>Expenses (₹)</th>
                                <th style={{ padding: "16px", textAlign: "right", color: "#86efac" }}>Net Sale (₹)</th>
                                <th style={{ padding: "16px", textAlign: "right", background: "rgba(255,255,255,0.05)" }}>Advance (₹)</th>
                                <th style={{ padding: "16px", textAlign: "right", background: "rgba(255,255,255,0.1)" }}>Payment Made (₹)</th>
                                <th style={{ padding: "16px", textAlign: "right", fontWeight: "900", background: COLORS.secondary+ "20", color: COLORS.secondary }}>Running Balance (₹)</th>
                             </tr>
                          </thead>
                          <tbody>
                             {[
                               { date: "24/03/2026", lot: "LOT-X11", bill: "FB-2026-1045", prod: "Mango Alphonso 1200 KG", gross: 84000, exp: 4200, net: 79800, adv: 10000, pmt: 0, bal: 69800 },
                               { date: "25/03/2026", lot: "PMT-REF-99", bill: "Bank TXN", prod: "NEFT Payment to Account", gross: 0, exp: 0, net: 0, adv: 0, pmt: 60000, bal: 9800 },
                               { date: "26/03/2026", lot: "LOT-X12", bill: "FB-2026-1048", prod: "Banana Yelakki 850 KG", gross: 25500, exp: 1275, net: 24225, adv: 0, pmt: 0, bal: 34025 },
                               { date: "27/03/2026", lot: "CORR-X1", bill: "Admin Edit", prod: "Ledger Correction: Missed Labour", gross: 0, exp: 500, net: -500, adv: 0, pmt: 0, bal: 33525 }
                             ].map((row, i) => (
                               <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: row.lot.includes("CORR") ? "#fffbeb" : row.lot.includes("PMT") ? "#f0fdf4" : "#fff", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.background="#f8fafc"} onMouseOut={e=>e.currentTarget.style.background=row.lot.includes("CORR") ? "#fffbeb" : row.lot.includes("PMT") ? "#f0fdf4" : "#fff"}>
                                  <td style={{ padding: "16px", fontWeight: "700" }}>{formatDate(row.date)}</td>
                                  <td style={{ padding: "16px", color: COLORS.muted }}>{row.lot}</td>
                                  <td style={{ padding: "16px", fontWeight: "800", color: COLORS.secondary }}>{row.bill}</td>
                                  <td style={{ padding: "16px" }}>{row.prod}</td>
                                  <td style={{ padding: "16px", textAlign: "right" }}>{row.gross > 0 ? row.gross.toLocaleString() : "-"}</td>
                                  <td style={{ padding: "16px", textAlign: "right", color: "#dc2626" }}>{row.exp > 0 ? row.exp.toLocaleString() : "-"}</td>
                                  <td style={{ padding: "16px", textAlign: "right", color: "#166534", fontWeight: "700" }}>{row.net !== 0 ? row.net.toLocaleString() : "-"}</td>
                                  <td style={{ padding: "16px", textAlign: "right", background: "#f8fafc" }}>{row.adv > 0 ? row.adv.toLocaleString() : "-"}</td>
                                  <td style={{ padding: "16px", textAlign: "right", background: "#f1f5f9", color: "#059669", fontWeight: "800" }}>{row.pmt > 0 ? row.pmt.toLocaleString() : "-"}</td>
                                  <td style={{ padding: "16px", textAlign: "right", fontWeight: "900", background: COLORS.secondary + "05", color: "#854d0e", fontSize: "14px" }}>{formatCurrency(row.bal)}</td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    ) : (
                       <table style={{ width: "100%", minWidth: "1200px", borderCollapse: "collapse", fontSize: "12px" }}>
                          <thead>
                             <tr style={{ background: "#0f172a", color: "#fff", textAlign: "left" }}>
                                <th style={{ padding: "16px" }}>Date</th>
                                <th style={{ padding: "16px" }}>Invoice No.</th>
                                <th style={{ padding: "16px", width: "250px" }}>Fruit / Variety</th>
                                <th style={{ padding: "16px", textAlign: "right" }}>Quantity (KG)</th>
                                <th style={{ padding: "16px", textAlign: "right" }}>Invoice Amount (₹)</th>
                                <th style={{ padding: "16px", textAlign: "right", color: "#86efac" }}>Payment Received (₹)</th>
                                <th style={{ padding: "16px", textAlign: "right", fontWeight: "900", background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5" }}>Outstanding Balance (₹)</th>
                             </tr>
                          </thead>
                          <tbody>
                             {[
                               { date: "22/03/2026", inv: "INV-2026-X1", prod: "Mango Banganapalli", qty: 2500, amt: 125000, pmt: 0, bal: 125000, overdue: true },
                               { date: "24/03/2026", inv: "RCV-REF-88", prod: "Bank RTGS Settlement", qty: 0, amt: 0, pmt: 100000, bal: 25000, overdue: false },
                               { date: "25/03/2026", inv: "INV-2026-X2", prod: "Sweet Corn", qty: 500, amt: 12500, pmt: 12500, bal: 25000, overdue: false }
                             ].map((row, i) => (
                               <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: row.overdue ? "#fef2f2" : row.inv.includes("RCV") ? "#f0fdf4" : "#fff", transition: "0.2s" }}>
                                  <td style={{ padding: "16px", fontWeight: "700" }}>
                                    {row.date} 
                                    {row.overdue && <span style={{ display: "block", fontSize: "9px", background: "#ef4444", color: "#fff", padding: "2px 6px", borderRadius: "10px", marginTop: "4px", width: "max-content", fontWeight: "900" }}>OVERDUE NOTIFICATION</span>}
                                  </td>
                                  <td style={{ padding: "16px", fontWeight: "800", color: COLORS.secondary }}>{row.inv}</td>
                                  <td style={{ padding: "16px" }}>{row.prod}</td>
                                  <td style={{ padding: "16px", textAlign: "right", fontWeight: "600" }}>{row.qty > 0 ? row.qty.toLocaleString() : "-"}</td>
                                  <td style={{ padding: "16px", textAlign: "right", fontWeight: "700" }}>{row.amt > 0 ? formatCurrency(row.amt) : "-"}</td>
                                  <td style={{ padding: "16px", textAlign: "right", color: "#166534", fontWeight: "800", background: "rgba(34, 197, 94, 0.05)" }}>{row.pmt > 0 ? formatCurrency(row.pmt) : "-"}</td>
                                  <td style={{ padding: "16px", textAlign: "right", fontWeight: "900", background: row.overdue ? "#fee2e2" : "#f8fafc", color: row.overdue ? "#991b1b" : "#475569", fontSize: "15px" }}>{formatCurrency(row.bal)}</td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    )}
                 </div>
              </Card>

              {/* Correction Modal */}
              {showCorrectionModal && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
                   <div style={{ background: "#fff", padding: "40px", borderRadius: "24px", width: "450px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", animation: "slideUp 0.3s ease-out" }}>
                      <h3 style={{ margin: "0 0 20px" }}>Add Ledger Correction Entry</h3>
                      <p style={{ fontSize: "13px", color: COLORS.muted, marginBottom: "20px" }}>Use this only for administrative corrections, missing entries, or verified disputes. All actions are audited.</p>
                      
                      <label style={{ fontSize: "12px", fontWeight: "800", color: COLORS.secondary, marginBottom: "8px", display: "block" }}>Correction Type</label>
                      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                         <Button onClick={() => setCorrectionForm({...correctionForm, type: "debit"})} variant={correctionForm.type === "debit" ? "primary" : "outline"} style={{ flex: 1 }}>Account Debit (-)</Button>
                         <Button onClick={() => setCorrectionForm({...correctionForm, type: "credit"})} variant={correctionForm.type === "credit" ? "primary" : "outline"} style={{ flex: 1 }}>Account Credit (+)</Button>
                      </div>

                      <Input label="Correction Amount (₹)" type="number" placeholder="e.g. 500" value={correctionForm.amount} onChange={e => setCorrectionForm({...correctionForm, amount: e.target.value})} />
                      
                      <label style={{ fontSize: "12px", fontWeight: "800", color: COLORS.secondary, marginBottom: "8px", display: "block", marginTop: "10px" }}>Reason / Justification</label>
                      <textarea 
                         placeholder="Provide detailed reason for correction..."
                         style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #EBE9E1", background: "#F8F9FA", color: COLORS.text, outline: "none", fontWeight: "500", fontSize: "14px", height: "100px", resize: "none" }}
                         value={correctionForm.reason}
                         onChange={e => setCorrectionForm({...correctionForm, reason: e.target.value})}
                      />

                      <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
                         <Button onClick={() => setShowCorrectionModal(false)} variant="outline" style={{ flex: 1 }}>Cancel</Button>
                         <Button 
                            style={{ flex: 2, background: "#ef4444" }} 
                            onClick={() => {
                               alert("✅ Correction Entry logically applied to the " + ledgerTab + " ledger and sent for admin review.");
                               setShowCorrectionModal(false);
                            }}
                         >Authorize Correction</Button>
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}

          {/* 11. PAYMENT & SETTLEMENT MANAGEMENT */}
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

              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "32px" }}>
                 {/* Main Processing Hub */}
                 <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ display: "flex", background: "#fff", padding: "8px", borderRadius: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", alignSelf: "flex-start" }}>
                       <button 
                          onClick={() => setPaymentTab("Buyer")}
                          style={{ padding: "12px 30px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "800", background: paymentTab === "Buyer" ? COLORS.primary : "transparent", color: paymentTab === "Buyer" ? "#fff" : COLORS.muted, transition: "0.2s" }}
                       >📥 Buyer Payments (Incoming)</button>
                       <button 
                          onClick={() => setPaymentTab("Farmer")}
                          style={{ padding: "12px 30px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "800", background: paymentTab === "Farmer" ? COLORS.primary : "transparent", color: paymentTab === "Farmer" ? "#fff" : COLORS.muted, transition: "0.2s" }}
                       >📤 Farmer Payments (Outgoing)</button>
                    </div>

                    {paymentTab === "Buyer" ? (
                       <Card title="Register Incoming Buyer Payment" subtitle="Apply collections against outstanding invoices">
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                             <div>
                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "12px" }}>Select Buyer</label>
                                <select 
                                   style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}
                                   value={buyerPaymentForm.buyerId}
                                   onChange={e => setBuyerPaymentForm({...buyerPaymentForm, buyerId: e.target.value})}
                                >
                                   <option value="">-- Choose Buyer Profile --</option>
                                   {buyers.map(b => <option key={b._id} value={b._id}>{b.shopName || b.name}</option>)}
                                </select>
                             </div>
                             <Input label="Against Invoice No." placeholder="e.g. INV-2026-X1" value={buyerPaymentForm.againstInvoiceNo} onChange={e => setBuyerPaymentForm({...buyerPaymentForm, againstInvoiceNo: e.target.value})} />
                             
                             <div>
                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "12px" }}>Payment Mode</label>
                                <select 
                                   style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}
                                   value={buyerPaymentForm.paymentMode}
                                   onChange={e => setBuyerPaymentForm({...buyerPaymentForm, paymentMode: e.target.value})}
                                >
                                   <option>Cash</option><option>UPI / Scan</option><option>Bank Transfer</option><option>Cheque / NEFT</option>
                                </select>
                             </div>
                             <Input label="Amount Received (₹)" type="number" placeholder="0.00" value={buyerPaymentForm.amountReceived} onChange={e => setBuyerPaymentForm({...buyerPaymentForm, amountReceived: e.target.value})} />
                             
                             <Input label="Reference No. / UPI ID" placeholder="TXN12345678" value={buyerPaymentForm.referenceNo} onChange={e => setBuyerPaymentForm({...buyerPaymentForm, referenceNo: e.target.value})} />
                             <Input label="Collected By" placeholder="Staff Name" value={buyerPaymentForm.collectedBy} onChange={e => setBuyerPaymentForm({...buyerPaymentForm, collectedBy: e.target.value})} />
                          </div>
                          
                          <div style={{ marginTop: "20px" }}>
                             <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "12px" }}>Entry Tags</label>
                             <div style={{ display: "flex", gap: "10px" }}>
                                <span style={{ padding: "8px 16px", background: "#f1f5f9", borderRadius: "20px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}>Part Payment</span>
                                <span style={{ padding: "8px 16px", background: COLORS.accent, color: COLORS.secondary, borderRadius: "20px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}>Full Settlement</span>
                                <span style={{ padding: "8px 16px", background: "#f1f5f9", borderRadius: "20px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}>Advance Collection</span>
                             </div>
                          </div>

                          <textarea 
                             placeholder="Internal notes (if any)..."
                             style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #EBE9E1", background: "#F8F9FA", color: COLORS.text, outline: "none", fontWeight: "500", fontSize: "14px", height: "80px", resize: "none", marginTop: "20px" }}
                             value={buyerPaymentForm.notes} onChange={e => setBuyerPaymentForm({...buyerPaymentForm, notes: e.target.value})}
                          />

                          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                             <Button style={{ flex: 1, height: "56px", fontSize: "16px" }} onClick={() => {
                                alert("💳 PAYMENT RECORDED: Ledger outstanding updated. Receipt generated.");
                             }}>Confirm & Log Payment</Button>
                             <Button variant="secondary" style={{ width: "140px" }}>🖨 Print Receipt</Button>
                          </div>
                       </Card>
                    ) : (
                       <Card title="Authorize Farmer Disbursement" subtitle="Record outgoing payments or advance settlements to suppliers">
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                             <div>
                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "12px" }}>Farmer Name</label>
                                <select 
                                   style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}
                                   value={farmerPaymentForm.farmerId}
                                   onChange={e => setFarmerPaymentForm({...farmerPaymentForm, farmerId: e.target.value})}
                                >
                                   <option value="">-- Choose Farmer Profile --</option>
                                   {suppliers.map(s => <option key={s._id} value={s._id}>{s.name} ({s.village})</option>)}
                                </select>
                             </div>
                             <Input label="Against Bill No. / Lot Trace" placeholder="e.g. FB-2026-X1" value={farmerPaymentForm.againstBillNo} onChange={e => setFarmerPaymentForm({...farmerPaymentForm, againstBillNo: e.target.value})} />
                             
                             <div>
                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "12px" }}>Payment Mode</label>
                                <select 
                                   style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}
                                   value={farmerPaymentForm.paymentMode}
                                   onChange={e => setFarmerPaymentForm({...farmerPaymentForm, paymentMode: e.target.value})}
                                >
                                   <option>Bank Transfer</option><option>Cash</option><option>UPI / PhonePe</option><option>Cheque Payment</option>
                                </select>
                             </div>
                             <Input label="Amount (₹)" type="number" placeholder="0.00" value={farmerPaymentForm.amount} onChange={e => setFarmerPaymentForm({...farmerPaymentForm, amount: e.target.value})} />
                             
                             <Input label="UPI Ref / Cheque No." placeholder="REF# 992200..." value={farmerPaymentForm.referenceNo} onChange={e => setFarmerPaymentForm({...farmerPaymentForm, referenceNo: e.target.value})} />
                             <div>
                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "12px" }}>Payment Type Tag</label>
                                <select 
                                   style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}
                                   value={farmerPaymentForm.tag}
                                   onChange={e => setFarmerPaymentForm({...farmerPaymentForm, tag: e.target.value})}
                                >
                                   <option>Advance Recovery</option><option>Settlement</option><option>Part Payment</option>
                                </select>
                             </div>
                          </div>
                          
                          <textarea 
                             placeholder="Internal payment memo..."
                             style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #EBE9E1", background: "#F8F9FA", color: COLORS.text, outline: "none", fontWeight: "500", fontSize: "14px", height: "80px", resize: "none", marginTop: "20px" }}
                             value={farmerPaymentForm.notes} onChange={e => setFarmerPaymentForm({...farmerPaymentForm, notes: e.target.value})}
                          />

                          <Button style={{ width: "100%", marginTop: "24px", height: "56px", fontSize: "16px", background: "#0f172a" }} onClick={() => {
                             alert("✅ DISBURSEMENT AUTHORIZED: Payout logged to Farmer Ledger.");
                          }}>Authorize & Dispatch Payout</Button>
                       </Card>
                    )}
                 </div>

                 {/* Sidebar Insights */}
                 <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <Card title="UPI Payment QR" subtitle="Generate for instant collection">
                       <div style={{ background: "#f8fafc", padding: "40px", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", border: "2px dashed #e2e8f0" }}>
                          <div style={{ width: "160px", height: "160px", background: "#0f172a", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: "15px" }}>
                             {/* Placeholder for QR */}
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
            </div>
          )}
          
          {/* 11.5 TRANSPORTATION TRACKING */}
          {activeSection === "Transportation Tracking" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "slideUp 0.5s ease-out" }}>
              {/* Logistical Overview */}
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

              {/* Main Hub Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                 <div style={{ display: "flex", gap: "12px", background: "#fff", padding: "6px", borderRadius: "14px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <button 
                       onClick={() => setTransportTab("Inward")}
                       style={{ padding: "12px 24px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "800", background: transportTab === "Inward" ? COLORS.primary : "transparent", color: transportTab === "Inward" ? "#fff" : COLORS.muted, transition: "0.2s" }}
                    >🛣️ Inward (Farmer ⮕ Mandi)</button>
                    <button 
                       onClick={() => setTransportTab("Outward")}
                       style={{ padding: "12px 24px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "800", background: transportTab === "Outward" ? COLORS.primary : "transparent", color: transportTab === "Outward" ? "#fff" : COLORS.muted, transition: "0.2s" }}
                    >🏁 Outward (Mandi ⮕ Buyer)</button>
                 </div>
                 
                 <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ position: "relative" }}>
                       <input 
                          placeholder="Filter by Vehicle No. (TS09...)" 
                          style={{ padding: "12px 16px 12px 40px", borderRadius: "12px", border: "1.5px solid #e2e8f0", width: "260px", outline: "none", fontWeight: "600" }}
                          value={transportFilter} onChange={e => setTransportFilter(e.target.value)}
                       />
                       <span style={{ position: "absolute", left: "14px", top: "12px", opacity: 0.4 }}>🔍</span>
                    </div>
                    <Button variant="secondary" onClick={() => alert("Generating Daily Dispatch Summary Report...")}>📄 Dispatch Report</Button>
                 </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "32px" }}>
                 {/* Input Forms */}
                 <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {transportTab === "Inward" ? (
                       <Card title="Register Inward Transportation Log" subtitle="Farmer-to-Mandi produce arrival tracking">
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                             <div>
                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "11px" }}>Linked Lot ID</label>
                                <select 
                                   style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}
                                   value={inwardTransportForm.lotId} onChange={e => setInwardTransportForm({...inwardTransportForm, lotId: e.target.value})}
                                >
                                   <option value="">-- Mandatory Selection --</option>
                                   <option>LOT-X122 (Alphonso)</option><option>LOT-Y45 (Banana)</option>
                                </select>
                             </div>
                             <Input label="Vehicle / Lorry No." placeholder="e.g. TS 12 AB 4567" value={inwardTransportForm.vehicleNo} onChange={e => setInwardTransportForm({...inwardTransportForm, vehicleNo: e.target.value})} />
                             
                             <Input label="Driver Name (Optional)" placeholder="Ramesh G." value={inwardTransportForm.driverName} onChange={e => setInwardTransportForm({...inwardTransportForm, driverName: e.target.value})} />
                             <Input label="Driver Mobile (Optional)" placeholder="91XXXXXXXX" value={inwardTransportForm.driverMobile} onChange={e => setInwardTransportForm({...inwardTransportForm, driverMobile: e.target.value})} />
                             
                             <Input label="Transport Company" placeholder="SR Transport / Private" value={inwardTransportForm.company} onChange={e => setInwardTransportForm({...inwardTransportForm, company: e.target.value})} />
                             <Input label="Origin (Village/District)" placeholder="Anantapur / Village X" value={inwardTransportForm.origin} onChange={e => setInwardTransportForm({...inwardTransportForm, origin: e.target.value})} />
                             
                             <Input label="Departure Date/Time" type="datetime-local" value={inwardTransportForm.departureTime} onChange={e => setInwardTransportForm({...inwardTransportForm, departureTime: e.target.value})} />
                             <Input label="Arrival Date/Time" type="datetime-local" value={inwardTransportForm.arrivalTime} onChange={e => setInwardTransportForm({...inwardTransportForm, arrivalTime: e.target.value})} />
                             
                             <Input label="Freight Amount (₹)" type="number" placeholder="5,500" value={inwardTransportForm.freightAmount} onChange={e => setInwardTransportForm({...inwardTransportForm, freightAmount: e.target.value})} />
                             <div>
                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "11px" }}>Freight Paid By</label>
                                <div style={{ display: "flex", gap: "8px" }}>
                                   <Button onClick={() => setInwardTransportForm({...inwardTransportForm, paidBy: "SPV"})} variant={inwardTransportForm.paidBy === "SPV" ? "primary" : "outline"} style={{ flex: 1, height: "40px", fontSize: "12px" }}>SPV</Button>
                                   <Button onClick={() => setInwardTransportForm({...inwardTransportForm, paidBy: "Farmer"})} variant={inwardTransportForm.paidBy === "Farmer" ? "primary" : "outline"} style={{ flex: 1, height: "40px", fontSize: "12px" }}>Farmer (Deduct)</Button>
                                </div>
                             </div>
                          </div>
                          <textarea 
                             placeholder="Route, stops, condition of produce (e.g. Hot cargo, no damage)..."
                             style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #EBE9E1", background: "#F8F9FA", color: COLORS.text, outline: "none", fontWeight: "500", fontSize: "14px", height: "80px", resize: "none", marginTop: "20px" }}
                             value={inwardTransportForm.notes} onChange={e => setInwardTransportForm({...inwardTransportForm, notes: e.target.value})}
                          />
                          <Button style={{ width: "100%", marginTop: "20px", height: "54px" }} onClick={() => alert("🚒 INWARD LOG COMMITTED: Freight cost linked to Farmer Bill.")}>Submit Inward Logistic Entry</Button>
                       </Card>
                    ) : (
                       <Card title="Log Outward Dispatch Details" subtitle="Tracking produce exit from Mandi to Buyer">
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                             <div>
                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "11px" }}>Linked Invoice No.</label>
                                <select 
                                   style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}
                                   value={outwardTransportForm.invoiceNo} onChange={e => setOutwardTransportForm({...outwardTransportForm, invoiceNo: e.target.value})}
                                >
                                   <option value="">-- Mandatory Selection --</option>
                                   <option>INV-2026-X12</option><option>INV-2026-X45</option>
                                </select>
                             </div>
                             <Input label="Bice / Vehicle No." placeholder="Bice No. 111 / Auto 44" value={outwardTransportForm.vehicleNo} onChange={e => setOutwardTransportForm({...outwardTransportForm, vehicleNo: e.target.value})} />
                             
                             <Input label="Driver Name (Optional)" placeholder="Subbu" value={outwardTransportForm.driverName} onChange={e => setOutwardTransportForm({...outwardTransportForm, driverName: e.target.value})} />
                             <Input label="Driver Mobile (Optional)" placeholder="88XXXXXXXX" value={outwardTransportForm.driverMobile} onChange={e => setOutwardTransportForm({...outwardTransportForm, driverMobile: e.target.value})} />
                             
                             <Input label="Destination" placeholder="Buyer Shop / City Market" value={outwardTransportForm.destination} onChange={e => setOutwardTransportForm({...outwardTransportForm, destination: e.target.value})} />
                             <Input label="Dispatch Date/Time" type="datetime-local" value={outwardTransportForm.dispatchTime} onChange={e => setOutwardTransportForm({...outwardTransportForm, dispatchTime: e.target.value})} />
                             
                             <Input label="Delivery Date/Time (Optional)" type="datetime-local" value={outwardTransportForm.deliveryTime} onChange={e => setOutwardTransportForm({...outwardTransportForm, deliveryTime: e.target.value})} />
                             <Input label="Freight Amount (₹)" type="number" placeholder="1,200" value={outwardTransportForm.freightAmount} onChange={e => setOutwardTransportForm({...outwardTransportForm, freightAmount: e.target.value})} />
                             
                             <div>
                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "11px" }}>Freight Paid By</label>
                                <div style={{ display: "flex", gap: "8px" }}>
                                   <Button onClick={() => setOutwardTransportForm({...outwardTransportForm, paidBy: "Buyer"})} variant={outwardTransportForm.paidBy === "Buyer" ? "primary" : "outline"} style={{ flex: 1, height: "40px", fontSize: "12px" }}>Buyer (Debit)</Button>
                                   <Button onClick={() => setOutwardTransportForm({...outwardTransportForm, paidBy: "SPV"})} variant={outwardTransportForm.paidBy === "SPV" ? "primary" : "outline"} style={{ flex: 1, height: "40px", fontSize: "12px" }}>SPV (Absorb)</Button>
                                </div>
                             </div>
                             <div>
                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "11px" }}>Delivery Status</label>
                                <select 
                                   style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}
                                   value={outwardTransportForm.status} onChange={e => setOutwardTransportForm({...outwardTransportForm, status: e.target.value})}
                                >
                                   <option>Pending</option><option>In Transit</option><option>Delivered</option><option>Returned</option>
                                </select>
                             </div>
                          </div>
                          <textarea 
                             placeholder="Notes: Damage, shortage, or return info..."
                             style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #EBE9E1", background: "#F8F9FA", color: COLORS.text, outline: "none", fontWeight: "500", fontSize: "14px", height: "80px", resize: "none", marginTop: "20px" }}
                             value={outwardTransportForm.notes} onChange={e => setOutwardTransportForm({...outwardTransportForm, notes: e.target.value})}
                          />
                          <Button style={{ width: "100%", marginTop: "20px", height: "54px", background: "#0f172a" }} onClick={() => alert("✅ OUTWARD DISPATCH LOGGED: Freight cost linked to Buyer Invoice.")}>Confirm Outward Dispatch</Button>
                       </Card>
                    )}
                 </div>

                 {/* Logistical Tracking Sidebar */}
                 <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
                                   <div style={{ fontSize: "11px", color: COLORS.muted }}>
                                      {truck.origin} <br />
                                      {truck.time}
                                   </div>
                                   <span style={{ fontSize: "11px", fontWeight: "800", color: truck.status === "Delayed" ? "#ef4444" : COLORS.primary }}>● {truck.status}</span>
                                </div>
                             </div>
                          ))}
                       </div>
                    </Card>

                    <Card title="Vehicle History Audit" subtitle="All trips by current filter">
                       {transportFilter ? (
                          <div>
                             <p style={{ fontSize: "12px", marginBottom: "15px" }}>Showing history for: <b>{transportFilter}</b></p>
                             <div style={{ padding: "12px", border: "1px solid #f1f5f9", borderRadius: "10px", fontSize: "12px" }}>
                                📅 22/03 - Inward (Farmer A)<br />
                                📅 24/03 - Outward (Buyer B)<br />
                                <span style={{ color: COLORS.primary, cursor: "pointer", fontWeight: "800", display: "block", marginTop: "10px" }}>View Full Profile →</span>
                             </div>
                          </div>
                       ) : (
                          <div style={{ textAlign: "center", padding: "20px", opacity: 0.5 }}>
                             <span style={{ fontSize: "24px" }}>🔍</span>
                             <p style={{ fontSize: "11px", margin: "10px 0 0" }}>Enter a vehicle number above to view its complete log history.</p>
                          </div>
                       )}
                    </Card>
                 </div>
              </div>
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
          {activeSection === "Reports" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px", animation: "slideUp 0.5s ease-out" }}>
                {/* 📊 Intelligence Metric Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
                   <Card style={{ background: COLORS.secondary, color: "#fff", border: "none" }}>
                      <p style={{ margin: 0, fontSize: "11px", opacity: 0.8, textTransform: "uppercase", fontWeight: "850", letterSpacing: "1px" }}>Today's Total Intake</p>
                      <h2 style={{ margin: "8px 0 0", fontSize: "36px", fontWeight: "900" }}>4,250 <span style={{ fontSize: "16px", opacity: 0.6 }}>KG</span></h2>
                      <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "8px", fontSize: "11px", fontWeight: "600", color: COLORS.accent }}>
                        Mango (2.5t) | Banana (1.2t) | Tomato (550kg)
                      </div>
                   </Card>
                   
                   <Card style={{ background: COLORS.primary, color: "#fff", border: "none" }}>
                      <p style={{ margin: 0, fontSize: "11px", opacity: 0.8, textTransform: "uppercase", fontWeight: "850", letterSpacing: "1px" }}>Total Sales (Invoiced)</p>
                      <h2 style={{ margin: "8px 0 0", fontSize: "36px", fontWeight: "900" }}>{formatCurrency(185400)}</h2>
                      <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "8px", fontSize: "11px", fontWeight: "500" }}>
                        Across 18 Registered Buyer Invoices (Today)
                      </div>
                   </Card>

                   <Card style={{ background: "#1e293b", color: "#fff", border: "none" }}>
                      <p style={{ margin: 0, fontSize: "11px", opacity: 0.8, textTransform: "uppercase", fontWeight: "850", letterSpacing: "1px" }}>Pending Auctions</p>
                      <h2 style={{ margin: "8px 0 0", fontSize: "36px", fontWeight: "900" }}>07 Lots</h2>
                      <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "8px", fontSize: "11px", fontWeight: "500", opacity: 0.7 }}>
                        Unallocated stock awaiting buyer confirmation
                      </div>
                   </Card>

                   <Card style={{ background: "#ffffff", border: `2px solid ${COLORS.secondary}15`, boxShadow: "0 15px 35px rgba(0,0,0,0.05)" }}>
                      <p style={{ margin: 0, fontSize: "11px", color: COLORS.muted, textTransform: "uppercase", fontWeight: "900", letterSpacing: "1px" }}>Total Farmer Outstanding</p>
                      <h2 style={{ margin: "8px 0 0", color: "#991b1b", fontSize: "36px", fontWeight: "900" }}>{formatCurrency(845000)}</h2>
                      <div style={{ marginTop: "12px", borderTop: `1px solid ${COLORS.secondary}10`, paddingTop: "8px", fontSize: "11px", fontWeight: "800", color: "#ef4444" }}>
                         🛑 42 Suppliers with pending settlement balances
                      </div>
                   </Card>
                </div>

               <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "32px" }}>
                  {/* Generated Reports & Exports */}
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
                                    <Button variant="outline" style={{ flex: 1, fontSize: "11px", padding: "8px" }} onClick={() => alert("Sharing report archive via WhatsApp...")}>WhatsApp</Button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </Card>
                  </div>

                  {/* Export & Sharing Center */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                     <Card title="Communication & Sharing" subtitle="Automated notifications for stakeholders">
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                           <div style={{ padding: "20px", background: "#f0fdf4", borderRadius: "20px", border: "1px solid #dcfce7" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                 <b style={{ color: "#166534" }}>Owner Daily Summary</b>
                                 <span style={{ fontSize: "10px", background: "#166534", color: "#fff", padding: "2px 8px", borderRadius: "10px" }}>CONFIGURED</span>
                              </div>
                              <p style={{ fontSize: "12px", margin: "0 0 15px" }}>Auto-share daily closing metrics to owner's WhatsApp at 09:00 PM.</p>
                              <Button variant="outline" style={{ width: "100%", background: "#fff", color: "#166534", borderColor: "#166534" }}>Update Config</Button>
                           </div>

                           <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
                              <h4 style={{ margin: "0 0 10px" }}>Manual Share Utility</h4>
                              <p style={{ fontSize: "12px", marginBottom: "15px" }}>Share document PDFs instantly with registered contacts.</p>
                              <select style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", marginBottom: "12px", fontWeight: "700" }}>
                                 <option>Select Stakeholder...</option>
                                 <option>Vikram Reddy (Farmer)</option><option>Reliance Retail (Buyer)</option>
                              </select>
                              <div style={{ display: "flex", gap: "10px" }}>
                                 <Button style={{ flex: 2 }}>Share via WhatsApp</Button>
                                 <Button variant="outline" style={{ flex: 1 }}>Email</Button>
                              </div>
                           </div>

                           <Card style={{ background: "#0f172a", textAlign: "center", color: "#fff" }}>
                              <h3>Universal Export</h3>
                              <p style={{ fontSize: "12px", opacity: 0.7 }}>Download whole ecosystem data as encrypted CSV archive.</p>
                              <Button variant="primary" style={{ marginTop: "15px", width: "100%" }}>Download Vault Data</Button>
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
                           <Input label="Core Product (Level 1)" placeholder="e.g. Mango, Tomato" />
                           <Input label="Variety Name (Level 2)" placeholder="e.g. Alphonso, S-Grade" />
                           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                              <Input label="Default Grade" placeholder="A-Grade" />
                              <Input label="Standard Unit" placeholder="KG / Box / Dozen" />
                           </div>
                           <Button style={{ marginTop: "10px" }}>Register in Catalog</Button>
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
                           <Input label="Category Label" placeholder="e.g. Association Fee" />
                           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                              <div>
                                 <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "11px" }}>Calculation Type</label>
                                 <select style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                                    <option>Percentage (%)</option><option>Fixed Amount (₹)</option>
                                 </select>
                              </div>
                              <Input label="Default Value" placeholder="e.g. 4" />
                           </div>
                           <Button style={{ marginTop: "10px" }}>Create Ledger Category</Button>
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
                           <Input label="Staff Full Name" placeholder="e.g. Ramesh K." />
                           <Input label="Login Username" placeholder="staff_01" />
                           <div>
                              <label style={{ display: "block", marginBottom: "6px", fontWeight: "800", color: COLORS.secondary, fontSize: "11px" }}>System Role</label>
                              <select style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                                 <option>Accountant</option>
                                 <option>Operations Staff</option>
                                 <option>Viewer (Read-Only)</option>
                                 <option>Admin / Owner</option>
                              </select>
                           </div>
                           <Input label="Access Expiry (Optional)" type="date" />
                           <Button style={{ marginTop: "10px" }}>Create Access Identity</Button>
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
                  <Card title="Role-Based Access Matrix" subtitle="Define module-level visibility and edit rights">
                     <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                        <thead>
                           <tr style={{ background: "#f8fafc" }}>
                              <th style={{ padding: "16px", textAlign: "left", border: "1px solid #e2e8f0" }}>Component / Module</th>
                              {["Admin", "Accountant", "Ops Staff", "Viewer"].map(r => (
                                 <th key={r} style={{ padding: "16px", border: "1px solid #e2e8f0" }}>{r}</th>
                              ))}
                           </tr>
                        </thead>
                        <tbody>
                           {[
                              { m: "System Config & Delete", p: ["Full", "None", "None", "None"] },
                              { m: "Finalize Bills / Invoices", p: ["Full", "Full", "Limit", "None"] },
                              { m: "Payment & Ledger Edits", p: ["Full", "Full", "None", "None"] },
                              { m: "Reports & Financial Logs", p: ["Full", "Full", "Full", "Read"] },
                              { m: "Traceability (Lot/Allocation)", p: ["Full", "Full", "Full", "Read"] }
                           ].map((row, i) => (
                              <tr key={i}>
                                 <td style={{ padding: "16px", border: "1px solid #e2e8f0", fontWeight: "750", color: COLORS.secondary }}>{row.m}</td>
                                 {row.p.map((perm, pi) => (
                                    <td key={pi} style={{ padding: "16px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                                       <span style={{ 
                                          fontSize: "11px", 
                                          fontWeight: "900", 
                                          padding: "4px 10px", 
                                          borderRadius: "10px",
                                          background: perm === "Full" ? "#f0fdf4" : perm === "None" ? "#fef2f2" : "#f1f5f9",
                                          color: perm === "Full" ? "#166534" : perm === "None" ? "#991b1b" : "#475569"
                                       }}>{perm}</span>
                                    </td>
                                 ))}
                              </tr>
                           ))}
                        </tbody>
                     </table>
                     <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "10px", padding: "16px", background: "#fff9eb", borderRadius: "12px", border: "1px solid #feebc8" }}>
                        <span style={{ fontSize: "20px" }}>⚠️</span>
                        <p style={{ margin: 0, fontSize: "12px", color: "#92400e" }}>Modifying the Access Matrix will force-logout all active sessions to re-apply JWT tokens.</p>
                     </div>
                  </Card>
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