import React, { useState, useEffect } from "react";
import "./index.css";
import { MandiService } from "./services/api";

const getISTDate = () => {
  const now = new Date();
  return new Date(now.getTime() + (5.5 * 60 * 60 * 1000)).toISOString().split('T')[0];
};

const formatCurrency = (v) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(v) || 0);
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [activeLedgerTab, setActiveLedgerTab] = useState("Supplier");
  
  // Storage States
  const [suppliers, setSuppliers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [lots, setLots] = useState([]);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [supplierBills, setSupplierBills] = useState([]);
  const [customerInvoices, setCustomerInvoices] = useState([]);

  // Form States
  const [authForm, setAuthForm] = useState({ username: "", password: "", role: "Owner / Admin" });
  const [supplierForm, setSupplierForm] = useState({ name: "", phone: "", village: "" });
  const [buyerForm, setBuyerForm] = useState({ name: "", shopName: "", phone: "" });
  const [lotForm, setLotForm] = useState({ vehicle: "", origin: "", farmerId: "" });
  const [ledgerForm, setLedgerForm] = useState({ date: getISTDate(), lotId: "", advance: 0, paymentMade: 0 });

  const fetchData = async () => {
    try {
      const s = await MandiService.getSuppliers();
      const b = await MandiService.getBuyers();
      const l = await MandiService.getLots();
      const lr = await MandiService.getLedgerEntries();
      const sb = await MandiService.getSupplierBills();
      const ci = await MandiService.getBuyerInvoices();
      
      if (s.status === "SUCCESS") setSuppliers(s.data || []);
      if (b.status === "SUCCESS") setBuyers(b.data || []);
      if (l.status === "SUCCESS") setLots(l.data || []);
      if (lr.status === "SUCCESS") setLedgerEntries(lr.data || []);
      if (sb.status === "SUCCESS") setSupplierBills(sb.data || []);
      if (ci.status === "SUCCESS") setCustomerInvoices(ci.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('mandi_token');
    if (token) {
       setLoggedIn(true);
       const u = JSON.parse(localStorage.getItem('mandi_user') || '{}');
       setUser(u);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) fetchData();
  }, [loggedIn]);

  const handleLogin = async () => {
    const res = await MandiService.login(authForm.username, authForm.password, authForm.role);
    if (res.status === "SUCCESS") {
      setLoggedIn(true);
      setUser(res.data.user);
    } else {
      alert("Login Failed: " + res.message);
    }
  };

  const handleLogout = async () => {
    await MandiService.logout();
    setLoggedIn(false);
    setUser(null);
  };

  // Handlers
  const registerSupplier = async () => {
    if (!supplierForm.name || !supplierForm.phone) return alert("Required fields missing");
    await MandiService.addSupplier(supplierForm);
    alert("Supplier Registered");
    setSupplierForm({ name: "", phone: "", village: "" });
    fetchData();
  };

  const registerBuyer = async () => {
    if (!buyerForm.name || !buyerForm.phone) return alert("Required fields missing");
    await MandiService.addBuyer(buyerForm);
    alert("Customer Registered");
    setBuyerForm({ name: "", shopName: "", phone: "" });
    fetchData();
  };

  const recordLot = async () => {
    if (!lotForm.vehicle || !lotForm.origin) return alert("Required fields missing");
    await MandiService.addLot({ 
       lotId: `LOT-${Date.now()}`,
       vehicleNumber: lotForm.vehicle,
       origin: lotForm.origin,
       entryDate: new Date().toISOString(),
       supplierId: lotForm.farmerId,
       lineItems: []
    });
    alert("Lot Registered");
    setLotForm({ vehicle: "", origin: "", farmerId: "" });
    fetchData();
  };

  const postLedger = async () => {
     await MandiService.addLedgerEntry(ledgerForm);
     alert("Ledger Posted");
     setLedgerForm({ date: getISTDate(), lotId: "", advance: 0, paymentMade: 0 });
     fetchData();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#000" }}>
      <style>{`
        * { box-sizing: border-box; }
        .vercel-tab { cursor: pointer; padding: 12px 16px; font-size: 14px; color: #666; transition: all 0.2s; position: relative; }
        .vercel-tab:hover { color: #000; }
        .vercel-tab-active { color: #000; font-weight: 500; }
        .vercel-tab-active::after { content: ''; position: absolute; bottom: 0; left: 16px; right: 16px; height: 2px; background: #000; }
        .vercel-card { background: #FFF; border: 1px solid #EAEAEA; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .vercel-btn-primary { background: #000; color: #FFF; border: 1px solid #000; border-radius: 6px; padding: 10px 20px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .vercel-btn-primary:hover { background: #333; }
        .vercel-btn-secondary { background: #FFF; color: #666; border: 1px solid #EAEAEA; border-radius: 6px; padding: 10px 20px; font-weight: 500; cursor: pointer; }
        .vercel-btn-secondary:hover { border-color: #000; color: #000; }
        input, select { padding: 10px 14px; border: 1px solid #EAEAEA; border-radius: 6px; outline: none; transition: border 0.2s; }
        input:focus { border-color: #000; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {!loggedIn ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#FAFAFA" }}>
           <div className="vercel-card" style={{ width: "100%", maxWidth: "400px", padding: "48px", animation: "fadeIn 0.6s ease-out" }}>
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                 <div style={{ width: "40px", height: "40px", background: "#000", color: "#FFF", borderRadius: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "20px", marginBottom: "16px" }}>M</div>
                 <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 8px 0" }}>Mandi Management System</h1>
                 <p style={{ color: "#666", fontSize: "14px" }}>Enter credentials to access deployment.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                 <input placeholder="Username" value={authForm.username} onChange={e=>setAuthForm({...authForm, username: e.target.value})} />
                 <input type="password" placeholder="Password" value={authForm.password} onChange={e=>setAuthForm({...authForm, password: e.target.value})} />
                 <select value={authForm.role} onChange={e=>setAuthForm({...authForm, role: e.target.value})}>
                    <option>Owner / Admin</option>
                    <option>Accountant</option>
                    <option>Operations Staff</option>
                 </select>
                 <button className="vercel-btn-primary" onClick={handleLogin}>Log In</button>
              </div>
           </div>
        </div>
      ) : (
        <>
          <header style={{ borderBottom: "1px solid #EAEAEA", background: "#FFF", position: "sticky", top: 0, zIndex: 1000 }}>
             <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 24px", borderBottom: "1px solid #FAFAFA" }}>
                <div style={{ width: "24px", height: "24px", background: "#000", color: "#FFF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "12px" }}>M</div>
                <span style={{ color: "#999", fontSize: "13px" }}>production</span>
                <span style={{ color: "#EAEAEA", fontSize: "13px" }}>/</span>
                <span style={{ fontWeight: "600", fontSize: "13px" }}>mandi-erp</span>
                <div style={{ background: "#F0FDF4", color: "#16A34A", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "12px", border: "1px solid #DCFCE7", marginLeft: "12px" }}>Stable</div>
                <div style={{ marginLeft: "auto", display: "flex", gap: "12px", alignItems: "center" }}>
                   <button className="vercel-btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }} onClick={handleLogout}>Log Out</button>
                   <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #FF0080, #7928CA)", border: "2px solid #FFF", boxShadow: "0 0 0 1px #EAEAEA" }} />
                </div>
             </div>
             <div style={{ padding: "0 24px", display: "flex" }}>
                {["Dashboard", "Suppliers", "Customers", "Logistics", "Ledger"].map(tab => (
                   <div key={tab} onClick={() => setActiveSection(tab)} className={`vercel-tab ${activeSection === tab ? 'vercel-tab-active' : ''}`}>{tab}</div>
                ))}
             </div>
          </header>

          <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
             
             {activeSection === "Dashboard" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px", animation: "fadeIn 0.4s ease" }}>
                   <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                      <div className="vercel-card" style={{ padding: "24px" }}>
                         <div style={{ color: "#666", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px" }}>Supply Intake (Lots)</div>
                         <div style={{ fontSize: "28px", fontWeight: "700" }}>{lots.length}</div>
                      </div>
                      <div className="vercel-card" style={{ padding: "24px" }}>
                         <div style={{ color: "#666", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px" }}>Active Suppliers</div>
                         <div style={{ fontSize: "28px", fontWeight: "700" }}>{suppliers.length}</div>
                      </div>
                      <div className="vercel-card" style={{ padding: "24px" }}>
                         <div style={{ color: "#666", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px" }}>Total Customers</div>
                         <div style={{ fontSize: "28px", fontWeight: "700", color: "#16A34A" }}>{buyers.length}</div>
                      </div>
                   </div>
                   <div className="vercel-card" style={{ padding: "32px" }}>
                      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Recent Receipts</h2>
                      {lots.slice(-5).reverse().map(l => (
                         <div key={l._id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #FAFAFA", fontSize: "14px" }}>
                            <span>Lot <b>{l.lotId}</b> — Vehicle <b>{l.vehicleNumber}</b></span>
                            <span style={{ color: "#999" }}>{new Date(l.createdAt).toLocaleDateString()}</span>
                         </div>
                      ))}
                      {lots.length === 0 && <div style={{ color: "#999", textAlign: "center", padding: "20px" }}>No recent receipts found.</div>}
                   </div>
                </div>
             )}

             {activeSection === "Suppliers" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                   <div className="vercel-card" style={{ padding: "32px" }}>
                      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>Registration</h2>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                         <input placeholder="Name" value={supplierForm.name} onChange={e=>setSupplierForm({...supplierForm, name: e.target.value})} />
                         <input placeholder="Phone" value={supplierForm.phone} onChange={e=>setSupplierForm({...supplierForm, phone: e.target.value})} />
                         <input placeholder="Village" value={supplierForm.village} onChange={e=>setSupplierForm({...supplierForm, village: e.target.value})} />
                      </div>
                      <button className="vercel-btn-primary" style={{ marginTop: "20px" }} onClick={registerSupplier}>Add Supplier</button>
                   </div>
                   <div className="vercel-card" style={{ padding: "32px" }}>
                      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Directory</h2>
                      {suppliers.map(s => (
                         <div key={s._id} style={{ display: "flex", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid #FAFAFA" }}>
                            <span><b>{s.name}</b> • {s.phone}</span>
                            <div style={{ display: "flex", gap: "12px" }}>
                               <button className="vercel-btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>Edit</button>
                               <button className="vercel-btn-secondary" style={{ padding: "6px 12px", fontSize: "12px", color: "#CC0000" }} onClick={async () => { await MandiService.deleteSupplier(s._id); fetchData(); }}>Delete</button>
                            </div>
                         </div>
                      ))}
                      {suppliers.length === 0 && <div style={{ color: "#999", textAlign: "center", padding: "20px" }}>No suppliers found.</div>}
                   </div>
                </div>
             )}

             {activeSection === "Customers" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                   <div className="vercel-card" style={{ padding: "32px" }}>
                      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>Registration</h2>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                         <input placeholder="Personal Name" value={buyerForm.name} onChange={e=>setBuyerForm({...buyerForm, name: e.target.value})} />
                         <input placeholder="Shop Name" value={buyerForm.shopName} onChange={e=>setBuyerForm({...buyerForm, shopName: e.target.value})} />
                         <input placeholder="Mobile" value={buyerForm.phone} onChange={e=>setBuyerForm({...buyerForm, phone: e.target.value})} />
                      </div>
                      <button className="vercel-btn-primary" style={{ marginTop: "20px" }} onClick={registerBuyer}>Add Customer</button>
                   </div>
                   <div className="vercel-card" style={{ padding: "32px" }}>
                      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Active Customers</h2>
                      {buyers.map(b => (
                         <div key={b._id} style={{ display: "flex", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid #FAFAFA" }}>
                            <span><b>{b.shopName}</b> ({b.name}) • {b.phone}</span>
                            <button className="vercel-btn-secondary" style={{ padding: "6px 12px", fontSize: "12px", color: "#CC0000" }} onClick={async () => { await MandiService.deleteBuyer(b._id); fetchData(); }}>Delete</button>
                         </div>
                      ))}
                      {buyers.length === 0 && <div style={{ color: "#999", textAlign: "center", padding: "20px" }}>No customers found.</div>}
                   </div>
                </div>
             )}

             {activeSection === "Logistics" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                   <div className="vercel-card" style={{ padding: "32px" }}>
                      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>Intake Recording</h2>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                         <input placeholder="Vehicle Number" value={lotForm.vehicle} onChange={e=>setLotForm({...lotForm, vehicle: e.target.value})} />
                         <input placeholder="Origin" value={lotForm.origin} onChange={e=>setLotForm({...lotForm, origin: e.target.value})} />
                         <select value={lotForm.farmerId} onChange={e=>setLotForm({...lotForm, farmerId: e.target.value})}>
                            <option value="">Select Supplier...</option>
                            {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                         </select>
                      </div>
                      <button className="vercel-btn-primary" style={{ marginTop: "20px" }} onClick={recordLot}>Initialize Lot</button>
                   </div>
                </div>
             )}

             {activeSection === "Ledger" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                   <div style={{ display: "flex", gap: "16px" }}>
                      {["Supplier", "Customer"].map(lt => (
                         <button key={lt} className={activeLedgerTab === lt ? "vercel-btn-primary" : "vercel-btn-secondary"} onClick={()=>setActiveLedgerTab(lt)}>{lt} Ledger</button>
                      ))}
                   </div>
                   
                   <div className="vercel-card" style={{ padding: "32px" }}>
                      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>Manual Ledger Entry</h2>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                         <input type="date" value={ledgerForm.date} onChange={e=>setLedgerForm({...ledgerForm, date: e.target.value})} />
                         <select value={ledgerForm.lotId} onChange={e=>setLedgerForm({...ledgerForm, lotId: e.target.value})}>
                            <option value="">Select Reference Lot...</option>
                            {lots.map(l => <option key={l._id} value={l.lotId}>{l.lotId}</option>)}
                         </select>
                         <input type="number" placeholder="Advance (₹)" value={ledgerForm.advance} onChange={e=>setLedgerForm({...ledgerForm, advance: Number(e.target.value)})} />
                         <input type="number" placeholder="Payment (₹)" value={ledgerForm.paymentMade} onChange={e=>setLedgerForm({...ledgerForm, paymentMade: Number(e.target.value)})} />
                      </div>
                      <button className="vercel-btn-primary" style={{ marginTop: "20px" }} onClick={postLedger}>Post to Ledger</button>
                   </div>

                   <div className="vercel-card" style={{ padding: "32px" }}>
                      <table style={{ width: "100%", textAlign: "left", fontSize: "14px" }}>
                         <thead>
                            <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #EAEAEA" }}>
                               <th style={{ padding: "16px" }}>Date</th>
                               <th>Reference</th>
                               <th>Advance</th>
                               <th>Payment</th>
                               <th style={{ textAlign: "right", paddingRight: "16px" }}>Balance</th>
                            </tr>
                         </thead>
                         <tbody>
                            {(() => {
                               let bal = 0;
                               return (ledgerEntries || []).map(e => {
                                  bal += (Number(e.netSale)||0) - (Number(e.advance)||0) - (Number(e.paymentMade)||0);
                                  return (
                                     <tr key={e._id} style={{ borderBottom: "1px solid #FAFAFA" }}>
                                        <td style={{ padding: "16px" }}>{new Date(e.date).toLocaleDateString()}</td>
                                        <td>{e.lotId || "N/A"}</td>
                                        <td style={{ color: "#CC0000" }}>{e.advance > 0 ? `-${e.advance}` : "—"}</td>
                                        <td style={{ color: "#16A34A" }}>{e.paymentMade > 0 ? `-${e.paymentMade}` : "—"}</td>
                                        <td style={{ textAlign: "right", paddingRight: "16px", fontWeight: "700" }}>{formatCurrency(bal)}</td>
                                     </tr>
                                  );
                               })
                            })()}
                         </tbody>
                      </table>
                      {ledgerEntries.length === 0 && <div style={{ color: "#999", textAlign: "center", padding: "20px" }}>No ledger entries found.</div>}
                   </div>
                </div>
             )}

          </main>
        </>
      )}
    </div>
  );
}
