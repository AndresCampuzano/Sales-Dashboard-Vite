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
import { currencyFormat } from '../utils/currencyFormat.ts';
import { ExpenseItem } from './ExpenseItem.tsx';
import { CURRENCIES } from '../constants/constants.ts';

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
      const expenseWithCurrency = expense.sortedExpenses.find(
         (exp) => exp.currencyKey === CURRENCIES[0].value
      );
      let totalExpensesWithCurrency = 0;

      if (expenseWithCurrency && expenseWithCurrency.items) {
         totalExpensesWithCurrency = expenseWithCurrency.items.reduce(
            (a, b) => a + b.price,
            0
         );
      }

      return (
         <>
            {expense.sortedExpenses.length > 0 && (
               <Alert severity='warning'>
                  Gastos:
                  {expense.sortedExpenses.map((exp) => (
                     <Typography
                        key={exp.currencyKey}
                        variant='h5'
                        component='div'
                        color='inherit'
                     >
                        {currencyFormat(
                           exp.items.reduce((a, b) => a + b.price, 0),
                           exp.currencyKey
                        )}
                     </Typography>
                  ))}
               </Alert>
            )}
            {expense.revenueWithoutExpenses - totalExpensesWithCurrency > 0 && (
               <Alert severity='success'>
                  Ganancias:{' '}
                  <Typography variant='h5' component='div' color='inherit'>
                     {currencyFormat(
                        expense.revenueWithoutExpenses -
                           totalExpensesWithCurrency,
                        CURRENCIES[0].value
                     )}
                  </Typography>
               </Alert>
            )}
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

                        {expensesSummaryUI(x)}

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
                           {x.revenueWithoutExpenses === 0 ? (
                              <Alert severity='info'>
                                 No se registran ventas en el mes.
                              </Alert>
                           ) : (
                              <Typography
                                 sx={{ mb: 1.5 }}
                                 color='text.secondary'
                              >
                                 Total de ventas:{' '}
                                 {currencyFormat(x.revenueWithoutExpenses)} (no
                                 representa las ganancias finales).
                              </Typography>
                           )}

                           <List
                              sx={{
                                 width: '100%',
                              }}
                           >
                              {x.allExpenses.map((y) => (
                                 <ExpenseItem item={y} key={y._id} />
                              ))}
                           </List>
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
