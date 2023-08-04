import {
   ExpenseInterface,
   MonthlySalesAndExpensesInterface,
   SalesDataTable,
} from '../types/types.ts';

/**
 * Groups sales and expenses by month
 */
export function groupSalesByMonth({
   sales,
   expenses,
}: {
   sales: SalesDataTable[];
   expenses: ExpenseInterface[];
}): MonthlySalesAndExpensesInterface[] {
   // Create an empty array to store monthly sales and expenses data.
   const monthlySales: Omit<
      MonthlySalesAndExpensesInterface,
      'revenueWithoutExpenses'
   >[] = [];

   // Loop through each sale data in the sales array.
   for (const sale of sales) {
      const saleDate = new Date(sale.date);
      const monthKey = `${saleDate.toLocaleString('en-US', {
         month: 'long',
      })} ${saleDate.getFullYear()}`;

      const existingMonth = monthlySales.find(
         (monthlySale) => monthlySale.month === monthKey
      );

      // If the month already exists in the monthlySales array, add the sale data to its allItems array and update the revenue.
      if (existingMonth) {
         existingMonth.allItems.push(sale);
         existingMonth.revenue += sale.totalPrice;
      } else {
         // If the month doesn't exist in the monthlySales array, create a new MonthlySalesInterface object.
         monthlySales.push({
            month: monthKey,
            allItems: [sale],
            revenue: sale.totalPrice,
            // Filter the expenses array to find expenses that match the same month and year as the sale.
            allExpenses: expenses.filter((x) => {
               const expenseMonthDate = new Date(
                  x.created_at as string
               ).getMonth();
               const expenseYear = new Date(
                  x.created_at as string
               ).getFullYear();
               const saleMonthDate = new Date(sale.date).getMonth();
               const saleYear = new Date(sale.date).getFullYear();
               return (
                  expenseMonthDate === saleMonthDate && expenseYear === saleYear
               );
            }),
         });
      }
   }

   // Calculate profit for each month and return the updated data.
   return monthlySales.map((x) => {
      const sales = x.revenue;
      const expenses = x.allExpenses.reduce((a, b) => a + b.price, 0);
      return {
         ...x,
         revenue: sales - expenses,
         revenueWithoutExpenses: sales,
      };
   });
}
