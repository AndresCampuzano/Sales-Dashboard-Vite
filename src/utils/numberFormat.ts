/**
 * Formats a number to any currency
 * @example 45000 -> $45.000
 */
export const numberFormat = (value: number, currency?: string): string => {
   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      minimumFractionDigits: 0,
      // maximumFractionDigits: 0,
      currency: currency || 'COP', // handles AUD and Korean won
   }).format(value);
};
