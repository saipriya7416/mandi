const API_BASE = import.meta.env.VITE_API_URL || "/api";

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

  // =====================================================
  // --- 17. STORAGE & DOCUMENTS ---
  // =====================================================
  uploadFile: async (file, docType = "Other", relatedToType = "Other", relatedTo = null) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("docType", docType);
      formData.append("relatedToType", relatedToType);
      if (relatedTo) formData.append("relatedTo", relatedTo);

      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });
      return handleResponse(res);
    } catch (e) {
      return { status: "ERROR", message: "Upload failed." };
    }
  },

  getDocuments: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/documents?${query}`, { headers: authHeaders() });
      return handleResponse(res);
    } catch (e) {
      return { status: "ERROR", data: [] };
    }
  },

  deleteDocument: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/document/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      return handleResponse(res);
    } catch (e) {
      return { status: "ERROR" };
    }
  },

  // =====================================================
  // --- 20. REPORTS & EXPORTS ---
  // =====================================================
  downloadBillPDF: async (id) => {
    const res = await fetch(`${API_BASE}/report/pdf/bill/${id}`, { headers: authHeaders() });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mandi_Bill_${id}.pdf`;
    a.click();
  },

  downloadInvoicePDF: async (id) => {
    const res = await fetch(`${API_BASE}/report/pdf/invoice/${id}`, { headers: authHeaders() });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mandi_Invoice_${id}.pdf`;
    a.click();
  },

  exportExcel: async (type) => {
    // type: 'suppliers' | 'buyers' | 'inventory'
    const res = await fetch(`${API_BASE}/report/excel/${type}`, { headers: authHeaders() });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mandi_${type}_Export.xlsx`;
    a.click();
  },
};
