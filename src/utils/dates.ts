/**
 * @private
 */
const months = [
   'January',
   'February',
   'March',
   'April',
   'May',
   'June',
   'July',
   'August',
   'September',
   'October',
   'November',
   'December',
];

/**
 * Sorts an array of objects by the "month" property in the format 'Month Year'.
 */
export function sortArrayByMonthAndYear<T>(arr: T[]): T[] {
   /**
    * Custom comparator function to compare two objects based on their "month" property.
    * @returns {number} - A negative, zero, or positive number indicating the sorting order.
    */
   const compareObjects = (obj1: unknown, obj2: unknown): number => {
      // FIXME: Fix types
      
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const [month1, year1] = obj1.month.split(' ');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const [month2, year2] = obj2.month.split(' ');

      // Compare years first
      if (year1 !== year2) {
         return Number(year1) - Number(year2);
      }

      // If years are the same, compare months
      const monthIndex1 = months.indexOf(month1);
      const monthIndex2 = months.indexOf(month2);

      return monthIndex2 - monthIndex1;
   };
   return arr.sort(compareObjects);
}
