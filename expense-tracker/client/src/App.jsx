import { useState, useEffect, useCallback } from 'react';
import { expenseAPI } from './api/expenseApi';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import './App.css';

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}

function StatsBar({ expenses }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const categories = [...new Set(expenses.map((e) => e.category))].length;
  const avgAmount = expenses.length ? total / expenses.length : 0;

  const fmt = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="stats-bar">
      <div className="stat-card" id="stat-total">
        <span className="stat-icon">💵</span>
        <div>
          <p className="stat-label">Total Spent</p>
          <p className="stat-value">{fmt(total)}</p>
        </div>
      </div>
      <div className="stat-card" id="stat-count">
        <span className="stat-icon">📋</span>
        <div>
          <p className="stat-label">Transactions</p>
          <p className="stat-value">{expenses.length}</p>
        </div>
      </div>
      <div className="stat-card" id="stat-categories">
        <span className="stat-icon">🏷️</span>
        <div>
          <p className="stat-label">Categories</p>
          <p className="stat-value">{categories}</p>
        </div>
      </div>
      <div className="stat-card" id="stat-avg">
        <span className="stat-icon">📊</span>
        <div>
          <p className="stat-label">Avg. Expense</p>
          <p className="stat-value">{fmt(avgAmount)}</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // Fetch all expenses
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await expenseAPI.getAll();
      setExpenses(res.data.data);
    } catch {
      showToast('Failed to load expenses. Is the server running?', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Add expense
  const handleAddExpense = async (formData) => {
    try {
      const res = await expenseAPI.create(formData);
      setExpenses((prev) => [res.data.data, ...prev]);
      showToast('Expense added successfully! 🎉');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add expense', 'error');
      throw err;
    }
  };

  // Update expense
  const handleUpdateExpense = async (formData) => {
    try {
      const res = await expenseAPI.update(editingExpense._id, formData);
      setExpenses((prev) =>
        prev.map((e) => (e._id === editingExpense._id ? res.data.data : e))
      );
      setEditingExpense(null);
      showToast('Expense updated successfully! ✅');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update expense', 'error');
      throw err;
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    setDeletingId(id);
    try {
      await expenseAPI.delete(id);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
      showToast('Expense deleted.');
    } catch {
      showToast('Failed to delete expense', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmitForm = editingExpense ? handleUpdateExpense : handleAddExpense;

  return (
    <div className="app">
      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="header-logo">💰</div>
            <div>
              <h1 className="header-title">Expense Tracker</h1>
              <p className="header-subtitle">Keep your finances in check</p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="container">
        <StatsBar expenses={expenses} />

        {/* Main layout */}
        <div className="main-layout">
          {/* Left: Form */}
          <aside className="form-column">
            <ExpenseForm
              onSubmit={handleSubmitForm}
              editingExpense={editingExpense}
              onCancelEdit={() => setEditingExpense(null)}
            />
          </aside>

          {/* Right: List */}
          <main className="list-column">
            <ExpenseList
              expenses={expenses}
              onEdit={setEditingExpense}
              onDelete={handleDelete}
              deletingId={deletingId}
              loading={loading}
            />
          </main>
        </div>
      </div>

      <footer className="app-footer">
        <p>Mini Expense Tracker · Built with React + Node.js + MongoDB</p>
      </footer>
    </div>
  );
}
