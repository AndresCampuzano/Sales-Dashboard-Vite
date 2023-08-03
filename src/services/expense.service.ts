import { ExpenseInterface } from '../types/types';

/**
 * Fetches an Expense
 */
export async function getExpense(id: string): Promise<ExpenseInterface> {
   const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/expenses/${id}`
   );
   return await res.json();
}

/**
 * Fetches all Expenses
 */
export async function getExpenses(): Promise<ExpenseInterface[]> {
   const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`);
   return await res.json();
}

/**
 * Posts an Expense
 */
export async function postExpense(data: ExpenseInterface): Promise<void> {
   await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
   });
}

/**
 * Updates an Expense
 */
export async function updateExpense(
   id: string,
   data: ExpenseInterface
): Promise<void> {
   await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, {
      method: 'PUT',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
   });
}

/**
 * Deletes an Expense
 */
export async function deleteExpense(id: string): Promise<void> {
   await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, {
      method: 'DELETE',
   });
}
