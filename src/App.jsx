import React, { useState } from "react";
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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  // ===== Calculations =====
  const grossSale = products.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const totalExpense = Object.values(expenses).reduce((a, b) => a + b, 0);
  const netSale = grossSale - totalExpense;
  const balancePayable = netSale - advancePayment;

  // ===== Week Graph Data =====
  const weekRawData = [grossSale * 0.8, grossSale, grossSale * 0.9, grossSale * 0.7, grossSale * 1.1, grossSale * 0.95, grossSale];
  const maxValue = Math.max(...weekRawData);
  const minValue = Math.min(...weekRawData);

  const weekData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Gross Sale",
        data: weekRawData,
        backgroundColor: weekRawData.map((value) => {
          if (value === maxValue) return "#16a34a";
          if (value === minValue) return "#dc2626";
          return "#3b82f6";
        }),
      },
    ],
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

                    {/* Weekwise Graph */}
          <div style={{ marginTop:"30px" }}>
            <h3>📊 Week Sales Comparison</h3>
            <Bar data={weekData} />
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
          {/* Inventory Intake Section with Default Values and Tabs */}
<div style={{ marginTop: "30px", background: "#fff7ed", padding: "25px", borderRadius: "16px", border: "2px solid #f59e0b" }}>
  <h2 style={{ textAlign: "center", color: "#d97706", fontSize: "26px", fontWeight: "bold" }}>📦 Inventory Intake</h2>

  {inventory.map((inv, index) => (
    <div key={index} style={{ marginTop: "20px", border: "1px solid #fbbf24", borderRadius: "12px", padding: "15px", background: "#fffbf0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
      
      {/* Inventory Main Info */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <input type="date" value={inv.date} onChange={(e) => updateInventory(index, "date", e.target.value)} style={{ flex: "1", padding:"8px", borderRadius:"8px", border:"1px solid #f59e0b", textAlign:"center" }} />
        <input value={inv.supplier} onChange={(e) => updateInventory(index, "supplier", e.target.value)} placeholder="🚚 Supplier" style={{ flex: "1.5", padding:"8px", borderRadius:"8px", border:"1px solid #f59e0b", textAlign:"center" }} />
        <input value={inv.product} onChange={(e) => updateInventory(index, "product", e.target.value)} placeholder="📦 Product" style={{ flex: "1.5", padding:"8px", borderRadius:"8px", border:"1px solid #f59e0b", textAlign:"center" }} />
        <input value={inv.grade} onChange={(e) => updateInventory(index, "grade", e.target.value)} placeholder="🏷 Grade" style={{ flex: "1", padding:"8px", borderRadius:"8px", border:"1px solid #f59e0b", textAlign:"center" }} />
        <input type="number" value={inv.quantity} onChange={(e) => updateInventory(index, "quantity", e.target.value)} placeholder="⚖ Qty" style={{ flex: "1", padding:"8px", borderRadius:"8px", border:"1px solid #f59e0b", textAlign:"right" }} />
        <span style={{ flex: "0.5", textAlign:"center" }}>{inv.unit}</span>
        <input type="number" value={inv.rate} onChange={(e) => updateInventory(index, "rate", e.target.value)} placeholder="💰 Rate" style={{ flex: "1", padding:"8px", borderRadius:"8px", border:"1px solid #f59e0b", textAlign:"right" }} />
        <span style={{ flex: "1", textAlign:"center" }}>🆔 {inv.lotId}</span>
        <input type="file" multiple onChange={(e) => updateInventoryFiles(index, e.target.files)} style={{ flex: "1", padding:"6px", borderRadius:"6px", border:"1px solid #f59e0b" }} />
        <button onClick={() => setInventory(inventory.filter((_, i) => i !== index))} style={{ background:"#ef4444", color:"white", borderRadius:"8px", padding:"8px 12px", fontWeight:"bold" }}>❌ Delete</button>
      </div>

      {/* Inventory Tabs */}
      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {["📊 Overview", "💵 Value Calculation", "🗂 Attached Files"].map(tab => {
            const key = `${index}-${tab}`;
            return (
              <button
                key={key}
                onClick={() => setActiveBuyerTab({ ...activeBuyerTab, [`inventory-${index}`]: tab })}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: activeBuyerTab[`inventory-${index}`] === tab ? "2px solid #f59e0b" : "1px solid #ccc",
                  background: activeBuyerTab[`inventory-${index}`] === tab ? "#f59e0b" : "#fff",
                  color: activeBuyerTab[`inventory-${index}`] === tab ? "#fff" : "#000",
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

        {/* Tab Content */}
        <div style={{ marginTop: "15px", padding: "15px", borderRadius: "12px", background: "#fff7ed", border: "1px solid #f59e0b", minHeight: "80px" }}>
          {activeBuyerTab[`inventory-${index}`] === "📊 Overview" && (
            <div>📦 Product: {inv.product || "🥭 Mango"} | Supplier: {inv.supplier || "🚚 Default Supplier"} | Qty: {inv.quantity || 50} {inv.unit} | Rate: ₹{inv.rate || 40}</div>
          )}
          {activeBuyerTab[`inventory-${index}`] === "💵 Value Calculation" && (
            <div>💰 Total Value: ₹{(inv.quantity || 50) * (inv.rate || 40)}</div>
          )}
          {activeBuyerTab[`inventory-${index}`] === "🗂 Attached Files" && (
            <div>
              {inv.files.length === 0 ? "No files attached." : inv.files.map((file, i) => <p key={i}>📄 {file.name}</p>)}
            </div>
          )}
          {!activeBuyerTab[`inventory-${index}`] && (
            <div style={{ color: "#d97706", fontWeight: "bold" }}>Select a tab to view details</div>
          )}
        </div>
      </div>
    </div>
  ))}

  <button onClick={() => addInventory({
      date: new Date().toISOString().slice(0,10),
      supplier: "🚚 Default Supplier",
      product: "🥭 Mango",
      grade: "A",
      quantity: 50,
      unit: "KG",
      rate: 40,
      lotId: "LOT" + Date.now(),
      files: []
  })} style={{ marginTop:"15px", background:"#16a34a", color:"white", borderRadius:"12px", padding:"10px 20px", fontWeight:"bold", boxShadow:"0 4px 8px rgba(0,0,0,0.2)" }}>
    ➕ Add Inventory
  </button>
</div>
        </div>
      </div>
    </div>
  );
}

export default App;