import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
   Box,
   Button,
   Container,
   Divider,
   LinearProgress,
   Typography,
} from '@mui/material';
import { getSales } from '../services/sale.service.ts';
import { CollapsibleTable } from '../components/CollapsibleTable.tsx';
import { SalesDataTable } from '../types/types.ts';
import { prepareDataSales } from '../utils/prepareDataSales.ts';

export const Dashboard = () => {
   const navigate = useNavigate();
   const [loading, setLoading] = useState<boolean>(true);
   const [sales, setSales] = useState<SalesDataTable[]>([]);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const data = await getSales();
            setSales(prepareDataSales(data));
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
            <Typography variant='h3'>Inicio</Typography>
            <Box mt={6} />

            <Box mt={3} />
            <Button
               variant='contained'
               color={'primary'}
               size={'medium'}
               onClick={() => navigate('/dashboard/sale-form')}
               disabled={loading}
            >
               Nueva Venta
            </Button>
            <Button
               variant='contained'
               color={'primary'}
               size={'medium'}
               onClick={() => navigate('/items')}
               disabled={loading}
               sx={{ marginLeft: 2 }}
            >
               Productos y gastos
            </Button>
            <Box mt={3} />
            {loading ? (
               <>
                  <LinearProgress />
               </>
            ) : (
               <>
                  <Box mt={4} />
                  <Typography variant='h4'>Total de ventas</Typography>
                  <Box mt={1} />
                  <Divider variant='fullWidth' />
                  <Box mt={3} />
                  <CollapsibleTable data={sales} />
               </>
            )}
         </Container>
      </>
   );
};
