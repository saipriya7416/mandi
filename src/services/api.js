const API_BASE = "http://127.0.0.1:5000/api";

export const MandiService = {
  // --- 4. SUPPLIERS ---
  addSupplier: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/supplier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    } catch (e) {
      alert("❌ API CONNECTION ERROR: Is the Backend Running?");
      return { status: "ERROR" };
    }
  },
  getSuppliers: async () => {
    const res = await fetch(`${API_BASE}/suppliers`);
    return res.json();
  },

  // --- 5. BUYERS ---
  addBuyer: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/buyer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    } catch (e) {
      alert("❌ API Error: Frontend could not reach Backend.");
      return { status: "ERROR" };
    }
  },
  getBuyers: async () => {
    const res = await fetch(`${API_BASE}/buyers`);
    return res.json();
  },

  // --- 6. INVENTORY INTAKE ---
  createLot: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/lot/intake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    } catch (e) {
      alert("❌ Inventory Intake Failed: Backend unreachable.");
      return { status: "ERROR" };
    }
  },
  getLots: async () => {
    const res = await fetch(`${API_BASE}/lots`);
    return res.json();
  },

  // --- 7. ALLOCATION ---
  allocateLot: async (data) => {
    const res = await fetch(`${API_BASE}/lot/allocate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // --- 8. FINANCIALS ---
  generateBill: async (data) => {
    const res = await fetch(`${API_BASE}/bill/supplier`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
