import express from 'express';
import {
  createExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';

const router = express.Router();

// POST /api/expenses - Add a new expense
router.post('/', createExpense);

// GET /api/expenses - Get all expenses
router.get('/', getAllExpenses);

// PUT /api/expenses/:id - Update an expense
router.put('/:id', updateExpense);

// DELETE /api/expenses/:id - Delete an expense
router.delete('/:id', deleteExpense);

export default router;
