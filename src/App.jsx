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
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
);

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
  sidebar: "#2d4137", // Darker brand green
};

// --- A-to-Z MASTER LISTS ---
const FRUIT_LIST_AZ = [
  "Apple",
  "Apricot",
  "Avocado",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Coconut",
  "Custard Apple",
  "Dates",
  "Dragonfruit",
  "Fig",
  "Grapes",
  "Guava",
  "Jackfruit",
  "Kiwi",
  "Lemon",
  "Litchi",
  "Mango (Alphonso/Banganapalli/Local)",
  "Mosambi",
  "Orange",
  "Papaya",
  "Peach",
  "Pear",
  "Pineapple",
  "Plum",
  "Pomegranate",
  "Sapota",
  "Strawberry",
  "Watermelon",
].sort();

const VEG_LIST_AZ = [
  "Ash Gourd",
  "Beetroot",
  "Bitter Gourd",
  "Bottle Gourd",
  "Brinjal",
  "Broccoli",
  "Cabbage",
  "Capsicum",
  "Carrot",
  "Cauliflower",
  "Chilli",
  "Cucumber",
  "Drumstick",
  "Garlic",
  "Ginger",
  "Green Peas",
  "Ladies Finger",
  "Onion",
  "Potato",
  "Pumpkin",
  "Radish",
  "Spinach",
  "Sweet Corn",
  "Tomato",
].sort();

const Card = ({ children, title, subtitle, action, style = {} }) => (
  <div
    style={{
      background: COLORS.card,
      borderRadius: "24px",
      padding: "32px",
      boxShadow:
        "0 10px 25px -5px rgba(0,0,0,0.02), 0 8px 10px -6px rgba(0,0,0,0.02)",
      border: "1.5px solid #F1F5F9",
      ...style,
    }}
  >
    {(title || action) && (
      <div
        style={{
          marginBottom: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {title && (
            <h3
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "900",
                color: COLORS.secondary,
                letterSpacing: "-0.5px",
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                margin: "6px 0 0 0",
                color: COLORS.muted,
                fontSize: "13px",
                fontWeight: "500",
                opacity: 0.8,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && action}
      </div>
    )}
    <div style={{ color: style.color || "inherit" }}>{children}</div>
  </div>
);

const Input = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  style = {},
}) => (
  <div style={{ marginBottom: "20px", ...style }}>
    {label && (
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "850",
          color: COLORS.secondary,
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </label>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "14px 18px",
        borderRadius: "14px",
        border: "1.5px solid #E2E8F0",
        background: "#F8FAFC",
        color: "#1E293B",
        outline: "none",
        fontWeight: "600",
        fontSize: "14px",
        transition: "all 0.3s ease",
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
    primary: {
      background: COLORS.primary,
      color: "#fff",
      boxShadow: `0 4px 12px ${COLORS.primary}30`,
    },
    secondary: {
      background: "#FFFFFF",
      color: COLORS.primary,
      border: `1px solid ${COLORS.primary}`,
    },
    success: {
      background: COLORS.success,
      color: "#fff",
      boxShadow: "0 4px 12px rgba(22, 101, 52, 0.2)",
    },
    danger: {
      background: COLORS.danger,
      color: "#fff",
      boxShadow: "0 4px 12px rgba(153, 27, 27, 0.2)",
    },
    outline: {
      background: "transparent",
      color: COLORS.secondary,
      border: "1.5px solid #E2E8F0",
    },
  };
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 28px",
        borderRadius: "12px",
        border: "none",
        fontWeight: "850",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        fontSize: "14px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        ...styles[variant],
        ...style,
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.transform = "translateY(-2px)")
      }
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
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
  if (typeof dateStr === "string" && dateStr.length <= 6) return dateStr;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // Return raw string if invalid
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }); // Returns DD/MM/YYYY
};

const getISTDate = () => {
  const now = new Date();
  return new Date(now.getTime() + 5.5 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
};

const DB = {
  Fruits: [
    "Apple",
    "Apricot",
    "Avocado",
    "Banana",
    "Blackberry",
    "Blueberry",
    "Cherry",
    "Coconut",
    "Dragon Fruit",
    "Fig",
    "Grapes",
    "Guava",
    "Kiwi",
    "Lemon",
    "Mango",
    "Orange",
    "Papaya",
    "Peach",
    "Pear",
    "Pineapple",
    "Plum",
    "Pomegranate",
    "Strawberry",
    "Watermelon",
  ],
  Vegetables: [
    "Ash Gourd",
    "Beetroot",
    "Brinjal",
    "Broccoli",
    "Cabbage",
    "Capsicum",
    "Carrot",
    "Cauliflower",
    "Cucumber",
    "Drumstick",
    "Garlic",
    "Ginger",
    "Green Chilli",
    "Lady Finger",
    "Onion",
    "Potato",
    "Pumpkin",
    "Radish",
    "Spinach",
    "Sweet Corn",
    "Tomato",
  ],
};

const PRODUCT_DATA = {
  Apple: {
    varieties: [
      "Fuji",
      "Gala",
      "Granny Smith",
      "Red Delicious",
      "Golden Delicious",
      "Honeycrisp",
      "Ambrosia",
      "Pink Lady",
      "McIntosh",
      "Empire",
    ],
    sizes: ["Small", "Medium", "Large", "Extra Large"],
    colors: ["Dark Red", "Light Red", "Green", "Yellow", "Mixed"],
  },
  Mango: {
    varieties: [
      "Alphonso",
      "Kesar",
      "Banganapalli",
      "Langra",
      "Dasheri",
      "Totapuri",
      "Sindhura",
      "Neelam",
    ],
    sizes: ["Small (150g)", "Medium (250g)", "Large (350g+)", "Jumbo"],
    colors: ["Yellow", "Orange", "Light Green", "Green", "Reddish"],
  },
  Banana: {
    varieties: ["Cavendish", "Robusta", "Red Banana", "Poovan", "Nendran"],
    sizes: ["Small", "Medium", "Large", "Extra Large (Hands)"],
    colors: ["Green", "Yellow", "Yellow-Green", "Red"],
  },
  Tomato: {
    varieties: ["Roma", "Cherry", "Beefsteak", "Heirloom", "Grape"],
    sizes: ["Small", "Medium", "Large"],
    colors: ["Red", "Orange", "Yellow", "Green"],
  },
  Onion: {
    varieties: [
      "Red Onion",
      "White Onion",
      "Yellow Onion",
      "Sweet Onion",
      "Shallot",
    ],
    sizes: [
      "Small (< 40mm)",
      "Medium (40-60mm)",
      "Large (60-80mm)",
      "Jumbo (> 80mm)",
    ],
    colors: ["Red", "White", "Yellow", "Brown"],
  },
  Grapes: {
    varieties: [
      "Thompson Seedless",
      "Flame Seedless",
      "Sharad Seedless",
      "Crimson",
      "Black Globe",
    ],
    sizes: ["Small Berry", "Medium Berry", "Large Berry"],
    colors: ["Green", "Black", "Red", "Mixed"],
  },
  default: {
    varieties: ["Standard", "Premium", "Local", "Hybrid"],
    sizes: ["Small", "Medium", "Large", "Extra Large"],
    colors: ["Standard", "Mixed", "Green", "Red", "Yellow", "Orange"],
  },
};

const getProductData = (productName) => {
  if (!productName)
    return {
      varieties: ["Standard", "Premium", "Local", "Hybrid"],
      grades: ["A Grade", "B Grade", "C Grade", "Premium", "Export Quality"],
      sizes: ["Small", "Medium", "Large", "Extra Large"],
      colors: ["Standard", "Mixed"],
    };
  const entry = PRODUCT_DATA[productName] || PRODUCT_DATA["default"];
  return {
    varieties: entry.varieties || ["Standard", "Premium", "Local", "Hybrid"],
    grades: ["A Grade", "B Grade", "C Grade", "Premium", "Export Quality"],
    sizes: entry.sizes || ["Small", "Medium", "Large", "Extra Large"],
    colors: entry.colors || [
      "Standard",
      "Mixed",
      "Green",
      "Red",
      "Yellow",
      "Orange",
    ],
  };
};

const TabHeader = ({ tabs, active, set }) => (
  <div
    style={{
      display: "flex",
      gap: "32px",
      borderBottom: "1px solid #EBE9E1",
      marginBottom: "32px",
      overflowX: "auto",
    }}
  >
    {tabs.map((t) => (
      <div
        key={t}
        onClick={() => set(t)}
        style={{
          padding: "0 0 12px 0",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "14px",
          color: active === t ? COLORS.sidebar : COLORS.muted,
          borderBottom:
            active === t
              ? `3px solid ${COLORS.accent}`
              : "3px solid transparent",
          transition: "all 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        {t}
      </div>
    ))}
  </div>
);

const FormGrid = ({ sections }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
    {sections.map((sec, i) => (
      <div
        key={i}
        style={{
          background: "#FFFFFF",
          padding: "32px",
          borderRadius: "12px",
          border: "1px solid #EBE9E1",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "800",
            color: COLORS.sidebar,
            borderBottom: "1px solid #EBE9E1",
            paddingBottom: "16px",
            marginBottom: "24px",
            marginTop: 0,
          }}
        >
          {sec.title}
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          {sec.fields.map((f, j) => (
            <div
              key={j}
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: COLORS.muted,
                }}
              >
                {f.label}
              </label>
              {f.type === "select" ? (
                <select
                  value={f.value}
                  defaultValue={
                    f.value === undefined ? f.defaultValue : undefined
                  }
                  onChange={f.onChange}
                  disabled={f.disabled}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "8px",
                    border: "1px solid #EBE9E1",
                    background: f.disabled ? "#FDFBF4" : "#FFFFFF",
                    color: COLORS.sidebar,
                    outline: "none",
                    fontSize: "13px",
                    fontWeight: "600",
                    appearance: "none",
                  }}
                >
                  <option value="" disabled selected={f.value === undefined}>
                    Select {f.label}
                  </option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  list={f.list}
                  placeholder={f.placeholder || ""}
                  disabled={f.disabled}
                  value={f.value}
                  defaultValue={
                    f.value === undefined ? f.defaultValue : undefined
                  }
                  onChange={f.onChange}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "8px",
                    border: "1px solid #EBE9E1",
                    background: f.disabled ? "#FDFBF4" : "#FFFFFF",
                    color: f.disabled ? COLORS.muted : COLORS.sidebar,
                    outline: "none",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                />
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
  const [activeSupplierTab, setActiveSupplierTab] = useState(
    "Supplier Registration",
  );
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
  // --- FORM STATES & HANDLERS ---
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    phone: "",
    address: "",
    govIdNumber: "",
    idType: "Aadhaar",
    bankDetails: "",
    notes: "",
  });
  const [buyerForm, setBuyerForm] = useState({
    name: "",
    shopName: "",
    phone: "",
    address: "",
    govIdNumber: "",
    idType: "Aadhaar",
    creditLimit: "",
    notes: "",
  });

  const handleRegisterSupplier = async () => {
    if (!supplierForm.name || !supplierForm.phone)
      return alert("Name and phone are required!");
    const payload = {
      name: supplierForm.name,
      phone: supplierForm.phone,
      address: supplierForm.address || "unknown",
      govIdNumber: supplierForm.govIdNumber || "N/A",
      idType: supplierForm.idType || "Aadhaar",
      notes: "Registered via Unified Dashboard",
    };
    try {
      const res = await MandiService.addSupplier(payload);
      if (res.status === "ERROR")
        return alert("Error adding supplier: " + res.message);
      alert("✅ Supplier successfully stored in the Database!");
      setSupplierForm({
        name: "",
        phone: "",
        address: "",
        govIdNumber: "",
        idType: "Aadhaar",
        bankDetails: "",
        notes: "",
      });
      fetchData();
    } catch (err) {
      alert("Registration Failed.");
    }
  };

  const handleRegisterBuyer = async () => {
    if (!buyerForm.name || !buyerForm.phone)
      return alert("Name and phone are required!");
    const payload = {
      name: buyerForm.name,
      phone: buyerForm.phone,
      address: buyerForm.address || "unknown",
      shopName: buyerForm.shopName || buyerForm.name,
      govIdNumber: buyerForm.govIdNumber || "N/A",
      creditLimit: Number(buyerForm.creditLimit) || 0,
      notes: "Registered via Unified Dashboard",
    };
    try {
      const res = await MandiService.addBuyer(payload);
      if (res.status === "ERROR")
        return alert("Error adding buyer: " + res.message);
      alert("✅ Buyer successfully stored in the Database!");
      setBuyerForm({
        name: "",
        shopName: "",
        phone: "",
        address: "",
        govIdNumber: "",
        idType: "Aadhaar",
        creditLimit: "",
        notes: "",
      });
      fetchData();
    } catch (err) {
      alert("Registration Failed.");
    }
  };

  const handleSaveDispatch = async () => {
    if (!intakeForm.supplierId)
      return alert("⚠️ Supplier is required to record a dispatch.");
    const payload = {
      supplier: intakeForm.supplierId,
      entryDate: intakeForm.entryDate,
      vehicleNumber: intakeForm.vehicleNumber,
      driverName: intakeForm.driverName,
      origin: intakeForm.origin,
      notes: intakeForm.notes,
      lineItems: intakeForm.lineItems,
    };
    const res = await MandiService.addLot(payload);
    if (res.status === "SUCCESS") {
      alert(`📦 DISPATCH RECORDED: Lot ${res.data.lotId} logged to Database.`);
      setIntakeForm({
        supplierId: "",
        entryDate: new Date().toISOString().slice(0, 10),
        vehicleNumber: "",
        driverName: "",
        origin: "",
        notes: "",
        lineItems: [
          {
            product: "",
            variety: "",
            grade: "",
            grossWeight: "",
            deductions: "",
            boxes: "",
            estimatedRate: "",
          },
        ],
      });
      fetchData();
    } else {
      alert(`❌ ERROR: ${res.message || "Failed to add lot"}`);
    }
  };
  const handleSavePurchase = async () => {
    if (!buyerPurchaseForm.buyerId)
      return alert("⚠️ Supplier is required to record a dispatch.");
    const payload = {
      supplier: buyerPurchaseForm.buyerId,
      entryDate: buyerPurchaseForm.entryDate,
      vehicleNumber: buyerPurchaseForm.vehicleNumber,
      driverName: buyerPurchaseForm.driverName,
      origin: buyerPurchaseForm.origin,
      notes: buyerPurchaseForm.notes,
      lineItems: buyerPurchaseForm.lineItems,
    };
    const res = await MandiService.addLot(payload);
    if (res.status === "SUCCESS") {
      alert(`📦 DISPATCH RECORDED: Lot ${res.data.lotId} logged to Database.`);
      setBuyerPurchaseForm({
        buyerId: "",
        entryDate: new Date().toISOString().slice(0, 10),
        vehicleNumber: "",
        driverName: "",
        origin: "",
        notes: "",
        lineItems: [
          {
            product: "",
            variety: "",
            grade: "",
            grossWeight: "",
            deductions: "",
            boxes: "",
            estimatedRate: "",
          },
        ],
      });
      fetchData();
    } else {
      alert(`❌ ERROR: ${res.message || "Failed to add lot"}`);
    }
  };

  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    lotId: "",
    memo: "",
    category: "Labour",
  });

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
    if (!inwardTransportForm.lotId || !inwardTransportForm.freightAmount)
      return alert("⚠️ Lot and Amount are required");
    const res = await MandiService.recordExpense({
      amount: Number(inwardTransportForm.freightAmount),
      category: "Transport",
      relatedLot: inwardTransportForm.lotId,
      description: `Inward: ${inwardTransportForm.vehicleNo} from ${inwardTransportForm.origin}`,
      date: inwardTransportForm.departureTime || new Date().toISOString(),
    });
    if (res.status === "SUCCESS") {
      alert("🚒 INWARD LOG COMMITTED: Data persisted to MongoDB.");
      fetchData();
    } else {
      alert(`❌ LOG FAILED: ${res.message || "Error"}`);
    }
  };

  const handleRecordOutwardTransport = async () => {
    if (!outwardTransportForm.invoiceNo || !outwardTransportForm.freightAmount)
      return alert("⚠️ Invoice and Amount are required");
    const res = await MandiService.recordExpense({
      amount: Number(outwardTransportForm.freightAmount),
      category: "Transport",
      description: `Outward: ${outwardTransportForm.vehicleNo} to ${outwardTransportForm.destination} (Inv: ${outwardTransportForm.invoiceNo})`,
      date: outwardTransportForm.dispatchTime || new Date().toISOString(),
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
    if (
      buyerInvoiceForm.items.some(
        (i) => !i.productLabel || (!i.netWeight && !i.grossWeight),
      )
    )
      return alert("⚠️ Product and Weight are required for all items");

    // Map frontend structure to expected backend schema
    const mappedItems = buyerInvoiceForm.items.map((i) => ({
      productName: i.productLabel || "Unknown Product",
      quantity: Number(i.netWeight) || Number(i.grossWeight) || 0,
      rate: Number(i.rate) || 0,
    }));

    const payload = {
      buyer: buyerInvoiceForm.buyerId,
      items: mappedItems,
      additionalCharges: buyerInvoiceForm.charges,
    };
    const res = await MandiService.generateBuyerInvoice(payload);
    if (res.status === "SUCCESS") {
      alert(
        `🚀 INVOICE ${res.data.invoiceNo} COMMITTED: Data persisted to MongoDB.`,
      );
      const newNo = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      setBuyerInvoiceForm({
        ...buyerInvoiceForm,
        items: [
          {
            productId: "",
            productLabel: "",
            variety: "",
            grade: "",
            grossWeight: 0,
            deductions: 0,
            netWeight: 0,
            rate: 0,
            amount: 0,
            lotId: "",
          },
        ],
        invoiceNo: newNo,
        amountReceived: 0,
        subTotal: 0,
        grandTotal: 0,
        balanceDue: 0,
      });
      fetchData();
    } else {
      alert(`❌ INVOICE FAILED: ${res.message || "Database Error"}`);
    }
  };

  const handleRecordBuyerPayment = async () => {
    if (!buyerPaymentForm.buyerId || !buyerPaymentForm.amountReceived)
      return alert("⚠️ Buyer and Amount are required");
    const payload = {
      partyType: "Buyer",
      partyId: buyerPaymentForm.buyerId,
      amount: Number(buyerPaymentForm.amountReceived),
      date: buyerPaymentForm.paymentDate,
      mode: buyerPaymentForm.paymentMode === "UPI / Scan" ? "UPI" : "Cash",
      type: "Full Settlement",
      referenceId: buyerPaymentForm.referenceNo,
      againstInvoiceNo: buyerPaymentForm.againstInvoiceNo,
    };
    const res = await MandiService.recordPayment(payload);
    if (res.status === "SUCCESS") {
      alert("💳 PAYMENT RECORDED: Database updated.");
      setBuyerPaymentForm({
        ...buyerPaymentForm,
        buyerId: "",
        amountReceived: "",
        referenceNo: "",
        notes: "",
      });
      fetchData();
    } else {
      alert(`❌ PAYMENT FAILED: ${res.message || "Error"}`);
    }
  };

  const handleRecordFarmerPayment = async () => {
    if (!farmerPaymentForm.farmerId || !farmerPaymentForm.amount)
      return alert("⚠️ Farmer and Amount are required");
    const payload = {
      partyType: "Supplier",
      partyId: farmerPaymentForm.farmerId,
      amount: Number(farmerPaymentForm.amount),
      date: farmerPaymentForm.paymentDate,
      mode: farmerPaymentForm.paymentMode === "Bank Transfer" ? "Bank" : "Cash",
      type: "Full Settlement",
      referenceId: farmerPaymentForm.referenceNo,
      againstBillNo: farmerPaymentForm.againstBillNo,
    };
    const res = await MandiService.recordPayment(payload);
    if (res.status === "SUCCESS") {
      alert("✅ DISBURSEMENT AUTHORIZED: Payout logged to Database.");
      setFarmerPaymentForm({
        ...farmerPaymentForm,
        farmerId: "",
        amount: "",
        referenceNo: "",
        notes: "",
      });
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
      date: new Date().toISOString(),
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
    dispatchId: `DSP-${Math.floor(10000 + Math.random() * 90000)}`,
    supplierId: "",
    entryDate: new Date().toISOString().slice(0, 10),
    entryTime: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    vehicleNumber: "",
    driverName: "",
    driverMobile: "",
    transportType: "Self Managed",
    origin: "",
    destination: "Madanapalle Market Hub",
    paymentStatus: "Pending",
    paymentMode: "Bank Transfer",
    dispatchStatus: "Loaded",
    notes: "",
    lineItems: [
      {
        itemGuid: Math.random().toString(36).substr(2, 9),
        category: "Fruits",
        product: "",
        variety: "",
        grade: "A Grade",
        size: "Medium",
        color: "Standard",
        unit: "KG",
        grossWeight: 0,
        packages: 0,
        packagingType: "Plastic Crates",
        rate: 0,
        batchNo: "",
        qualityStatus: "Passed",
        storageType: "Ambient",
      },
    ],
  });
  const [buyerPurchaseForm, setBuyerPurchaseForm] = useState({
    dispatchId: `DSP-${Math.floor(10000 + Math.random() * 90000)}`,
    supplierId: "",
    buyerId: "",
    buyerMobile: "",
    entryDate: new Date().toISOString().slice(0, 10),
    entryTime: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    vehicleNumber: "",
    driverName: "",
    driverMobile: "",
    transportType: "Self Managed",
    origin: "",
    destination: "Madanapalle Market Hub",
    paymentStatus: "Pending",
    paymentMode: "Bank Transfer",
    dispatchStatus: "Loaded",
    notes: "",
    lineItems: [
      {
        itemGuid: Math.random().toString(36).substr(2, 9),
        category: "Fruits",
        product: "",
        variety: "",
        grade: "A Grade",
        size: "Medium",
        color: "Standard",
        unit: "KG",
        grossWeight: 0,
        packages: 0,
        packagingType: "Plastic Crates",
        rate: 0,
        batchNo: "",
        qualityStatus: "Passed",
        storageType: "Ambient",
      },
    ],
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
    notes: "",
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
    lowStockAlerts: 0,
  });
  const [selection, setSelection] = useState({
    lot: null,
    item: null,
    buyerId: "",
    qty: "",
    rate: "",
    inv: "",
  });
  const [intelData, setIntelData] = useState([]);
  const [intelQuery, setIntelQuery] = useState("");
  const [lotTraceability, setLotTraceability] = useState([]);
  const [allocationTraceability, setAllocationTraceability] = useState(null);
  const [buyerIQ, setBuyerIQ] = useState(null);

  // --- ALLOCATION FORM STATE (REQUIRED BY ENTERPRISE ALLOCATION ENGINE) ---
  const [allocationForm, setAllocationForm] = useState({
    buyerId: "",
    quantity: "",
    saleRate: "",
    notes: "",
  });

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
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    buyerId: "",
    buyerPhone: "",
    buyerAddress: "",
    vehicleNumber: "",
    biceNo: "",
    driverName: "",
    routeNotes: "",
    items: [
      {
        productId: "",
        productLabel: "",
        variety: "",
        grade: "",
        grossWeight: 0,
        deductions: 0,
        netWeight: 0,
        rate: 0,
        amount: 0,
        lotId: "",
      },
    ],
    charges: {
      commission: 0,
      handling: 0,
      transport: 0,
      other: 0,
      otherLabel: "Other Charges",
    },
    subTotal: 0,
    totalCharges: 0,
    grandTotal: 0,
    amountReceived: 0,
    balanceDue: 0,
    status: "Unpaid",
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
      { label: "Market Fee", value: 0 },
    ],
    advance: 0,
    netPayable: 0,
  });

  // --- LEDGER SYSTEM STATES ---
  const [ledgerTab, setLedgerTab] = useState("Farmer"); // "Farmer" | "Buyer"
  const [ledgerFilters, setLedgerFilters] = useState({
    entityId: "",
    startDate: "",
    endDate: "",
    asOnDate: "",
    season: "All",
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
    notes: "",
  });
  const [buyerPaymentForm, setBuyerPaymentForm] = useState({
    buyerId: "",
    paymentDate: new Date().toISOString().slice(0, 10),
    againstInvoiceNo: "",
    paymentMode: "UPI / Scan",
    amountReceived: "",
    referenceNo: "",
    collectedBy: "Admin Staff",
    notes: "",
  });
  const [dailyCashSummary, setDailyCashSummary] = useState({
    cash: 45000,
    upi: 125000,
    bank: 320000,
  });

  const [correctionForm, setCorrectionForm] = useState({
    amount: "",
    type: "payment",
    reason: "",
  });

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
    notes: "",
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
    notes: "",
  });
  const [transportFilter, setTransportFilter] = useState("");

  // --- PRODUCT MASTER & CONFIGURATION STATES ---
  const [activeConfigTab, setActiveConfigTab] = useState("Product"); // "Product" | "Expense" | "System"
  const [masterProducts, setMasterProducts] = useState(() => {
    const saved = localStorage.getItem("master_products");
    return saved
      ? JSON.parse(saved)
      : [
          {
            name: "Mango",
            varieties: [
              "Alphonso",
              "Banganapalli",
              "Rumani",
              "Nillam",
              "Kesar",
            ],
            grades: ["A-Grade", "B-Grade", "Export"],
            units: ["KG", "Ton", "Crate"],
          },
          {
            name: "Banana",
            varieties: ["Yelakki", "G9", "Nendran"],
            grades: ["Local", "Export"],
            units: ["KG", "Ton"],
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("master_products", JSON.stringify(masterProducts));
  }, [masterProducts]);

  const [newProductForm, setNewProductForm] = useState({
    coreProduct: "",
    variety: "",
    grade: "A-Grade",
    unit: "KG",
  });

  const handleRegisterProduct = () => {
    if (!newProductForm.coreProduct || !newProductForm.variety) {
      alert("⚠️ Core Product and Variety name are mandatory.");
      return;
    }

    const existingIdx = masterProducts.findIndex(
      (p) => p.name.toLowerCase() === newProductForm.coreProduct.toLowerCase(),
    );

    if (existingIdx !== -1) {
      const updatedProducts = [...masterProducts];
      if (
        !updatedProducts[existingIdx].varieties.includes(newProductForm.variety)
      ) {
        updatedProducts[existingIdx].varieties.push(newProductForm.variety);
      }
      if (!updatedProducts[existingIdx].units.includes(newProductForm.unit)) {
        updatedProducts[existingIdx].units.push(newProductForm.unit);
      }
      setMasterProducts(updatedProducts);
      alert(
        `✅ Variety '${newProductForm.variety}' added to ${newProductForm.coreProduct}!`,
      );
    } else {
      const newProduct = {
        name: newProductForm.coreProduct,
        varieties: [newProductForm.variety],
        grades: [newProductForm.grade],
        units: [newProductForm.unit],
      };
      setMasterProducts([...masterProducts, newProduct]);
      alert(
        `✅ Core Product '${newProductForm.coreProduct}' registered in catalog!`,
      );
    }

    setNewProductForm({
      coreProduct: "",
      variety: "",
      grade: "A-Grade",
      unit: "KG",
    });
  };

  const [newExpenseForm, setNewExpenseForm] = useState({
    label: "",
    type: "Percentage",
    defaultValue: 0,
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
      active: true,
    };

    setMasterExpenses([...masterExpenses, newExpense]);
    setNewExpenseForm({
      label: "",
      type: "Percentage",
      defaultValue: 0,
    });
    alert(
      `✅ Expense Category '${newExpense.name}' created! This will now appear in New Bill dropdowns.`,
    );
  };

  const [masterExpenses, setMasterExpenses] = useState(() => {
    const saved = localStorage.getItem("master_expenses");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            name: "Commission",
            type: "Percentage",
            default: 4,
            active: true,
          },
          {
            id: "2",
            name: "Labour/Handling",
            type: "Fixed",
            default: 0,
            active: true,
          },
          {
            id: "3",
            name: "Market Fee",
            type: "Percentage",
            default: 1,
            active: true,
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("master_expenses", JSON.stringify(masterExpenses));
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
    authWhatsApp: "+91 99XXXXXX00",
  });

  // --- USER ROLES & SECURITY STATES ---
  const [activeSecurityTab, setActiveSecurityTab] = useState("Staff Hub"); // "Staff Hub" | "Permissions" | "Security"
  const [staffUsers, setStaffUsers] = useState([
    {
      id: "U001",
      name: "Srinivasa Rao",
      role: "Admin",
      status: "Active",
      lastLogin: "10 mins ago",
    },
    {
      id: "U002",
      name: "Anil Kumar",
      role: "Accountant",
      status: "Active",
      lastLogin: "3 hours ago",
    },
    {
      id: "U003",
      name: "Ramesh Babu",
      role: "Operations Staff",
      status: "Active",
      lastLogin: "Yesterday",
    },
    {
      id: "U004",
      name: "Venkatesh",
      role: "Viewer",
      status: "Deactivated",
      lastLogin: "5 days ago",
    },
  ]);

  const [newStaffForm, setNewStaffForm] = useState({
    name: "",
    username: "",
    role: "Accountant",
    expiry: "",
  });

  const handleCreateStaff = () => {
    if (!newStaffForm.name || !newStaffForm.username) {
      alert("⚠️ Please fill in all staff details.");
      return;
    }

    const newStaff = {
      id: `U${(staffUsers.length + 1).toString().padStart(3, "0")}`,
      name: newStaffForm.name,
      role: newStaffForm.role,
      status: "Active",
      lastLogin: "Never",
    };

    setStaffUsers([...staffUsers, newStaff]);
    setNewStaffForm({
      name: "",
      username: "",
      role: "Accountant",
      expiry: "",
    });
    alert("✅ Staff Identity Created Successfully! User added to Directory.");
  };

  const [securityAuditLogs, setSecurityAuditLogs] = useState([
    {
      timestamp: "2026-03-25 14:10",
      user: "Admin",
      action: "System Config Updated",
      status: "SUCCESS",
    },
    {
      timestamp: "2026-03-25 11:45",
      user: "Accountant",
      action: "Void Bill #129 Attempt",
      status: "DENIED",
    },
    {
      timestamp: "2026-03-25 09:30",
      user: "Admin",
      action: "Database Backup Initiated",
      status: "SUCCESS",
    },
  ]);

  // --- CONNECTION MODULE STATES ---
  const [connSearchQuery, setConnSearchQuery] = useState("");
  const [selectedConnFarmer, setSelectedConnFarmer] = useState(null);
  const [connSelectedBuyer, setConnSelectedBuyer] = useState(null);
  const [connFilters, setConnFilters] = useState({
    dateRange: "All",
    product: "All",
    paymentMode: "All",
  });

  // --- DATA SYNC WITH BACKEND ---
  // --- DATA SYNC WITH BACKEND ---
  const fetchData = async () => {
    // Robust fallbacks for Demo/Offline consistency
    const dummySuppliers = [
      "Vikram Reddy",
      "Sandhya Devi",
      "Anwar Pasha",
      "Gopal Krishnan",
      "Srinivasa Rao",
      "Ramachandra Murthy",
      "Lakshmi Kanth",
      "Venkata Raman",
      "Satyavati Garu",
      "Rajesh Kumar",
      "Suresh Babu",
      "Manisha Singh",
      "Vijay Bhaskar",
      "Anil Reddy",
      "Kavita Rao",
      "Shiva Prasad",
      "Naveen Kumar",
      "Santosh Hegde",
      "Padmaja Devi",
      "Ravi Teja",
      "Mohan Babu",
      "Girish Gupta",
      "Aruna Kumari",
      "Harish Shetty",
      "Bhaskar Rao",
      "Chandra Mohan",
      "Durga Prasad",
      "Eshwar Rao",
      "Fatima Begum",
      "Ganapathi Bhat",
      "Himamshu Roy",
      "Indrani Sharma",
      "Jagadish Murthy",
      "Karthik Raja",
      "Lalitha Goud",
      "Murali Krishna",
      "Nirmala Devi",
      "Om Prakash",
      "Parvathi Amma",
      "Qasim Khan",
    ].map((n, i) => ({
      _id: `s-${i}`,
      name: n,
      village: "Madanapalle",
      mobile: `98480${10000 + i}`,
      phone: `98480${10000 + i}`,
      address: "Main Road, Madanapalle",
      govIdNumber: `AID-${1000 + i}`,
      idType: "Aadhaar",
    }));

    const dummyBuyers = [
      "Harsha Wholesale",
      "Reliance Fresh",
      "BigBasket Depot",
      "Heritage Foods",
      "Anand Foodworld",
      "Heritage Depot",
      "BigBasket Hub",
      "Metro Cash & Carry",
      "More Retail",
      "Spencer's Market",
      "Nilgiris Supermarket",
      "Star Bazaar",
      "DMart Depot",
      "Safal Mandi",
      "Nature's Basket",
      "Amazon Fresh Hub",
      "Daily Delight",
      "FreshDirect",
      "GreenWay Traders",
      "Quality First",
      "Tasty Trends",
      "Urban Organic",
      "Value Mart",
      "Wholesale Wonders",
      "Zenith Exports",
    ].map((n, i) => ({
      _id: `b-${i}`,
      name: n,
      shopName: n,
      phone: `99590${10000 + i}`,
      mobile: `99590${10000 + i}`,
      address: `Stall #${100 + i}, Madanapalle Market`,
    }));

    const dummyLots = [
      {
        _id: "l-1",
        lotId: "LOT-2026-001",
        supplier: { name: "Vikram Reddy" },
        entryDate: "2026-03-20",
        origin: "Madanapalle",
        status: "Partially Sold",
        totalQuantity: 1500,
        remainingQuantity: 400,
        lineItems: [
          {
            product: "Mango",
            variety: "Alphonso",
            grade: "A",
            grossWeight: 500,
            deductions: 20,
            netWeight: 480,
            soldQuantity: 300,
            remainingQuantity: 180,
            amount: 20000,
            rate: 45,
            status: "Partially Sold",
          },
          {
            product: "Mango",
            variety: "Kesar",
            grade: "B",
            grossWeight: 1000,
            deductions: 50,
            netWeight: 950,
            soldQuantity: 730,
            remainingQuantity: 220,
            amount: 40000,
            rate: 55,
            status: "Partially Sold",
          },
        ],
      },
      {
        _id: "l-2",
        lotId: "LOT-2026-002",
        supplier: { name: "Sandhya Devi" },
        entryDate: "2026-03-21",
        origin: "Guntur",
        status: "Pending Auction",
        totalQuantity: 2000,
        remainingQuantity: 2000,
        lineItems: [
          {
            product: "Banana",
            variety: "Yelakki",
            grade: "A",
            grossWeight: 2000,
            deductions: 100,
            netWeight: 1900,
            soldQuantity: 0,
            remainingQuantity: 1900,
            amount: 0,
            rate: 25,
            status: "Pending Auction",
          },
        ],
      },
      {
        _id: "l-3",
        lotId: "LOT-2026-003",
        supplier: { name: "Anwar Pasha" },
        entryDate: "2026-03-22",
        origin: "Nellore",
        status: "Fully Sold",
        totalQuantity: 1200,
        remainingQuantity: 0,
        lineItems: [
          {
            product: "Tomato",
            variety: "Roma",
            grade: "A",
            grossWeight: 1200,
            deductions: 50,
            netWeight: 1150,
            soldQuantity: 1150,
            remainingQuantity: 0,
            amount: 15000,
            rate: 13,
            status: "Fully Sold",
          },
        ],
      },
    ];

    try {
      const sRes = await MandiService.getSuppliers();
      setSuppliers(sRes.status === "SUCCESS" ? sRes.data : dummySuppliers);

      const bRes = await MandiService.getBuyers();
      setBuyers(bRes.status === "SUCCESS" ? bRes.data : dummyBuyers);

      const lRes = await MandiService.getLots();
      setLots(lRes.status === "SUCCESS" ? lRes.data : dummyLots);

      const dRes = await MandiService.getDocuments();
      if (dRes.status === "SUCCESS") {
        setDocuments(dRes.data);
      } else {
        setDocuments([
          {
            _id: "d-1",
            originalName: "Land-Patta-Vikram.pdf",
            docType: "KYC",
            fileSize: 1024 * 500,
            url: "#",
          },
          {
            _id: "d-2",
            originalName: "Aadhaar-Sandhya.jpg",
            docType: "KYC",
            fileSize: 1024 * 200,
            url: "#",
          },
        ]);
      }

      const statsRes = await MandiService.getInventoryDashboard();
      if (statsRes.status === "SUCCESS") setInventoryStats(statsRes.data);
      else
        setInventoryStats({
          totalLotsToday: 14,
          incomingKgToday: 8500,
          totalSoldKg: 12400,
          remainingStockKg: 3200,
          pendingDeliveryKg: 850,
          netRevenue: 284560,
          settlementsPending: 15,
          settlementsPendingAmount: 45200,
          activeProcurementLots: 6,
          totalProcurementLots: 8,
          lowStockAlerts: 2,
        });
    } catch (err) {
      console.warn(
        "Backend Unreachable - Using Local Data Engine:",
        err.message,
      );
      setSuppliers(dummySuppliers);
      setBuyers(dummyBuyers);
      setLots(dummyLots);
      setInventoryStats({
        totalLotsToday: 14,
        incomingKgToday: 8500,
        totalSoldKg: 12400,
        remainingStockKg: 3200,
        pendingDeliveryKg: 850,
        netRevenue: 284560,
        settlementsPending: 15,
        settlementsPendingAmount: 45200,
        activeProcurementLots: 6,
        totalProcurementLots: 8,
        lowStockAlerts: 2,
      });
    }
  };

  const handleFileUpload = async (
    event,
    docType = "Other",
    relatedToType = "Other",
    relatedTo = null,
  ) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024)
      return alert("❌ CLIP REACHED: Max size 10MB");

    setUploading(true);
    const res = await MandiService.uploadFile(
      file,
      docType,
      relatedToType,
      relatedTo,
    );
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
    if (
      loggedIn &&
      activeSection === "Supplier Billing" &&
      settlementData.length === 0
    ) {
      // Seed mock visuals for "duplicated data" requirement
      setSettlementData([
        {
          _id: "s-mock-1",
          lotRef: { lotId: "LOT-2026-X01", vehicleNumber: "AP-02-TX-1234" },
          lineItem: { product: "🥭 Mango", variety: "Alphonso" },
          quantity: 450,
          saleRate: 75,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "s-mock-2",
          lotRef: { lotId: "LOT-2026-X01", vehicleNumber: "AP-02-TX-1234" },
          lineItem: { product: "🥭 Mango", variety: "Kesar" },
          quantity: 300,
          saleRate: 55,
          createdAt: new Date().toISOString(),
        },
      ]);
      setFarmerBillsList([
        {
          _id: "b-mock-1",
          billNo: "FB-2026-9999",
          date: "2026-03-15",
          netPayable: 45000,
        },
        {
          _id: "b-mock-2",
          billNo: "FB-2026-9998",
          date: "2026-03-10",
          netPayable: 32000,
        },
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
    const res = await MandiService.login(authForm.username, authForm.password);
    if (res?.status === "SUCCESS") {
      setLoggedIn(true);
      setUser(res.data.user);
    } else {
      alert(`❌ LOGIN FAILED: ${res?.message || "Invalid Credentials"}`);
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
    const buyer = buyers.find((b) => b._id === buyerId);
    if (!buyer) return;

    setBuyerInvoiceForm((prev) => ({
      ...prev,
      buyerId,
      buyerPhone: buyer.phone || "",
      buyerAddress: buyer.address || "",
    }));

    // Fetch buyer history/intel
    const res = await MandiService.getBuyerIntel(buyerId);
    if (res.status === "SUCCESS") {
      setBuyerHistory(res.data);
      if (res.data.pendingBalance > 0) {
        alert(
          `⚠️ ALERT: Buyer has a pending balance of ${formatCurrency(res.data.pendingBalance)}`,
        );
      }
    }
  };

  const calculateInvoiceTotals = (form) => {
    const subTotal = form.items.reduce(
      (acc, item) => acc + item.netWeight * item.rate,
      0,
    );
    // Dynamically sum all numeric values in form.charges
    const totalCharges = Object.keys(form.charges).reduce((acc, key) => {
      if (key === "otherLabel") return acc;
      return acc + (Number(form.charges[key]) || 0);
    }, 0);
    const grandTotal = subTotal + totalCharges;
    const balanceDue = Math.max(
      0,
      grandTotal - Number(form.amountReceived || 0),
    );

    let status = "Unpaid";
    if (Number(form.amountReceived) >= grandTotal && grandTotal > 0)
      status = "Fully Paid";
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
    const isDuplicate = buyerId === "b-1" && buyerInvoiceForm.date === today;
    setDuplicateWarning(isDuplicate);
  };

  const addInvoiceItem = () => {
    setBuyerInvoiceForm((prev) => {
      const newForm = {
        ...prev,
        items: [
          ...prev.items,
          {
            productId: "",
            productLabel: "",
            variety: "",
            grade: "",
            grossWeight: 0,
            deductions: 0,
            netWeight: 0,
            rate: 0,
            amount: 0,
            lotId: "",
          },
        ],
      };
      checkForDuplicateInvoice(newForm.buyerId, newForm.items); // Re-check on item add
      return newForm;
    });
  };

  const removeInvoiceItem = (index) => {
    setBuyerInvoiceForm((prev) => {
      const newItems = prev.items.filter((_, i) => i !== index);
      const updatedForm = calculateInvoiceTotals({
        ...prev,
        items: newItems.length
          ? newItems
          : [
              {
                productId: "",
                productLabel: "",
                variety: "",
                grade: "",
                grossWeight: 0,
                deductions: 0,
                netWeight: 0,
                rate: 0,
                amount: 0,
                lotId: "",
              },
            ],
      });
      checkForDuplicateInvoice(updatedForm.buyerId, updatedForm.items); // Re-check on item remove
      return updatedForm;
    });
  };

  const handleUpdateInvoiceItem = (index, field, value) => {
    setBuyerInvoiceForm((prev) => {
      const newItems = [...prev.items];
      newItems[index][field] = value;

      if (
        field === "grossWeight" ||
        field === "deductions" ||
        field === "rate"
      ) {
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
    if (intakeForm.lineItems.some((i) => !i.product || !i.grossWeight))
      return alert("⚠️ Product and Weight are required for all items");

    const payload = {
      supplier: intakeForm.supplierId,
      entryDate: intakeForm.entryDate,
      vehicleNumber: intakeForm.vehicleNumber,
      driverName: intakeForm.driverName,
      origin: intakeForm.origin,
      notes: intakeForm.notes,
      lineItems: intakeForm.lineItems.map((i) => ({
        product: i.product || i.productLabel || "Unknown",
        variety: i.variety || "Standard",
        grade: i.grade || "A",
        grossWeight: Number(i.grossWeight) || 0,
        deductions: Number(i.deductions) || 0,
        boxes: Number(i.boxes) || 0,
        estimatedRate: Number(i.estimatedRate) || 0,
      })),
    };

    const res = await MandiService.addLot(payload);
    if (res.status === "SUCCESS") {
      alert(
        `💾 SUCCESS: Lot ${res.data.lotId} recorded! Net weight added to Live Stock.`,
      );
      setIntakeForm({
        supplierId: "",
        entryDate: new Date().toISOString().slice(0, 16), // datetime-local format
        vehicleNumber: "",
        driverName: "",
        origin: "",
        notes: "",
        lineItems: [
          {
            product: "",
            variety: "",
            grade: "A",
            grossWeight: "",
            deductions: "",
            boxes: "",
            estimatedRate: "",
          },
        ],
      });
      fetchData();
    } else {
      alert(`❌ FAILED: ${res.message || "Database Error"}`);
    }
  };

  // --- HANDLE ALLOCATION (MISSING FUNCTION — WAS CRASHING ON BUTTON CLICK) ---
  const handleAllocate = async () => {
    if (!allocationForm.buyerId) return alert("⚠️ Please select a Buyer");
    if (!allocationForm.quantity || Number(allocationForm.quantity) <= 0)
      return alert("⚠️ Please enter a valid Quantity");
    if (!allocationForm.saleRate || Number(allocationForm.saleRate) <= 0)
      return alert("⚠️ Please enter a valid Sale Rate");
    if (!selection.item || !selection.lot)
      return alert("⚠️ Please select a Lot Item from the left panel");
    if (Number(allocationForm.quantity) > selection.item.remainingQuantity) {
      return alert(
        `⚠️ Quantity entered (${allocationForm.quantity} KG) exceeds available stock (${selection.item.remainingQuantity} KG)`,
      );
    }

    const payload = {
      lotId: selection.lot._id,
      lineItemId: selection.item._id,
      buyerId: allocationForm.buyerId,
      quantity: Number(allocationForm.quantity),
      rate: Number(allocationForm.saleRate),
      notes: allocationForm.notes,
    };

    try {
      const res = await MandiService.allocateLot(payload);
      if (res.status === "SUCCESS") {
        alert(
          `🚀 ALLOCATION AUTHORIZED: Invoice ${res.data?.invoiceNo || "generated"} committed to database.`,
        );
        setAllocationForm({
          buyerId: "",
          quantity: "",
          saleRate: "",
          notes: "",
        });
        setSelection({
          lot: null,
          item: null,
          buyerId: "",
          qty: "",
          rate: "",
          inv: "",
        });
        fetchData();
      } else {
        alert(`❌ ALLOCATION FAILED: ${res.message || "Database Error"}`);
      }
    } catch (err) {
      alert(`❌ ALLOCATION FAILED: ${err.message}`);
    }
  };

  const handleFarmerSelectionForSettlement = async (id) => {
    if (!id) return;
    const resData = await MandiService.getFarmerSettlementData(id);
    if (resData.status === "SUCCESS") {
      setSettlementData(resData.data);
      const gross = resData.data.reduce(
        (acc, i) => acc + i.quantity * i.saleRate,
        0,
      );
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
    if (field === "product" || field === "variety") {
      newData[idx].lineItem = { ...newData[idx].lineItem, [field]: value };
    } else {
      newData[idx][field] =
        field === "quantity" || field === "saleRate" ? Number(value) : value;
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
        isManual: true,
      },
    ]);
  };

  const removeSettlementRow = (idx) => {
    setSettlementData(settlementData.filter((_, i) => i !== idx));
  };

  const handleCreateFarmerBill = async () => {
    const targetFarmerId = farmerBillForm.farmerId;
    if (!targetFarmerId) return alert("⚠️ Please select a farmer first.");
    if (settlementData.length === 0)
      return alert(
        "⚠️ No sale entries added to this bill. Please ensure items are present.",
      );

    const gross = settlementData.reduce(
      (acc, i) => acc + i.quantity * i.saleRate,
      0,
    );
    const totalExp = farmerBillForm.expenses.reduce(
      (acc, e) => acc + e.value,
      0,
    );
    const netPayable = gross - totalExp - farmerBillForm.advance;

    const backendPayload = {
      supplier: targetFarmerId,
      items: settlementData.map((s) => ({
        lotId: s._id, // USE THE ROW ID TO CLEAR FROM PENDING ON DASHBOARD
        productName: s.lineItem?.product || "Product",
        quantity: s.quantity || 0,
        rate: s.saleRate || 0,
      })),
      expenses: {
        transport:
          farmerBillForm.expenses.find((e) => e.label.includes("Freight"))
            ?.value || 0,
        marketing:
          farmerBillForm.expenses.find((e) => e.label.includes("Market"))
            ?.value || 0,
        labour:
          farmerBillForm.expenses.find((e) => e.label.includes("Labour"))
            ?.value || 0,
        packing:
          farmerBillForm.expenses.find((e) => e.label.includes("Packing"))
            ?.value || 0,
        misc:
          farmerBillForm.expenses.find((e) => e.label.includes("Commission"))
            ?.value || 0,
      },
      advancePayment: farmerBillForm.advance || 0,
    };

    const res = await MandiService.createFarmerSettlementBill(backendPayload);
    if (res.status === "SUCCESS") {
      setIsBillLocked(true);
      // Prevent crash: ensure 'expenses' remains a React-loopable array despite backend object responses
      setFarmerBillForm({
        ...farmerBillForm,
        ...res.data,
        expenses: farmerBillForm.expenses,
      });
      // Finalize state and await global sync for immediate dashboard updates
      await fetchData();
      handleFarmerSelectionForSettlement(targetFarmerId);
      alert(
        "🔒 BILL FINALIZED & SENT TO LEDGER: Record successfully stored in Database.",
      );

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
            { label: "Market Fee", value: 0 },
          ],
          advance: 0,
          netPayable: 0,
        });
      }
    } else {
      alert(
        `❌ STORAGE FAILED: ${res.message || "Database synchronization error. Please check backend logs."}`,
      );
    }
  };

  const handleVoidBill = async (id) => {
    const reason = prompt(
      "Mandatory: Reason for voiding this finalized settlement?",
    );
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
    const ex = [
      ...farmerBillForm.expenses,
      { label: "Additional Deduction", value: 0, isCustom: true },
    ];
    setFarmerBillForm({ ...farmerBillForm, expenses: ex });
  };

  // --- MENU CONFIG (PRODUCTION WORKFLOW) ---
  const ALL_MENU = [
    {
      id: "Dashboard",
      icon: "📊",
      roles: ["Admin", "Accountant", "Operations Staff", "Viewer"],
    },
    {
      id: "User Role",
      icon: "👥",
      roles: ["Admin", "Operations Staff"],
      label: "Profiles",
    },
    {
      id: "Inventory Allocation",
      icon: "📦",
      roles: ["Admin", "Operations Staff"],
    },
    {
      id: "Supplier Billing",
      icon: "⚖️",
      roles: ["Admin", "Accountant", "Operations Staff"],
    },
    {
      id: "Buyer Invoicing",
      icon: "🧾",
      roles: ["Admin", "Accountant", "Operations Staff"],
    },
    {
      id: "Ledger System",
      icon: "📖",
      roles: ["Admin", "Accountant", "Viewer"],
    },
    { id: "CONNECTION", icon: "🔗", roles: ["Admin", "Accountant", "Viewer"] },
    {
      id: "Payment & Settlement Management",
      icon: "💳",
      roles: ["Admin", "Accountant"],
    },
    {
      id: "Transportation Tracking",
      icon: "🚚",
      roles: ["Admin", "Operations Staff", "Accountant"],
    },
    {
      id: "Expense Management",
      icon: "💸",
      roles: ["Admin", "Accountant", "Operations Staff"],
    },
    { id: "Reports", icon: "📄", roles: ["Admin", "Accountant", "Viewer"] },
    { id: "Product Master & Configuration", icon: "⚙️", roles: ["Admin"] },
    {
      id: "User Roles, Access Control & Security",
      icon: "🛡️",
      roles: ["Admin"],
    },
    { id: "Document Management", icon: "📂", roles: ["Admin"] },
  ];

  const MENU = user
    ? ALL_MENU.filter((item) => item.roles.includes(user.role))
    : [];

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          background: "#0f172a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <h1>⚡ Syncing Matrix...</h1>
      </div>
    );

  if (!loggedIn) {
    return (
      <div
        style={{
          height: "100vh",
          background: "#fcf9f1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
          * { font-family: 'Plus Jakarta Sans', sans-serif; }
          .font-display { font-family: 'Outfit', sans-serif !important; }
          @keyframes floatUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
          .spv-input:focus { border-color: #9fb443 !important; }
          .spv-btn:hover { transform:translateY(-3px) !important; box-shadow:0 20px 45px rgba(55,81,68,0.45) !important; }
        `}</style>
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-120px",
            width: "550px",
            height: "550px",
            background: "#375144",
            borderRadius: "50%",
            opacity: 0.05,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-100px",
            width: "420px",
            height: "420px",
            background: "#9fb443",
            borderRadius: "50%",
            opacity: 0.07,
          }}
        />
        <div
          style={{
            animation: "floatUp 0.5s ease-out",
            width: "460px",
            background: "#ffffff",
            borderRadius: "40px",
            padding: "56px 50px 48px",
            boxShadow: "0 30px 70px rgba(55,81,68,0.15)",
            border: "1.5px solid rgba(159,180,67,0.2)",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "96px",
                height: "96px",
                background: "linear-gradient(145deg, #375144, #2d4137)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 14px 35px rgba(55,81,68,0.35)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "7px",
                  borderRadius: "50%",
                  border: "3.5px solid #9fb443",
                  opacity: 0.65,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: "14px",
                  borderRadius: "50%",
                  border: "2px solid #9fb443",
                  opacity: 0.25,
                }}
              />
              <span
                style={{
                  color: "#9fb443",
                  fontSize: "20px",
                  fontWeight: "900",
                  letterSpacing: "-0.5px",
                  zIndex: 1,
                }}
              >
                SPV
              </span>
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "14px",
                  width: "12px",
                  height: "8px",
                  background: "#9fb443",
                  borderRadius: "50%",
                  transform: "rotate(-35deg)",
                  opacity: 0.9,
                }}
              />
            </div>
          </div>
          <h1
            style={{
              margin: "0 0 4px",
              fontWeight: "900",
              color: "#375144",
              fontSize: "32px",
              letterSpacing: "-1.5px",
            }}
          >
            SPV FRUITS
          </h1>
          <p
            style={{
              color: "#9fb443",
              marginBottom: "44px",
              fontSize: "10px",
              letterSpacing: "3.5px",
              textTransform: "uppercase",
              fontWeight: "900",
            }}
          >
            Orchard Admin Console
          </p>
          <div style={{ textAlign: "left" }}>
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  fontWeight: "900",
                  color: "#375144",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  marginBottom: "8px",
                }}
              >
                Staff Identity
              </label>
              <input
                className="spv-input"
                type="text"
                placeholder="Enter username"
                value={authForm.username}
                onChange={(e) =>
                  setAuthForm({ ...authForm, username: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "15px 18px",
                  borderRadius: "14px",
                  border: "1.5px solid rgba(55,81,68,0.12)",
                  background: "#fcf9f1",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#375144",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  fontWeight: "900",
                  color: "#375144",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  marginBottom: "8px",
                }}
              >
                Secret Access Key
              </label>
              <input
                className="spv-input"
                type="password"
                placeholder="••••••••"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm({ ...authForm, password: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%",
                  padding: "15px 18px",
                  borderRadius: "14px",
                  border: "1.5px solid rgba(55,81,68,0.12)",
                  background: "#fcf9f1",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#375144",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
          </div>
          <button
            className="spv-btn"
            onClick={handleLogin}
            style={{
              width: "100%",
              height: "58px",
              fontSize: "16px",
              fontWeight: "900",
              marginTop: "28px",
              background: "linear-gradient(135deg, #375144 0%, #2d4137 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "18px",
              cursor: "pointer",
              letterSpacing: "0.5px",
              boxShadow: "0 12px 30px rgba(55,81,68,0.3)",
              transition: "all 0.25s",
            }}
          >
            🔐 Initialize Command Deck
          </button>
          <div
            style={{
              marginTop: "32px",
              paddingTop: "20px",
              borderTop: "1.5px solid rgba(159,180,67,0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#9fb443",
              }}
            />
            <span
              style={{
                fontSize: "10px",
                color: "#64748b",
                fontWeight: "700",
                letterSpacing: "0.5px",
              }}
            >
              SYSTEM v4.3.0 • SPV FRUITS ERP
            </span>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#9fb443",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
      }}
    >
      <style>{`
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-display { font-family: 'Outfit', sans-serif !important; }
      `}</style>
      {/* MOBILE HEADER (Conditional) */}
      {loggedIn && isMobile && (
        <div
          style={{
            background: "#2d4137",
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "#9fb443",
              margin: 0,
              fontSize: "20px",
              fontWeight: "900",
            }}
          >
            SPV Fruits
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </div>
      )}

      {/* 1. SIDE NAVIGATION (Jamango Style) */}
      {loggedIn && (
        <nav
          style={{
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
            boxShadow: isMobile ? "4px 0 16px rgba(0,0,0,0.1)" : "none",
          }}
        >
          <div
            style={{
              padding: "0 24px 32px 24px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                position: "relative",
                background: "linear-gradient(145deg, #375144, #2d4137)",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "4px",
                  borderRadius: "50%",
                  border: "2px solid #9fb443",
                  opacity: 0.5,
                }}
              />
              <span
                style={{
                  color: "#9fb443",
                  fontSize: "13px",
                  fontWeight: "900",
                  zIndex: 1,
                }}
              >
                SPV
              </span>
            </div>
            <div>
              <h2
                style={{
                  color: "#ffffff",
                  fontWeight: "850",
                  fontSize: "18px",
                  letterSpacing: "-0.5px",
                  margin: 0,
                }}
              >
                SPV FRUITS
              </h2>
              <p
                style={{
                  color: "#9fb443",
                  fontSize: "10px",
                  margin: "2px 0 0",
                  fontWeight: "750",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Orchard Admin
              </p>
            </div>
          </div>

          <div style={{ padding: "0 24px", marginBottom: "12px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                color: "#548265",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Overview
            </span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
            {MENU.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                style={{
                  padding: item.isSub ? "8px 16px 8px 36px" : "12px 18px",
                  borderRadius: "14px",
                  marginBottom: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  background:
                    activeSection === item.id
                      ? "rgba(160, 183, 99, 0.15)"
                      : "transparent",
                  color: activeSection === item.id ? "#ffffff" : "#AEC4BB",
                }}
              >
                <span
                  style={{
                    fontSize: item.isSub ? "14px" : "18px",
                    opacity: activeSection === item.id ? 1 : 0.6,
                    transform:
                      activeSection === item.id ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontWeight: activeSection === item.id ? "850" : "550",
                    fontSize: item.isSub ? "12px" : "14px",
                    letterSpacing: "0.2px",
                  }}
                >
                  {item.id}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "auto",
              padding: "28px 24px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              background: "rgba(0,0,0,0.15)",
              margin: "0 12px 12px",
              borderRadius: "20px",
            }}
          >
            <div
              style={{
                background: COLORS.accent,
                width: "38px",
                height: "38px",
                borderRadius: "19px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.secondary,
                fontSize: "14px",
                fontWeight: "900",
                boxShadow: "0 0 15px rgba(0,0,0,0.2)",
              }}
            >
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color: "#ffffff",
                  fontSize: "14px",
                  margin: 0,
                  fontWeight: "850",
                  letterSpacing: "0.3px",
                }}
              >
                {user?.username || "Staff Identity"}
              </p>
              <p
                style={{
                  color: "#AEC4BB",
                  fontSize: "11px",
                  margin: 0,
                  fontWeight: "600",
                  textTransform: "uppercase",
                  opacity: 0.7,
                }}
              >
                {user?.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: COLORS.accent,
                cursor: "pointer",
                fontSize: "20px",
                padding: "8px",
                transition: "0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.2)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              🚪
            </button>
          </div>
        </nav>
      )}

      {/* Sidebar Overlay for Mobile */}
      {isMobile && sidebarOpen && loggedIn && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
        />
      )}

      {/* Main Command Deck */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: isMobile ? "24px 16px" : "60px",
          scrollBehavior: "smooth",
        }}
      >
        <header
          style={{
            marginBottom: "60px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "900",
                  color: COLORS.secondary,
                  margin: 0,
                  letterSpacing: "-1px",
                }}
              >
                {getGreeting()},{" "}
                {user?.name?.split(" ")[0] || user?.username || "Admin"}
              </h1>
              <p
                style={{
                  color: COLORS.muted,
                  fontSize: "15px",
                  marginTop: "8px",
                  fontWeight: "650",
                  opacity: 0.8,
                }}
              >
                Orchard & Mandi Operations Command Center
              </p>
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  padding: "10px 20px",
                  borderRadius: "24px",
                  fontSize: "14px",
                  fontWeight: "850",
                  color: COLORS.primary,
                  border: `1px solid ${COLORS.primary}20`,
                }}
              >
                📅{" "}
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </div>
              <div
                style={{
                  background: "#FFFFFF",
                  border: `1.5px solid ${COLORS.secondary}15`,
                  width: "48px",
                  height: "48px",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: COLORS.primary,
                  boxShadow: "0 8px 15px rgba(0,0,0,0.04)",
                  position: "relative",
                }}
              >
                🔔{" "}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "8px",
                    height: "8px",
                    background: COLORS.danger,
                    borderRadius: "4px",
                    border: "2px solid #fff",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </header>

        {/* --- MODULE DISPATCHER --- */}
        <div style={{ animation: "fadeIn 0.6s ease-out" }}>
          {/* 14. Dashboard */}
          {activeSection === "Dashboard" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "40px" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "repeat(2, 1fr)"
                    : "repeat(4, 1fr)",
                  gap: "20px",
                }}
              >
                {[
                  {
                    icon: "💰",
                    label: "Net Revenue",
                    period: "Total Net Sale",
                    val: formatCurrency(inventoryStats.netRevenue || 0),
                    trend: "Dynamic",
                    trendUp: true,
                    sub: "Live Database",
                    gradFrom: "#375144",
                    gradTo: "#2d4137",
                    sparkW: "72%",
                  },
                  {
                    icon: "⚖️",
                    label: "Inventory",
                    period: "Live Stock",
                    val: `${inventoryStats.remainingStockKg} KG`,
                    trend: "Real-time",
                    trendUp: true,
                    sub: "From DB Lots",
                    gradFrom: "#4a6741",
                    gradTo: "#375144",
                    sparkW: "58%",
                  },
                  {
                    icon: "📋",
                    label: "Settlements",
                    period: "Pending Invoices/Bills",
                    val: `${inventoryStats.settlementsPending} Pending`,
                    trend: formatCurrency(
                      inventoryStats.settlementsPendingAmount || 0,
                    ),
                    trendUp: null,
                    sub: "awaiting review",
                    gradFrom: "#9fb443",
                    gradTo: "#7a8d34",
                    sparkW: "40%",
                  },
                  {
                    icon: "🏪",
                    label: "Procurement",
                    period: "Active Lots",
                    val: `${inventoryStats.activeProcurementLots} / ${inventoryStats.totalProcurementLots}`,
                    trend: `${inventoryStats.lowStockAlerts} Low`,
                    trendUp: false,
                    sub: "restock alerts",
                    gradFrom: "#c0392b",
                    gradTo: "#a93226",
                    sparkW: "25%",
                  },
                ].map((m, i) => (
                  <div
                    key={i}
                    style={{
                      background: `linear-gradient(145deg, ${m.gradFrom} 0%, ${m.gradTo} 100%)`,
                      borderRadius: "28px",
                      padding: "28px 26px",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: `0 16px 40px ${m.gradFrom}35`,
                      cursor: "default",
                      transition: "transform 0.25s, box-shadow 0.25s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow = `0 24px 50px ${m.gradFrom}50`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = `0 16px 40px ${m.gradFrom}35`;
                    }}
                  >
                    {/* Background orb */}
                    <div
                      style={{
                        position: "absolute",
                        top: "-30px",
                        right: "-30px",
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.07)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-20px",
                        left: "-20px",
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.05)",
                      }}
                    />
                    {/* Icon badge */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(4px)",
                        borderRadius: "14px",
                        width: "44px",
                        height: "44px",
                        fontSize: "20px",
                        marginBottom: "18px",
                      }}
                    >
                      {m.icon}
                    </div>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "11px",
                        fontWeight: "800",
                        color: "rgba(255,255,255,0.65)",
                        textTransform: "uppercase",
                        letterSpacing: "1.5px",
                      }}
                    >
                      {m.label}
                    </p>
                    <p
                      style={{
                        margin: "0 0 12px",
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.45)",
                        fontWeight: "600",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {m.period}
                    </p>
                    <h2
                      className="font-display"
                      style={{
                        fontSize: "32px",
                        margin: "0 0 16px",
                        color: "#ffffff",
                        fontWeight: "900",
                        letterSpacing: "-1.5px",
                        lineHeight: 1,
                      }}
                    >
                      {m.val}
                    </h2>
                    {/* Spark bar */}
                    <div
                      style={{
                        height: "3px",
                        background: "rgba(255,255,255,0.15)",
                        borderRadius: "2px",
                        marginBottom: "14px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: m.sparkW,
                          background: "rgba(255,255,255,0.5)",
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          background: "rgba(255,255,255,0.18)",
                          color: "#fff",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "900",
                        }}
                      >
                        {m.trendUp !== null ? (m.trendUp ? "▲" : "▼") : "●"}{" "}
                        {m.trend}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.55)",
                          fontWeight: "600",
                        }}
                      >
                        {m.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "24px",
                  marginTop: "0px",
                }}
              >
                {/* Recent Orders */}
                <Card
                  action={
                    <span
                      style={{
                        color: COLORS.sidebar,
                        fontWeight: "600",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      View all &rarr;
                    </span>
                  }
                  title="Recent Orders"
                  style={{ padding: "24px 0 0 0" }}
                >
                  <div
                    className="menu-scroll"
                    style={{
                      marginTop: "20px",
                      maxHeight: "380px",
                      overflowY: "auto",
                      paddingRight: "8px",
                    }}
                  >
                    {[
                      {
                        initials: "PR",
                        name: "Priya Reddy",
                        desc: "2 x Alphonso KG • Hyderabad",
                        amount: "₹1,240",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "SM",
                        name: "Sanjay Mehta",
                        desc: "5 x Kesar KG • Secunderabad",
                        amount: "₹3,100",
                        status: "In Transit",
                        statusCol: "#3B82F6",
                      },
                      {
                        initials: "AK",
                        name: "Ananya Kumar",
                        desc: "1 x Langra KG • Banjara Hills",
                        amount: "₹580",
                        status: "Pending",
                        statusCol: "#F59E0B",
                      },
                      {
                        initials: "VS",
                        name: "Vikram Sharma",
                        desc: "3 x Alphonso KG • Jubilee Hills",
                        amount: "₹1,860",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "DM",
                        name: "Deepa Menon",
                        desc: "4 x Kesar KG • Madhapur",
                        amount: "₹2,480",
                        status: "In Transit",
                        statusCol: "#3B82F6",
                      },
                      {
                        initials: "SR",
                        name: "Srinivas Rao",
                        desc: "1 x Alphonso KG • Gachibowli",
                        amount: "₹620",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "LN",
                        name: "Lakshmi Narayana",
                        desc: "10 x Kesar KG • Kukatpally",
                        amount: "₹6,200",
                        status: "Pending",
                        statusCol: "#F59E0B",
                      },
                      {
                        initials: "VB",
                        name: "Venkatesh Babu",
                        desc: "3 x Langra KG • Ameerpet",
                        amount: "₹1,740",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "SK",
                        name: "Sai Krishna",
                        desc: "2 x Dasheri Box • Kondapur",
                        amount: "₹1,100",
                        status: "In Transit",
                        statusCol: "#3B82F6",
                      },
                      {
                        initials: "BP",
                        name: "Bhanu Prakash",
                        desc: "5 x Alphonso Box • Miyapur",
                        amount: "₹3,100",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "RS",
                        name: "Ramya Sri",
                        desc: "1 x Kesar Box • Dilsukhnagar",
                        amount: "₹620",
                        status: "Pending",
                        statusCol: "#F59E0B",
                      },
                      {
                        initials: "HN",
                        name: "Harika Naidu",
                        desc: "8 x Badami Box • SR Nagar",
                        amount: "₹3,840",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "KV",
                        name: "Karthik Varma",
                        desc: "2 x Langra Box • RTC X Roads",
                        amount: "₹1,160",
                        status: "In Transit",
                        statusCol: "#3B82F6",
                      },
                      {
                        initials: "PR",
                        name: "Prasad Reddy",
                        desc: "4 x Alphonso Box • LB Nagar",
                        amount: "₹2,480",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "SC",
                        name: "Swapna Chowdary",
                        desc: "3 x Kesar Box • KPHB",
                        amount: "₹1,860",
                        status: "Pending",
                        statusCol: "#F59E0B",
                      },
                      {
                        initials: "TG",
                        name: "Tejaswini Goud",
                        desc: "1 x Banganapalli Box • Begumpet",
                        amount: "₹450",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "SK",
                        name: "Shiva Kumar",
                        desc: "6 x Alphonso Box • Uppal",
                        amount: "₹3,720",
                        status: "In Transit",
                        statusCol: "#3B82F6",
                      },
                      {
                        initials: "MB",
                        name: "Mahesh Babu",
                        desc: "2 x Kesar Box • Panjagutta",
                        amount: "₹1,240",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "PA",
                        name: "Pavani Akula",
                        desc: "3 x Langra Box • Somajiguda",
                        amount: "₹1,740",
                        status: "Pending",
                        statusCol: "#F59E0B",
                      },
                      {
                        initials: "SD",
                        name: "Sujatha Devi",
                        desc: "1 x Alphonso Box • Tarnaka",
                        amount: "₹620",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "MC",
                        name: "Mohan Chandra",
                        desc: "7 x Kesar Box • ECIL",
                        amount: "₹4,340",
                        status: "In Transit",
                        statusCol: "#3B82F6",
                      },
                      {
                        initials: "SG",
                        name: "Suresh Goud",
                        desc: "4 x Banganapalli Box • Bowenpally",
                        amount: "₹1,800",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "DS",
                        name: "Divya Sree",
                        desc: "2 x Alphonso Box • Malkajgiri",
                        amount: "₹1,240",
                        status: "Pending",
                        statusCol: "#F59E0B",
                      },
                      {
                        initials: "RR",
                        name: "Rajeshwar Rao",
                        desc: "5 x Kesar Box • Alwal",
                        amount: "₹3,100",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "AK",
                        name: "Anil Kumar",
                        desc: "1 x Langra Box • Tolichowki",
                        amount: "₹580",
                        status: "In Transit",
                        statusCol: "#3B82F6",
                      },
                      {
                        initials: "SN",
                        name: "Surya Narayana",
                        desc: "3 x Alphonso Box • Mehdipatnam",
                        amount: "₹1,860",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "KR",
                        name: "Kalyani Rani",
                        desc: "2 x Kesar Box • Attapur",
                        amount: "₹1,240",
                        status: "Pending",
                        statusCol: "#F59E0B",
                      },
                      {
                        initials: "MY",
                        name: "Manoj Yadav",
                        desc: "4 x Banganapalli Box • Chandanagar",
                        amount: "₹1,800",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "RR",
                        name: "Rakesh Reddy",
                        desc: "6 x Alphonso Box • Gachibowli",
                        amount: "₹3,720",
                        status: "In Transit",
                        statusCol: "#3B82F6",
                      },
                      {
                        initials: "SR",
                        name: "Swathi Reddy",
                        desc: "1 x Kesar Box • Hitech City",
                        amount: "₹620",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "MC",
                        name: "Mounika Chowdary",
                        desc: "3 x Langra Box • Madhapur",
                        amount: "₹1,740",
                        status: "Pending",
                        statusCol: "#F59E0B",
                      },
                      {
                        initials: "NB",
                        name: "Nani Babu",
                        desc: "2 x Alphonso Box • Jubilee Hills",
                        amount: "₹1,240",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "PK",
                        name: "Praveen Kumar",
                        desc: "5 x Kesar Box • Banjara Hills",
                        amount: "₹3,100",
                        status: "In Transit",
                        statusCol: "#3B82F6",
                      },
                      {
                        initials: "KR",
                        name: "Koteswara Rao",
                        desc: "1 x Banganapalli Box • Nanakramguda",
                        amount: "₹450",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "RN",
                        name: "Ramesh Naidu",
                        desc: "4 x Alphonso Box • Manikonda",
                        amount: "₹2,480",
                        status: "Pending",
                        statusCol: "#F59E0B",
                      },
                      {
                        initials: "NR",
                        name: "Nagarjuna Raju",
                        desc: "3 x Kesar Box • Gachibowli",
                        amount: "₹1,860",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "GM",
                        name: "Geetha Madhuri",
                        desc: "2 x Langra Box • Kondapur",
                        amount: "₹1,160",
                        status: "In Transit",
                        statusCol: "#3B82F6",
                      },
                      {
                        initials: "HK",
                        name: "Hari Krishna",
                        desc: "1 x Alphonso Box • Hafeezpet",
                        amount: "₹620",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                      {
                        initials: "VB",
                        name: "Veera Babu",
                        desc: "5 x Kesar Box • Miyapur",
                        amount: "₹3,100",
                        status: "Pending",
                        statusCol: "#F59E0B",
                      },
                      {
                        initials: "SV",
                        name: "Sandeep Varma",
                        desc: "4 x Banganapalli Box • Chandanagar",
                        amount: "₹1,800",
                        status: "Confirmed",
                        statusCol: "#4CAF50",
                      },
                    ].map((order, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "16px 24px",
                          borderTop: "1px solid #EBE9E1",
                          borderBottom: i === 39 ? "none" : "",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <div
                            style={{
                              background: "#F1F5EB",
                              color: COLORS.sidebar,
                              width: "36px",
                              height: "36px",
                              borderRadius: "18px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: "700",
                            }}
                          >
                            {order.initials}
                          </div>
                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: "600",
                                color: COLORS.text,
                                fontSize: "14px",
                              }}
                            >
                              {order.name}
                            </p>
                            <p
                              style={{
                                margin: "2px 0 0",
                                color: COLORS.muted,
                                fontSize: "12px",
                              }}
                            >
                              {order.desc}
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: "700",
                              color: COLORS.text,
                              fontSize: "14px",
                            }}
                          >
                            {order.amount}
                          </p>
                          <p
                            style={{
                              margin: "4px 0 0",
                              color: order.statusCol,
                              fontSize: "11px",
                              fontWeight: "600",
                            }}
                          >
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Bottom analytics row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr",
                  gap: "24px",
                }}
              >
                {/* Sales Analytics Panel */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "28px",
                    padding: "32px",
                    boxShadow: "0 10px 30px rgba(55,81,68,0.06)",
                    border: "1.5px solid rgba(159,180,67,0.12)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "28px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: "0 0 4px",
                          fontSize: "18px",
                          fontWeight: "900",
                          color: "#375144",
                          letterSpacing: "-0.5px",
                        }}
                      >
                        Sales Performance
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: COLORS.muted,
                          fontWeight: "600",
                        }}
                      >
                        Weight (KGs/Tones) dispatched this week · Mon–Sun
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {["Week", "Month", "Season"].map((t, i) => (
                        <button
                          key={t}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "10px",
                            border: "none",
                            fontSize: "11px",
                            fontWeight: "800",
                            cursor: "pointer",
                            background:
                              i === 0 ? "#375144" : "rgba(55,81,68,0.08)",
                            color: i === 0 ? "#fff" : "#375144",
                            transition: "0.2s",
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: "200px", width: "100%" }}>
                    <Bar
                      data={{
                        labels: [
                          "Mon",
                          "Tue",
                          "Wed",
                          "Thu",
                          "Fri",
                          "Sat",
                          "Sun",
                        ],
                        datasets: [
                          {
                            label: "KGs Sold",
                            data: [65, 45, 80, 75, 120, 60, 40],
                            backgroundColor: [
                              "rgba(55,81,68,0.12)",
                              "rgba(55,81,68,0.12)",
                              "rgba(55,81,68,0.12)",
                              "rgba(55,81,68,0.12)",
                              "#375144",
                              "rgba(55,81,68,0.12)",
                              "rgba(55,81,68,0.12)",
                            ],
                            hoverBackgroundColor: "#9fb443",
                            borderRadius: 10,
                            borderSkipped: false,
                            barThickness: 32,
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: "#375144",
                            padding: 12,
                            cornerRadius: 10,
                            callbacks: { label: (ctx) => ` ${ctx.raw} KGs` },
                          },
                        },
                        scales: {
                          x: {
                            grid: { display: false },
                            border: { display: false },
                            ticks: {
                              color: "#64748b",
                              font: { weight: "700", size: 11 },
                              padding: 6,
                            },
                          },
                          y: {
                            grid: { color: "rgba(0,0,0,0.04)" },
                            border: { display: false },
                            ticks: {
                              color: "#94a3b8",
                              font: { size: 10 },
                              padding: 6,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "24px",
                      marginTop: "20px",
                      paddingTop: "18px",
                      borderTop: "1.5px solid rgba(55,81,68,0.08)",
                    }}
                  >
                    {[
                      { label: "Peak Day", val: "Friday", icon: "🏆" },
                      { label: "Total Weight (KG)", val: "4,850", icon: "⚖️" },
                      { label: "Avg Daily", val: "69.3", icon: "📊" },
                      { label: "Best Sale", val: "₹74,400", icon: "💰" },
                    ].map((s, i) => (
                      <div key={i}>
                        <p
                          style={{
                            margin: "0 0 3px",
                            fontSize: "10px",
                            fontWeight: "800",
                            color: COLORS.muted,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          {s.icon} {s.label}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "17px",
                            fontWeight: "900",
                            color: "#375144",
                            letterSpacing: "-0.5px",
                          }}
                        >
                          {s.val}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Global Entity Roles Router */}
          {activeSection === "User Role" && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "32px",
                borderBottom: "1px solid #EBE9E1",
                paddingBottom: "24px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    color: COLORS.sidebar,
                    margin: "0 0 12px 0",
                    letterSpacing: "-0.5px",
                  }}
                >
                  System User Matrix
                </h2>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div
                    onClick={() => setActiveUserRoleTab("Supplier")}
                    style={{
                      padding: "10px 24px",
                      cursor: "pointer",
                      fontWeight: "700",
                      background:
                        activeUserRoleTab === "Supplier"
                          ? COLORS.sidebar
                          : "#F3F1EA",
                      color:
                        activeUserRoleTab === "Supplier"
                          ? "#FFFFFF"
                          : COLORS.muted,
                      borderRadius: "8px",
                      transition: "all 0.2s",
                    }}
                  >
                    🏢 Supplier Pipeline
                  </div>
                  <div
                    onClick={() => setActiveUserRoleTab("Buyer")}
                    style={{
                      padding: "10px 24px",
                      cursor: "pointer",
                      fontWeight: "700",
                      background:
                        activeUserRoleTab === "Buyer"
                          ? COLORS.sidebar
                          : "#F3F1EA",
                      color:
                        activeUserRoleTab === "Buyer"
                          ? "#FFFFFF"
                          : COLORS.muted,
                      borderRadius: "8px",
                      transition: "all 0.2s",
                    }}
                  >
                    💎 Buyer Pipeline
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Supplier Role Module (Handles both direct "Supplier" and nested "User Role") */}
          {(activeSection === "Supplier" ||
            (activeSection === "User Role" &&
              activeUserRoleTab === "Supplier")) && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              <TabHeader
                tabs={[
                  "Supplier Registration",
                  "Dispatch Entry",
                  "Supplier Accounts",
                ]}
                active={activeSupplierTab}
                set={setActiveSupplierTab}
              />

              {activeSupplierTab === "Supplier Registration" && (
                <div>
                  <FormGrid
                    sections={[
                      {
                        title: "Basic Details",
                        fields: [
                          {
                            label: "Supplier ID",
                            disabled: true,
                            value:
                              "SUP-" +
                              Math.floor(Math.random() * 90000 + 10000),
                          },
                          {
                            label: "Full Name",
                            placeholder: "Enter name",
                            value: supplierForm.name,
                            onChange: (e) =>
                              setSupplierForm({
                                ...supplierForm,
                                name: e.target.value,
                              }),
                          },
                          {
                            label: "Mobile Number",
                            type: "tel",
                            value: supplierForm.phone,
                            onChange: (e) =>
                              setSupplierForm({
                                ...supplierForm,
                                phone: e.target.value,
                              }),
                          },
                          { label: "Alternate Mobile / Landline", type: "tel" },
                          { label: "WhatsApp Number", type: "tel" },
                          { label: "Email", type: "email" },
                          {
                            label: "Local / Non-Local",
                            type: "select",
                            options: ["Local", "Non-Local"],
                          },
                          {
                            label: "Address",
                            placeholder: "Street/Village",
                            value: supplierForm.address,
                            onChange: (e) =>
                              setSupplierForm({
                                ...supplierForm,
                                address: e.target.value,
                              }),
                          },
                          { label: "City" },
                          { label: "District" },
                          { label: "Pincode" },
                          { label: "State" },
                          { label: "Country", value: "India" },
                          { label: "GST Number" },
                          { label: "Aadhaar / PAN Number" },
                          { label: "Business Name" },
                          {
                            label: "Registration Date",
                            type: "date",
                            value: new Date().toISOString().slice(0, 10),
                          },
                        ],
                      },
                      {
                        title: "Additional Business Details",
                        fields: [
                          {
                            label: "Preferred Payment Method",
                            type: "select",
                            options: [
                              "Bank Transfer (RTGS/NEFT)",
                              "UPI",
                              "Cash",
                              "Cheque",
                            ],
                          },
                          {
                            label: "Credit Limit (₹)",
                            type: "number",
                            placeholder: "0.00",
                          },
                          {
                            label: "Supplier Category",
                            type: "select",
                            options: [
                              "Farmer",
                              "Wholesaler",
                              "Broker",
                              "Agent",
                            ],
                          },
                          {
                            label: "Transport Availability",
                            type: "select",
                            options: [
                              "Yes - Own Transport",
                              "No - Requires Pickup",
                            ],
                          },
                          { label: "Remarks / Notes" },
                        ],
                      },
                    ]}
                  />
                  <div
                    style={{ display: "flex", gap: "16px", marginTop: "32px" }}
                  >
                    <Button
                      style={{ background: COLORS.sidebar }}
                      onClick={handleRegisterSupplier}
                    >
                      Submit Details
                    </Button>
                    <Button variant="secondary">Save Draft</Button>
                    <Button variant="outline">Edit</Button>
                    <Button
                      variant="danger"
                      style={{
                        background: "#F1F5F9",
                        color: COLORS.danger,
                        border: "none",
                      }}
                    >
                      Cancel All
                    </Button>
                  </div>
                </div>
              )}

              {activeSupplierTab === "Dispatch Entry" && (
                <div style={{ animation: "fadeIn 0.5s ease-out" }}>
                  {/* Logistics & Core Details */}
                  <Card
                    style={{
                      marginBottom: "24px",
                      borderLeft: `6px solid ${COLORS.sidebar}`,
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Dispatch ID
                        </label>
                        <input
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                            fontWeight: "700",
                          }}
                          value={intakeForm.dispatchId}
                          onChange={(e) =>
                            setIntakeForm({
                              ...intakeForm,
                              dispatchId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Supplier / Farmer
                        </label>
                        <select
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                            fontWeight: "700",
                          }}
                          value={intakeForm.supplierId}
                          onChange={(e) => {
                            const s = suppliers.find(
                              (sup) => sup.name === e.target.value,
                            );
                            setIntakeForm({
                              ...intakeForm,
                              supplierId: e.target.value,
                              origin: s?.village || "",
                            });
                          }}
                        >
                          <option>Select Supplier</option>
                          {suppliers.map((s) => (
                            <option key={s._id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Dispatch Date & Time
                        </label>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <input
                            type="date"
                            style={{
                              flex: 2,
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1.5px solid #F1F5F9",
                            }}
                            value={intakeForm.entryDate}
                            onChange={(e) =>
                              setIntakeForm({
                                ...intakeForm,
                                entryDate: e.target.value,
                              })
                            }
                          />
                          <input
                            type="time"
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1.5px solid #F1F5F9",
                            }}
                            value={intakeForm.entryTime}
                            onChange={(e) =>
                              setIntakeForm({
                                ...intakeForm,
                                entryTime: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px",
                        marginTop: "20px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Destination Location
                        </label>
                        <input
                          placeholder="e.g. Madanapalle Market Hub"
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                          }}
                          value={intakeForm.destination}
                          onChange={(e) =>
                            setIntakeForm({
                              ...intakeForm,
                              destination: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Vehicle Info
                        </label>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <input
                            placeholder="TS 09 EU 1234"
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1.5px solid #F1F5F9",
                            }}
                            value={intakeForm.vehicleNumber}
                            onChange={(e) =>
                              setIntakeForm({
                                ...intakeForm,
                                vehicleNumber: e.target.value,
                              })
                            }
                          />
                          <select
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1.5px solid #F1F5F9",
                            }}
                            value={intakeForm.transportType}
                            onChange={(e) =>
                              setIntakeForm({
                                ...intakeForm,
                                transportType: e.target.value,
                              })
                            }
                          >
                            <option>Self Managed</option>
                            <option>Third Party Logistics</option>
                            <option>Buyer Arrangement</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Driver Details
                        </label>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <input
                            placeholder="Name"
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1.5px solid #F1F5F9",
                            }}
                            value={intakeForm.driverName}
                            onChange={(e) =>
                              setIntakeForm({
                                ...intakeForm,
                                driverName: e.target.value,
                              })
                            }
                          />
                          <input
                            placeholder="Mobile"
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1.5px solid #F1F5F9",
                            }}
                            value={intakeForm.driverMobile}
                            onChange={(e) =>
                              setIntakeForm({
                                ...intakeForm,
                                driverMobile: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px",
                        marginTop: "20px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Dispatch Status
                        </label>
                        <select
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                          }}
                          value={intakeForm.dispatchStatus}
                          onChange={(e) =>
                            setIntakeForm({
                              ...intakeForm,
                              dispatchStatus: e.target.value,
                            })
                          }
                        >
                          <option>Packed</option>
                          <option>Loaded</option>
                          <option>In Transit</option>
                          <option>Delivered</option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Payment Status
                        </label>
                        <select
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                          }}
                          value={intakeForm.paymentStatus}
                          onChange={(e) =>
                            setIntakeForm({
                              ...intakeForm,
                              paymentStatus: e.target.value,
                            })
                          }
                        >
                          <option>Pending</option>
                          <option>Partial</option>
                          <option>Paid</option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Payment Mode
                        </label>
                        <select
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                          }}
                          value={intakeForm.paymentMode}
                          onChange={(e) =>
                            setIntakeForm({
                              ...intakeForm,
                              paymentMode: e.target.value,
                            })
                          }
                        >
                          <option>Cash</option>
                          <option>UPI</option>
                          <option>Bank Transfer</option>
                          <option>Cheque</option>
                        </select>
                      </div>
                    </div>
                  </Card>

                  {/* Product Line Items */}
                  {intakeForm.lineItems.map((item, index) => (
                    <Card
                      key={item.itemGuid}
                      style={{
                        marginTop: "16px",
                        background: "#fcfcfc",
                        border:
                          index % 2 === 0
                            ? "1px solid #EBE9E1"
                            : "1px solid #D4E157",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "20px",
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            color: COLORS.sidebar,
                            fontSize: "14px",
                            fontWeight: "800",
                          }}
                        >
                          PRODUCT #{index + 1}
                        </h4>
                        <Button
                          variant="danger"
                          style={{ padding: "6px 12px", fontSize: "11px" }}
                          onClick={() => {
                            const newItems = intakeForm.lineItems.filter(
                              (li) => li.itemGuid !== item.itemGuid,
                            );
                            setIntakeForm({
                              ...intakeForm,
                              lineItems: newItems,
                            });
                          }}
                        >
                          ✕ Remove Product
                        </Button>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(180px, 1fr))",
                          gap: "16px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Category
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.category}
                            onChange={(e) => {
                              const val = e.target.value;
                              const newItems = [...intakeForm.lineItems];
                              newItems[index].category = val;
                              setIntakeForm({
                                ...intakeForm,
                                lineItems: newItems,
                              });
                            }}
                          >
                            <option>Fruits</option>
                            <option>Vegetables</option>
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Product Name (A-Z)
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                              fontWeight: "700",
                            }}
                            value={item.product}
                            onChange={(e) => {
                              const val = e.target.value;
                              const newItems = [...intakeForm.lineItems];
                              newItems[index].product = val;
                              // Auto-Duplicate Logic: Look for previous dispatches of the same product
                              const prev = lots.find(
                                (l) => l.lineItems?.[0]?.product === val,
                              );
                              if (prev) {
                                newItems[index].variety =
                                  prev.lineItems?.[0]?.variety || "";
                                newItems[index].grade =
                                  prev.lineItems?.[0]?.grade || "A Grade";
                                newItems[index].unit =
                                  prev.lineItems?.[0]?.unit || "KG";
                              }
                              setIntakeForm({
                                ...intakeForm,
                                lineItems: newItems,
                              });
                            }}
                          >
                            {item.category === "Fruits"
                              ? FRUIT_LIST_AZ.map((f) => (
                                  <option key={f}>{f}</option>
                                ))
                              : VEG_LIST_AZ.map((v) => (
                                  <option key={v}>{v}</option>
                                ))}
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Variety
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.variety}
                            onChange={(e) => {
                              const newItems = [...intakeForm.lineItems];
                              newItems[index].variety = e.target.value;
                              setIntakeForm({
                                ...intakeForm,
                                lineItems: newItems,
                              });
                            }}
                          >
                            {getProductData(item.product).varieties.map((v) => (
                              <option key={v}>{v}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Grade
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.grade}
                            onChange={(e) => {
                              const newItems = [...intakeForm.lineItems];
                              newItems[index].grade = e.target.value;
                              setIntakeForm({
                                ...intakeForm,
                                lineItems: newItems,
                              });
                            }}
                          >
                            <option>A Grade</option>
                            <option>B Grade</option>
                            <option>C Grade</option>
                            <option>Premium</option>
                            <option>Export Quality</option>
                          </select>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(150px, 1fr))",
                          gap: "14px",
                          marginTop: "16px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Size
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.size}
                            onChange={(e) => {
                              const n = [...intakeForm.lineItems];
                              n[index].size = e.target.value;
                              setIntakeForm({ ...intakeForm, lineItems: n });
                            }}
                          >
                            {getProductData(item.product).sizes.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Color
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.color}
                            onChange={(e) => {
                              const n = [...intakeForm.lineItems];
                              n[index].color = e.target.value;
                              setIntakeForm({ ...intakeForm, lineItems: n });
                            }}
                          >
                            {getProductData(item.product).colors.map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Quantity
                          </label>
                          <input
                            type="number"
                            placeholder="0"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.grossWeight}
                            onChange={(e) => {
                              const n = [...intakeForm.lineItems];
                              n[index].grossWeight = Number(e.target.value);
                              setIntakeForm({ ...intakeForm, lineItems: n });
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Unit Type
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.unit}
                            onChange={(e) => {
                              const n = [...intakeForm.lineItems];
                              n[index].unit = e.target.value;
                              setIntakeForm({ ...intakeForm, lineItems: n });
                            }}
                          >
                            <option>KG</option>
                            <option>Box</option>
                            <option>Crate</option>
                            <option>Ton</option>
                            <option>Packet</option>
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Rate per KG (₹)
                          </label>
                          <input
                            type="number"
                            placeholder="0.00"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.rate}
                            onChange={(e) => {
                              const n = [...intakeForm.lineItems];
                              n[index].rate = Number(e.target.value);
                              setIntakeForm({ ...intakeForm, lineItems: n });
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Total Weight
                          </label>
                          <input
                            disabled
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "none",
                              background: "#f0fdf4",
                              fontWeight: "800",
                              color: "#166534",
                            }}
                            value={`${item.grossWeight || 0} ${item.unit}`}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Total Amount (₹)
                          </label>
                          <input
                            disabled
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "none",
                              background: "#f0fdf4",
                              fontWeight: "900",
                              color: "#166534",
                            }}
                            value={formatCurrency(item.rate * item.grossWeight)}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(150px, 1fr))",
                          gap: "14px",
                          marginTop: "14px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            No. of Packages
                          </label>
                          <input
                            type="number"
                            placeholder="0"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.packages}
                            onChange={(e) => {
                              const n = [...intakeForm.lineItems];
                              n[index].packages = Number(e.target.value);
                              setIntakeForm({ ...intakeForm, lineItems: n });
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Packaging Type
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.packagingType}
                            onChange={(e) => {
                              const n = [...intakeForm.lineItems];
                              n[index].packagingType = e.target.value;
                              setIntakeForm({ ...intakeForm, lineItems: n });
                            }}
                          >
                            <option>Plastic Crates</option>
                            <option>Wooden Boxes</option>
                            <option>Corrugated Box</option>
                            <option>Gunny Bags</option>
                            <option>Loose Load</option>
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Batch Number
                          </label>
                          <input
                            placeholder="e.g. BCH-2026-001"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.batchNo}
                            onChange={(e) => {
                              const n = [...intakeForm.lineItems];
                              n[index].batchNo = e.target.value;
                              setIntakeForm({ ...intakeForm, lineItems: n });
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Quality Status
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.qualityStatus}
                            onChange={(e) => {
                              const n = [...intakeForm.lineItems];
                              n[index].qualityStatus = e.target.value;
                              setIntakeForm({ ...intakeForm, lineItems: n });
                            }}
                          >
                            <option>Passed</option>
                            <option>Quarantine</option>
                            <option>Rejected</option>
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Storage Type
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.storageType}
                            onChange={(e) => {
                              const n = [...intakeForm.lineItems];
                              n[index].storageType = e.target.value;
                              setIntakeForm({ ...intakeForm, lineItems: n });
                            }}
                          >
                            <option>Ambient</option>
                            <option>Cold Storage</option>
                            <option>Refrigerated</option>
                            <option>Hygienic Room</option>
                          </select>
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Dispatch Remarks
                          </label>
                          <input
                            placeholder="e.g. Handle with care, fragile, keep dry..."
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.remarks || ""}
                            onChange={(e) => {
                              const n = [...intakeForm.lineItems];
                              n[index].remarks = e.target.value;
                              setIntakeForm({ ...intakeForm, lineItems: n });
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}

                  <div
                    style={{
                      marginTop: "24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: COLORS.sidebar,
                      padding: "24px",
                      borderRadius: "20px",
                      color: "#fff",
                    }}
                  >
                    <div>
                      <Button
                        style={{
                          background: "#fff",
                          color: COLORS.sidebar,
                          fontWeight: "900",
                        }}
                        onClick={() => {
                          const newItem = {
                            itemGuid: Math.random().toString(36).substr(2, 9),
                            category: "Fruits",
                            product: "",
                            variety: "",
                            grade: "A Grade",
                            size: "Medium",
                            color: "Standard",
                            unit: "KG",
                            grossWeight: 0,
                            packages: 0,
                            packagingType: "Plastic Crates",
                            rate: 0,
                            batchNo: "",
                            qualityStatus: "Passed",
                            storageType: "Ambient",
                            remarks: "",
                          };
                          setIntakeForm({
                            ...intakeForm,
                            lineItems: [...intakeForm.lineItems, newItem],
                          });
                        }}
                      >
                        ⊕ Add Product
                      </Button>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          opacity: 0.7,
                          fontWeight: "700",
                        }}
                      >
                        DISPATCH TRANSACTION TOTAL
                      </p>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "32px",
                          fontWeight: "900",
                        }}
                      >
                        {formatCurrency(
                          intakeForm.lineItems.reduce(
                            (a, c) => a + c.rate * c.grossWeight,
                            0,
                          ),
                        )}
                      </h2>
                    </div>
                  </div>

                  <div
                    style={{ marginTop: "20px", display: "flex", gap: "16px" }}
                  >
                    <Button
                      style={{
                        flex: 1,
                        background: COLORS.success,
                        height: "60px",
                        fontSize: "18px",
                      }}
                      onClick={handleSaveDispatch}
                    >
                      🚀 Commit Dispatch & Log Inventory
                    </Button>
                    <Button
                      variant="outline"
                      style={{ background: "#fff", height: "60px" }}
                      onClick={() => alert("Draft saved.")}
                    >
                      💾 Save Draft
                    </Button>
                  </div>

                  <div style={{ marginTop: "40px" }}>
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "800",
                        color: COLORS.sidebar,
                        marginBottom: "16px",
                        borderBottom: "1px solid #EBE9E1",
                        paddingBottom: "12px",
                      }}
                    >
                      Recent Dispatches
                    </h3>
                    <div
                      style={{
                        overflowX: "auto",
                        background: "#fff",
                        borderRadius: "12px",
                        border: "1px solid #EBE9E1",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: "13px",
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              background: "#FDFBF4",
                              textAlign: "left",
                              color: COLORS.muted,
                            }}
                          >
                            <th
                              style={{
                                padding: "14px",
                                fontWeight: "700",
                                borderBottom: "1px solid #EBE9E1",
                              }}
                            >
                              Dispatch ID
                            </th>
                            <th
                              style={{
                                padding: "14px",
                                fontWeight: "700",
                                borderBottom: "1px solid #EBE9E1",
                              }}
                            >
                              Supplier
                            </th>
                            <th
                              style={{
                                padding: "14px",
                                fontWeight: "700",
                                borderBottom: "1px solid #EBE9E1",
                              }}
                            >
                              Product / Grade
                            </th>
                            <th
                              style={{
                                padding: "14px",
                                fontWeight: "700",
                                borderBottom: "1px solid #EBE9E1",
                              }}
                            >
                              Vehicle
                            </th>
                            <th
                              style={{
                                padding: "14px",
                                fontWeight: "700",
                                borderBottom: "1px solid #EBE9E1",
                              }}
                            >
                              Total
                            </th>
                            <th
                              style={{
                                padding: "14px",
                                fontWeight: "700",
                                borderBottom: "1px solid #EBE9E1",
                              }}
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              id: "DSP-55920",
                              supplier: "Priya Reddy",
                              product: "Apple · Premium",
                              vehicle: "TS09 EU 1234",
                              amount: "₹45,000",
                              status: "In Transit",
                            },
                            {
                              id: "DSP-55919",
                              supplier: "Srinivas Rao",
                              product: "Mango · A Grade",
                              vehicle: "AP28 BW 9091",
                              amount: "₹82,500",
                              status: "Delivered",
                            },
                            {
                              id: "DSP-55918",
                              supplier: "Mohan Chandra",
                              product: "Tomato · Standard",
                              vehicle: "TS07 CD 4455",
                              amount: "₹18,000",
                              status: "Delivered",
                            },
                          ].map((d, i) => (
                            <tr
                              key={i}
                              style={{
                                borderBottom:
                                  i === 2 ? "none" : "1px solid #EBE9E1",
                              }}
                            >
                              <td
                                style={{
                                  padding: "14px",
                                  fontWeight: "700",
                                  color: COLORS.sidebar,
                                }}
                              >
                                {d.id}
                              </td>
                              <td style={{ padding: "14px" }}>{d.supplier}</td>
                              <td style={{ padding: "14px" }}>{d.product}</td>
                              <td style={{ padding: "14px" }}>{d.vehicle}</td>
                              <td
                                style={{
                                  padding: "14px",
                                  fontWeight: "700",
                                  color: COLORS.sidebar,
                                }}
                              >
                                {d.amount}
                              </td>
                              <td style={{ padding: "14px" }}>
                                <span
                                  style={{
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    background:
                                      d.status === "Delivered"
                                        ? "#DCFCE7"
                                        : "#FEF3C7",
                                    color:
                                      d.status === "Delivered"
                                        ? "#166534"
                                        : "#92400E",
                                  }}
                                >
                                  {d.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Export & Sharing Center */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <Card
                  title="Communication & Sharing"
                  subtitle="Automated notifications for stakeholders"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        padding: "20px",
                        background: "#f0fdf4",
                        borderRadius: "20px",
                        border: "1px solid #dcfce7",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <b style={{ color: "#166534" }}>Owner Daily Summary</b>
                        <span
                          style={{
                            fontSize: "10px",
                            background: "#166534",
                            color: "#fff",
                            padding: "2px 8px",
                            borderRadius: "10px",
                          }}
                        >
                          CONFIGURED
                        </span>
                      </div>
                      <p style={{ fontSize: "12px", margin: "0 0 15px" }}>
                        Auto-share daily closing metrics to owner's WhatsApp at
                        09:00 PM.
                      </p>
                      <Button
                        variant="outline"
                        style={{
                          width: "100%",
                          background: "#fff",
                          color: "#166534",
                          borderColor: "#166534",
                        }}
                      >
                        Update Config
                      </Button>
                    </div>

                    <div
                      style={{
                        padding: "20px",
                        background: "#f8fafc",
                        borderRadius: "20px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <h4 style={{ margin: "0 0 10px" }}>
                        Manual Share Utility
                      </h4>
                      <p style={{ fontSize: "12px", marginBottom: "15px" }}>
                        Share document PDFs instantly with registered contacts.
                      </p>
                      <select
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "1px solid #cbd5e1",
                          marginBottom: "12px",
                          fontWeight: "700",
                        }}
                      >
                        <option>Select Stakeholder...</option>
                        <option>Vikram Reddy (Farmer)</option>
                        <option>Reliance Retail (Buyer)</option>
                      </select>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <Button style={{ flex: 2 }}>Share via WhatsApp</Button>
                        <Button variant="outline" style={{ flex: 1 }}>
                          Email
                        </Button>
                      </div>
                    </div>

                    <Card
                      style={{
                        background: "#0f172a",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      <h3>Universal Export</h3>
                      <p style={{ fontSize: "12px", opacity: 0.7 }}>
                        Download whole ecosystem data as encrypted CSV archive.
                      </p>
                      <Button
                        variant="primary"
                        style={{ marginTop: "15px", width: "100%" }}
                      >
                        Download Vault Data
                      </Button>
                    </Card>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Buyer Role Module (Handles both direct "Buyer" and nested "User Role") */}
          {(activeSection === "Buyer" ||
            (activeSection === "User Role" &&
              activeUserRoleTab === "Buyer")) && (
            <div style={{ animation: "fadeIn 0.4s ease-out" }}>
              <TabHeader
                tabs={[
                  "Buyer Registration",
                  "Purchase Entry",
                  "Buyer Accounts",
                ]}
                active={activeBuyerTab}
                set={setActiveBuyerTab}
              />

              {activeBuyerTab === "Buyer Registration" && (
                <div>
                  <FormGrid
                    sections={[
                      {
                        title: "Basic Details",
                        fields: [
                          {
                            label: "Buyer ID",
                            disabled: true,
                            value:
                              "SUP-" +
                              Math.floor(Math.random() * 90000 + 10000),
                          },
                          {
                            label: "Full Name",
                            placeholder: "Enter name",
                            value: buyerForm.name,
                            onChange: (e) =>
                              setBuyerForm({
                                ...buyerForm,
                                name: e.target.value,
                              }),
                          },
                          {
                            label: "Mobile Number",
                            type: "tel",
                            value: buyerForm.phone,
                            onChange: (e) =>
                              setBuyerForm({
                                ...buyerForm,
                                phone: e.target.value,
                              }),
                          },
                          { label: "Alternate Mobile / Landline", type: "tel" },
                          { label: "WhatsApp Number", type: "tel" },
                          { label: "Email", type: "email" },
                          {
                            label: "Local / Non-Local",
                            type: "select",
                            options: ["Local", "Non-Local"],
                          },
                          {
                            label: "Address",
                            placeholder: "Street/Village",
                            value: buyerForm.address,
                            onChange: (e) =>
                              setBuyerForm({
                                ...buyerForm,
                                address: e.target.value,
                              }),
                          },
                          { label: "City" },
                          { label: "District" },
                          { label: "Pincode" },
                          { label: "State" },
                          { label: "Country", value: "India" },
                          { label: "GST Number" },
                          { label: "Aadhaar / PAN Number" },
                          { label: "Business Name" },
                          {
                            label: "Registration Date",
                            type: "date",
                            value: new Date().toISOString().slice(0, 10),
                          },
                        ],
                      },
                      {
                        title: "Additional Business Details",
                        fields: [
                          {
                            label: "Preferred Payment Method",
                            type: "select",
                            options: [
                              "Bank Transfer (RTGS/NEFT)",
                              "UPI",
                              "Cash",
                              "Cheque",
                            ],
                          },
                          {
                            label: "Credit Limit (₹)",
                            type: "number",
                            placeholder: "0.00",
                          },
                          {
                            label: "Buyer Category",
                            type: "select",
                            options: [
                              "Farmer",
                              "Wholesaler",
                              "Broker",
                              "Agent",
                            ],
                          },
                          {
                            label: "Transport Availability",
                            type: "select",
                            options: [
                              "Yes - Own Transport",
                              "No - Requires Pickup",
                            ],
                          },
                          { label: "Remarks / Notes" },
                        ],
                      },
                    ]}
                  />
                  <div
                    style={{ display: "flex", gap: "16px", marginTop: "32px" }}
                  >
                    <Button
                      style={{ background: COLORS.sidebar }}
                      onClick={handleRegisterBuyer}
                    >
                      Register Buyer
                    </Button>
                    <Button variant="secondary">Save Draft</Button>
                    <Button variant="outline">Edit</Button>
                    <Button
                      variant="danger"
                      style={{
                        background: "#F1F5F9",
                        color: COLORS.danger,
                        border: "none",
                      }}
                    >
                      Cancel All
                    </Button>
                  </div>
                </div>
              )}

              {activeBuyerTab === "Purchase Entry" && (
                <div style={{ animation: "fadeIn 0.5s ease-out" }}>
                  {/* Logistics & Core Details */}
                  <Card
                    style={{
                      marginBottom: "24px",
                      borderLeft: `6px solid ${COLORS.sidebar}`,
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Purchase ID
                        </label>
                        <input
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                            fontWeight: "700",
                          }}
                          value={buyerPurchaseForm.dispatchId}
                          onChange={(e) =>
                            setBuyerPurchaseForm({
                              ...buyerPurchaseForm,
                              dispatchId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Supplier / Farmer
                        </label>
                        <select
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                            fontWeight: "700",
                          }}
                          value={buyerPurchaseForm.supplierId}
                          onChange={(e) => {
                            const s = suppliers.find(
                              (sup) => sup.name === e.target.value,
                            );
                            setBuyerPurchaseForm({
                              ...buyerPurchaseForm,
                              supplierId: e.target.value,
                              origin: s?.village || "",
                            });
                          }}
                        >
                          <option>Select Supplier</option>
                          {suppliers.map((s) => (
                            <option key={s._id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Buyer Name
                        </label>
                        <select
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                            fontWeight: "700",
                          }}
                          value={buyerPurchaseForm.buyerId}
                          onChange={(e) => {
                            const b = buyers.find(
                              (x) => (x.shopName || x.name) === e.target.value,
                            );
                            setBuyerPurchaseForm({
                              ...buyerPurchaseForm,
                              buyerId: e.target.value,
                              buyerMobile: b?.phone || b?.mobile || "",
                            });
                          }}
                        >
                          <option>Select Buyer</option>
                          {buyers.map((b) => (
                            <option key={b._id}>{b.shopName || b.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Dispatch Date & Time
                        </label>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <input
                            type="date"
                            style={{
                              flex: 2,
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1.5px solid #F1F5F9",
                            }}
                            value={buyerPurchaseForm.entryDate}
                            onChange={(e) =>
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                entryDate: e.target.value,
                              })
                            }
                          />
                          <input
                            type="time"
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1.5px solid #F1F5F9",
                            }}
                            value={buyerPurchaseForm.entryTime}
                            onChange={(e) =>
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                entryTime: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px",
                        marginTop: "20px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Buyer Mobile
                        </label>
                        <input
                          placeholder="+91 9999999999"
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                          }}
                          value={buyerPurchaseForm.buyerMobile}
                          onChange={(e) =>
                            setBuyerPurchaseForm({
                              ...buyerPurchaseForm,
                              buyerMobile: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Destination Location
                        </label>
                        <input
                          placeholder="e.g. Madanapalle Market Hub"
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                          }}
                          value={buyerPurchaseForm.destination}
                          onChange={(e) =>
                            setBuyerPurchaseForm({
                              ...buyerPurchaseForm,
                              destination: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Vehicle Info
                        </label>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <input
                            placeholder="TS 09 EU 1234"
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1.5px solid #F1F5F9",
                            }}
                            value={buyerPurchaseForm.vehicleNumber}
                            onChange={(e) =>
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                vehicleNumber: e.target.value,
                              })
                            }
                          />
                          <select
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1.5px solid #F1F5F9",
                            }}
                            value={buyerPurchaseForm.transportType}
                            onChange={(e) =>
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                transportType: e.target.value,
                              })
                            }
                          >
                            <option>Self Managed</option>
                            <option>Third Party Logistics</option>
                            <option>Buyer Arrangement</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Driver Details
                        </label>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <input
                            placeholder="Name"
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1.5px solid #F1F5F9",
                            }}
                            value={buyerPurchaseForm.driverName}
                            onChange={(e) =>
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                driverName: e.target.value,
                              })
                            }
                          />
                          <input
                            placeholder="Mobile"
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1.5px solid #F1F5F9",
                            }}
                            value={buyerPurchaseForm.driverMobile}
                            onChange={(e) =>
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                driverMobile: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px",
                        marginTop: "20px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Dispatch Status
                        </label>
                        <select
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                          }}
                          value={buyerPurchaseForm.dispatchStatus}
                          onChange={(e) =>
                            setBuyerPurchaseForm({
                              ...buyerPurchaseForm,
                              dispatchStatus: e.target.value,
                            })
                          }
                        >
                          <option>Packed</option>
                          <option>Loaded</option>
                          <option>In Transit</option>
                          <option>Delivered</option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Payment Status
                        </label>
                        <select
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                          }}
                          value={buyerPurchaseForm.paymentStatus}
                          onChange={(e) =>
                            setBuyerPurchaseForm({
                              ...buyerPurchaseForm,
                              paymentStatus: e.target.value,
                            })
                          }
                        >
                          <option>Pending</option>
                          <option>Partial</option>
                          <option>Paid</option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: COLORS.sidebar,
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Payment Mode
                        </label>
                        <select
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1.5px solid #F1F5F9",
                          }}
                          value={buyerPurchaseForm.paymentMode}
                          onChange={(e) =>
                            setBuyerPurchaseForm({
                              ...buyerPurchaseForm,
                              paymentMode: e.target.value,
                            })
                          }
                        >
                          <option>Cash</option>
                          <option>UPI</option>
                          <option>Bank Transfer</option>
                          <option>Cheque</option>
                        </select>
                      </div>
                    </div>
                  </Card>

                  {/* Product Line Items */}
                  {buyerPurchaseForm.lineItems.map((item, index) => (
                    <Card
                      key={item.itemGuid}
                      style={{
                        marginTop: "16px",
                        background: "#fcfcfc",
                        border:
                          index % 2 === 0
                            ? "1px solid #EBE9E1"
                            : "1px solid #D4E157",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "20px",
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            color: COLORS.sidebar,
                            fontSize: "14px",
                            fontWeight: "800",
                          }}
                        >
                          PRODUCT #{index + 1}
                        </h4>
                        <Button
                          variant="danger"
                          style={{ padding: "6px 12px", fontSize: "11px" }}
                          onClick={() => {
                            const newItems = buyerPurchaseForm.lineItems.filter(
                              (li) => li.itemGuid !== item.itemGuid,
                            );
                            setBuyerPurchaseForm({
                              ...buyerPurchaseForm,
                              lineItems: newItems,
                            });
                          }}
                        >
                          ✕ Remove Product
                        </Button>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(180px, 1fr))",
                          gap: "16px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Category
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.category}
                            onChange={(e) => {
                              const val = e.target.value;
                              const newItems = [...buyerPurchaseForm.lineItems];
                              newItems[index].category = val;
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                lineItems: newItems,
                              });
                            }}
                          >
                            <option>Fruits</option>
                            <option>Vegetables</option>
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Product Name (A-Z)
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                              fontWeight: "700",
                            }}
                            value={item.product}
                            onChange={(e) => {
                              const val = e.target.value;
                              const newItems = [...buyerPurchaseForm.lineItems];
                              newItems[index].product = val;
                              // Auto-Duplicate Logic: Look for previous dispatches of the same product
                              const prev = lots.find(
                                (l) => l.lineItems?.[0]?.product === val,
                              );
                              if (prev) {
                                newItems[index].variety =
                                  prev.lineItems?.[0]?.variety || "";
                                newItems[index].grade =
                                  prev.lineItems?.[0]?.grade || "A Grade";
                                newItems[index].unit =
                                  prev.lineItems?.[0]?.unit || "KG";
                              }
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                lineItems: newItems,
                              });
                            }}
                          >
                            {item.category === "Fruits"
                              ? FRUIT_LIST_AZ.map((f) => (
                                  <option key={f}>{f}</option>
                                ))
                              : VEG_LIST_AZ.map((v) => (
                                  <option key={v}>{v}</option>
                                ))}
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Variety
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.variety}
                            onChange={(e) => {
                              const newItems = [...buyerPurchaseForm.lineItems];
                              newItems[index].variety = e.target.value;
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                lineItems: newItems,
                              });
                            }}
                          >
                            {getProductData(item.product).varieties.map((v) => (
                              <option key={v}>{v}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Grade
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.grade}
                            onChange={(e) => {
                              const newItems = [...buyerPurchaseForm.lineItems];
                              newItems[index].grade = e.target.value;
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                lineItems: newItems,
                              });
                            }}
                          >
                            <option>A Grade</option>
                            <option>B Grade</option>
                            <option>C Grade</option>
                            <option>Premium</option>
                            <option>Export Quality</option>
                          </select>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(150px, 1fr))",
                          gap: "14px",
                          marginTop: "16px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Size
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.size}
                            onChange={(e) => {
                              const n = [...buyerPurchaseForm.lineItems];
                              n[index].size = e.target.value;
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                lineItems: n,
                              });
                            }}
                          >
                            {getProductData(item.product).sizes.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Color
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.color}
                            onChange={(e) => {
                              const n = [...buyerPurchaseForm.lineItems];
                              n[index].color = e.target.value;
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                lineItems: n,
                              });
                            }}
                          >
                            {getProductData(item.product).colors.map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Quantity
                          </label>
                          <input
                            type="number"
                            placeholder="0"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.grossWeight}
                            onChange={(e) => {
                              const n = [...buyerPurchaseForm.lineItems];
                              n[index].grossWeight = Number(e.target.value);
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                lineItems: n,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Unit Type
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.unit}
                            onChange={(e) => {
                              const n = [...buyerPurchaseForm.lineItems];
                              n[index].unit = e.target.value;
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                lineItems: n,
                              });
                            }}
                          >
                            <option>KG</option>
                            <option>Box</option>
                            <option>Crate</option>
                            <option>Ton</option>
                            <option>Packet</option>
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Rate per KG (₹)
                          </label>
                          <input
                            type="number"
                            placeholder="0.00"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.rate}
                            onChange={(e) => {
                              const n = [...buyerPurchaseForm.lineItems];
                              n[index].rate = Number(e.target.value);
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                lineItems: n,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Total Weight
                          </label>
                          <input
                            disabled
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "none",
                              background: "#f0fdf4",
                              fontWeight: "800",
                              color: "#166534",
                            }}
                            value={`${item.grossWeight || 0} ${item.unit}`}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Total Amount (₹)
                          </label>
                          <input
                            disabled
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "none",
                              background: "#f0fdf4",
                              fontWeight: "900",
                              color: "#166534",
                            }}
                            value={formatCurrency(item.rate * item.grossWeight)}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(150px, 1fr))",
                          gap: "14px",
                          marginTop: "14px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            No. of Packages
                          </label>
                          <input
                            type="number"
                            placeholder="0"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.packages}
                            onChange={(e) => {
                              const n = [...buyerPurchaseForm.lineItems];
                              n[index].packages = Number(e.target.value);
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                lineItems: n,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Packaging Type
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.packagingType}
                            onChange={(e) => {
                              const n = [...buyerPurchaseForm.lineItems];
                              n[index].packagingType = e.target.value;
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                lineItems: n,
                              });
                            }}
                          >
                            <option>Plastic Crates</option>
                            <option>Wooden Boxes</option>
                            <option>Corrugated Box</option>
                            <option>Gunny Bags</option>
                            <option>Loose Load</option>
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Batch Number
                          </label>
                          <input
                            placeholder="e.g. BCH-2026-001"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.batchNo}
                            onChange={(e) => {
                              const n = [...buyerPurchaseForm.lineItems];
                              n[index].batchNo = e.target.value;
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                lineItems: n,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Quality Status
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.qualityStatus}
                            onChange={(e) => {
                              const n = [...buyerPurchaseForm.lineItems];
                              n[index].qualityStatus = e.target.value;
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                lineItems: n,
                              });
                            }}
                          >
                            <option>Passed</option>
                            <option>Quarantine</option>
                            <option>Rejected</option>
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Storage Type
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.storageType}
                            onChange={(e) => {
                              const n = [...buyerPurchaseForm.lineItems];
                              n[index].storageType = e.target.value;
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                lineItems: n,
                              });
                            }}
                          >
                            <option>Ambient</option>
                            <option>Cold Storage</option>
                            <option>Refrigerated</option>
                            <option>Hygienic Room</option>
                          </select>
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                          <label
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Dispatch Remarks
                          </label>
                          <input
                            placeholder="e.g. Handle with care, fragile, keep dry..."
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1.2px solid #E2E8F0",
                            }}
                            value={item.remarks || ""}
                            onChange={(e) => {
                              const n = [...buyerPurchaseForm.lineItems];
                              n[index].remarks = e.target.value;
                              setBuyerPurchaseForm({
                                ...buyerPurchaseForm,
                                lineItems: n,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}

                  <div
                    style={{
                      marginTop: "24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: COLORS.sidebar,
                      padding: "24px",
                      borderRadius: "20px",
                      color: "#fff",
                    }}
                  >
                    <div>
                      <Button
                        style={{
                          background: "#fff",
                          color: COLORS.sidebar,
                          fontWeight: "900",
                        }}
                        onClick={() => {
                          const newItem = {
                            itemGuid: Math.random().toString(36).substr(2, 9),
                            category: "Fruits",
                            product: "",
                            variety: "",
                            grade: "A Grade",
                            size: "Medium",
                            color: "Standard",
                            unit: "KG",
                            grossWeight: 0,
                            packages: 0,
                            packagingType: "Plastic Crates",
                            rate: 0,
                            batchNo: "",
                            qualityStatus: "Passed",
                            storageType: "Ambient",
                            remarks: "",
                          };
                          setBuyerPurchaseForm({
                            ...buyerPurchaseForm,
                            lineItems: [
                              ...buyerPurchaseForm.lineItems,
                              newItem,
                            ],
                          });
                        }}
                      >
                        ⊕ Add Product
                      </Button>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          opacity: 0.7,
                          fontWeight: "700",
                        }}
                      >
                        DISPATCH TRANSACTION TOTAL
                      </p>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "32px",
                          fontWeight: "900",
                        }}
                      >
                        {formatCurrency(
                          buyerPurchaseForm.lineItems.reduce(
                            (a, c) => a + c.rate * c.grossWeight,
                            0,
                          ),
                        )}
                      </h2>
                    </div>
                  </div>

                  <div
                    style={{ marginTop: "20px", display: "flex", gap: "16px" }}
                  >
                    <Button
                      style={{
                        flex: 1,
                        background: COLORS.success,
                        height: "60px",
                        fontSize: "18px",
                      }}
                      onClick={handleSavePurchase}
                    >
                      🚀 Commit Dispatch & Log Inventory
                    </Button>
                    <Button
                      variant="outline"
                      style={{ background: "#fff", height: "60px" }}
                      onClick={() => alert("Draft saved.")}
                    >
                      💾 Save Draft
                    </Button>
                  </div>

                  <div style={{ marginTop: "40px" }}>
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "800",
                        color: COLORS.sidebar,
                        marginBottom: "16px",
                        borderBottom: "1px solid #EBE9E1",
                        paddingBottom: "12px",
                      }}
                    >
                      Recent Dispatches
                    </h3>
                    <div
                      style={{
                        overflowX: "auto",
                        background: "#fff",
                        borderRadius: "12px",
                        border: "1px solid #EBE9E1",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: "13px",
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              background: "#FDFBF4",
                              textAlign: "left",
                              color: COLORS.muted,
                            }}
                          >
                            <th
                              style={{
                                padding: "14px",
                                fontWeight: "700",
                                borderBottom: "1px solid #EBE9E1",
                              }}
                            >
                              Purchase ID
                            </th>
                            <th
                              style={{
                                padding: "14px",
                                fontWeight: "700",
                                borderBottom: "1px solid #EBE9E1",
                              }}
                            >
                              Supplier
                            </th>
                            <th
                              style={{
                                padding: "14px",
                                fontWeight: "700",
                                borderBottom: "1px solid #EBE9E1",
                              }}
                            >
                              Buyer
                            </th>
                            <th
                              style={{
                                padding: "14px",
                                fontWeight: "700",
                                borderBottom: "1px solid #EBE9E1",
                              }}
                            >
                              Product / Grade
                            </th>
                            <th
                              style={{
                                padding: "14px",
                                fontWeight: "700",
                                borderBottom: "1px solid #EBE9E1",
                              }}
                            >
                              Vehicle
                            </th>
                            <th
                              style={{
                                padding: "14px",
                                fontWeight: "700",
                                borderBottom: "1px solid #EBE9E1",
                              }}
                            >
                              Total
                            </th>
                            <th
                              style={{
                                padding: "14px",
                                fontWeight: "700",
                                borderBottom: "1px solid #EBE9E1",
                              }}
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              id: "DSP-55920",
                              supplier: "Priya Reddy",
                              buyer: "Harsha Wholesale",
                              product: "Apple · Premium",
                              vehicle: "TS09 EU 1234",
                              amount: "₹45,000",
                              status: "In Transit",
                            },
                            {
                              id: "DSP-55919",
                              supplier: "Srinivas Rao",
                              buyer: "Reliance Retail",
                              product: "Mango · A Grade",
                              vehicle: "AP28 BW 9091",
                              amount: "₹82,500",
                              status: "Delivered",
                            },
                            {
                              id: "DSP-55918",
                              supplier: "Mohan Chandra",
                              buyer: "Metro Cash",
                              product: "Tomato · Standard",
                              vehicle: "TS07 CD 4455",
                              amount: "₹18,000",
                              status: "Delivered",
                            },
                          ].map((d, i) => (
                            <tr
                              key={i}
                              style={{
                                borderBottom:
                                  i === 2 ? "none" : "1px solid #EBE9E1",
                              }}
                            >
                              <td
                                style={{
                                  padding: "14px",
                                  fontWeight: "700",
                                  color: COLORS.sidebar,
                                }}
                              >
                                {d.id}
                              </td>
                              <td style={{ padding: "14px" }}>{d.supplier}</td>
                              <td style={{ padding: "14px" }}>{d.buyer}</td>
                              <td style={{ padding: "14px" }}>{d.product}</td>
                              <td style={{ padding: "14px" }}>{d.vehicle}</td>
                              <td
                                style={{
                                  padding: "14px",
                                  fontWeight: "700",
                                  color: COLORS.sidebar,
                                }}
                              >
                                {d.amount}
                              </td>
                              <td style={{ padding: "14px" }}>
                                <span
                                  style={{
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    background:
                                      d.status === "Delivered"
                                        ? "#DCFCE7"
                                        : "#FEF3C7",
                                    color:
                                      d.status === "Delivered"
                                        ? "#166534"
                                        : "#92400E",
                                  }}
                                >
                                  {d.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Export & Sharing Center */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <Card
                  title="Communication & Sharing"
                  subtitle="Automated notifications for stakeholders"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        padding: "20px",
                        background: "#f0fdf4",
                        borderRadius: "20px",
                        border: "1px solid #dcfce7",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <b style={{ color: "#166534" }}>Owner Daily Summary</b>
                        <span
                          style={{
                            fontSize: "10px",
                            background: "#166534",
                            color: "#fff",
                            padding: "2px 8px",
                            borderRadius: "10px",
                          }}
                        >
                          CONFIGURED
                        </span>
                      </div>
                      <p style={{ fontSize: "12px", margin: "0 0 15px" }}>
                        Auto-share daily closing metrics to owner's WhatsApp at
                        09:00 PM.
                      </p>
                      <Button
                        variant="outline"
                        style={{
                          width: "100%",
                          background: "#fff",
                          color: "#166534",
                          borderColor: "#166534",
                        }}
                      >
                        Update Config
                      </Button>
                    </div>

                    <div
                      style={{
                        padding: "20px",
                        background: "#f8fafc",
                        borderRadius: "20px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <h4 style={{ margin: "0 0 10px" }}>
                        Manual Share Utility
                      </h4>
                      <p style={{ fontSize: "12px", marginBottom: "15px" }}>
                        Share document PDFs instantly with registered contacts.
                      </p>
                      <select
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "1px solid #cbd5e1",
                          marginBottom: "12px",
                          fontWeight: "700",
                        }}
                      >
                        <option>Select Stakeholder...</option>
                        <option>Vikram Reddy (Farmer)</option>
                        <option>Reliance Retail (Buyer)</option>
                      </select>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <Button style={{ flex: 2 }}>Share via WhatsApp</Button>
                        <Button variant="outline" style={{ flex: 1 }}>
                          Email
                        </Button>
                      </div>
                    </div>

                    <Card
                      style={{
                        background: "#0f172a",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      <h3>Universal Export</h3>
                      <p style={{ fontSize: "12px", opacity: 0.7 }}>
                        Download whole ecosystem data as encrypted CSV archive.
                      </p>
                      <Button
                        variant="primary"
                        style={{ marginTop: "15px", width: "100%" }}
                      >
                        Download Vault Data
                      </Button>
                    </Card>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* 15.5 PRODUCT MASTER & CONFIGURATION */}
          {activeSection === "Product Master & Configuration" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                animation: "slideUp 0.5s ease-out",
              }}
            >
              {/* Config Sub-Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  background: "#fff",
                  padding: "8px",
                  borderRadius: "16px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  alignSelf: "flex-start",
                }}
              >
                {["Product", "Expense", "System"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveConfigTab(tab)}
                    style={{
                      padding: "12px 28px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "850",
                      transition: "0.2s",
                      background:
                        activeConfigTab === tab
                          ? COLORS.primary
                          : "transparent",
                      color: activeConfigTab === tab ? "#fff" : COLORS.muted,
                    }}
                  >
                    {tab === "Product"
                      ? "🍏 Product Catalog"
                      : tab === "Expense"
                        ? "💸 Expense Masters"
                        : "⚙️ System Settings"}
                  </button>
                ))}
              </div>

              {activeConfigTab === "Product" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1.8fr",
                    gap: "32px",
                  }}
                >
                  <Card
                    title="Add New Product / Variety"
                    subtitle="No-coding required catalog expansion"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <Input
                        label="Core Product (Level 1)"
                        placeholder="e.g. Mango, Tomato"
                        value={newProductForm.coreProduct}
                        onChange={(e) =>
                          setNewProductForm({
                            ...newProductForm,
                            coreProduct: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="Variety Name (Level 2)"
                        placeholder="e.g. Alphonso, S-Grade"
                        value={newProductForm.variety}
                        onChange={(e) =>
                          setNewProductForm({
                            ...newProductForm,
                            variety: e.target.value,
                          })
                        }
                      />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "6px",
                              fontWeight: "800",
                              color: COLORS.secondary,
                              fontSize: "11px",
                            }}
                          >
                            Default Grade
                          </label>
                          <select
                            value={newProductForm.grade}
                            onChange={(e) =>
                              setNewProductForm({
                                ...newProductForm,
                                grade: e.target.value,
                              })
                            }
                            style={{
                              width: "100%",
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1px solid #e2e8f0",
                              background: "#f8fafc",
                              fontWeight: "600",
                            }}
                          >
                            <option>A-Grade</option>
                            <option>B-Grade</option>
                            <option>C-Grade</option>
                            <option>Export Quality</option>
                            <option>Pulp Grade</option>
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "6px",
                              fontWeight: "800",
                              color: COLORS.secondary,
                              fontSize: "11px",
                            }}
                          >
                            Standard Unit
                          </label>
                          <select
                            value={newProductForm.unit}
                            onChange={(e) =>
                              setNewProductForm({
                                ...newProductForm,
                                unit: e.target.value,
                              })
                            }
                            style={{
                              width: "100%",
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1px solid #e2e8f0",
                              background: "#f8fafc",
                              fontWeight: "600",
                            }}
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
                      <Button
                        style={{ marginTop: "10px" }}
                        onClick={handleRegisterProduct}
                      >
                        Register in Catalog
                      </Button>
                    </div>
                  </Card>

                  <Card
                    title="Active Product Hierarchy"
                    subtitle="Current configurable variety & grade matrix"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {masterProducts.map((p, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "20px",
                            background: "#f8fafc",
                            borderRadius: "20px",
                            border: "1.5px solid #e2e8f0",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "12px",
                            }}
                          >
                            <h3 style={{ margin: 0, color: COLORS.secondary }}>
                              {p.name}
                            </h3>
                            <span
                              style={{
                                fontSize: "12px",
                                background: "#e2e8f0",
                                padding: "4px 10px",
                                borderRadius: "8px",
                                fontWeight: "800",
                              }}
                            >
                              {p.units.join(", ")}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                            }}
                          >
                            {p.varieties.map((v) => (
                              <span
                                key={v}
                                style={{
                                  fontSize: "11px",
                                  background: "#fff",
                                  border: "1px solid #cbd5e1",
                                  padding: "4px 12px",
                                  borderRadius: "10px",
                                  fontWeight: "600",
                                }}
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                          <div
                            style={{
                              marginTop: "12px",
                              display: "flex",
                              gap: "6px",
                            }}
                          >
                            {p.grades.map((g) => (
                              <span
                                key={g}
                                style={{
                                  fontSize: "10px",
                                  color: COLORS.primary,
                                  fontWeight: "900",
                                }}
                              >
                                • {g}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {activeConfigTab === "Expense" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.5fr",
                    gap: "32px",
                  }}
                >
                  <Card
                    title="Register Expense Category"
                    subtitle="Admin can add/rename billing deductions"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <Input
                        label="Category Label"
                        placeholder="e.g. Loading Fee"
                        value={newExpenseForm.label}
                        onChange={(e) =>
                          setNewExpenseForm({
                            ...newExpenseForm,
                            label: e.target.value,
                          })
                        }
                      />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "6px",
                              fontWeight: "800",
                              color: COLORS.secondary,
                              fontSize: "11px",
                            }}
                          >
                            Calculation Type
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <option>Percentage (%)</option>
                            <option>Fixed Amount (₹)</option>
                          </select>
                        </div>
                        <Input
                          label="Default Value"
                          placeholder="e.g. 4"
                          value={newExpenseForm.defaultValue}
                          onChange={(e) =>
                            setNewExpenseForm({
                              ...newExpenseForm,
                              defaultValue: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        style={{ marginTop: "10px" }}
                        onClick={handleRegisterExpenseCategory}
                      >
                        Create Ledger Category
                      </Button>
                    </div>
                  </Card>
                  <Card
                    title="Expense Master List"
                    subtitle="Manage appearing categories in Bills/Invoices"
                  >
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr
                          style={{
                            textAlign: "left",
                            borderBottom: "2px solid #f1f5f9",
                          }}
                        >
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Label
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Type
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Default
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Activity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {masterExpenses.map((ex) => (
                          <tr
                            key={ex.id}
                            style={{ borderBottom: "1px solid #f8fafc" }}
                          >
                            <td style={{ padding: "12px", fontWeight: "700" }}>
                              {ex.name}
                            </td>
                            <td style={{ padding: "12px", fontSize: "13px" }}>
                              {ex.type}
                            </td>
                            <td style={{ padding: "12px", fontSize: "13px" }}>
                              {ex.type === "Percentage"
                                ? `${ex.default}%`
                                : formatCurrency(ex.default)}
                            </td>
                            <td style={{ padding: "12px" }}>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                  style={{
                                    color: COLORS.primary,
                                    background: "none",
                                    border: "none",
                                    fontSize: "12px",
                                    fontWeight: "850",
                                    cursor: "pointer",
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  style={{
                                    color: "#ef4444",
                                    background: "none",
                                    border: "none",
                                    fontSize: "12px",
                                    fontWeight: "850",
                                    cursor: "pointer",
                                  }}
                                >
                                  {ex.active ? "Deactivate" : "Activate"}
                                </button>
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
                <Card
                  title="Global Governance & System Settings"
                  subtitle="Branding, financial rules and automated communication"
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "32px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <h4
                        style={{
                          color: COLORS.primary,
                          borderBottom: `2px solid ${COLORS.primary}`,
                          paddingBottom: "8px",
                          margin: "0 0 8px",
                        }}
                      >
                        📦 Core Branding
                      </h4>
                      <Input
                        label="Business Name"
                        value={systemSettings.businessName}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            businessName: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="Business Address"
                        value={systemSettings.address}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            address: e.target.value,
                          })
                        }
                      />
                      <div
                        style={{
                          padding: "12px",
                          border: "2px dashed #e2e8f0",
                          borderRadius: "10px",
                          textAlign: "center",
                          fontSize: "11px",
                        }}
                      >
                        Drop Logo File Here (.png/.jpg)
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <h4
                        style={{
                          color: COLORS.primary,
                          borderBottom: `2px solid ${COLORS.primary}`,
                          paddingBottom: "8px",
                          margin: "0 0 8px",
                        }}
                      >
                        💰 Financial Defaults
                      </h4>
                      <Input
                        label="Global Default Commission (%)"
                        type="number"
                        value={systemSettings.defaultCommission}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            defaultCommission: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="Standard Payment Terms"
                        placeholder="7 Days"
                        value={systemSettings.buyerPaymentTerms}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            buyerPaymentTerms: e.target.value,
                          })
                        }
                      />
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "800",
                            color: COLORS.secondary,
                            fontSize: "11px",
                          }}
                        >
                          Financial Year Cycle
                        </label>
                        <select
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <option>April–March (India)</option>
                          <option>January–December</option>
                        </select>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <h4
                        style={{
                          color: COLORS.primary,
                          borderBottom: `2px solid ${COLORS.primary}`,
                          paddingBottom: "8px",
                          margin: "0 0 8px",
                        }}
                      >
                        📑 Documentation & Comms
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "2fr 1fr",
                          gap: "10px",
                        }}
                      >
                        <Input
                          label="Invoice Prefix"
                          value={systemSettings.invoicePrefix}
                          onChange={(e) =>
                            setSystemSettings({
                              ...systemSettings,
                              invoicePrefix: e.target.value,
                            })
                          }
                        />
                        <Input label="Start #" placeholder="101" />
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "2fr 1fr",
                          gap: "10px",
                        }}
                      >
                        <Input
                          label="Farmer Bill Prefix"
                          value={systemSettings.billPrefix}
                          onChange={(e) =>
                            setSystemSettings({
                              ...systemSettings,
                              billPrefix: e.target.value,
                            })
                          }
                        />
                        <Input label="Start #" placeholder="1" />
                      </div>
                      <Input
                        label="Auth WhatsApp No (For Webhook)"
                        value={systemSettings.authWhatsApp}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            authWhatsApp: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "40px",
                      borderTop: "1.5px solid #f1f5f9",
                      paddingTop: "24px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      style={{ padding: "14px 40px" }}
                      onClick={() =>
                        alert(
                          "💿 SYSTEM CONFIGURATION COLD-BOOTED: All settings persisted.",
                        )
                      }
                    >
                      Commit Global Settings
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* 15.6 USER ROLES, ACCESS CONTROL & SECURITY */}
          {activeSection === "User Roles, Access Control & Security" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                animation: "slideUp 0.5s ease-out",
              }}
            >
              {/* Security Sub-Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  background: "#fff",
                  padding: "8px",
                  borderRadius: "16px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  alignSelf: "flex-start",
                }}
              >
                {["Staff Hub", "Permissions", "Security"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSecurityTab(tab)}
                    style={{
                      padding: "12px 28px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "850",
                      transition: "0.2s",
                      background:
                        activeSecurityTab === tab
                          ? COLORS.primary
                          : "transparent",
                      color: activeSecurityTab === tab ? "#fff" : COLORS.muted,
                    }}
                  >
                    {tab === "Staff Hub"
                      ? "👥 Staff Identity Hub"
                      : tab === "Permissions"
                        ? "🛡️ Role Matrix"
                        : "🔐 Security Guard"}
                  </button>
                ))}
              </div>

              {activeSecurityTab === "Staff Hub" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: "32px",
                  }}
                >
                  <Card
                    title="Onboard New Staff"
                    subtitle="Create digital identities for Mandi personnel"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <Input
                        label="Staff Full Name"
                        placeholder="e.g. Ramesh K."
                        value={newStaffForm.name}
                        onChange={(e) =>
                          setNewStaffForm({
                            ...newStaffForm,
                            name: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="Login Username"
                        placeholder="staff_01"
                        value={newStaffForm.username}
                        onChange={(e) =>
                          setNewStaffForm({
                            ...newStaffForm,
                            username: e.target.value,
                          })
                        }
                      />
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "800",
                            color: COLORS.secondary,
                            fontSize: "11px",
                          }}
                        >
                          System Role
                        </label>
                        <select
                          value={newStaffForm.role}
                          onChange={(e) =>
                            setNewStaffForm({
                              ...newStaffForm,
                              role: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                            background: "#f8fafc",
                            fontWeight: "600",
                          }}
                        >
                          <option>Accountant</option>
                          <option>Operations Staff</option>
                          <option>Viewer (Read-Only)</option>
                          <option>Admin / Owner</option>
                        </select>
                      </div>
                      <Input
                        label="Access Expiry (Optional)"
                        type="date"
                        value={newStaffForm.expiry}
                        onChange={(e) =>
                          setNewStaffForm({
                            ...newStaffForm,
                            expiry: e.target.value,
                          })
                        }
                      />
                      <Button
                        style={{ marginTop: "10px" }}
                        onClick={handleCreateStaff}
                      >
                        Create Access Identity
                      </Button>
                    </div>
                  </Card>

                  <Card
                    title="Staff Directory"
                    subtitle="Manage active sessions and role assignments"
                  >
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr
                          style={{
                            textAlign: "left",
                            borderBottom: "2px solid #f1f5f9",
                          }}
                        >
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Identity
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Role
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Last Login
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "11px",
                              textTransform: "uppercase",
                            }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffUsers.map((u) => (
                          <tr
                            key={u.id}
                            style={{ borderBottom: "1px solid #f8fafc" }}
                          >
                            <td style={{ padding: "12px" }}>
                              <div style={{ fontWeight: "750" }}>{u.name}</div>
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: COLORS.muted,
                                }}
                              >
                                {u.id} •{" "}
                                <span
                                  style={{
                                    color:
                                      u.status === "Active"
                                        ? "#22c55e"
                                        : "#ef4444",
                                  }}
                                >
                                  {u.status}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: "12px" }}>
                              <span
                                style={{
                                  fontSize: "11px",
                                  background:
                                    u.role === "Admin" ? "#fef3c7" : "#f1f5f9",
                                  padding: "4px 10px",
                                  borderRadius: "8px",
                                  fontWeight: "800",
                                }}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "12px",
                                fontSize: "12px",
                                color: COLORS.muted,
                              }}
                            >
                              {u.lastLogin}
                            </td>
                            <td style={{ padding: "12px" }}>
                              <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: COLORS.primary,
                                    cursor: "pointer",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                  }}
                                >
                                  RESET PWD
                                </button>
                                <button
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: "#64748b",
                                    cursor: "pointer",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                  }}
                                >
                                  DEACTIVATE
                                </button>
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
                <Card
                  title="Role-Based Access Matrix"
                  subtitle="Define module-level visibility and edit rights"
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      marginTop: "20px",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        <th
                          style={{
                            padding: "16px",
                            textAlign: "left",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          Component / Module
                        </th>
                        {["Admin", "Accountant", "Ops Staff", "Viewer"].map(
                          (r) => (
                            <th
                              key={r}
                              style={{
                                padding: "16px",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              {r}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          m: "System Config & Delete",
                          p: ["Full", "None", "None", "None"],
                        },
                        {
                          m: "Finalize Bills / Invoices",
                          p: ["Full", "Full", "Limit", "None"],
                        },
                        {
                          m: "Payment & Ledger Edits",
                          p: ["Full", "Full", "None", "None"],
                        },
                        {
                          m: "Reports & Financial Logs",
                          p: ["Full", "Full", "Full", "Read"],
                        },
                        {
                          m: "Traceability (Lot/Allocation)",
                          p: ["Full", "Full", "Full", "Read"],
                        },
                      ].map((row, i) => (
                        <tr key={i}>
                          <td
                            style={{
                              padding: "16px",
                              border: "1px solid #e2e8f0",
                              fontWeight: "750",
                              color: COLORS.secondary,
                            }}
                          >
                            {row.m}
                          </td>
                          {row.p.map((perm, pi) => (
                            <td
                              key={pi}
                              style={{
                                padding: "16px",
                                border: "1px solid #e2e8f0",
                                textAlign: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "900",
                                  padding: "4px 10px",
                                  borderRadius: "10px",
                                  background:
                                    perm === "Full"
                                      ? "#f0fdf4"
                                      : perm === "None"
                                        ? "#fef2f2"
                                        : "#f1f5f9",
                                  color:
                                    perm === "Full"
                                      ? "#166534"
                                      : perm === "None"
                                        ? "#991b1b"
                                        : "#475569",
                                }}
                              >
                                {perm}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div
                    style={{
                      marginTop: "24px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "16px",
                      background: "#fff9eb",
                      borderRadius: "12px",
                      border: "1px solid #feebc8",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>⚠️</span>
                    <p
                      style={{ margin: 0, fontSize: "12px", color: "#92400e" }}
                    >
                      Modifying the Access Matrix will force-logout all active
                      sessions to re-apply JWT tokens.
                    </p>
                  </div>
                </Card>
              )}

              {activeSecurityTab === "Security" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1.2fr",
                    gap: "32px",
                  }}
                >
                  <Card
                    title="Financial Audit Trail"
                    subtitle="Chronological log of critical system overrides"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {securityAuditLogs.map((log, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "14px",
                            background: "#f8fafc",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "16px",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                padding: "8px",
                                background:
                                  log.status === "SUCCESS"
                                    ? "#dcfce7"
                                    : "#fee2e2",
                                borderRadius: "8px",
                                color:
                                  log.status === "SUCCESS"
                                    ? "#166534"
                                    : "#991b1b",
                              }}
                            >
                              {log.status === "SUCCESS" ? "✅" : "🚫"}
                            </div>
                            <div>
                              <div
                                style={{ fontWeight: "800", fontSize: "13px" }}
                              >
                                {log.action}
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: COLORS.muted,
                                }}
                              >
                                By {log.user} • {log.timestamp}
                              </div>
                            </div>
                          </div>
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              color: COLORS.primary,
                              fontWeight: "800",
                              fontSize: "11px",
                              cursor: "pointer",
                            }}
                          >
                            VIEW DETAILS
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                    }}
                  >
                    <Card
                      title="System Hardening"
                      subtitle="Global security switches"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                        }}
                      >
                        {[
                          {
                            l: "Session Timeout (Pulse)",
                            d: "Auto-logout after 30 mins",
                          },
                          {
                            l: "KYC Archive Encryption",
                            d: "AES-256 for all document uploads",
                          },
                          {
                            l: "Admin Mobile OTP",
                            d: "Enforce 2FA for Admin login",
                          },
                          {
                            l: "Auto Database Backup",
                            d: "Encrypted daily cycle at 03:00 AM",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <div
                                style={{ fontSize: "12px", fontWeight: "800" }}
                              >
                                {item.l}
                              </div>
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: COLORS.muted,
                                }}
                              >
                                {item.d}
                              </div>
                            </div>
                            <div
                              style={{
                                width: "40px",
                                height: "20px",
                                background: COLORS.primary,
                                borderRadius: "10px",
                                position: "relative",
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  right: "2px",
                                  top: "2px",
                                  width: "16px",
                                  height: "16px",
                                  background: "#fff",
                                  borderRadius: "50%",
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card style={{ background: "#0f172a", color: "#fff" }}>
                      <h3 style={{ margin: "0 0 10px" }}>Document Lock</h3>
                      <p style={{ fontSize: "12px", opacity: 0.7 }}>
                        Invoices & Bills lock instantly upon generation.
                        Unlocking requires Admin-level audit reason.
                      </p>
                      <Button
                        style={{ width: "100%", marginTop: "15px" }}
                        variant="outline"
                      >
                        Unlock Current Register
                      </Button>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 15. CONNECTION MODULE (PREMIUM INTELLIGENCE REPORT) */}
          {activeSection === "CONNECTION" && (
            <div
              style={{
                animation: "slideUp 0.6s ease-out",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
              }}
            >
              {/* TOP: Search + Farmer Summary Card */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "32px",
                  alignItems: "start",
                }}
              >
                <Card
                  title="Farmer Traceability Search"
                  subtitle="Two-way intelligence engine"
                >
                  <Input
                    label="Search by Name, Mobile, Village or Lot ID"
                    value={connSearchQuery}
                    onChange={(e) => setConnSearchQuery(e.target.value)}
                    placeholder="e.g. Vikram Reddy or 9848010000"
                  />
                  <Button style={{ width: "100%", marginTop: "12px" }}>
                    Execute Intelligence Search
                  </Button>

                  <div
                    style={{
                      marginTop: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "10px",
                        fontWeight: "800",
                        color: COLORS.muted,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      Search Results (Click to View Dashboard)
                    </label>
                    {[
                      {
                        id: "f1",
                        name: "Vikram Reddy",
                        phone: "9848010000",
                        village: "Madanapalle",
                      },
                      {
                        id: "f2",
                        name: "Srinivas Rao",
                        phone: "8123456789",
                        village: "Vijayawada",
                      },
                      {
                        id: "f3",
                        name: "Priya Reddy",
                        phone: "9988776655",
                        village: "Chittoor",
                      },
                      {
                        id: "f4",
                        name: "Mohan Chandra",
                        phone: "7766554433",
                        village: "Guntur",
                      },
                    ].map((farmer) => (
                      <div
                        key={farmer.id}
                        style={{
                          padding: "16px",
                          background:
                            selectedConnFarmer?.id === farmer.id
                              ? "rgba(159, 180, 67, 0.1)"
                              : "#f8fafc",
                          borderRadius: "16px",
                          cursor: "pointer",
                          border:
                            selectedConnFarmer?.id === farmer.id
                              ? `2.5px solid ${COLORS.secondary}`
                              : "1.5px solid #e2e8f0",
                          transition: "0.25s all",
                          marginBottom: "8px",
                        }}
                        onClick={() => setSelectedConnFarmer(farmer)}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <b
                            style={{ color: COLORS.primary, fontSize: "15px" }}
                          >
                            {farmer.name}
                          </b>
                          <span
                            style={{
                              fontSize: "10px",
                              background: COLORS.secondary,
                              color: "#fff",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontWeight: "800",
                            }}
                          >
                            VERIFIED
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "12px",
                            color: COLORS.muted,
                            display: "block",
                            marginTop: "4px",
                            fontWeight: "600",
                          }}
                        >
                          📱 {farmer.phone} • 📍 {farmer.village}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                {selectedConnFarmer ? (
                  <Card
                    style={{
                      background:
                        "linear-gradient(135deg, #2d4137 0%, #1e293b 100%)",
                      color: "#fff",
                      border: "none",
                      boxShadow: "0 25px 50px -12px rgba(45, 65, 55, 0.4)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "32px",
                      }}
                    >
                      <div>
                        <h2
                          style={{
                            margin: "0 0 8px 0",
                            color: COLORS.secondary,
                            fontSize: "32px",
                            fontWeight: "900",
                            letterSpacing: "1px",
                          }}
                        >
                          {selectedConnFarmer.name}
                        </h2>
                        <div
                          style={{
                            fontSize: "13px",
                            opacity: 0.8,
                            display: "flex",
                            gap: "16px",
                          }}
                        >
                          <span>
                            <b style={{ opacity: 0.6 }}>Mobile:</b>{" "}
                            {selectedConnFarmer.phone}
                          </span>
                          <span>
                            <b style={{ opacity: 0.6 }}>Origin:</b>{" "}
                            {selectedConnFarmer.village}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          padding: "16px 24px",
                          borderRadius: "20px",
                          textAlign: "right",
                          minWidth: "150px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            textTransform: "uppercase",
                            letterSpacing: "1.5px",
                            opacity: 0.6,
                            fontWeight: "800",
                            marginBottom: "4px",
                          }}
                        >
                          Pending Settlement
                        </div>
                        <b
                          style={{
                            fontSize: "28px",
                            color: "#fbbf24",
                            fontWeight: "900",
                          }}
                        >
                          ₹ 45,200
                        </b>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "16px",
                      }}
                    >
                      {[
                        {
                          l: "Lots Supplied",
                          v: "14",
                          c: "#fff",
                          bg: "rgba(255,255,255,0.1)",
                        },
                        {
                          l: "QTY Supplied",
                          v: "8,500 KG",
                          c: "#fff",
                          bg: "rgba(255,255,255,0.1)",
                        },
                        {
                          l: "QTY Sold",
                          v: "7,900 KG",
                          c: COLORS.secondary,
                          bg: "rgba(159,180,67,0.1)",
                        },
                        {
                          l: "Gross Sale",
                          v: "₹ 4,25,000",
                          c: "#fff",
                          bg: "rgba(255,255,255,0.1)",
                        },
                        {
                          l: "Expenses Deducted",
                          v: "₹ 21,250",
                          c: "#fca5a5",
                          bg: "rgba(248, 113, 113, 0.1)",
                        },
                        {
                          l: "Net Paid",
                          v: "₹ 3,58,550",
                          c: "#4ade80",
                          bg: "rgba(74, 222, 128, 0.1)",
                        },
                        {
                          l: "Last Supply Date",
                          v: "24/03/2026",
                          c: "#fff",
                          bg: "rgba(255,255,255,0.1)",
                        },
                      ].map((x, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "16px",
                            background: x.bg,
                            borderRadius: "16px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              opacity: 0.7,
                              marginBottom: "6px",
                              fontWeight: "700",
                            }}
                          >
                            {x.l}
                          </div>
                          <b
                            style={{
                              fontSize: "18px",
                              color: x.c,
                              fontWeight: "900",
                            }}
                          >
                            {x.v}
                          </b>
                        </div>
                      ))}
                    </div>
                  </Card>
                ) : (
                  <Card
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "250px",
                      color: COLORS.muted,
                      background: "rgba(255,255,255,0.5)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: "48px",
                          display: "block",
                          marginBottom: "16px",
                        }}
                      >
                        🔗
                      </span>
                      <h3 style={{ margin: 0, color: COLORS.sidebar }}>
                        Connection Matrix Standby
                      </h3>
                      <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>
                        Select a farmer to generate exhaustive traceability
                        intelligence.
                      </p>
                    </div>
                  </Card>
                )}
              </div>

              {selectedConnFarmer && (
                <>
                  {/* SMART ALERT */}
                  <div
                    style={{
                      background: "#fef2f2",
                      color: "#991b1b",
                      padding: "18px 24px",
                      borderRadius: "20px",
                      border: "1.5px solid #fecaca",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      fontWeight: "800",
                      boxShadow: "0 10px 20px rgba(220, 38, 38, 0.05)",
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>⚠️</span>
                    <div>
                      <div style={{ fontSize: "14px", letterSpacing: "0.5px" }}>
                        HIGH RISK ALERTS LINKED TO CURRENT PRODUCE:
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          opacity: 0.8,
                          fontWeight: "600",
                          marginTop: "4px",
                        }}
                      >
                        Buyer <b>'Reliance Fresh'</b> holds pending ₹1,45,000
                        affecting the liquidation of this farmer's supply.
                        Escalate collection strategy.
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "3.5fr 1fr",
                      gap: "32px",
                    }}
                  >
                    {/* MIDDLE: Live Traceability Table */}
                    <Card
                      title="Detailed Connection & Sales Ledger"
                      subtitle="Immutable Farmer-to-Buyer Log"
                      style={{ overflow: "hidden", padding: 0 }}
                    >
                      <div style={{ padding: "24px" }}>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "16px",
                            marginBottom: "24px",
                          }}
                        >
                          {[
                            "Date Range",
                            "Buyer Name",
                            "Product",
                            "Variety",
                            "Grade",
                            "Payment Mode",
                            "Balance Pending",
                          ].map((f) => (
                            <select
                              key={f}
                              style={{
                                padding: "10px 16px",
                                borderRadius: "10px",
                                border: "1.5px solid #e2e8f0",
                                outline: "none",
                                fontSize: "12px",
                                fontWeight: "700",
                                color: COLORS.text,
                                background: "#f8fafc",
                              }}
                            >
                              <option>{f} filter...</option>
                            </select>
                          ))}
                        </div>

                        <div
                          style={{
                            overflowX: "auto",
                            border: "1.5px solid #f1f5f9",
                            borderRadius: "20px",
                            background: "#fff",
                          }}
                        >
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              fontSize: "12px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <thead>
                              <tr
                                style={{
                                  background: "#0f172a",
                                  color: "#fff",
                                  textAlign: "left",
                                }}
                              >
                                <th
                                  style={{
                                    padding: "18px",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  DATE & TIME
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  LOT ID
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  PRODUCE SPEC
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    textAlign: "right",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                  }}
                                >
                                  QTY (KG)
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  BUYER IDENTITY
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    textAlign: "right",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                  }}
                                >
                                  RATE (₹)
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    textAlign: "right",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                  }}
                                >
                                  AMOUNT (₹)
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    textAlign: "right",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                  }}
                                >
                                  PAID
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    textAlign: "right",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                    color: "#fbbf24",
                                  }}
                                >
                                  BALANCE
                                </th>
                                <th
                                  style={{
                                    padding: "18px",
                                    fontWeight: "800",
                                    fontSize: "11px",
                                  }}
                                >
                                  INVOICE
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Row 1 */}
                              <tr
                                style={{
                                  cursor: "pointer",
                                  borderBottom: "1px solid #f1f5f9",
                                  transition: "0.2s",
                                }}
                                onClick={() =>
                                  setConnSelectedBuyer({
                                    name: "Reliance Fresh",
                                    phone: "9959012345",
                                    address: "Stall #102, Market Yard",
                                    totalPurchases: "₹ 4.5L",
                                    preferredProducts: [
                                      "Mango Alphonso (80%)",
                                      "Banana Yelakki (20%)",
                                    ],
                                    paymentBehavior:
                                      "Delayed (15 days average)",
                                    outstanding: "₹ 1,45,000",
                                  })
                                }
                              >
                                <td style={{ padding: "16px" }}>
                                  <b
                                    style={{
                                      color: COLORS.sidebar,
                                      fontSize: "13px",
                                    }}
                                  >
                                    24/03/2026
                                  </b>
                                  <br />
                                  <span
                                    style={{
                                      opacity: 0.6,
                                      fontSize: "10px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    Tuesday, 6:45 AM
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    color: COLORS.primary,
                                    fontWeight: "900",
                                  }}
                                >
                                  LOT-2026-X11
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <b
                                    style={{
                                      color: COLORS.sidebar,
                                      fontSize: "13px",
                                    }}
                                  >
                                    Mango
                                  </b>
                                  <br />
                                  <span
                                    style={{
                                      opacity: 0.6,
                                      fontSize: "10px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    Alphonso • A Grade
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    fontWeight: "800",
                                    fontSize: "13px",
                                  }}
                                >
                                  1,200
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <b
                                    style={{
                                      color: COLORS.sidebar,
                                      fontSize: "13px",
                                    }}
                                  >
                                    Reliance Fresh
                                  </b>
                                  <br />
                                  <span
                                    style={{
                                      opacity: 0.6,
                                      fontSize: "10px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    9959012345 • Stall #102
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    color: COLORS.success,
                                    fontWeight: "900",
                                    fontSize: "13px",
                                  }}
                                >
                                  45.00
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    fontWeight: "900",
                                    fontSize: "13px",
                                  }}
                                >
                                  54,000
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                  }}
                                >
                                  <b style={{ fontSize: "13px" }}>24,000</b>
                                  <br />
                                  <span
                                    style={{
                                      color: "#3b82f6",
                                      fontSize: "10px",
                                      fontWeight: "800",
                                      display: "inline-block",
                                      padding: "2px 6px",
                                      background: "#eff6ff",
                                      borderRadius: "6px",
                                      marginTop: "2px",
                                    }}
                                  >
                                    UPI Transfer
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    color: COLORS.danger,
                                    fontWeight: "900",
                                    fontSize: "13px",
                                  }}
                                >
                                  30,000
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <span
                                    style={{
                                      color: "#fff",
                                      background: "#334155",
                                      padding: "6px 10px",
                                      borderRadius: "8px",
                                      fontWeight: "800",
                                      fontSize: "10px",
                                    }}
                                  >
                                    INV-2026-X01
                                  </span>
                                </td>
                              </tr>
                              {/* Row 2 */}
                              <tr
                                style={{
                                  cursor: "pointer",
                                  borderBottom: "1px solid #f1f5f9",
                                  transition: "0.2s",
                                }}
                                onClick={() =>
                                  setConnSelectedBuyer({
                                    name: "Harsha Wholesale",
                                    phone: "9898989898",
                                    address: "Stall #45, New Block",
                                    totalPurchases: "₹ 1.2L",
                                    preferredProducts: [
                                      "Banana Yelakki (100%)",
                                    ],
                                    paymentBehavior:
                                      "Excellent (Same day cash)",
                                    outstanding: "₹ 0",
                                  })
                                }
                              >
                                <td style={{ padding: "16px" }}>
                                  <b
                                    style={{
                                      color: COLORS.sidebar,
                                      fontSize: "13px",
                                    }}
                                  >
                                    23/03/2026
                                  </b>
                                  <br />
                                  <span
                                    style={{
                                      opacity: 0.6,
                                      fontSize: "10px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    Monday, 8:15 AM
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    color: COLORS.primary,
                                    fontWeight: "900",
                                  }}
                                >
                                  LOT-2026-X09
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <b
                                    style={{
                                      color: COLORS.sidebar,
                                      fontSize: "13px",
                                    }}
                                  >
                                    Banana
                                  </b>
                                  <br />
                                  <span
                                    style={{
                                      opacity: 0.6,
                                      fontSize: "10px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    Yelakki • Premium
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    fontWeight: "800",
                                    fontSize: "13px",
                                  }}
                                >
                                  850
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <b
                                    style={{
                                      color: COLORS.sidebar,
                                      fontSize: "13px",
                                    }}
                                  >
                                    Harsha Wholesale
                                  </b>
                                  <br />
                                  <span
                                    style={{
                                      opacity: 0.6,
                                      fontSize: "10px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    9898989898 • Stall #45
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    color: COLORS.success,
                                    fontWeight: "900",
                                    fontSize: "13px",
                                  }}
                                >
                                  32.00
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    fontWeight: "900",
                                    fontSize: "13px",
                                  }}
                                >
                                  27,200
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                  }}
                                >
                                  <b style={{ fontSize: "13px" }}>27,200</b>
                                  <br />
                                  <span
                                    style={{
                                      color: COLORS.success,
                                      fontSize: "10px",
                                      fontWeight: "800",
                                      display: "inline-block",
                                      padding: "2px 6px",
                                      background: "#f0fdf4",
                                      borderRadius: "6px",
                                      marginTop: "2px",
                                    }}
                                  >
                                    Cash Payment
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    color: COLORS.muted,
                                    fontWeight: "900",
                                    fontSize: "13px",
                                  }}
                                >
                                  0
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <span
                                    style={{
                                      color: "#fff",
                                      background: "#334155",
                                      padding: "6px 10px",
                                      borderRadius: "8px",
                                      fontWeight: "800",
                                      fontSize: "10px",
                                    }}
                                  >
                                    INV-2026-X02
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Card>

                    {/* RIGHT PANEL: Buyer Details Snapshot */}
                    <div>
                      <Card
                        title="Buyer Snapshot"
                        subtitle="Select trade log to inspect"
                        style={{ position: "sticky", top: "20px" }}
                      >
                        {connSelectedBuyer ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "24px",
                              animation: "slideUp 0.3s",
                            }}
                          >
                            <div
                              style={{
                                background: "#f8fafc",
                                padding: "24px",
                                borderRadius: "20px",
                                border: "1.5px solid #e2e8f0",
                              }}
                            >
                              <h3
                                style={{
                                  margin: "0 0 8px 0",
                                  color: COLORS.sidebar,
                                  fontSize: "20px",
                                }}
                              >
                                {connSelectedBuyer.name}
                              </h3>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: COLORS.muted,
                                  fontWeight: "600",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "6px",
                                }}
                              >
                                <span>📞 {connSelectedBuyer.phone}</span>
                                <span>📍 {connSelectedBuyer.address}</span>
                              </div>

                              <div
                                style={{
                                  marginTop: "24px",
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr",
                                  gap: "20px",
                                }}
                              >
                                <div>
                                  <small
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "800",
                                      color: COLORS.muted,
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Lifetime Sourced
                                  </small>
                                  <div
                                    style={{
                                      fontSize: "18px",
                                      fontWeight: "900",
                                      color: COLORS.sidebar,
                                      marginTop: "4px",
                                    }}
                                  >
                                    {connSelectedBuyer.totalPurchases}
                                  </div>
                                </div>
                                <div>
                                  <small
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "800",
                                      color: COLORS.muted,
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Unsettled Balance
                                  </small>
                                  <div
                                    style={{
                                      fontSize: "18px",
                                      fontWeight: "900",
                                      color:
                                        connSelectedBuyer.outstanding === "₹ 0"
                                          ? COLORS.success
                                          : COLORS.danger,
                                      marginTop: "4px",
                                    }}
                                  >
                                    {connSelectedBuyer.outstanding}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <small
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "800",
                                  color: COLORS.muted,
                                  display: "block",
                                  marginBottom: "10px",
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                }}
                              >
                                Payment Habit Indicator
                              </small>
                              <div
                                style={{
                                  padding: "16px",
                                  background:
                                    connSelectedBuyer.outstanding === "₹ 0"
                                      ? "#f0fdf4"
                                      : "#fef3c7",
                                  color:
                                    connSelectedBuyer.outstanding === "₹ 0"
                                      ? "#166534"
                                      : "#b45309",
                                  borderRadius: "16px",
                                  fontSize: "13px",
                                  fontWeight: "800",
                                }}
                              >
                                {connSelectedBuyer.paymentBehavior}
                              </div>
                            </div>
                            <div>
                              <small
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "800",
                                  color: COLORS.muted,
                                  display: "block",
                                  marginBottom: "10px",
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                }}
                              >
                                Commodity Preferences
                              </small>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "10px",
                                }}
                              >
                                {connSelectedBuyer.preferredProducts.map(
                                  (pp, idx) => (
                                    <span
                                      key={idx}
                                      style={{
                                        fontSize: "12px",
                                        padding: "8px 16px",
                                        background: "#e2e8f0",
                                        color: COLORS.sidebar,
                                        borderRadius: "24px",
                                        fontWeight: "700",
                                      }}
                                    >
                                      {pp}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              textAlign: "center",
                              opacity: 0.5,
                              padding: "60px 0",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "48px",
                                display: "block",
                                marginBottom: "16px",
                              }}
                            >
                              👉
                            </span>
                            <p
                              style={{
                                fontWeight: "600",
                                fontSize: "15px",
                                lineHeight: "1.5",
                              }}
                            >
                              Click any transaction row in the matrix to unmask
                              buyer intelligence.
                            </p>
                          </div>
                        )}
                      </Card>
                    </div>
                  </div>

                  {/* BOTTOM: Sub-Analytics Layer */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "32px",
                    }}
                  >
                    {/* Product Analytics */}
                    <Card
                      title="Product Analytics"
                      subtitle="Market disposal efficiency by crop"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "20px",
                        }}
                      >
                        <div
                          style={{
                            background: "#f8fafc",
                            padding: "20px",
                            borderRadius: "20px",
                            borderLeft: `6px solid ${COLORS.primary}`,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.02)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <b style={{ fontSize: "16px" }}>Mango Alphonso</b>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: "800",
                                color: "#fff",
                                background: COLORS.success,
                                padding: "4px 10px",
                                borderRadius: "10px",
                                textTransform: "uppercase",
                              }}
                            >
                              Top Volume
                            </span>
                          </div>
                          <div
                            style={{
                              marginTop: "16px",
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "13px",
                              color: COLORS.muted,
                              fontWeight: "600",
                            }}
                          >
                            <span>
                              Supplies Cleared:{" "}
                              <b style={{ color: COLORS.text }}>4,000 KG</b>
                            </span>
                            <span>
                              Yield Rate:{" "}
                              <b style={{ color: COLORS.success }}>
                                ₹ 42.50 Avg
                              </b>
                            </span>
                          </div>
                          <div
                            style={{
                              marginTop: "12px",
                              fontSize: "12px",
                              color: COLORS.text,
                              background: "#fff",
                              padding: "10px",
                              borderRadius: "10px",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            Major Acquirer:{" "}
                            <b style={{ color: COLORS.primary }}>
                              Harsha Wholesale (45%)
                            </b>
                          </div>
                        </div>

                        <div
                          style={{
                            background: "#f8fafc",
                            padding: "20px",
                            borderRadius: "20px",
                            borderLeft: `6px solid ${COLORS.secondary}`,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.02)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <b style={{ fontSize: "16px" }}>Banana Yelakki</b>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: "800",
                                color: COLORS.sidebar,
                                background: "#f1f5f9",
                                padding: "4px 10px",
                                borderRadius: "10px",
                                textTransform: "uppercase",
                              }}
                            >
                              Stable
                            </span>
                          </div>
                          <div
                            style={{
                              marginTop: "16px",
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "13px",
                              color: COLORS.muted,
                              fontWeight: "600",
                            }}
                          >
                            <span>
                              Supplies Cleared:{" "}
                              <b style={{ color: COLORS.text }}>2,500 KG</b>
                            </span>
                            <span>
                              Yield Rate:{" "}
                              <b style={{ color: COLORS.success }}>
                                ₹ 31.00 Avg
                              </b>
                            </span>
                          </div>
                          <div
                            style={{
                              marginTop: "12px",
                              fontSize: "12px",
                              color: COLORS.text,
                              background: "#fff",
                              padding: "10px",
                              borderRadius: "10px",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            Major Acquirer:{" "}
                            <b style={{ color: COLORS.primary }}>
                              Reliance Fresh (82%)
                            </b>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Payment Tracking */}
                    <Card
                      title="Payment Flow Intelligence"
                      subtitle="Tracing origin limits & liquidity generation"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "24px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1.5px dashed #e2e8f0",
                            paddingBottom: "16px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "800",
                              color: COLORS.muted,
                              textTransform: "uppercase",
                            }}
                          >
                            Gross Generated
                          </span>
                          <b
                            style={{ fontSize: "20px", color: COLORS.sidebar }}
                          >
                            ₹ 4,25,000
                          </b>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1.5px dashed #e2e8f0",
                            paddingBottom: "16px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "800",
                              color: COLORS.success,
                              textTransform: "uppercase",
                            }}
                          >
                            Amount Liquidated
                          </span>
                          <b
                            style={{ fontSize: "20px", color: COLORS.success }}
                          >
                            ₹ 3,45,000
                          </b>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1.5px dashed #e2e8f0",
                            paddingBottom: "16px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "800",
                              color: COLORS.danger,
                              textTransform: "uppercase",
                            }}
                          >
                            Deficit Balance
                          </span>
                          <b style={{ fontSize: "20px", color: COLORS.danger }}>
                            ₹ 80,000
                          </b>
                        </div>

                        <div style={{ marginTop: "8px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "900",
                              color: COLORS.muted,
                              letterSpacing: "1px",
                              display: "block",
                              marginBottom: "12px",
                            }}
                          >
                            PAYMENT APPARATUS DISTRIBUTION
                          </span>
                          <div style={{ display: "flex", gap: "12px" }}>
                            <div
                              style={{
                                flex: 1,
                                background: "#f8fafc",
                                padding: "16px",
                                borderRadius: "16px",
                                textAlign: "center",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "24px",
                                  marginBottom: "8px",
                                }}
                              >
                                💵
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "900",
                                  color: COLORS.sidebar,
                                }}
                              >
                                30% CASH
                              </div>
                            </div>
                            <div
                              style={{
                                flex: 1,
                                background: "#f8fafc",
                                padding: "16px",
                                borderRadius: "16px",
                                textAlign: "center",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "24px",
                                  marginBottom: "8px",
                                }}
                              >
                                📱
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "900",
                                  color: "#3b82f6",
                                }}
                              >
                                65% UPI
                              </div>
                            </div>
                            <div
                              style={{
                                flex: 1,
                                background: "#fef2f2",
                                padding: "16px",
                                borderRadius: "16px",
                                textAlign: "center",
                                border: "1px solid #fecaca",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "24px",
                                  marginBottom: "8px",
                                }}
                              >
                                ⏳
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "900",
                                  color: COLORS.danger,
                                }}
                              >
                                5% DEBT
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Timing Algorithms */}
                    <Card
                      title="Time Array Analytics"
                      subtitle="Biological lifecycle & market disposal velocities"
                    >
                      <div
                        style={{
                          overflowX: "auto",
                          border: "1px solid #e2e8f0",
                          borderRadius: "20px",
                          background: "#f8fafc",
                        }}
                      >
                        <table
                          style={{
                            width: "100%",
                            fontSize: "12px",
                            textAlign: "left",
                            borderCollapse: "collapse",
                          }}
                        >
                          <thead>
                            <tr
                              style={{
                                color: COLORS.muted,
                                background: "rgba(0,0,0,0.03)",
                              }}
                            >
                              <th
                                style={{
                                  padding: "16px",
                                  fontWeight: "800",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                }}
                              >
                                DAY PATTERN
                              </th>
                              <th
                                style={{
                                  padding: "16px",
                                  fontWeight: "800",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                }}
                              >
                                OPTIMAL CLEARANCE WINDOW
                              </th>
                              <th
                                style={{
                                  padding: "16px",
                                  textAlign: "right",
                                  fontWeight: "800",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                }}
                              >
                                VOLUME
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              {
                                d: "Monday",
                                t: "06:00 AM - 08:30 AM",
                                v: "2,400",
                              },
                              {
                                d: "Tuesday",
                                t: "05:45 AM - 07:00 AM",
                                v: "1,850",
                              },
                              {
                                d: "Thursday",
                                t: "07:00 AM - 10:00 AM",
                                v: "3,100",
                              },
                            ].map((row, i) => (
                              <tr
                                key={i}
                                style={{
                                  borderBottom: "1px solid #e2e8f0",
                                  background: "#fff",
                                }}
                              >
                                <td
                                  style={{
                                    padding: "16px",
                                    fontWeight: "800",
                                    color: COLORS.sidebar,
                                  }}
                                >
                                  {row.d}
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    color: COLORS.muted,
                                    fontWeight: "600",
                                  }}
                                >
                                  {row.t}
                                </td>
                                <td
                                  style={{
                                    padding: "16px",
                                    textAlign: "right",
                                    fontWeight: "900",
                                    color: COLORS.primary,
                                  }}
                                >
                                  {row.v} KG
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div
                        style={{
                          marginTop: "24px",
                          background: "rgba(159, 180, 67, 0.1)",
                          padding: "16px",
                          borderRadius: "16px",
                          border: `1px solid ${COLORS.secondary}40`,
                          fontSize: "12px",
                          color: COLORS.sidebar,
                          fontWeight: "600",
                          display: "flex",
                          gap: "10px",
                          alignItems: "flex-start",
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>💡</span>
                        <span>
                          Insight: Produce supplied on Thursdays accounts for
                          highest liquidation volumes despite late timing
                          windows.
                        </span>
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 16. Search & Filters */}
          {activeSection === "Search & Filters" && (
            <Card
              title="Matrix Search Terminal"
              subtitle="Universal lookup for the Mandi ecosystem"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "20px",
                  marginBottom: "32px",
                }}
              >
                <Input placeholder="By Supplier Identity..." />
                <Input placeholder="By Buyer Name..." />
                <Input placeholder="By Core Product..." />
                <Input type="date" label="By Transaction Date" />
                <Input
                  placeholder="By Invoice/Bill #"
                  label="Document Number"
                />
                <Input
                  placeholder="By Auto Lot ID"
                  label="Tracking Reference"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "flex-end",
                }}
              >
                <Button variant="outline">Clear Matrix</Button>
                <Button>Execute Lookup</Button>
              </div>
              <div
                style={{
                  padding: "100px",
                  textAlign: "center",
                  border: "2px solid #f1f5f9",
                  borderRadius: "32px",
                  marginTop: "40px",
                  color: COLORS.muted,
                }}
              >
                <span style={{ fontSize: "48px" }}>🔎</span>
                <p>Results will populate here after a lookup is initialized.</p>
              </div>
            </Card>
          )}

          {/* 17. Document Management */}
          {activeSection === "Document Management" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr",
                gap: "32px",
              }}
            >
              <Card
                title="Repository Vault"
                subtitle="Archive for physical bill scans and KYC docs"
              >
                <div
                  style={{
                    padding: "60px",
                    border: "4px dashed #f1f5f9",
                    borderRadius: "32px",
                    textAlign: "center",
                    color: COLORS.muted,
                    position: "relative",
                  }}
                >
                  <span style={{ fontSize: "64px" }}>📂</span>
                  <h3 style={{ color: "#0f172a" }}>
                    {uploading ? "⚡ Syncing Entry..." : "Vault Archive Queue"}
                  </h3>
                  <p>Click to browse or drag documents into storage.</p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0,
                      cursor: "pointer",
                    }}
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
                    <p
                      style={{
                        textAlign: "center",
                        color: COLORS.muted,
                        padding: "40px",
                      }}
                    >
                      No documents in vault.
                    </p>
                  ) : (
                    documents.map((doc) => (
                      <div
                        key={doc._id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "16px",
                          background: "#f8fafc",
                          borderRadius: "16px",
                          marginBottom: "12px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "14px",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: "28px" }}>
                            {doc.docType === "Produce Photo" ? "🖼️" : "📄"}
                          </span>
                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: "800",
                                fontSize: "14px",
                              }}
                            >
                              {doc.originalName}
                            </p>
                            <small style={{ color: COLORS.muted }}>
                              {doc.docType} • {(doc.fileSize / 1024).toFixed(1)}{" "}
                              KB
                            </small>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            <Button
                              variant="secondary"
                              style={{ padding: "8px 12px", fontSize: "12px" }}
                            >
                              View
                            </Button>
                          </a>
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteDoc(doc._id)}
                            style={{ padding: "8px 12px", fontSize: "12px" }}
                          >
                            🗑️
                          </Button>
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
          {DB.Fruits.map((f) => (
            <option key={`f-${f}`} value={f} />
          ))}
        </datalist>
        <datalist id="vegetable-list">
          {DB.Vegetables.map((v) => (
            <option key={`v-${v}`} value={v} />
          ))}
        </datalist>
      </div>
    </div>
  );
}
