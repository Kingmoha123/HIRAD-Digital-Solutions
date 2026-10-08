/**
 * HIRAD BMS — API Client
 * Central Axios instance that communicates with the Express backend
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

// Helper to retrieve auth token
const getToken = () => localStorage.getItem('hirad_bms_token') || sessionStorage.getItem('hirad_bms_token');

// ─── Generic fetch wrapper ────────────────────────────────────────────────
async function request(method, endpoint, data = null, params = null) {
  const token = getToken();

  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.append(k, v);
    });
  }

  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(data && { body: JSON.stringify(data) }),
  };

  const res = await fetch(url.toString(), opts);
  const json = await res.json();

  if (!res.ok) {
    const err = new Error(json.message || 'Request failed');
    err.status = res.status;
    throw err;
  }

  return json;
}

const api = {
  get:    (endpoint, params) => request('GET',    endpoint, null, params),
  post:   (endpoint, data)   => request('POST',   endpoint, data),
  put:    (endpoint, data)   => request('PUT',    endpoint, data),
  patch:  (endpoint, data)   => request('PATCH',  endpoint, data),
  delete: (endpoint)         => request('DELETE', endpoint),
};

export default api;

// ─── Auth ─────────────────────────────────────────────────────────────────
export const authAPI = {
  login:          (email, password) => api.post('/auth/login', { email, password }),
  me:             ()                => api.get('/auth/me'),
  changePassword: (data)            => api.put('/auth/change-password', data),
};

// ─── Dashboard ────────────────────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// ─── Clients ──────────────────────────────────────────────────────────────
export const clientsAPI = {
  getAll:  (params) => api.get('/clients', params),
  getOne:  (id)     => api.get(`/clients/${id}`),
  create:  (data)   => api.post('/clients', data),
  update:  (id, data) => api.put(`/clients/${id}`, data),
  delete:  (id)     => api.delete(`/clients/${id}`),
};

// ─── Leads ────────────────────────────────────────────────────────────────
export const leadsAPI = {
  getAll:  (params) => api.get('/leads', params),
  getOne:  (id)     => api.get(`/leads/${id}`),
  create:  (data)   => api.post('/leads', data),
  update:  (id, data) => api.put(`/leads/${id}`, data),
  delete:  (id)     => api.delete(`/leads/${id}`),
};

// ─── Projects ─────────────────────────────────────────────────────────────
export const projectsAPI = {
  getAll:  (params) => api.get('/projects', params),
  getOne:  (id)     => api.get(`/projects/${id}`),
  create:  (data)   => api.post('/projects', data),
  update:  (id, data) => api.put(`/projects/${id}`, data),
  delete:  (id)     => api.delete(`/projects/${id}`),
};

// ─── Tasks ────────────────────────────────────────────────────────────────
export const tasksAPI = {
  getAll:  (params) => api.get('/tasks', params),
  getOne:  (id)     => api.get(`/tasks/${id}`),
  create:  (data)   => api.post('/tasks', data),
  update:  (id, data) => api.put(`/tasks/${id}`, data),
  delete:  (id)     => api.delete(`/tasks/${id}`),
};

// ─── Meetings ─────────────────────────────────────────────────────────────
export const meetingsAPI = {
  getAll:  (params) => api.get('/meetings', params),
  getOne:  (id)     => api.get(`/meetings/${id}`),
  create:  (data)   => api.post('/meetings', data),
  update:  (id, data) => api.put(`/meetings/${id}`, data),
  delete:  (id)     => api.delete(`/meetings/${id}`),
};

// ─── Invoices ─────────────────────────────────────────────────────────────
export const invoicesAPI = {
  getAll:  (params) => api.get('/invoices', params),
  getOne:  (id)     => api.get(`/invoices/${id}`),
  create:  (data)   => api.post('/invoices', data),
  update:  (id, data) => api.put(`/invoices/${id}`, data),
  delete:  (id)     => api.delete(`/invoices/${id}`),
};

// ─── Payments ─────────────────────────────────────────────────────────────
export const paymentsAPI = {
  getAll:  (params) => api.get('/payments', params),
  getOne:  (id)     => api.get(`/payments/${id}`),
  create:  (data)   => api.post('/payments', data),
  update:  (id, data) => api.put(`/payments/${id}`, data),
  delete:  (id)     => api.delete(`/payments/${id}`),
};

// ─── Expenses ─────────────────────────────────────────────────────────────
export const expensesAPI = {
  getAll:  (params) => api.get('/expenses', params),
  getOne:  (id)     => api.get(`/expenses/${id}`),
  create:  (data)   => api.post('/expenses', data),
  update:  (id, data) => api.put(`/expenses/${id}`, data),
  delete:  (id)     => api.delete(`/expenses/${id}`),
};

// ─── Proposals ────────────────────────────────────────────────────────────
export const proposalsAPI = {
  getAll:  (params) => api.get('/proposals', params),
  getOne:  (id)     => api.get(`/proposals/${id}`),
  create:  (data)   => api.post('/proposals', data),
  update:  (id, data) => api.put(`/proposals/${id}`, data),
  delete:  (id)     => api.delete(`/proposals/${id}`),
};

// ─── Contracts ────────────────────────────────────────────────────────────
export const contractsAPI = {
  getAll:  (params) => api.get('/contracts', params),
  getOne:  (id)     => api.get(`/contracts/${id}`),
  create:  (data)   => api.post('/contracts', data),
  update:  (id, data) => api.put(`/contracts/${id}`, data),
  delete:  (id)     => api.delete(`/contracts/${id}`),
};

// ─── Services ─────────────────────────────────────────────────────────────
export const servicesAPI = {
  getAll:  (params) => api.get('/services', params),
  getOne:  (id)     => api.get(`/services/${id}`),
  create:  (data)   => api.post('/services', data),
  update:  (id, data) => api.put(`/services/${id}`, data),
  delete:  (id)     => api.delete(`/services/${id}`),
};

// ─── Documents ────────────────────────────────────────────────────────────
export const documentsAPI = {
  getAll:  (params) => api.get('/documents', params),
  getOne:  (id)     => api.get(`/documents/${id}`),
  create:  (data)   => api.post('/documents', data),
  update:  (id, data) => api.put(`/documents/${id}`, data),
  delete:  (id)     => api.delete(`/documents/${id}`),
};

// ─── Employees ────────────────────────────────────────────────────────────
export const employeesAPI = {
  getAll:  (params) => api.get('/employees', params),
  getOne:  (id)     => api.get(`/employees/${id}`),
  create:  (data)   => api.post('/employees', data),
  update:  (id, data) => api.put(`/employees/${id}`, data),
  delete:  (id)     => api.delete(`/employees/${id}`),
};

// ─── Time Entries ─────────────────────────────────────────────────────────
export const timeAPI = {
  getAll:  (params) => api.get('/time-entries', params),
  getOne:  (id)     => api.get(`/time-entries/${id}`),
  create:  (data)   => api.post('/time-entries', data),
  update:  (id, data) => api.put(`/time-entries/${id}`, data),
  delete:  (id)     => api.delete(`/time-entries/${id}`),
};

// ─── Activity Log & Audit ────────────────────────────────────────────────
export const activitiesAPI = {
  getAll: (params) => api.get('/activities', params),
  create: (data)   => api.post('/activities', data),
};

// ─── Notifications ───────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll:      ()         => api.get('/notifications'),
  create:      (data)     => api.post('/notifications', data),
  markRead:    (id)       => api.put(`/notifications/${id}/read`),
  markAllRead: ()         => api.put('/notifications/mark-all-read'),
};

// ─── Global Search ────────────────────────────────────────────────────────
export const searchAPI = {
  search: (query) => api.get('/search', { q: query }),
};

