import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';
import {
   ExpenseInterface,
   MonthlySalesAndExpensesInterface,
   SalesDataTable,
} from '../types/types.ts';
import { SyntheticEvent, useEffect, useState } from 'react';
import { groupSalesByMonth } from '../utils/groupSalesByMonth.ts';
import {
   Alert,
   Avatar,
   Card,
   CardContent,
   Grid,
   List,
   ListItem,
   ListItemAvatar,
   ListItemText,
   Snackbar,
   Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { numberFormat } from '../utils/numberFormat.ts';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export const MonthlySales = ({
   sales,
   expenses,
}: {
   sales: SalesDataTable[];
   expenses: ExpenseInterface[];
}) => {
   const [data, setData] = useState<MonthlySalesAndExpensesInterface[]>([]);
   const [openAlert, setOpenAlert] = useState(false);

   const navigate = useNavigate();

   useEffect(() => {
      setData(
         groupSalesByMonth({
            sales,
            expenses,
         })
      );
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
   const onCopyObject = (sale: MonthlySalesAndExpensesInterface) => {
      try {
         navigator.clipboard.writeText(JSON.stringify(sale));
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

   return (
      <>
         <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
         >
            {data.map((x) => (
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
                        <Typography
                           variant='h5'
                           component='div'
                           color={x.revenue < 0 ? 'red' : 'inherit'}
                        >
                           {numberFormat(x.revenue)}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                           {x.allItems.length > 1
                              ? `${x.allItems.length} ventas`
                              : `${x.allItems.length} venta`}{' '}
                           <ContentCopyIcon
                              fontSize={'small'}
                              onClick={() => onCopyObject(x)}
                           />
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                           {numberFormat(x.revenueWithoutExpenses)} sin gastos.
                        </Typography>
                        <List
                           sx={{
                              width: '100%',
                           }}
                        >
                           {x.allExpenses.map((y) => (
                              <ListItem key={y._id}>
                                 <ListItemAvatar>
                                    <Avatar>
                                       {y.type === 'instagram_ad' ? (
                                          <InstagramIcon />
                                       ) : y.type === 'facebook_ad' ? (
                                          <FacebookIcon />
                                       ) : (
                                          <AttachMoneyIcon />
                                       )}
                                    </Avatar>
                                 </ListItemAvatar>
                                 <ListItemText
                                    primary={y.name}
                                    secondary={'- ' + numberFormat(y.price)}
                                 />
                                 <IconButton
                                    edge='end'
                                    aria-label='edit'
                                    onClick={() =>
                                       navigate(
                                          `/dashboard/expense-form?id=${y._id}`
                                       )
                                    }
                                 >
                                    <EditIcon />
                                 </IconButton>
                              </ListItem>
                           ))}
                        </List>
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
