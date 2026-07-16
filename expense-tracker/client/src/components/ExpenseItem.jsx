const CATEGORY_COLORS = {
  Food: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  Transport: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
  Housing: { bg: '#d1fae5', text: '#065f46', dot: '#10b981' },
  Healthcare: { bg: '#fce7f3', text: '#9d174d', dot: '#ec4899' },
  Entertainment: { bg: '#ede9fe', text: '#5b21b6', dot: '#8b5cf6' },
  Shopping: { bg: '#fff7ed', text: '#9a3412', dot: '#f97316' },
  Education: { bg: '#ecfeff', text: '#164e63', dot: '#06b6d4' },
  Utilities: { bg: '#f0fdf4', text: '#14532d', dot: '#22c55e' },
  Other: { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' },
};

const CATEGORY_ICONS = {
  Food: '🍔',
  Transport: '🚗',
  Housing: '🏠',
  Healthcare: '💊',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Education: '📚',
  Utilities: '⚡',
  Other: '📦',
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr));
}

export default function ExpenseItem({ expense, onEdit, onDelete, isDeleting }) {
  const color = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other;
  const icon = CATEGORY_ICONS[expense.category] || '📦';

  return (
    <div className={`expense-item ${isDeleting ? 'deleting' : ''}`} id={`expense-${expense._id}`}>
      <div className="expense-item-left">
        <div className="category-icon-wrap" style={{ background: color.bg }}>
          <span className="category-icon">{icon}</span>
        </div>
        <div className="expense-details">
          <h3 className="expense-title">{expense.title}</h3>
          <div className="expense-meta">
            <span
              className="category-badge"
              style={{ background: color.bg, color: color.text }}
            >
              <span className="badge-dot" style={{ background: color.dot }} />
              {expense.category}
            </span>
            <span className="expense-date">📅 {formatDate(expense.date)}</span>
          </div>
        </div>
      </div>

      <div className="expense-item-right">
        <div className="expense-amount">{formatCurrency(expense.amount)}</div>
        <div className="expense-actions">
          <button
            className="action-btn edit-btn"
            onClick={() => onEdit(expense)}
            title="Edit expense"
            id={`edit-${expense._id}`}
          >
            ✏️
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(expense._id)}
            title="Delete expense"
            disabled={isDeleting}
            id={`delete-${expense._id}`}
          >
            {isDeleting ? '⏳' : '🗑️'}
          </button>
        </div>
      </div>
    </div>
  );
}
