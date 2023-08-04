import { useEffect, useState } from 'react';
import {
   Avatar,
   Box,
   Button,
   Container,
   Divider,
   LinearProgress,
   Typography,
} from '@mui/material';
import { ExpenseInterface, Item, SalesDataTable } from '../types/types.ts';
import { getItems } from '../services/item.service.ts';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { numberFormat } from '../utils/numberFormat.ts';
import { colorFromConstants } from '../utils/colorFromConstants.ts';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { getSales } from '../services/sale.service.ts';
import { prepareDataSales } from '../utils/prepareDataSales.ts';
import { MonthlySales } from '../components/MonthlySales.tsx';
import { getExpenses } from '../services/expense.service.ts';

export const Items = () => {
   const navigate = useNavigate();
   const [loading, setLoading] = useState<boolean>(true);
   const [sales, setSales] = useState<SalesDataTable[]>([]);
   const [expenses, setExpenses] = useState<ExpenseInterface[]>([]);
   const [items, setItems] = useState<Item[]>([]);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const itemsRes = await getItems();
            const sales = await getSales();
            const expenses = await getExpenses();
            setItems(itemsRes);
            setSales(prepareDataSales(sales));
            setExpenses(expenses);
         } catch (error) {
            console.error(error);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, []);

   return (
      <>
         <Container>
            <Box mt={6} />
            <Typography variant='h3'>Productos y gastos</Typography>
            <Box mt={6} />
            <Box mt={3} />
            {loading ? (
               <>
                  <LinearProgress />
               </>
            ) : (
               <>
                  <Typography variant='h4'>Todos los productos</Typography>
                  <Box mt={1} />
                  <Divider variant='fullWidth' />
                  <Box mt={2} />
                  <Button
                     variant='contained'
                     color={'primary'}
                     startIcon={<AddIcon />}
                     size={'medium'}
                     onClick={() => navigate('/dashboard/item-form')}
                     disabled={loading}
                  >
                     Crear nuevo producto
                  </Button>
                  <Box mt={3} />
                  <TableContainer component={Paper}>
                     <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                        <TableHead>
                           <TableRow>
                              <TableCell align='left'>Imagen</TableCell>
                              <TableCell align='left'>Nombre</TableCell>
                              <TableCell align='left'>Precio</TableCell>
                              <TableCell align='left'>Colores</TableCell>
                              <TableCell align='left'></TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {items.map((row) => (
                              <TableRow key={row._id}>
                                 <TableCell component='th' scope='row'>
                                    <Avatar alt={row.name} src={row.image} />
                                 </TableCell>
                                 <TableCell align='left'>{row.name}</TableCell>
                                 <TableCell align='left'>
                                    {numberFormat(row.price)}
                                 </TableCell>
                                 <TableCell align='left'>
                                    <>
                                       {row.available_colors.map((color) => (
                                          <div
                                             key={color}
                                             style={{
                                                backgroundColor:
                                                   colorFromConstants(color)
                                                      .bgColor,
                                                textAlign: 'center',
                                             }}
                                          >
                                             <span
                                                style={{
                                                   color: colorFromConstants(
                                                      color
                                                   ).textColor,
                                                }}
                                             >
                                                {color}
                                             </span>
                                          </div>
                                       ))}
                                    </>
                                 </TableCell>
                                 <TableCell align='left'>
                                    <EditIcon
                                       style={{ cursor: 'pointer' }}
                                       onClick={() =>
                                          navigate(
                                             `/dashboard/item-form?id=${row._id}`
                                          )
                                       }
                                    />
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </TableContainer>
                  <Box mt={6} />
                  <Typography variant='h4'>Rendimiento por mes</Typography>
                  <Box mt={1} />
                  <Divider variant='fullWidth' />
                  <Box mt={2} />
                  <Button
                     variant='contained'
                     color={'primary'}
                     startIcon={<AddIcon />}
                     size={'medium'}
                     onClick={() => navigate('/dashboard/expense-form')}
                     disabled={loading}
                  >
                     Agregar nuevo gasto
                  </Button>
                  <Box mt={2} />
                  <Box mt={3} />
                  <MonthlySales sales={sales} expenses={expenses} />
               </>
            )}
         </Container>
      </>
   );
};
