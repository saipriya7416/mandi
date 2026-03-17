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

  // ===== Buyer Active Tab =====
  const [activeBuyerTab, setActiveBuyerTab] = useState({}); // {index: "ledger"|"purchase"|"outstanding"|"payments"}

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
      { name: "", phone: "", shopName: "", address: "", govId: "", idType: "", creditLimit: "", notes: "", ledger: [], purchaseHistory: [], outstanding: 0, payments: [] },
    ]);
  };

  const deleteBuyer = (index) => {
    const updated = buyers.filter((_, i) => i !== index);
    setBuyers(updated);
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
      invoiceWindow.document.write(`<tr><td>${p.name}</td><td>${p.quantity}</td><td>₹${p.rate}</td><td>₹${p.quantity*p.rate}</td></tr>`);
    });
    invoiceWindow.document.write("</table>");
    invoiceWindow.document.write(`<h3>💰 Gross Sale: ₹${grossSale}</h3>`);
    invoiceWindow.document.write(`<h3>💸 Total Expenses: ₹${totalExpense}</h3>`);
    invoiceWindow.document.write(`<h3>📈 Net Sale: ₹${netSale}</h3>`);
    invoiceWindow.document.write(`<h3>💳 Advance Payment: ₹${advancePayment}</h3>`);
    invoiceWindow.document.write(`<h3>🧮 Balance Payable: ₹${balancePayable}</h3>`);
    invoiceWindow.document.write("<h3>📊 Week Sales Comparison</h3>");
    weekData.labels.forEach((day, i) => {
      let highlight = "";
      if (weekRawData[i] === maxValue) highlight = " (Highest)";
      if (weekRawData[i] === minValue) highlight = " (Lowest)";
      invoiceWindow.document.write(`<p>${day}: ₹${weekRawData[i]}${highlight}</p>`);
    });
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
        {/*... (previous product, expenses, suppliers sections remain unchanged) ...*/}

        {/* ===== Buyers Section with Tabs ===== */}
        <div style={{ marginTop: "30px", background: "#f0fdfa", padding: "20px", borderRadius: "12px", border:"2px solid #14b8a6" }}>
          <h2 style={{ textAlign:"center", color:"#0d9488" }}>🛒 Buyer Management</h2>
          <table style={{ width:"100%", marginTop:"15px", borderCollapse:"collapse" }}>
            <thead>
              <tr>
                <th>🏷 Name</th>
                <th>📞 Phone</th>
                <th>🏪 Shop Name</th>
                <th>🏠 Address</th>
                <th>🆔 Govt ID</th>
                <th>📝 ID Type</th>
                <th>💳 Credit Limit</th>
                <th>🗒 Notes</th>
                <th>❌ Delete</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((b,index)=>(
                <tr key={index}>
                  <td><input value={b.name} onChange={(e)=>updateBuyer(index,"name",e.target.value)} /></td>
                  <td><input value={b.phone} onChange={(e)=>updateBuyer(index,"phone",e.target.value)} /></td>
                  <td><input value={b.shopName} onChange={(e)=>updateBuyer(index,"shopName",e.target.value)} /></td>
                  <td><input value={b.address} onChange={(e)=>updateBuyer(index,"address",e.target.value)} /></td>
                  <td><input value={b.govId} onChange={(e)=>updateBuyer(index,"govId",e.target.value)} /></td>
                  <td><input value={b.idType} onChange={(e)=>updateBuyer(index,"idType",e.target.value)} /></td>
                  <td><input value={b.creditLimit} onChange={(e)=>updateBuyer(index,"creditLimit",e.target.value)} /></td>
                  <td><input value={b.notes} onChange={(e)=>updateBuyer(index,"notes",e.target.value)} /></td>
                  <td><button onClick={()=>deleteBuyer(index)} style={{background:"#ef4444", color:"white", borderRadius:"4px"}}>❌</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addBuyer} style={{marginTop:"10px", background:"#14b8a6", color:"white", borderRadius:"8px", padding:"6px 12px"}}>➕ Add Buyer</button>

          {/* ===== Buyer Features Tabs ===== */}
          {buyers.map((b,index)=>(
            <div key={"tab"+index} style={{marginTop:"15px", border:"1px solid #0d9488", borderRadius:"8px", padding:"10px"}}>
              <div style={{display:"flex", gap:"10px", marginBottom:"10px"}}>
                {["ledger","purchaseHistory","outstanding","payments"].map(tab=>(
                  <button key={tab} onClick={()=>setActiveBuyerTab({...activeBuyerTab,[index]:tab})} 
                    style={{
                      padding:"6px 10px",
                      borderRadius:"6px",
                      background: activeBuyerTab[index]===tab?"#0d9488":"#a5f3fc",
                      color: activeBuyerTab[index]===tab?"white":"#0d9488",
                      border:"none",
                      cursor:"pointer"
                    }}>{tab}</button>
                ))}
              </div>
              <div style={{padding:"10px", background:"#e0f7f4", borderRadius:"6px"}}>
                {activeBuyerTab[index]==="ledger" && (
                  <div>
                    <h4>📒 Buyer Ledger</h4>
                    <pre>{JSON.stringify(b.ledger, null, 2)}</pre>
                  </div>
                )}
                {activeBuyerTab[index]==="purchaseHistory" && (
                  <div>
                    <h4>🛍️ Purchase History</h4>
                    <pre>{JSON.stringify(b.purchaseHistory, null, 2)}</pre>
                  </div>
                )}
                {activeBuyerTab[index]==="outstanding" && (
                  <div>
                    <h4>💰 Outstanding Tracking</h4>
                    <pre>₹ {b.outstanding}</pre>
                  </div>
                )}
                {activeBuyerTab[index]==="payments" && (
                  <div>
                    <h4>💳 Payment Tracking</h4>
                    <pre>{JSON.stringify(b.payments, null, 2)}</pre>
                  </div>
                )}
                {!activeBuyerTab[index] && <div>Select a feature tab above</div>}
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default App;