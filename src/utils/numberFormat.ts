/**
 * Formats a number to COP currency
 * @example 45000 -> $45.000
 */
export const numberFormat = (value: number): string => {
   return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currency: 'COP',
   }).format(value);
};
