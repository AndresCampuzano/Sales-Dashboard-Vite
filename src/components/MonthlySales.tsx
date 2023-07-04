import { DateTime } from 'luxon';
import { MonthlySalesInterface, SalesDataTable } from '../types/types.ts';
import { useEffect, useState } from 'react';
import { groupSalesByMonth } from '../utils/groupSalesByMonth.ts';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { numberFormat } from '../utils/numberFormat.ts';

export const MonthlySales = ({ data }: { data: SalesDataTable[] }) => {
   const [sales, setSales] = useState<MonthlySalesInterface[]>([]);

   useEffect(() => {
      setSales(groupSalesByMonth(data));
   }, [data]);

   /**
    * By a given month and year, returns the month and year in spanish
    * @example "January 2021" -> "Enero 2021"
    */
   function localizeMonth(monthString: string): string {
      const dateTime = DateTime.fromFormat(monthString, 'MMMM yyyy');
      const localizedMonth = dateTime.setLocale('es').toFormat('MMMM yyyy');
      return localizedMonth.charAt(0).toUpperCase() + localizedMonth.slice(1);
   }

   return (
      <>
         <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
         >
            {sales.map((sale) => (
               <Grid key={sale.month} xs={12} sm={4} md={4} item>
                  <Card sx={{ minWidth: 275 }}>
                     <CardContent>
                        <Typography
                           sx={{ fontSize: 14 }}
                           color='text.secondary'
                           gutterBottom
                        >
                           {localizeMonth(sale.month)}
                        </Typography>
                        <Typography variant='h5' component='div'>
                           {numberFormat(sale.revenue)}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                           {sale.allItems.length > 1
                              ? `${sale.allItems.length} ventas`
                              : `${sale.allItems.length} venta`}
                        </Typography>
                     </CardContent>
                  </Card>
               </Grid>
            ))}
         </Grid>
      </>
   );
};
