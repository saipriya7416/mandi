import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
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

  // ===== Supplier Bill State =====
  const [supplierBill, setSupplierBill] = useState({
    billNumber: "BILL" + Date.now(),
    date: new Date().toISOString().slice(0, 10),
    supplierName: "",
    items: [],
    expenses: { transport: 0, marketing: 0, labour: 0, packing: 0, misc: 0 },
    advancePayment: 0,
  });

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
        date: new Date().toISOString().slice(0, 10),
        supplier: "",
        product: "",
        grade: "",
        quantity: 0,
        unit: "KG",
        rate: 0,
        lotId: "LOT" + Date.now(),
        files: [],
      },
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

  // ===== Supplier Bill Functions =====
  const updateSupplierBillItem = (index, field, value) => {
    const updated = { ...supplierBill };
    updated.items[index][field] = field === "name" ? value : Number(value);
    setSupplierBill(updated);
  };

  const addSupplierBillItem = () => {
    setSupplierBill({
      ...supplierBill,
      items: [...supplierBill.items, { name: "", quantity: 0, rate: 0 }],
    });
  };

  const updateSupplierBillExpense = (field, value) => {
    const updated = { ...supplierBill };
    updated.expenses[field] = Number(value);
    setSupplierBill(updated);
  };

  const printSupplierBill = () => {
    const doc = new jsPDF();
    doc.text("🧾 Supplier Bill", 105, 10, { align: "center" });
    doc.text(`Bill No: ${supplierBill.billNumber}`, 10, 20);
    doc.text(`Date: ${supplierBill.date}`, 10, 28);
    doc.text(`Supplier: ${supplierBill.supplierName}`, 10, 36);

    let startY = 50;
    doc.text("Items:", 10, startY);
    supplierBill.items.forEach((item, i) => {
      startY += 8;
      doc.text(`${i + 1}. ${item.name} | Qty: ${item.quantity} | Rate: ₹${item.rate} | Amount: ₹${item.quantity * item.rate}`, 10, startY);
    });

    startY += 12;
    doc.text("Expenses:", 10, startY);
    Object.keys(supplierBill.expenses).forEach((key) => {
      startY += 8;
      doc.text(`${key}: ₹${supplierBill.expenses[key]}`, 10, startY);
    });

    const grossSale = products.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const totalExpense = Object.values(expenses).reduce((a, b) => a + b, 0);
    const netSale = grossSale - totalExpense;
    const balancePayable = netSale - advancePayment;

    startY += 12;
    doc.text(`💰 Gross Sale: ₹${grossSale}`, 10, startY);
    startY += 8;
    doc.text(`💸 Total Expenses: ₹${totalExpense}`, 10, startY);
    startY += 8;
    doc.text(`📈 Net Sale: ₹${netSale}`, 10, startY);
    startY += 8;
    doc.text(`💳 Advance Payment: ₹${supplierBill.advancePayment}`, 10, startY);
    startY += 8;
    doc.text(`🧮 Balance Payable: ₹${balancePayable}`, 10, startY);

    doc.save(`SupplierBill-${supplierBill.billNumber}.pdf`);
  };

  // ===== Filtered Products for Search =====
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
      <div className="h-screen flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: "url('https://femina.wwmindia.com/content/2023/may/bengalurufoodnews-royalorchid1685205463.jpg')" }}>
        <div className="bg-white/90 p-10 rounded-xl w-80 shadow-lg">
          <h2 className="text-center text-2xl text-yellow-500 font-bold">🥭 Mango Mandi ERP Login</h2>
          <input placeholder="👤 Username" className="w-full p-3 mt-5 mb-3 rounded-lg border border-gray-300"/>
          <input type="password" placeholder="🔒 Password" className="w-full p-3 mb-5 rounded-lg border border-gray-300"/>
          <button onClick={() => setLoggedIn(true)} className="w-full p-3 bg-yellow-400 rounded-lg font-bold">🚀 Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white p-5">
        <img src="https://tse4.mm.bing.net/th/id/OIP.ks72csN96u4QVk_QF_7MlwHaHa?pid=Api&P=0&h=180" alt="Company Logo" className="w-28 h-28 rounded-full mx-auto object-cover"/>
        <h2 className="text-yellow-400 mt-3 text-center text-xl font-bold">🥭 Mandi ERP</h2>
        <ul className="mt-5 space-y-2">
          {["📊 Dashboard","🚚 Suppliers","🛒 Buyers","📦 Inventory","🧾 Invoices","📈 Reports","⚙️ Settings"].map(item => (
            <li key={item} className="p-2 bg-gray-700 rounded-lg">{item}</li>
          ))}
        </ul>
        <button onClick={()=>setLoggedIn(false)} className="mt-5 w-full p-2 bg-red-500 rounded-lg">🔓 Logout</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Here goes the full main content: Products, Expenses, Buyers, Inventory, Supplier Bills, Graphs... */}
        {/* Due to message length limits, I’ll provide the rest of the code in the next message */}
                {/* ===== Products Section ===== */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-3">🛍️ Products</h2>
          <div className="flex mb-2">
            <input
              type="text"
              placeholder="🔍 Search Product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded-lg flex-1 mr-2"
            />
            <button onClick={addProduct} className="bg-yellow-400 px-4 rounded-lg font-bold">➕ Add</button>
          </div>
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Product</th>
                <th className="border p-2">Quantity (KG)</th>
                <th className="border p-2">Rate (₹)</th>
                <th className="border p-2">Amount (₹)</th>
                <th className="border p-2">❌ Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, i) => (
                <tr key={i}>
                  <td className="border p-2">
                    <input
                      value={p.name}
                      onChange={(e) => updateProduct(i, "name", e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={p.quantity}
                      onChange={(e) => updateProduct(i, "quantity", e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={p.rate}
                      onChange={(e) => updateProduct(i, "rate", e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border p-2">{formatCurrency(p.quantity * p.rate)}</td>
                  <td className="border p-2">
                    <button onClick={() => deleteProduct(i)} className="text-red-500 font-bold">❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== Expenses Section ===== */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-3">💸 Expenses</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(expenses).map((key) => (
              <div key={key}>
                <label className="block capitalize">{key}</label>
                <input
                  type="number"
                  value={expenses[key]}
                  onChange={(e) => setExpenses({ ...expenses, [key]: Number(e.target.value) })}
                  className="w-full border p-2 rounded"
                />
              </div>
            ))}
            <div>
              <label>Advance Payment</label>
              <input
                type="number"
                value={advancePayment}
                onChange={(e) => setAdvancePayment(Number(e.target.value))}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* ===== Calculations Summary ===== */}
        <div className="mb-10 p-5 bg-white shadow rounded-lg w-full md:w-2/3">
          <h2 className="text-xl font-bold text-gray-800 mb-3">🧮 Summary</h2>
          <p>💰 Gross Sale: {formatCurrency(grossSale)}</p>
          <p>💸 Total Expenses: {formatCurrency(totalExpense)}</p>
          <p>📈 Net Sale: {formatCurrency(netSale)}</p>
          <p>💳 Advance Payment: {formatCurrency(advancePayment)}</p>
          <p>🧮 Balance Payable: {formatCurrency(balancePayable)}</p>
          <button onClick={printInvoice} className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg font-bold">🖨️ Print Invoice</button>
        </div>

        {/* ===== Week Graph ===== */}
        <div className="mb-10 p-5 bg-white shadow rounded-lg w-full md:w-2/3">
          <h2 className="text-xl font-bold text-gray-800 mb-3">📊 Weekly Sales Graph</h2>
          <Bar data={weekData} />
        </div>

        {/* ===== Inventory Section ===== */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-3">📦 Inventory Intake</h2>
          <button onClick={addInventory} className="bg-yellow-400 px-4 py-2 rounded-lg font-bold mb-3">➕ Add Inventory</button>
          {inventory.map((inv, i) => (
            <div key={i} className="mb-4 p-3 bg-white shadow rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="date" value={inv.date} onChange={(e)=>updateInventory(i,"date",e.target.value)} className="border p-2 rounded"/>
                <input placeholder="Supplier" value={inv.supplier} onChange={(e)=>updateInventory(i,"supplier",e.target.value)} className="border p-2 rounded"/>
                <input placeholder="Product" value={inv.product} onChange={(e)=>updateInventory(i,"product",e.target.value)} className="border p-2 rounded"/>
                <input placeholder="Grade" value={inv.grade} onChange={(e)=>updateInventory(i,"grade",e.target.value)} className="border p-2 rounded"/>
                <input type="number" placeholder="Quantity" value={inv.quantity} onChange={(e)=>updateInventory(i,"quantity",Number(e.target.value))} className="border p-2 rounded"/>
                <input placeholder="Unit" value={inv.unit} onChange={(e)=>updateInventory(i,"unit",e.target.value)} className="border p-2 rounded"/>
                <input type="number" placeholder="Rate" value={inv.rate} onChange={(e)=>updateInventory(i,"rate",Number(e.target.value))} className="border p-2 rounded"/>
                <input type="text" placeholder="Lot ID" value={inv.lotId} onChange={(e)=>updateInventory(i,"lotId",e.target.value)} className="border p-2 rounded"/>
                <input type="file" multiple onChange={(e)=>updateInventoryFiles(i,e.target.files)} className="border p-2 rounded"/>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Suppliers Section ===== */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-3">🚚 Suppliers</h2>
          <button onClick={addSupplier} className="bg-yellow-400 px-4 py-2 rounded-lg font-bold mb-3">➕ Add Supplier</button>
          {suppliers.map((sup, i) => (
            <div key={i} className="mb-4 p-3 bg-white shadow rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {["name","phone","address","village","govId","idType","bankDetails","notes"].map(field=>(
                  <input key={field} placeholder={field} value={sup[field]} onChange={e=>updateSupplier(i,field,e.target.value)} className="border p-2 rounded"/>
                ))}
                <button onClick={()=>deleteSupplier(i)} className="text-red-500 font-bold">❌ Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Buyers Section ===== */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-3">🛒 Buyers</h2>
          <button onClick={addBuyer} className="bg-yellow-400 px-4 py-2 rounded-lg font-bold mb-3">➕ Add Buyer</button>
          {buyers.map((buyer,i)=>(
            <div key={i} className="mb-4 p-3 bg-white shadow rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {["name","phone","shopName","address","govId","idType","creditLimit","notes"].map(field=>(
                  <input key={field} placeholder={field} value={buyer[field]} onChange={e=>updateBuyer(i,field,e.target.value)} className="border p-2 rounded"/>
                ))}
                <button onClick={()=>deleteBuyer(i)} className="text-red-500 font-bold">❌ Delete</button>
              </div>
              {/* Buyer Tabs */}
              <div className="mt-2 flex space-x-2">
                {["Ledger","Purchase History","Payments","Outstanding"].map(tab=>(
                  <button key={tab} className={`px-2 py-1 rounded ${activeBuyerTab[i]===tab?"bg-blue-500 text-white":"bg-gray-200"}`} onClick={()=>setActiveBuyerTab({...activeBuyerTab,[i]:tab})}>{tab}</button>
                ))}
              </div>
              <div className="mt-2 p-2 border rounded bg-gray-50">
                {activeBuyerTab[i]==="Ledger" && <p>Ledger Entries: {JSON.stringify(buyer.ledger)}</p>}
                {activeBuyerTab[i]==="Purchase History" && <p>Purchase History: {JSON.stringify(buyer.purchaseHistory)}</p>}
                {activeBuyerTab[i]==="Payments" && <p>Payments: {JSON.stringify(buyer.payments)}</p>}
                {activeBuyerTab[i]==="Outstanding" && <p>Outstanding Amount: {formatCurrency(buyer.outstanding)}</p>}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;