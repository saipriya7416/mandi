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

  const [products, setProducts] = useState([
    { name: "🥭 Mango", quantity: 50, rate: 40 },
    { name: "🌾 Rice", quantity: 30, rate: 35 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [expenses, setExpenses] = useState({
    lorry: 2000,
    marketing: 1500,
    coolie: 1000,
    cash: 500,
    kaja: 300,
    others: 700,
  });

  const [advancePayment, setAdvancePayment] = useState(5000);

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

  // Calculations
  const grossSale = products.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const totalExpense = Object.values(expenses).reduce((a, b) => a + b, 0);
  const netSale = grossSale - totalExpense;
  const balancePayable = netSale - advancePayment;

  // Weekly data for graph
  const weekSales = [
    grossSale * 0.8,
    grossSale,
    grossSale * 0.9,
    grossSale * 0.7,
    grossSale * 1.1,
    grossSale * 0.95,
    grossSale,
  ];

  const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const weekData = {
    labels: weekLabels,
    datasets: [
      {
        label: "Gross Sale",
        data: weekSales,
        backgroundColor: ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa", "#f472b6", "#fcd34d"],
      },
    ],
  };

  // Determine high and low sale days
  const maxSale = Math.max(...weekSales);
  const minSale = Math.min(...weekSales);
  const highDay = weekLabels[weekSales.indexOf(maxSale)];
  const lowDay = weekLabels[weekSales.indexOf(minSale)];

  const printInvoice = () => {
    const invoiceWindow = window.open("", "PRINT", "height=600,width=800");
    invoiceWindow.document.write("<html><head><title>Invoice</title></head><body>");
    invoiceWindow.document.write("<h2>🧾 Buyer Invoice</h2>");
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
    weekLabels.forEach((day, i) => {
      invoiceWindow.document.write(`<p>${day}: ₹${weekSales[i]}</p>`);
    });
    invoiceWindow.document.write(`<p>📈 High Sale Day: ${highDay} (₹${maxSale})</p>`);
    invoiceWindow.document.write(`<p>📉 Low Sale Day: ${lowDay} (₹${minSale})</p>`);
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
        <h2 style={{ color: "#facc15" }}>🥭 Mandi ERP</h2>
        <ul style={{ listStyle: "none", padding: 0, marginTop: "30px" }}>
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

          {/* Calculations */}
          <hr style={{ marginTop: "20px" }} />
          <h3 style={{ color: "#d97706" }}>💰 Gross Sale = ₹{grossSale}</h3>
          <h3 style={{ color: "#dc2626" }}>💸 Total Expenses = ₹{totalExpense}</h3>
          <h3 style={{ color: "#16a34a" }}>📈 Net Sale = ₹{netSale}</h3>
          <h3 style={{ color: "#7c3aed" }}>💳 Advance Payment = ₹{advancePayment}</h3>
          <h3 style={{ color: "#2563eb" }}>🧮 Balance Payable = ₹{balancePayable}</h3>

          {/* Weekwise Graph & Analysis */}
          <div style={{ marginTop: "30px" }}>
            <h3>📊 Week Sales Comparison</h3>
            <Bar data={weekData} />
            <p style={{ marginTop: "10px" }}>📈 High Sale Day: {highDay} (₹{maxSale})</p>
            <p>📉 Low Sale Day: {lowDay} (₹{minSale})</p>
          </div>

          {/* Expenses Section */}
          <div style={{ marginTop: "30px", padding: "20px", border: "2px solid #fbbf24", borderRadius: "10px", backgroundColor: "#fff7ed" }}>
            <h2 style={{ textAlign: "center", color: "#b91c1c" }}>💰 Custom Expenses</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center", marginTop: "15px" }}>
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
            <div style={{ marginTop: "20px", textAlign:"center", fontWeight:"bold", fontSize:"18px" }}>
              Total Expenses: ₹ {totalExpense}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;