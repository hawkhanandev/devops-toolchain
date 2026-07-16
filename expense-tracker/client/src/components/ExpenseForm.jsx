import { useState, useEffect } from 'react';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Utilities', 'Other'];

const defaultForm = {
  title: '',
  amount: '',
  category: 'Food',
  date: new Date().toISOString().split('T')[0],
};

export default function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: new Date(editingExpense.date).toISOString().split('T')[0],
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [editingExpense]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      newErrors.amount = 'Enter a valid positive amount';
    if (!form.date) newErrors.date = 'Date is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
      if (!editingExpense) setForm(defaultForm);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = Boolean(editingExpense);

  return (
    <div className="form-card">
      <div className="form-header">
        <div className="form-header-icon">{isEditing ? '✏️' : '➕'}</div>
        <div>
          <h2 className="form-title">{isEditing ? 'Edit Expense' : 'Add New Expense'}</h2>
          <p className="form-subtitle">{isEditing ? 'Update the expense details below' : 'Track your spending with ease'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="expense-form" noValidate>
        <div className="form-grid">
          {/* Title */}
          <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
            <label htmlFor="title" className="form-label">
              <span className="label-icon">📝</span> Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input"
              placeholder="e.g. Grocery Shopping"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
            />
            {errors.title && <span className="error-msg">{errors.title}</span>}
          </div>

          {/* Amount */}
          <div className={`form-group ${errors.amount ? 'has-error' : ''}`}>
            <label htmlFor="amount" className="form-label">
              <span className="label-icon">💰</span> Amount ($)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              className="form-input"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
            />
            {errors.amount && <span className="error-msg">{errors.amount}</span>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              <span className="label-icon">🏷️</span> Category
            </label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className={`form-group ${errors.date ? 'has-error' : ''}`}>
            <label htmlFor="date" className="form-label">
              <span className="label-icon">📅</span> Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              className="form-input"
              value={form.date}
              onChange={handleChange}
            />
            {errors.date && <span className="error-msg">{errors.date}</span>}
          </div>
        </div>

        <div className="form-actions">
          {isEditing && (
            <button type="button" className="btn btn-ghost" onClick={onCancelEdit}>
              ✕ Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading} id="submit-expense-btn">
            {loading ? (
              <span className="btn-loading"><span className="spinner" />Processing…</span>
            ) : (
              isEditing ? '💾 Save Changes' : '➕ Add Expense'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
