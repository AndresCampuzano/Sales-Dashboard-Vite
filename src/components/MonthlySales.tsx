import { DateTime } from 'luxon';
import {
   ExpenseInterface,
   MonthlySalesAndExpensesInterface,
   SalesDataTable,
} from '../types/types.ts';
import { SyntheticEvent, useEffect, useState } from 'react';
import { groupSalesByMonth } from '../utils/groupSalesByMonth.ts';
import {
   Alert,
   Card,
   CardContent,
   Grid,
   List,
   Snackbar,
   Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { numberFormat } from '../utils/numberFormat.ts';
import { ExpenseItem } from './ExpenseItem.tsx';

export const MonthlySales = ({
   sales,
   expenses,
}: {
   sales: SalesDataTable[];
   expenses: ExpenseInterface[];
}) => {
   const [salesState, salesDataState] = useState<
      MonthlySalesAndExpensesInterface[]
   >([]);
   // Alert
   const [openAlert, setOpenAlert] = useState(false);

   useEffect(() => {
      const { salesWithExpenses } = groupSalesByMonth({
         sales,
         expenses,
      });
      salesDataState(salesWithExpenses);
   }, [sales, expenses]);

   /**
    * By a given month and year, returns the month and year in spanish
    * @example "January 2021" -> "Enero 2021"
    */
   function localizeMonth(monthString: string): string {
      const dateTime = DateTime.fromFormat(monthString, 'MMMM yyyy');
      const localizedMonth = dateTime.setLocale('es').toFormat('MMMM yyyy');
      return localizedMonth.charAt(0).toUpperCase() + localizedMonth.slice(1);
   }

   /**
    * Copy the object to the clipboard
    */
   const onCopyObject = (item: MonthlySalesAndExpensesInterface) => {
      try {
         navigator.clipboard.writeText(JSON.stringify(item));
         onAlertClick();
      } catch (e) {
         console.error(e);
      }
   };

   const onAlertClick = () => {
      setOpenAlert(true);
   };

   const handleAlertClose = (_?: SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
         return;
      }
      setOpenAlert(false);
   };

   const expensesSummaryUI = (expense: MonthlySalesAndExpensesInterface) => {
      return (
         <>
            {expense.sortedExpenses.map((exp) => (
               <Typography
                  key={exp.currencyKey}
                  variant='h5'
                  component='div'
                  color='inherit'
               >
                  {numberFormat(
                     exp.items.reduce((a, b) => a + b.price, 0),
                     exp.currencyKey
                  )}
               </Typography>
            ))}
         </>
      );
   };

   return (
      <>
         <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
         >
            {salesState.map((x) => (
               <Grid key={x.month} xs={12} sm={4} md={4} item>
                  <Card sx={{ minWidth: 275 }}>
                     <CardContent>
                        <Typography
                           sx={{ fontSize: 14 }}
                           color='text.secondary'
                           gutterBottom
                        >
                           {localizeMonth(x.month)}
                        </Typography>

                        {x.areAllCurrenciesCOP && x.revenue ? (
                           <Typography
                              variant='h5'
                              component='div'
                              color={x.revenue < 0 ? 'red' : 'inherit'}
                           >
                              {numberFormat(x.revenue)}
                           </Typography>
                        ) : (
                           <>{expensesSummaryUI(x)}</>
                        )}

                        {x.allItems && (
                           <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                              {x.allItems?.length > 1
                                 ? `${x.allItems.length} ventas`
                                 : `${x.allItems?.length} venta`}{' '}
                              <ContentCopyIcon
                                 fontSize={'small'}
                                 onClick={() => onCopyObject(x)}
                              />
                           </Typography>
                        )}
                        <>
                           <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                              {numberFormat(x.revenueWithoutExpenses)} sin
                              gastos.
                           </Typography>
                           <List
                              sx={{
                                 width: '100%',
                              }}
                           >
                              {x.allExpenses.map((y) => (
                                 <ExpenseItem item={y} key={y._id} />
                              ))}
                           </List>
                           {!x.areAllCurrenciesCOP ? (
                              <Alert severity='warning'>
                                 No se puede sumar los gastos del mes debido a
                                 que hay diferentes divisas.
                              </Alert>
                           ) : (
                              <>
                                 <Typography
                                    sx={{ mb: 1.5 }}
                                    color='text.secondary'
                                 >
                                    Suma de los gastos:{' '}
                                    {numberFormat(Math.abs(x.expenses))}
                                 </Typography>
                              </>
                           )}
                        </>
                     </CardContent>
                  </Card>
               </Grid>
            ))}
         </Grid>
         <Snackbar
            open={openAlert}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={handleAlertClose}
         >
            <Alert
               onClose={handleAlertClose}
               severity='info'
               sx={{ width: '100%' }}
            >
               Copiado en el portapapeles
            </Alert>
         </Snackbar>
      </>
   );
};
