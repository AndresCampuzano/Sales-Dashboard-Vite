/**
 * Formats number to COP currency
 */
export const numberFormat = (value: number): string => {
   return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
   }).format(value);
};
