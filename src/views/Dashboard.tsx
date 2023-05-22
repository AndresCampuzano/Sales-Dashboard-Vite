import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
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
import { SaleWithClientAndItemData } from '../types/types.ts';

export const Dashboard = () => {
   const navigate = useNavigate();
   const [loading, setLoading] = useState<boolean>(false);
   const [sales, setSales] = useState<SaleWithClientAndItemData[]>([]);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const sales = await getSales();
            setSales(sales);
            console.log(sales);
         } catch (error) {
            console.error(error);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, []);

   const tableData = [
      {
         name: 'Frozen yoghurt',
         calories: 159,
         fat: 6.0,
         carbs: 24,
         protein: 4.0,
         price: 3.99,
         history: [
            {
               date: '2020-01-05',
               customerId: '11091700',
               amount: 3,
            },
            {
               date: '2020-01-02',
               customerId: 'Anonymous',
               amount: 1,
            },
         ],
      },
      {
         name: 'Cupcake',
         calories: 237,
         fat: 9.0,
         carbs: 37,
         protein: 4.3,
         price: 4.99,
         history: [
            {
               date: '2020-01-05',
               customerId: '11091700',
               amount: 9,
            },
            {
               date: '2020-01-02',
               customerId: 'Anonymous',
               amount: 6,
            },
         ],
      },
   ];

   return (
      <>
         <Container>
            <Box mt={6} />
            <Typography variant='h3'>Panel</Typography>
            <Box mt={6} />
            <Typography variant='h4'>Total de Ventas</Typography>
            <Box mt={1} />
            <Divider variant='fullWidth' />
            <Box mt={3} />
            <Button
               variant='contained'
               color={'primary'}
               size={'medium'}
               onClick={() => navigate('/dashboard/sale-form')}
            >
               Nueva Venta
            </Button>
            <Box mt={3} />
            {loading ? (
               <>
                  <LinearProgress />
               </>
            ) : (
               <>
                  <CollapsibleTable data={tableData} />
               </>
            )}
         </Container>
      </>
   );
};
