import { MonthlySalesInterface, SalesDataTable } from '../types/types.ts';

/**
 * Groups sales by month
 */
export function groupSalesByMonth(
   sales: SalesDataTable[]
): MonthlySalesInterface[] {
   const monthlySales: MonthlySalesInterface[] = [];

   for (const saleData of sales) {
      const saleDate = new Date(saleData.date);
      const monthKey = `${saleDate.toLocaleString('en-US', {
         month: 'long',
      })} ${saleDate.getFullYear()}`;

      const existingMonth = monthlySales.find(
         (monthlySale) => monthlySale.month === monthKey
      );

      if (existingMonth) {
         existingMonth.allItems.push(saleData);
         existingMonth.revenue += saleData.totalPrice;
      } else {
         monthlySales.push({
            month: monthKey,
            allItems: [saleData],
            revenue: saleData.totalPrice,
         });
      }
   }

   return monthlySales;
}
