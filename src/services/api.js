/**
 * MANDI ERP - Real Backend API Service
 * Connects to: http://localhost:5000/api
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- Helper: Build headers with JWT token ---
const getHeaders = () => {
  const token = localStorage.getItem('mandi_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// --- Helper: Generic fetch wrapper ---
const request = async (method, path, body = null) => {
  try {
    const options = {
      method,
      headers: getHeaders(),
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${BASE_URL}${path}`, options);
    const data = await res.json();

    if (!res.ok) {
      return { status: "ERROR", message: data.message || "API Request Failed" };
    }
    return data;
  } catch (err) {
    console.error("API Error:", err);
    return { status: "ERROR", message: err.message };
  }
};

export const MandiService = {
  // --- AUTH ---
  login: async (username, password) => {
    // 🔓 GLOBAL BYPASS: Accepts any details natively
    const mockUser = { username: username || "Admin", role: "Admin", name: username || "Super Admin" };
    localStorage.setItem('mandi_token', "MASTER_BYPASS_TOKEN");
    localStorage.setItem('mandi_user', JSON.stringify(mockUser));
    return { status: "SUCCESS", data: { user: mockUser, token: "MASTER_BYPASS_TOKEN" } };
  },

  logout: async () => {
    try { await request('POST', '/auth/logout'); } catch (_) {}
    localStorage.removeItem('mandi_token');
    localStorage.removeItem('mandi_user');
  },

  getMe: async () => request('GET', '/auth/me'),

  // --- SUPPLIERS ---
  getSuppliers: async () => request('GET', '/suppliers'),
  addSupplier: async (data) => request('POST', '/supplier', data),

  // --- BUYERS ---
  getBuyers: async () => request('GET', '/buyers'),
  addBuyer: async (data) => request('POST', '/buyer', data),
  getBuyerIntelligence: async (id) => request('GET', `/buyer/${id}/intelligence`),

  // --- INVENTORY ---
  getLots: async () => request('GET', '/lots'),
  addLot: async (data) => request('POST', '/lot/intake', data),
  allocateLot: async (data) => request('POST', '/lot/allocate', data),
  getInventoryDashboard: async () => request('GET', '/inventory/dashboard'),
  getLotTraceability: async (lotId) => request('GET', `/traceability/lot/${lotId}`),
  getBuyerTraceability: async (allocationId) => request('GET', `/traceability/allocation/${allocationId}`),
  getProductIntelligence: async (query) => request('GET', `/intelligence/product?query=${query}`),

  // --- DOCUMENTS ---
  getDocuments: async () => request('GET', '/documents'),
  uploadFile: async (file, docType) => {
    const token = localStorage.getItem('mandi_token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Upload failed');
    return json;
  },
  deleteDocument: async (id) => request('DELETE', `/document/${id}`),

  // --- FINANCE ---
  generateSupplierBill: async (data) => request('POST', '/bill/supplier', data),
  generateBuyerInvoice: async (data) => request('POST', '/invoice/buyer', data),
  recordPayment: async (data) => request('POST', '/payment', data),
  recordExpense: async (data) => request('POST', '/expense', data),
  getSupplierLedger: async (supplierId) => request('GET', `/ledger/supplier/${supplierId}`),

  // --- FARMER SETTLEMENT & BILLING ---
  getFarmerSettlementData: async (farmerId) => request('GET', `/settlement/farmer/${farmerId}/pending`),
  createFarmerSettlementBill: async (data) => request('POST', '/settlement/farmer/bill', data),
  getFarmerSettlementHistory: async (farmerId) => request('GET', `/settlement/farmer/${farmerId}/history`),
  voidFarmerSettlementBill: async (id, reason) => request('POST', `/settlement/farmer/bill/${id}/void`, { reason }),

  // --- REPORTS ---
  downloadBillPDF: async (id) => {
    const token = localStorage.getItem('mandi_token');
    const res = await fetch(`${BASE_URL}/report/pdf/bill/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  },
  exportExcel: async (type) => {
    const token = localStorage.getItem('mandi_token');
    const res = await fetch(`${BASE_URL}/report/excel/${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-export.xlsx`;
    a.click();
  },
};
