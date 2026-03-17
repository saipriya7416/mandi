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
      name: "", phone: "", address: "", village: "", govId: "", idType: "", bank: "", notes: "" 
    },
  ]);

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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ===== Supplier Functions =====
  const updateSupplier = (index, field, value) => {
    const updated = [...suppliers];
    updated[index][field] = value;
    setSuppliers(updated);
  };

  const addSupplier = () => {
    setSuppliers([...suppliers, { name: "", phone: "", address: "", village: "", govId: "", idType: "", bank: "", notes: "" }]);
  };

  const deleteSupplier = (index) => {
    const updated = suppliers.filter((_, i) => i !== index);
    setSuppliers(updated);
  };

  // ===== Calculations =====
  const grossSale = products.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const totalExpense = Object.values(expenses).reduce((a, b) => a + b, 0);
  const netSale = grossSale - totalExpense;
  const balancePayable = netSale - advancePayment;

  // ===== Week Graph Data =====
  const weekData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Gross Sale",
        data: [grossSale * 0.8, grossSale, grossSale * 0.9, grossSale * 0.7, grossSale * 1.1, grossSale * 0.95, grossSale],
        backgroundColor: ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa", "#f472b6", "#fcd34d"],
      },
    ],
  };

  const maxSaleIndex = weekData.datasets[0].data.indexOf(Math.max(...weekData.datasets[0].data));
  const minSaleIndex = weekData.datasets[0].data.indexOf(Math.min(...weekData.datasets[0].data));

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
      if (i === maxSaleIndex) highlight = " (Highest)";
      if (i === minSaleIndex) highlight = " (Lowest)";
      invoiceWindow.document.write(`<p>${day}: ₹${weekData.datasets[0].data[i]}${highlight}</p>`);
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
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px" }}>
        {/* Products Table */}
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom:"30px" }}>
          <h2>📦 Product Entry</h2>
          <table style={{ width: "100%", marginTop: "15px" }}>
            <thead>
              <tr>
                <th>📦 Product</th>
                <th>⚖ Quantity (KG)</th>
                <th>₹ Rate</th>
                <th>💰 Amount</th>
                <th>❌ Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item, index) => (
                <tr key={index}>
                  <td><input value={item.name} onChange={(e)=>updateProduct(index,"name",e.target.value)} /></td>
                  <td><input type="number" value={item.quantity} onChange={(e)=>updateProduct(index,"quantity",e.target.value)} /></td>
                  <td><input type="number" value={item.rate} onChange={(e)=>updateProduct(index,"rate",e.target.value)} /></td>
                  <td>₹{item.quantity * item.rate}</td>
                  <td><button onClick={()=>deleteProduct(index)} style={{ background: "#ef4444", color: "white", borderRadius: "4px" }}>❌</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addProduct} style={{ marginTop: "10px", background: "#22c55e", color: "white", borderRadius: "8px", padding: "6px 12px" }}>➕ Add Product</button>
        </div>

        {/* Suppliers Table */}
        <div style={{ background: "white", padding: "20px", borderRadius: "12px" }}>
          <h2>🚚 Suppliers Management</h2>
          <table style={{ width: "100%", marginTop: "15px" }}>
            <thead>
              <tr>
                <th>👤 Name</th>
                <th>📞 Phone</th>
                <th>🏠 Address</th>
                <th>🏘 Village</th>
                <th>🆔 Gov ID</th>
                <th>📝 ID Type</th>
                <th>🏦 Bank Details</th>
                <th>🗒 Notes</th>
                <th>❌ Delete</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s, i) => (
                <tr key={i}>
                  <td><input value={s.name} onChange={(e)=>updateSupplier(i,"name",e.target.value)} /></td>
                  <td><input value={s.phone} onChange={(e)=>updateSupplier(i,"phone",e.target.value)} /></td>
                  <td><input value={s.address} onChange={(e)=>updateSupplier(i,"address",e.target.value)} /></td>
                  <td><input value={s.village} onChange={(e)=>updateSupplier(i,"village",e.target.value)} /></td>
                  <td><input value={s.govId} onChange={(e)=>updateSupplier(i,"govId",e.target.value)} /></td>
                  <td><input value={s.idType} onChange={(e)=>updateSupplier(i,"idType",e.target.value)} /></td>
                  <td><input value={s.bank} onChange={(e)=>updateSupplier(i,"bank",e.target.value)} /></td>
                  <td><input value={s.notes} onChange={(e)=>updateSupplier(i,"notes",e.target.value)} /></td>
                  <td><button onClick={()=>deleteSupplier(i)} style={{ background:"#ef4444", color:"white", borderRadius:"4px" }}>❌</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addSupplier} style={{ marginTop: "10px", background:"#22c55e", color:"white", borderRadius:"8px", padding:"6px 12px" }}>➕ Add Supplier</button>
        </div>
      </div>
    </div>
  );
}

export default App;