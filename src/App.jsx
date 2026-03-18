import React, { useState } from "react";
import "./index.css"; // Make sure this line is at top of App.js
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ===== Helper function =====
const formatCurrency = (value) => {
  if (value === "" || isNaN(value)) return "";
  return "₹" + parseFloat(value).toLocaleString("en-IN");
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // ===== Products =====
  const [products, setProducts] = useState([
    { name: "🥭 Mango", quantity: 50, rate: 40 },
    { name: "🌾 Rice", quantity: 30, rate: 35 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // ===== Expenses =====
  const [expenses, setExpenses] = useState({
    lorry: 2000,
    marketing: 1500,
    coolie: 1000,
    cash: 500,
    kaja: 300,
    others: 700,
  });

  const [advancePayment, setAdvancePayment] = useState(5000);

  // ===== Suppliers =====
  const [suppliers, setSuppliers] = useState([
    {
      name: "",
      phone: "",
      address: "",
      village: "",
      govId: "",
      idType: "",
      bankDetails: "",
      notes: "",
    },
  ]);

  // ===== Buyers =====
  const [buyers, setBuyers] = useState([
    {
      name: "",
      phone: "",
      shopName: "",
      address: "",
      govId: "",
      idType: "",
      creditLimit: "",
      notes: "",
      ledger: [],
      purchaseHistory: [],
      outstanding: 0,
      payments: [],
    },
  ]);

  const [activeBuyerTab, setActiveBuyerTab] = useState({}); // key: buyer index, value: active tab
   // ===== Inventory Intake State =====
  const [inventory, setInventory] = useState([]);
  // ===== Supplier Bill State =====
const [supplierBill, setSupplierBill] = useState({
  billNumber: "",
  date: "",
  supplierName: "",
  items: [
    { name: "", quantity: 0, rate: 0 }
  ],
  expenses: {
    freight: 0,
    marketing: 0,
    labour: 0,
    packing: 0,
    misc: 0
  },
  advancePayment: 0
});

  // ===== Product Functions =====
  const updateProduct = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = field === "name" ? value : Number(value);
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([...products, { name: "", quantity: 0, rate: 0 }]);
  };

  const deleteProduct = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  // ===== Supplier Functions =====
  const updateSupplier = (index, field, value) => {
    const updated = [...suppliers];
    updated[index][field] = value;
    setSuppliers(updated);
  };

  const addSupplier = () => {
    setSuppliers([
      ...suppliers,
      { name: "", phone: "", address: "", village: "", govId: "", idType: "", bankDetails: "", notes: "" },
    ]);
  };

  const deleteSupplier = (index) => {
    const updated = suppliers.filter((_, i) => i !== index);
    setSuppliers(updated);
  };

  // ===== Buyer Functions =====
  const updateBuyer = (index, field, value) => {
    const updated = [...buyers];
    updated[index][field] = value;
    setBuyers(updated);
  };

  const addBuyer = () => {
    setBuyers([
      ...buyers,
      {
        name: "",
        phone: "",
        shopName: "",
        address: "",
        govId: "",
        idType: "",
        creditLimit: "",
        notes: "",
        ledger: [],
        purchaseHistory: [],
        outstanding: 0,
        payments: [],
      },
    ]);
  };


  const deleteBuyer = (index) => {
    const updated = buyers.filter((_, i) => i !== index);
    setBuyers(updated);
  };

  // ===== Inventory Functions =====
  const addInventory = () => {
    setInventory([
      ...inventory,
      {
        date: new Date().toISOString().slice(0,10),
        supplier: "",
        product: "",
        grade: "",
        quantity: 0,
        unit: "KG",
        rate: "",
        lotId: "LOT" + Date.now(),
        files: []
      }
    ]);
  };

  const updateInventory = (index, field, value) => {
    const updated = [...inventory];
    updated[index][field] = value;
    setInventory(updated);
  };

  const updateInventoryFiles = (index, files) => {
    const updated = [...inventory];
    updated[index].files = Array.from(files);
    setInventory(updated);
  };

  const addSupplierBillItem = () => {
  setSupplierBill({
    ...supplierBill,
    items: [...supplierBill.items, { name: "", quantity: 0, rate: 0 }]
  });
};

const deleteSupplierBillItem = (index) => {
  const updated = supplierBill.items.filter((_, i) => i !== index);
  setSupplierBill({ ...supplierBill, items: updated });
};

const updateSupplierBillItem = (index, field, value) => {
  const updated = [...supplierBill.items];
  updated[index][field] = field === "name" ? value : Number(value);
  setSupplierBill({ ...supplierBill, items: updated });
};

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  // ===== Calculations =====
 const grossSale = supplierBill.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
const totalExpense = Object.values(supplierBill.expenses).reduce((a, b) => a + b, 0);
const netSale = grossSale - totalExpense;
const balancePayable = netSale - (supplierBill.advancePayment || 0);

// ===== Week Graph Data =====
const weekRawData = [12000, 18000, 9000, 22000, 15000, 7000, 20000];

const maxValue = Math.max(...weekRawData);
const minValue = Math.min(...weekRawData);

const barColors = weekRawData.map((value) => {
  if (value === maxValue) return "green";
  if (value === minValue) return "red";
  return "blue";
});

const weekData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Gross Sale",
      data: weekRawData,
      backgroundColor: barColors,
      borderColor: barColors,
      borderWidth: 1,
      borderRadius: 8,
    },
  ],
};

const weekOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
  // ===== Invoice Print =====
  const printInvoice = () => {
    const invoiceWindow = window.open("", "PRINT", "height=600,width=800");
    invoiceWindow.document.write("<html><head><title>Invoice</title></head><body>");
    invoiceWindow.document.write(`<h2 style="text-align:center;">🧾 Buyer Invoice</h2>`);
    invoiceWindow.document.write("<table border='1' cellpadding='10'><tr><th>Product</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>");
    products.forEach((p) => {
      invoiceWindow.document.write(`<tr><td>${p.name}</td><td>${formatCurrency(p.quantity)}</td><td>${formatCurrency(p.rate)}</td><td>${formatCurrency(p.quantity*p.rate)}</td></tr>`);
    });
    invoiceWindow.document.write("</table>");
    invoiceWindow.document.write(`<h3>💰 Gross Sale: ${formatCurrency(grossSale)}</h3>`);
    invoiceWindow.document.write(`<h3>💸 Total Expenses: ${formatCurrency(totalExpense)}</h3>`);
    invoiceWindow.document.write(`<h3>📈 Net Sale: ${formatCurrency(netSale)}</h3>`);
    invoiceWindow.document.write(`<h3>💳 Advance Payment: ${formatCurrency(advancePayment)}</h3>`);
    invoiceWindow.document.write(`<h3>🧮 Balance Payable: ${formatCurrency(balancePayable)}</h3>`);
    invoiceWindow.document.write("<h3>📊 Week Sales Comparison</h3>");
    weekData.labels.forEach((day, i) => {
      let highlight = "";
      if (weekRawData[i] === maxValue) highlight = " (Highest)";
      if (weekRawData[i] === minValue) highlight = " (Lowest)";
      invoiceWindow.document.write(`<p>${day}: ${formatCurrency(weekRawData[i])}${highlight}</p>`);
    });
    invoiceWindow.document.write("</body></html>");
    invoiceWindow.document.close();
    invoiceWindow.print();
  };

  if (!loggedIn) {
    return (
      <div
        style={{
          height: "100vh",
          backgroundImage:
            "url('https://femina.wwmindia.com/content/2023/may/bengalurufoodnews-royalorchid1685205463.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ background: "rgba(255,255,255,0.92)", padding: "40px", borderRadius: "16px", width: "360px", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}>
          <h2 style={{ textAlign: "center", color: "#d97706" }}>🥭 Mango Mandi ERP Login</h2>
          <input placeholder="👤 Username" style={{ width: "100%", padding: "12px", marginTop: "20px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc" }} />
          <input type="password" placeholder="🔒 Password" style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ccc" }} />
          <button onClick={() => setLoggedIn(true)} style={{ width: "100%", padding: "12px", background: "#facc15", border: "none", borderRadius: "8px", fontWeight: "bold" }}>
            🚀 Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Sidebar */}
      <div style={{ width: "240px", background: "#1f2937", color: "white", padding: "20px" }}>
        <img src="https://tse4.mm.bing.net/th/id/OIP.ks72csN96u4QVk_QF_7MlwHaHa?pid=Api&P=0&h=180" 
             alt="Company Logo" 
             style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", display: "block", margin: "0 auto" }} />
        <h2 style={{ color: "#facc15", marginTop: "15px", textAlign:"center" }}>🥭 Mandi ERP</h2>
        <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
          {["📊 Dashboard","🚚 Suppliers","🛒 Buyers","📦 Inventory","🧾 Invoices","📈 Reports","⚙️ Settings"].map((item) => (
            <li key={item} style={{ padding: "12px", marginBottom: "10px", background: "#374151", borderRadius: "8px" }}>{item}</li>
          ))}
        </ul>
        <button onClick={() => setLoggedIn(false)} style={{ marginTop: "20px", width: "100%", padding: "10px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px" }}>
          🔓 Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px" }}>
        {/* Search & Filter */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "20px" }}>
          <input placeholder="🔍 Search Product" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          <button onClick={printInvoice} style={{ background: "#22c55e", color: "white", borderRadius: "8px", padding: "6px 12px" }}>🖨 Print Invoice</button>
        </div>
        {/* Product Entry Table */}
<div style={{ background: "white", padding: "20px", borderRadius: "12px" }}>
  <h2>📦 Product Entry</h2>
  <table style={{ width: "100%", marginTop: "15px", borderCollapse: "collapse", textAlign:"center" }}>
    <thead>
      <tr>
        <th style={{padding:"10px"}}>📦 Product</th>
        <th style={{padding:"10px"}}>⚖ Quantity (KG)</th>
        <th style={{padding:"10px"}}>₹ Rate</th>
        <th style={{padding:"10px"}}>💰 Amount</th>
        <th style={{padding:"10px"}}>❌ Delete</th>
      </tr>
    </thead>
    <tbody>
      {filteredProducts.map((item, index) => (
        <tr key={index} style={{ height:"50px" }}>
          <td>
            <input
              value={item.name}
              onChange={(e)=>updateProduct(index,"name",e.target.value)}
              style={{ width:"100%", padding:"6px 8px", borderRadius:"6px", border:"1px solid #ccc", textAlign:"center" }}
            />
          </td>
          <td>
            <input
              type="number"
              value={item.quantity}
              onChange={(e)=>updateProduct(index,"quantity",e.target.value)}
              style={{ width:"80%", padding:"6px 8px", borderRadius:"6px", border:"1px solid #ccc", textAlign:"right" }}
            />
          </td>
          <td>
            <input
              type="number"
              value={item.rate}
              onChange={(e)=>updateProduct(index,"rate",e.target.value)}
              style={{ width:"80%", padding:"6px 8px", borderRadius:"6px", border:"1px solid #ccc", textAlign:"right" }}
            />
          </td>
          <td style={{ fontWeight:"bold" }}>₹{item.quantity * item.rate}</td>
          <td>
            <button onClick={()=>deleteProduct(index)} style={{ background: "#ef4444", color: "white", borderRadius:"4px", padding:"6px 10px" }}>❌</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <button onClick={addProduct} style={{ marginTop:"10px", background:"#22c55e", color:"white", borderRadius:"8px", padding:"6px 12px" }}>➕ Add Product</button>

  {/* Calculations Cards */}
  <div style={{ display:"flex", flexWrap:"wrap", gap:"20px", marginTop:"20px" }}>
    <div style={{ flex:"1 1 150px", background:"#fef3c7", padding:"12px", borderRadius:"8px", textAlign:"center", fontWeight:"bold" }}>💰 Gross Sale<br/>₹{grossSale}</div>
    <div style={{ flex:"1 1 150px", background:"#fee2e2", padding:"12px", borderRadius:"8px", textAlign:"center", fontWeight:"bold" }}>💸 Total Expenses<br/>₹{totalExpense}</div>
    <div style={{ flex:"1 1 150px", background:"#dcfce7", padding:"12px", borderRadius:"8px", textAlign:"center", fontWeight:"bold" }}>📈 Net Sale<br/>₹{netSale}</div>
    <div style={{ flex:"1 1 150px", background:"#ede9fe", padding:"12px", borderRadius:"8px", textAlign:"center", fontWeight:"bold" }}>💳 Advance Payment<br/>₹{advancePayment}</div>
    <div style={{ flex:"1 1 150px", background:"#e0f2fe", padding:"12px", borderRadius:"8px", textAlign:"center", fontWeight:"bold" }}>🧮 Balance Payable<br/>₹{balancePayable}</div>
  </div>
</div>

          {/* week sales graph */}
<div style={{ marginTop:"30px" }}>
  <h3>📊 Week Sales Comparison</h3>
  <Bar data={weekData} options={weekOptions} />
</div>

          {/* Expenses Section */}
          <div style={{ marginTop:"30px", padding:"20px", border:"2px solid #fbbf24", borderRadius:"10px", backgroundColor:"#fff7ed" }}>
            <h2 style={{ textAlign:"center", color:"#b91c1c" }}>💰 Custom Expenses</h2>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"15px", justifyContent:"center", marginTop:"15px" }}>
              {Object.keys(expenses).map((key) => (
                <div key={key}>
                  <label>
                    {key==="lorry"?"🚚 Lorry Freight":
                     key==="marketing"?"📢 Marketing":
                     key==="coolie"?"💪 Coolie":
                     key==="cash"?"💵 Cash":
                     key==="kaja"?"🍰 Kaja":"🛠️ Others"}
                  </label><br/>
                  <input type="number" min="0" value={expenses[key]} onChange={(e)=>setExpenses({...expenses,[key]:parseFloat(e.target.value)||0})} style={{ padding:"8px", margin:"5px", width:"120px", borderRadius:"5px", border:"1px solid #ccc"}}/>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"20px", textAlign:"center", fontWeight:"bold", fontSize:"18px" }}>
              Total Expenses: ₹ {totalExpense}
            </div>
          </div>

          {/* Expenses Section */}
          <div style={{ marginTop:"30px", padding:"20px", border:"2px solid #fbbf24", borderRadius:"10px", backgroundColor:"#fff7ed" }}>
            <h2 style={{ textAlign:"center", color:"#b91c1c" }}>💰 Custom Expenses</h2>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"15px", justifyContent:"center", marginTop:"15px" }}>
              {Object.keys(expenses).map((key) => (
                <div key={key}>
                  <label>
                    {key==="lorry"?"🚚 Lorry Freight":
                     key==="marketing"?"📢 Marketing":
                     key==="coolie"?"💪 Coolie":
                     key==="cash"?"💵 Cash":
                     key==="kaja"?"🍰 Kaja":"🛠️ Others"}
                  </label><br/>
                  <input type="number" min="0" value={expenses[key]} onChange={(e)=>setExpenses({...expenses,[key]:parseFloat(e.target.value)||0})} style={{ padding:"8px", margin:"5px", width:"120px", borderRadius:"5px", border:"1px solid #ccc", textAlign:"right"}}/>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"20px", textAlign:"center", fontWeight:"bold", fontSize:"18px" }}>
              Total Expenses: {formatCurrency(totalExpense)}
            </div>
             </div>
          {/* Suppliers Section */}
          <div style={{ marginTop:"30px", background:"#f0fdf4", padding:"20px", borderRadius:"12px", border:"2px solid #22c55e" }}>
            <h2 style={{ textAlign:"center", color:"#16a34a" }}>🚚 Supplier Management</h2>
            <table style={{ width:"100%", marginTop:"15px", borderCollapse:"collapse" }}>
              <thead>
                <tr>
                  <th>🏷 Name</th>
                  <th>📞 Phone</th>
                  <th>🏠 Address</th>
                  <th>🌾 Village</th>
                  <th>🆔 Govt ID</th>
                  <th>📝 ID Type</th>
                  <th>🏦 Bank</th>
                  <th>🗒 Notes</th>
                  <th>❌ Delete</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s,index)=>(
                  <tr key={index}>
                    <td><input value={s.name} onChange={(e)=>updateSupplier(index,"name",e.target.value)} /></td>
                    <td><input value={s.phone} onChange={(e)=>updateSupplier(index,"phone",e.target.value)} /></td>
                    <td><input value={s.address} onChange={(e)=>updateSupplier(index,"address",e.target.value)} /></td>
                    <td><input value={s.village} onChange={(e)=>updateSupplier(index,"village",e.target.value)} /></td>
                    <td><input value={s.govId} onChange={(e)=>updateSupplier(index,"govId",e.target.value)} /></td>
                    <td><input value={s.idType} onChange={(e)=>updateSupplier(index,"idType",e.target.value)} /></td>
                    <td><input value={s.bankDetails} onChange={(e)=>updateSupplier(index,"bankDetails",e.target.value)} /></td>
                    <td><input value={s.notes} onChange={(e)=>updateSupplier(index,"notes",e.target.value)} /></td>
                    <td><button onClick={()=>deleteSupplier(index)} style={{background:"#ef4444", color:"white", borderRadius:"4px"}}>❌</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addSupplier} style={{marginTop:"10px", background:"#22c55e", color:"white", borderRadius:"8px", padding:"6px 12px"}}>➕ Add Supplier</button>
          </div>

          {/* Buyers Section with Advanced Tabs */}
          <div style={{ marginTop: "30px", background: "#f0fdfa", padding: "25px", borderRadius: "16px", border: "2px solid #14b8a6" }}>
            <h2 style={{ textAlign: "center", color: "#0d9488", fontSize: "26px", fontWeight: "bold" }}>🛒 Buyer Management</h2>
            {buyers.map((b, index) => (
              <div key={index} style={{ marginTop: "25px", border: "1px solid #14b8a6", borderRadius: "12px", padding: "15px", background: "#e0f2f1", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                
                {/* Buyer Info Card */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                  <input placeholder="🧑 Name" value={b.name} onChange={(e) => updateBuyer(index, "name", e.target.value)} style={{ flex: "1", padding: "10px", borderRadius: "8px", border: "1px solid #0d9488", fontWeight: "bold" }} />
                  <input placeholder="📞 Phone" value={b.phone} onChange={(e) => updateBuyer(index, "phone", e.target.value)} style={{ flex: "1", padding: "10px", borderRadius: "8px", border: "1px solid #0d9488" }} />
                  <input placeholder="🏪 Shop Name" value={b.shopName} onChange={(e) => updateBuyer(index, "shopName", e.target.value)} style={{ flex: "1", padding: "10px", borderRadius: "8px", border: "1px solid #0d9488" }} />
                  <input placeholder="🏠 Address" value={b.address} onChange={(e) => updateBuyer(index, "address", e.target.value)} style={{ flex: "2", padding: "10px", borderRadius: "8px", border: "1px solid #0d9488" }} />
                  <input placeholder="🆔 Govt ID" value={b.govId} onChange={(e) => updateBuyer(index, "govId", e.target.value)} style={{ flex: "1", padding: "10px", borderRadius: "8px", border: "1px solid #0d9488" }} />
                  <input placeholder="📝 ID Type" value={b.idType} onChange={(e) => updateBuyer(index, "idType", e.target.value)} style={{ flex: "1", padding: "10px", borderRadius: "8px", border: "1px solid #0d9488" }} />
                  <input placeholder="💳 Credit Limit" value={b.creditLimit} onChange={(e) => updateBuyer(index, "creditLimit", e.target.value)} style={{ flex: "1", padding: "10px", borderRadius: "8px", border: "1px solid #0d9488", textAlign:"right" }} />
                  <input placeholder="🗒 Notes" value={b.notes} onChange={(e) => updateBuyer(index, "notes", e.target.value)} style={{ flex: "2", padding: "10px", borderRadius: "8px", border: "1px solid #0d9488" }} />
                  <button onClick={() => deleteBuyer(index)} style={{ background: "#ef4444", color: "white", borderRadius: "8px", padding: "10px 16px", fontWeight: "bold" }}>❌ Delete</button>
                </div>

                {/* Tabs for Advanced Features */}
                <div style={{ marginTop: "20px" }}>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    {["💼 Ledger", "🛍 Purchase History", "💳 Outstanding", "💰 Payments"].map(tab => {
                      const key = `${index}-${tab}`;
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveBuyerTab({ ...activeBuyerTab, [index]: tab })}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: activeBuyerTab[index] === tab ? "2px solid #0d9488" : "1px solid #ccc",
                            background: activeBuyerTab[index] === tab ? "#0d9488" : "#fff",
                            color: activeBuyerTab[index] === tab ? "#fff" : "#000",
                            fontWeight: "bold",
                            cursor: "pointer",
                            flex: "1",
                            textAlign: "center",
                          }}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content Card */}
                  <div style={{ marginTop: "15px", padding: "15px", borderRadius: "12px", background: "#d1fae5", border: "1px solid #0d9488", minHeight: "80px" }}>
                    {activeBuyerTab[index] === "💼 Ledger" && <div>💼 Buyer Ledger Details</div>}
                    {activeBuyerTab[index] === "🛍 Purchase History" && <div>🛍 Purchase History Details</div>}
                    {activeBuyerTab[index] === "💳 Outstanding" && <div>💳 Outstanding Tracking</div>}
                    {activeBuyerTab[index] === "💰 Payments" && <div>💰 Payment Tracking</div>}
                    {!activeBuyerTab[index] && <div style={{ color: "#0d9488", fontWeight: "bold" }}>Select a tab to view details</div>}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addBuyer} style={{ marginTop: "20px", background: "#14b8a6", color: "white", borderRadius: "12px", padding: "10px 20px", fontWeight: "bold" }}>➕ Add Buyer</button>
          </div>
          {/* Inventory Section with Advanced Tabs */}
<div style={{ marginTop: "30px", background: "#fff7ed", padding: "25px", borderRadius: "16px", border: "2px solid #f59e0b" }}>
  <h2 style={{ textAlign: "center", color: "#d97706", fontSize: "26px", fontWeight: "bold" }}>📦 Inventory Intake</h2>

  {inventory.map((inv, index) => (
    <div key={index} style={{ marginTop: "25px", border: "1px solid #f59e0b", borderRadius: "12px", padding: "15px", background: "#fef3c7", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      
      {/* Inventory Info Card */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <input type="date" value={inv.date} onChange={(e) => updateInventory(index, "date", e.target.value)} style={{ flex: "1", padding:"10px", borderRadius:"8px", border:"1px solid #f59e0b", textAlign:"center" }} />
        <input placeholder="🚚 Supplier" value={inv.supplier} onChange={(e) => updateInventory(index, "supplier", e.target.value)} style={{ flex: "1", padding:"10px", borderRadius:"8px", border:"1px solid #f59e0b" }} />
        <input placeholder="📦 Product" value={inv.product} onChange={(e) => updateInventory(index, "product", e.target.value)} style={{ flex: "1", padding:"10px", borderRadius:"8px", border:"1px solid #f59e0b" }} />
        <input placeholder="🏷 Grade" value={inv.grade} onChange={(e) => updateInventory(index, "grade", e.target.value)} style={{ flex: "1", padding:"10px", borderRadius:"8px", border:"1px solid #f59e0b" }} />
        <input type="number" placeholder="⚖ Qty" value={inv.quantity} onChange={(e) => updateInventory(index, "quantity", e.target.value)} style={{ flex: "1", padding:"10px", borderRadius:"8px", border:"1px solid #f59e0b", textAlign:"right" }} />
        <input placeholder="🔢 Unit" value={inv.unit} readOnly style={{ flex: "1", padding:"10px", borderRadius:"8px", border:"1px solid #f59e0b", textAlign:"center", background:"#fef3c7" }} />
        <input type="number" placeholder="💰 Rate" value={inv.rate} onChange={(e) => updateInventory(index, "rate", e.target.value)} style={{ flex: "1", padding:"10px", borderRadius:"8px", border:"1px solid #f59e0b", textAlign:"right" }} />
        <input placeholder="🆔 Lot ID" value={inv.lotId} readOnly style={{ flex: "1", padding:"10px", borderRadius:"8px", border:"1px solid #f59e0b", textAlign:"center", background:"#fef3c7" }} />
        <div style={{ flex: "2" }}>
          <input type="file" multiple onChange={(e) => updateInventoryFiles(index, e.target.files)} />
          {inv.files.length > 0 && inv.files.map((file, i) => <p key={i}>📄 {file.name}</p>)}
        </div>
        <button onClick={() => setInventory(inventory.filter((_, i) => i !== index))} style={{ background:"#ef4444", color:"white", borderRadius:"8px", padding:"10px 16px", fontWeight:"bold" }}>❌ Delete</button>
      </div>

      {/* Tabs for Advanced Features */}
      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {["📊 Stock Value", "🗂 Files"].map(tab => {
            const key = `${index}-${tab}`;
            return (
              <button
                key={key}
                onClick={() => setActiveBuyerTab({ ...activeBuyerTab, [index]: tab })}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: activeBuyerTab[index] === tab ? "2px solid #f59e0b" : "1px solid #ccc",
                  background: activeBuyerTab[index] === tab ? "#f59e0b" : "#fff",
                  color: activeBuyerTab[index] === tab ? "#fff" : "#000",
                  fontWeight: "bold",
                  cursor: "pointer",
                  flex: "1",
                  textAlign: "center",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tab Content Card */}
        <div style={{ marginTop: "15px", padding: "15px", borderRadius: "12px", background: "#fef9c3", border: "1px solid #f59e0b", minHeight: "80px" }}>
          {activeBuyerTab[index] === "📊 Stock Value" && <div>💰 {inv.quantity * inv.rate} ₹</div>}
          {activeBuyerTab[index] === "🗂 Files" && <div>{inv.files.length === 0 ? "No files attached" : inv.files.map((file, i) => <p key={i}>📄 {file.name}</p>)}</div>}
          {!activeBuyerTab[index] && <div style={{ color: "#b45309", fontWeight: "bold" }}>Select a tab to view details</div>}
        </div>
      </div>
    </div>
  ))}

  <button onClick={addInventory} style={{ marginTop: "20px", background: "#f59e0b", color: "white", borderRadius: "12px", padding: "10px 20px", fontWeight: "bold" }}>
    ➕ Add Inventory
  </button>
</div>
{/* Inventory Allocation to Buyers */}
<div style={{ marginTop: "30px", background: "#f0fdfa", padding: "25px", borderRadius: "16px", border: "2px solid #14b8a6" }}>
  <h2 style={{ textAlign: "center", color: "#0d9488", fontSize: "26px", fontWeight: "bold" }}>🔗 Inventory Allocation to Buyers</h2>

  {inventory.map((lot, lotIndex) => (
    <div key={lotIndex} style={{ marginTop: "25px", border: "1px solid #14b8a6", borderRadius: "12px", padding: "15px", background: "#e0f2f1", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      
      {/* Lot Info Card */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <div style={{ flex: "1", fontWeight: "bold" }}>📅 Date: {lot.date}</div>
        <div style={{ flex: "1", fontWeight: "bold" }}>🚚 Supplier: {lot.supplier || "N/A"}</div>
        <div style={{ flex: "1", fontWeight: "bold" }}>📦 Product: {lot.product || "N/A"}</div>
        <div style={{ flex: "1", fontWeight: "bold" }}>🏷 Grade: {lot.grade || "N/A"}</div>
        <div style={{ flex: "1", fontWeight: "bold" }}>⚖ Qty: {lot.quantity}</div>
        <div style={{ flex: "1", fontWeight: "bold" }}>💰 Rate: ₹{lot.rate}</div>
        <div style={{ flex: "1", fontWeight: "bold" }}>🆔 Lot ID: {lot.lotId}</div>
        <div style={{ flex: "1" }}>🗂 Files: {lot.files.length} attached</div>
      </div>

      {/* Buyer Allocation */}
      <div style={{ marginTop: "15px" }}>
        <h4 style={{ fontWeight: "bold", color: "#0d9488" }}>🛒 Allocate to Buyers</h4>
        {buyers.map((b, buyerIndex) => (
          <div key={buyerIndex} style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
            <div style={{ flex: "2" }}>🧑 {b.name || "N/A"} ({b.shopName || "Shop"})</div>
            <input
              type="number"
              placeholder="Qty to allocate"
              value={lot.allocations?.[buyerIndex]?.quantity || ""}
              min="0"
              max={lot.quantity - (lot.allocations?.reduce((sum, a) => sum + (a?.quantity || 0), 0) || 0)}
              onChange={(e) => {
                const qty = parseFloat(e.target.value) || 0;
                const updatedAlloc = [...(lot.allocations || [])];
                updatedAlloc[buyerIndex] = { ...updatedAlloc[buyerIndex], buyerIndex, quantity: qty };
                const updatedLot = { ...lot, allocations: updatedAlloc };
                const updatedInventory = [...inventory];
                updatedInventory[lotIndex] = updatedLot;
                setInventory(updatedInventory);
              }}
              style={{ flex: "1", padding: "6px 8px", borderRadius: "6px", border: "1px solid #0d9488", textAlign: "right" }}
            />
            <div style={{ flex: "1", fontWeight: "bold" }}>Allocated: {lot.allocations?.[buyerIndex]?.quantity || 0}</div>
          </div>
        ))}
        <div style={{ marginTop: "10px", fontWeight: "bold", color: "#0d9488" }}>
          ⚖ Remaining Stock: {lot.quantity - (lot.allocations?.reduce((sum, a) => sum + (a?.quantity || 0), 0) || 0)}
        </div>
      </div>

      {/* Tabs for Advanced Features */}
      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {["📊 Allocation Summary", "📝 Supplier-Buyer History"].map(tab => {
            const key = `${lotIndex}-${tab}`;
            return (
              <button
                key={key}
                onClick={() => setActiveBuyerTab({ ...activeBuyerTab, [`lot-${lotIndex}`]: tab })}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: activeBuyerTab[`lot-${lotIndex}`] === tab ? "2px solid #0d9488" : "1px solid #ccc",
                  background: activeBuyerTab[`lot-${lotIndex}`] === tab ? "#0d9488" : "#fff",
                  color: activeBuyerTab[`lot-${lotIndex}`] === tab ? "#fff" : "#000",
                  fontWeight: "bold",
                  cursor: "pointer",
                  flex: "1",
                  textAlign: "center",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tab Content Card */}
        <div style={{ marginTop: "15px", padding: "15px", borderRadius: "12px", background: "#d1fae5", border: "1px solid #0d9488", minHeight: "80px" }}>
          {activeBuyerTab[`lot-${lotIndex}`] === "📊 Allocation Summary" &&
            <div>
              {lot.allocations?.length > 0
                ? lot.allocations.map((a, i) => (
                    <p key={i}>🧑 {buyers[a.buyerIndex]?.name || "N/A"}: {a.quantity} KG</p>
                  ))
                : "No allocations yet"}
            </div>
          }
          {activeBuyerTab[`lot-${lotIndex}`] === "📝 Supplier-Buyer History" &&
            <div>
              {lot.allocations?.length > 0
                ? lot.allocations.map((a, i) => (
                    <p key={i}>🚚 {lot.supplier} → 🧑 {buyers[a.buyerIndex]?.name || "N/A"}: {a.quantity} KG</p>
                  ))
                : "No history yet"}
            </div>
          }
          {!activeBuyerTab[`lot-${lotIndex}`] && <div style={{ color: "#0d9488", fontWeight: "bold" }}>Select a tab to view details</div>}
        </div>
      </div>
    </div>
  ))}

  <button onClick={addInventory} style={{ marginTop: "20px", background: "#14b8a6", color: "white", borderRadius: "12px", padding: "10px 20px", fontWeight: "bold" }}>
    ➕ Add Inventory Lot
  </button>
</div>
{/* Supplier Bill Generation Section */}
<div
  style={{
    marginTop: "30px",
    background: "linear-gradient(135deg,#ffffff,#eef6ff)",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    border: "1px solid #dbeafe",
  }}
>
  <h2 style={{ color: "#1e3a8a", fontWeight: "800", marginBottom: "20px" }}>
    🧾 Supplier Bill Generation
  </h2>

  {/* Top Fields */}
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "15px" }}>
    <input
      placeholder="🔢 Bill Number"
      value={supplierBill.billNumber}
      onChange={(e) =>
        setSupplierBill({ ...supplierBill, billNumber: e.target.value })
      }
      style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ccc" }}
    />

    <input
      type="date"
      value={supplierBill.date}
      onChange={(e) =>
        setSupplierBill({ ...supplierBill, date: e.target.value })
      }
      style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ccc" }}
    />

    <input
      placeholder="🏢 Supplier Name"
      value={supplierBill.supplierName}
      onChange={(e) =>
        setSupplierBill({ ...supplierBill, supplierName: e.target.value })
      }
      style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ccc" }}
    />
  </div>

  {/* Product Rows */}
  <div style={{ marginTop: "25px" }}>
    {supplierBill.items.map((item, index) => (
      <div
        key={index}
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        <input
          placeholder="📦 Product"
          value={item.name}
          onChange={(e) =>
            updateSupplierBillItem(index, "name", e.target.value)
          }
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <input
          type="number"
          placeholder="Qty"
          value={item.quantity}
          onChange={(e) =>
            updateSupplierBillItem(index, "quantity", e.target.value)
          }
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <input
          type="number"
          placeholder="Rate"
          value={item.rate}
          onChange={(e) =>
            updateSupplierBillItem(index, "rate", e.target.value)
          }
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <div
          style={{
            padding: "10px",
            background: "#f3f4f6",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          ₹{item.quantity * item.rate}
        </div>

        <button
          onClick={() => deleteSupplierBillItem(index)}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
          }}
        >
          ❌
        </button>
      </div>
    ))}

    <button
      onClick={addSupplierBillItem}
      style={{
        background: "#16a34a",
        color: "white",
        padding: "10px 16px",
        borderRadius: "10px",
        border: "none",
        fontWeight: "bold",
      }}
    >
      ➕ Add Product
    </button>
  </div>

  {/* Expense Section */}
  <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "12px", marginTop: "25px" }}>
    {["freight", "marketing", "labour", "packing", "misc"].map((key) => (
      <input
        key={key}
        type="number"
        placeholder={key}
        value={supplierBill.expenses[key]}
        onChange={(e) =>
          setSupplierBill({
            ...supplierBill,
            expenses: {
              ...supplierBill.expenses,
              [key]: Number(e.target.value),
            },
          })
        }
        style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
      />
    ))}
  </div>

  {/* Advance Payment */}
  <div style={{ marginTop: "20px" }}>
    <input
      type="number"
      placeholder="💳 Advance Payment"
      value={supplierBill.advancePayment}
      onChange={(e) =>
        setSupplierBill({
          ...supplierBill,
          advancePayment: Number(e.target.value),
        })
      }
      style={{
        padding: "12px",
        width: "250px",
        borderRadius: "10px",
        border: "1px solid #ccc",
      }}
    />
  </div>
    {/* Summary Cards */}
  <div style={{ display: "flex", gap: "15px", marginTop: "25px", flexWrap: "wrap" }}>
    <div style={{ background: "#fef3c7", padding: "12px", borderRadius: "10px", fontWeight: "bold" }}>
      💰 Gross Sale ₹ {grossSale}
    </div>
    <div style={{ background: "#fee2e2", padding: "12px", borderRadius: "10px", fontWeight: "bold" }}>
      💸 Expenses ₹ {totalExpense}
    </div>
    <div style={{ background: "#dcfce7", padding: "12px", borderRadius: "10px", fontWeight: "bold" }}>
      📈 Net ₹ {netSale}
    </div>
    <div style={{ background: "#dbeafe", padding: "12px", borderRadius: "10px", fontWeight: "bold" }}>
      🧮 Balance ₹ {balancePayable}
    </div>
  </div>

  {/* Detailed Totals Section */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: "15px",
      marginTop: "25px",
    }}
  >
    {[
      { label: "💰 Gross Sale", value: grossSale, bg: "#fef3c7" },
      { label: "💸 Total Expenses", value: totalExpense, bg: "#fee2e2" },
      { label: "📈 Net Sale", value: netSale, bg: "#dcfce7" },
      { label: "💳 Advance Payment", value: supplierBill.advancePayment, bg: "#dbeafe" },
      { label: "🧮 Balance Payable", value: balancePayable, bg: "#ede9fe" },
    ].map((card, i) => (
      <div
        key={i}
        style={{
          background: card.bg,
          padding: "16px",
          borderRadius: "14px",
          fontWeight: "800",
          fontSize: "17px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.06)",
        }}
      >
        <div>{card.label}</div>
        <div style={{ marginTop: "8px", fontSize: "20px" }}>
          ₹ {card.value}
        </div>
      </div>
    ))}
  </div>
</div>

  {/* Product Table */}
  <div
    style={{
      marginTop: "30px",
      background: "#fff",
      padding: "24px",
      borderRadius: "18px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    }}
  >
    <h3
      style={{
        fontSize: "20px",
        fontWeight: "800",
        marginBottom: "20px",
        color: "#111827",
      }}
    >
      📦 Product Details
</h3>

{/* Header Tabs */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
    gap: "14px",
    marginBottom: "16px",
  }}
>
  {[
    "🛒 Product Name",
    "📦 Quantity",
    "💰 Rate",
    "🧾 Amount",
    "❌ Delete",
  ].map((title, i) => (
    <div
      key={i}
      style={{
        background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
        padding: "12px",
        borderRadius: "12px",
        textAlign: "center",
        fontWeight: "700",
        color: "#1e3a8a",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      {title}
    </div>
  ))}
</div>

{supplierBill.items.map((item, index) => (
  <div
    key={index}
    style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
      gap: "14px",
      marginBottom: "14px",
      alignItems: "center",
    }}
  >
    <input
      type="text"
      placeholder="🛒 Product"
      value={item.name}
      onChange={(e) =>
        updateSupplierBillItem(index, "name", e.target.value)
      }
      style={{
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid #93c5fd",
        background: "#eff6ff",
      }}
    />

    <input
      type="number"
      placeholder="Qty"
      value={item.quantity}
      onChange={(e) =>
        updateSupplierBillItem(index, "quantity", e.target.value)
      }
      style={{
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid #86efac",
        background: "#f0fdf4",
      }}
    />

    <input
      type="number"
      placeholder="Rate"
      value={item.rate}
      onChange={(e) =>
        updateSupplierBillItem(index, "rate", e.target.value)
      }
      style={{
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid #fde68a",
        background: "#fefce8",
      }}
    />

    <div
      style={{
        padding: "12px",
        borderRadius: "12px",
        background: "#f3f4f6",
        textAlign: "center",
        fontWeight: "700",
      }}
    >
      ₹{item.quantity * item.rate}
    </div>

    <button
      onClick={() => deleteSupplierBillItem(index)}
      style={{
        background: "#ef4444",
        color: "white",
        border: "none",
        padding: "10px 14px",
        borderRadius: "10px",
        cursor: "pointer",
      }}
    >
      ✖
    </button>
  </div>
))}

<button
  onClick={addSupplierBillItem}
  style={{
    marginTop: "12px",
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  }}
>
  ➕ Add Product Row
</button>

{/* Expense Deductions */}
<div
  style={{
    marginTop: "30px",
    background: "linear-gradient(135deg, #ffffff, #f9fafb)",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb",
  }}
>
  <h3
    style={{
      fontSize: "20px",
      fontWeight: "800",
      marginBottom: "20px",
      color: "#111827",
    }}
  >
    💸 Expense Deductions
  </h3>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: "18px",
    }}
  >
    {[
      { label: "🚚 Transport / Freight", key: "freight" },
      { label: "📢 Marketing", key: "marketing" },
      { label: "👷 Labour / Coolie", key: "labour" },
      { label: "📦 Packing", key: "packing" },
      { label: "🧾 Miscellaneous", key: "misc" },
    ].map((expense, i) => (
      <div
        key={i}
        style={{
          background: "#fff",
          padding: "16px",
          borderRadius: "14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <label
          style={{
            display: "block",
            fontWeight: "700",
            marginBottom: "8px",
            color: "#374151",
          }}
        >
          {expense.label}
        </label>

        <input
          type="number"
          value={supplierBill.expenses[expense.key]}
          onChange={(e) =>
            setSupplierBill({
              ...supplierBill,
              expenses: {
                ...supplierBill.expenses,
                [expense.key]: Number(e.target.value),
              },
            })
          }
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            background: "#f9fafb",
            outline: "none",
          }}
        />
      </div>
    ))}
  </div>

  <div
    style={{
      marginTop: "20px",
      padding: "16px",
      background: "#eef2ff",
      borderRadius: "14px",
      fontWeight: "800",
      fontSize: "18px",
      color: "#1e3a8a",
      textAlign: "right",
    }}
  >
    Total Expenses ₹ {totalExpense}
  </div>
  {/* Buyer Invoice Generation */}
<div
  style={{
    marginTop: "30px",
    background: "linear-gradient(135deg,#ffffff,#f0fdf4)",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    border: "1px solid #bbf7d0",
  }}
>
  <h2 style={{ color: "#166534", fontWeight: "800", marginBottom: "20px" }}>
    🧾 Buyer Invoice Generation
  </h2>

  {/* Top Fields */}
  {/* Top Fields - Vertical Advanced Boxes */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
    marginBottom: "25px",
  }}
>
  {[
    {
      label: "🔢 Invoice Number",
      placeholder: "Enter Invoice Number",
      type: "text",
    },
    {
      label: "📅 Date",
      placeholder: "",
      type: "date",
    },
    {
      label: "🏢 Buyer Name",
      placeholder: "Enter Buyer Name",
      type: "text",
    },
  ].map((field, i) => (
    <div
      key={i}
      style={{
        background: "#ffffff",
        padding: "16px",
        borderRadius: "14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        border: "1px solid #d1fae5",
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "700",
          color: "#166534",
        }}
      >
        {field.label}
      </label>

      <input
        type={field.type}
        placeholder={field.placeholder}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          background: "#f9fafb",
          outline: "none",
        }}
      />
    </div>
  ))}
</div>

  {/* Product Header */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
      gap: "12px",
      marginTop: "25px",
      marginBottom: "10px",
    }}
  >
    {["📦 Product", "Qty", "₹ Rate", "💰 Amount", "❌"].map((head, i) => (
      <div
        key={i}
        style={{
          background: "#dcfce7",
          padding: "10px",
          borderRadius: "10px",
          textAlign: "center",
          fontWeight: "700",
        }}
      >
        {head}
      </div>
    ))}
  </div>

  {/* Product Rows */}
  {[1].map((_, index) => (
    <div
      key={index}
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
        gap: "12px",
        marginBottom: "12px",
      }}
    >
      <input placeholder="Product" style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
      <input type="number" placeholder="Qty" style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
      <input type="number" placeholder="Rate" style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
      <div style={{ padding: "10px", background: "#f3f4f6", borderRadius: "8px", textAlign: "center" }}>₹0</div>
      <button style={{ background: "#ef4444", color: "white", border: "none", borderRadius: "8px" }}>❌</button>
    </div>
  ))}

  <button
    style={{
      background: "#16a34a",
      color: "white",
      padding: "10px 16px",
      borderRadius: "10px",
      border: "none",
      fontWeight: "bold",
    }}
  >
    ➕ Add Product
  </button>

  {/* Additional Charges */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: "15px",
      marginTop: "25px",
    }}
  >
    {["Commission", "Transport", "Handling"].map((charge, i) => (
      <input
        key={i}
        placeholder={charge}
        type="number"
        style={{
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #ccc",
        }}
      />
    ))}
  </div>

  {/* Totals */}
  <div style={{ display: "flex", gap: "15px", marginTop: "25px", flexWrap: "wrap" }}>
    <div style={{ background: "#fef3c7", padding: "12px", borderRadius: "10px", fontWeight: "bold" }}>
      💰 Gross Total ₹ 0
    </div>
    <div style={{ background: "#fee2e2", padding: "12px", borderRadius: "10px", fontWeight: "bold" }}>
      💸 Charges ₹ 0
    </div>
    <div style={{ background: "#dcfce7", padding: "12px", borderRadius: "10px", fontWeight: "bold" }}>
      📈 Net Total ₹ 0
    </div>
  </div>

  {/* PDF Button */}
  <button
    style={{
      marginTop: "20px",
      background: "#2563eb",
      color: "white",
      padding: "12px 18px",
      borderRadius: "10px",
      border: "none",
      fontWeight: "700",
    }}
  >
    🖨 Generate Invoice PDF
  </button>
</div>

{/* Supplier Ledger */}
<div
  style={{
    marginTop: "30px",
    background: "#fff",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  }}
>
  <h2 style={{ fontWeight: "800", marginBottom: "20px" }}>📘 Supplier Ledger</h2>

  <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "10px" }}>
    {["Date", "Bill No", "Quantity", "Amount", "Advance", "Balance"].map((h, i) => (
      <div key={i} style={{ fontWeight: "700", background: "#e0f2fe", padding: "10px", borderRadius: "8px" }}>
        {h}
      </div>
    ))}
  </div>
</div>

{/* Buyer Ledger */}
<div
  style={{
    marginTop: "30px",
    background: "#fff",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  }}
>
  <h2 style={{ fontWeight: "800", marginBottom: "20px" }}>📗 Buyer Ledger</h2>

  <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "10px" }}>
    {["Date", "Invoice No", "Purchase Amount", "Payments", "Outstanding"].map((h, i) => (
      <div key={i} style={{ fontWeight: "700", background: "#dcfce7", padding: "10px", borderRadius: "8px" }}>
        {h}
      </div>
    ))}
  </div>
  {/* Payment Management */}
<div
  style={{
    marginTop: "30px",
    background: "linear-gradient(135deg,#ffffff,#fefce8)",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    border: "1px solid #fde68a",
  }}
>
  <h2 style={{ color: "#92400e", fontWeight: "800", marginBottom: "20px" }}>
    💳 Payment Management
  </h2>

  {/* Top Fields */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "16px",
      marginBottom: "25px",
    }}
  >
    {[
      { label: "📅 Payment Date", type: "date", placeholder: "" },
      { label: "🏢 Party Name", type: "text", placeholder: "Enter Supplier / Buyer Name" },
      { label: "💰 Payment Amount", type: "number", placeholder: "Enter Amount" },
    ].map((field, i) => (
      <div
        key={i}
        style={{
          background: "#fff",
          padding: "16px",
          borderRadius: "14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          border: "1px solid #fde68a",
        }}
      >
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "700",
            color: "#92400e",
          }}
        >
          {field.label}
        </label>

        <input
          type={field.type}
          placeholder={field.placeholder}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            background: "#f9fafb",
            outline: "none",
          }}
        />
      </div>
    ))}
  </div>

  {/* Payment Modes */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: "15px",
      marginBottom: "20px",
    }}
  >
    {["💵 Cash", "📲 UPI", "🏦 Bank"].map((mode, i) => (
      <button
        key={i}
        style={{
          padding: "14px",
          borderRadius: "12px",
          border: "none",
          background: "#fef3c7",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        {mode}
      </button>
    ))}
  </div>

  {/* Payment Type */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: "15px",
      marginBottom: "20px",
    }}
  >
    {["🧾 Partial Payment", "💳 Advance Payment", "✅ Full Settlement"].map((type, i) => (
      <div
        key={i}
        style={{
          background: "#fff7ed",
          padding: "14px",
          borderRadius: "12px",
          textAlign: "center",
          fontWeight: "700",
          border: "1px solid #fdba74",
        }}
      >
        {type}
      </div>
    ))}
  </div>

  {/* Settlement Tracking */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: "15px",
      marginTop: "20px",
    }}
  >
    {[
      { label: "💰 Total Due", value: "₹ 0", bg: "#fef3c7" },
      { label: "💳 Paid Amount", value: "₹ 0", bg: "#dcfce7" },
      { label: "📌 Balance Pending", value: "₹ 0", bg: "#fee2e2" },
    ].map((card, i) => (
      <div
        key={i}
        style={{
          background: card.bg,
          padding: "16px",
          borderRadius: "14px",
          fontWeight: "800",
          fontSize: "17px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.06)",
        }}
      >
        <div>{card.label}</div>
        <div style={{ marginTop: "8px", fontSize: "20px" }}>
          {card.value}
        </div>
      </div>
    ))}
  </div>

  {/* Save Button */}
  <button
    style={{
      marginTop: "25px",
      background: "#ca8a04",
      color: "white",
      border: "none",
      padding: "12px 18px",
      borderRadius: "12px",
      fontWeight: "700",
      cursor: "pointer",
    }}
  >
    💾 Save Payment Record
  </button>
  {/* Expense Management */}
<div
  style={{
    marginTop: "30px",
    background: "linear-gradient(135deg,#ffffff,#fdf4ff)",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    border: "1px solid #e9d5ff",
  }}
>
  <h2 style={{ color: "#7c3aed", fontWeight: "800", marginBottom: "20px" }}>
    💸 Expense Management
  </h2>

  {/* Expense Entry Fields */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "16px",
      marginBottom: "25px",
    }}
  >
    {[
      { label: "📅 Expense Date", type: "date", placeholder: "" },
      { label: "🧾 Transaction Reference", type: "text", placeholder: "Enter Bill / Invoice No" },
      { label: "💰 Expense Amount", type: "number", placeholder: "Enter Amount" },
    ].map((field, i) => (
      <div
        key={i}
        style={{
          background: "#fff",
          padding: "16px",
          borderRadius: "14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          border: "1px solid #ddd6fe",
        }}
      >
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "700",
            color: "#6d28d9",
          }}
        >
          {field.label}
        </label>

        <input
          type={field.type}
          placeholder={field.placeholder}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            background: "#f9fafb",
            outline: "none",
          }}
        />
      </div>
    ))}
  </div>

  {/* Expense Categories */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(5,1fr)",
      gap: "15px",
      marginBottom: "20px",
    }}
  >
    {[
      "👷 Labour",
      "🚚 Transport",
      "📢 Marketing",
      "📦 Packing",
      "🧾 Miscellaneous",
    ].map((category, i) => (
      <button
        key={i}
        style={{
          padding: "14px",
          borderRadius: "12px",
          border: "none",
          background: "#ede9fe",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        {category}
      </button>
    ))}
  </div>

  {/* Expense Tracking Cards */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: "15px",
      marginTop: "20px",
    }}
  >
    {[
      { label: "💰 Total Expense", value: "₹ 0", bg: "#f3e8ff" },
      { label: "📊 Today's Expense", value: "₹ 0", bg: "#fae8ff" },
      { label: "📌 Transaction Expense", value: "₹ 0", bg: "#ede9fe" },
    ].map((card, i) => (
      <div
        key={i}
        style={{
          background: card.bg,
          padding: "16px",
          borderRadius: "14px",
          fontWeight: "800",
          fontSize: "17px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.06)",
        }}
      >
        <div>{card.label}</div>
        <div style={{ marginTop: "8px", fontSize: "20px" }}>
          {card.value}
        </div>
      </div>
    ))}
  </div>

  {/* Expense Report Section */}
  <div
    style={{
      marginTop: "25px",
      background: "#faf5ff",
      padding: "16px",
      borderRadius: "14px",
      fontWeight: "700",
      color: "#6d28d9",
    }}
  >
    📄 Expense Reports Available Per Transaction / Daily / Monthly
  </div>

  {/* Save Button */}
  <button
    style={{
      marginTop: "25px",
      background: "#7c3aed",
      color: "white",
      border: "none",
      padding: "12px 18px",
      borderRadius: "12px",
      fontWeight: "700",
      cursor: "pointer",
    }}
  >
    💾 Save Expense Entry
  </button>
</div>
</div>
</div>
</div>
</div>
</div> 
</div> 
);
}

export default App;