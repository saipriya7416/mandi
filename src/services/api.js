const API_BASE = "http://127.0.0.1:5000/api";

// --- Token Helpers ---
const getToken = () => localStorage.getItem("mandi_token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (res.status === 401) {
    // Token expired or invalid - force logout
    localStorage.removeItem("mandi_token");
    localStorage.removeItem("mandi_user");
    window.location.reload();
  }
  return data;
};

export const MandiService = {
  // =====================================================
  // --- AUTH ---
  // =====================================================
  login: async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.status === "SUCCESS") {
        localStorage.setItem("mandi_token", data.data.token);
        localStorage.setItem("mandi_user", JSON.stringify(data.data.user));
      }
      return data;
    } catch (e) {
      return { status: "ERROR", message: "Cannot connect to backend. Is it running?" };
    }
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    } catch (e) {
      return { status: "ERROR", message: "Registration failed." };
    }
  },

  logout: () => {
    localStorage.removeItem("mandi_token");
    localStorage.removeItem("mandi_user");
  },

  getMe: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
      return handleResponse(res);
    } catch (e) {
      return { status: "ERROR" };
    }
  },

  listUsers: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/users`, { headers: authHeaders() });
      return handleResponse(res);
    } catch (e) {
      return { status: "ERROR", data: [] };
    }
  },

  deleteUser: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/auth/user/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      return handleResponse(res);
    } catch (e) {
      return { status: "ERROR" };
    }
  },

  // =====================================================
  // --- 4. SUPPLIERS ---
  // =====================================================
  addSupplier: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/supplier`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    } catch (e) {
      alert("❌ API CONNECTION ERROR: Is the Backend Running?");
      return { status: "ERROR" };
    }
  },
  getSuppliers: async () => {
    try {
      const res = await fetch(`${API_BASE}/suppliers`, { headers: authHeaders() });
      return handleResponse(res);
    } catch (e) {
      return { status: "ERROR", data: [] };
    }
  },

  // =====================================================
  // --- 5. BUYERS ---
  // =====================================================
  addBuyer: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/buyer`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    } catch (e) {
      alert("❌ API Error: Frontend could not reach Backend.");
      return { status: "ERROR" };
    }
  },
  getBuyers: async () => {
    try {
      const res = await fetch(`${API_BASE}/buyers`, { headers: authHeaders() });
      return handleResponse(res);
    } catch (e) {
      return { status: "ERROR", data: [] };
    }
  },

  // =====================================================
  // --- 6. INVENTORY INTAKE ---
  // =====================================================
  createLot: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/lot/intake`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    } catch (e) {
      alert("❌ Inventory Intake Failed: Backend unreachable.");
      return { status: "ERROR" };
    }
  },
  getLots: async () => {
    try {
      const res = await fetch(`${API_BASE}/lots`, { headers: authHeaders() });
      return handleResponse(res);
    } catch (e) {
      return { status: "ERROR", data: [] };
    }
  },

  // =====================================================
  // --- 7. ALLOCATION ---
  // =====================================================
  allocateLot: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/lot/allocate`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    } catch (e) {
      return { status: "ERROR" };
    }
  },

  // =====================================================
  // --- 8. FINANCIALS ---
  // =====================================================
  generateBill: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/bill/supplier`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    } catch (e) {
      return { status: "ERROR" };
    }
  },
  recordPayment: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/payment`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    } catch (e) {
      return { status: "ERROR" };
    }
  },
  recordExpense: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/expense`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    } catch (e) {
      return { status: "ERROR" };
    }
  },
};
