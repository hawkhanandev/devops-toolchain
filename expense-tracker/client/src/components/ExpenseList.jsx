import ExpenseItem from './ExpenseItem';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function ExpenseList({ expenses, onEdit, onDelete, deletingId, loading }) {
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return (
      <div className="list-card">
        <div className="list-header">
          <h2 className="list-title">💸 Expense List</h2>
        </div>
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Loading your expenses…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="list-card">
      <div className="list-header">
        <div>
          <h2 className="list-title">💸 Expense List</h2>
          <p className="list-subtitle">{expenses.length} {expenses.length === 1 ? 'record' : 'records'} found</p>
        </div>
        {expenses.length > 0 && (
          <div className="total-badge">
            <span className="total-label">Total</span>
            <span className="total-amount">{formatCurrency(totalAmount)}</span>
          </div>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌟</div>
          <h3 className="empty-title">No expenses yet!</h3>
          <p className="empty-desc">Add your first expense using the form above to start tracking your finances.</p>
        </div>
      ) : (
        <div className="expenses-container">
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={deletingId === expense._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
