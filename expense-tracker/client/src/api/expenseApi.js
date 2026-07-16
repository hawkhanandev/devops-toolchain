import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const expenseAPI = {
  // Get all expenses
  getAll: () => api.get('/expenses'),

  // Create a new expense
  create: (data) => api.post('/expenses', data),

  // Update an expense
  update: (id, data) => api.put(`/expenses/${id}`, data),

  // Delete an expense
  delete: (id) => api.delete(`/expenses/${id}`),
};

export default api;
