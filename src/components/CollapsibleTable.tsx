import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Collapse from '@mui/material/Collapse';
import { Avatar, AvatarGroup, Box, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import { SalesDataTable } from '../types/types.ts';
import { numberFormat } from '../utils/numberFormat.ts';

export const CollapsibleTable = ({ data }: { data: SalesDataTable[] }) => {
   return (
      <TableContainer component={Paper}>
         <Table aria-label='collapsible table'>
            <TableHead>
               <TableRow>
                  <TableCell />
                  <TableCell>Productos</TableCell>
                  <TableCell align='right'>Total #</TableCell>
                  <TableCell align='right'>Total $</TableCell>
                  <TableCell align='right'>Ciudad</TableCell>
                  <TableCell align='right'>Fecha</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {data.map((row) => (
                  <Row key={row.id} row={row} />
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   );
};

const Row = (props: { row: SalesDataTable }) => {
   const { row } = props;
   const [open, setOpen] = React.useState(false);

   return (
      <React.Fragment>
         <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
               <IconButton
                  aria-label='expand row'
                  size='small'
                  onClick={() => setOpen(!open)}
               >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
               </IconButton>
            </TableCell>
            <TableCell component='th' scope='row'>
               <AvatarGroup max={4}>
                  {row.avatarItems.map((i) => (
                     <Avatar key={i.id} alt={i.name} src={i.image_src} />
                  ))}
               </AvatarGroup>
            </TableCell>
            <TableCell align='right'>{row.totalProducts}</TableCell>
            <TableCell align='right'>{numberFormat(row.totalPrice)}</TableCell>
            <TableCell align='right'>{row.city}</TableCell>
            <TableCell align='right'>{row.date.toString()}</TableCell>
         </TableRow>
         <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
               <Collapse in={open} timeout='auto' unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                     <Typography variant='h6' gutterBottom component='div'>
                        Productos
                     </Typography>
                     <Table size='small' aria-label='purchases'>
                        <TableHead>
                           <TableRow>
                              <TableCell>Productos</TableCell>
                              <TableCell>Nombre</TableCell>
                              <TableCell align='right'>Color</TableCell>
                              <TableCell align='right'>Precio</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {row.nestedTableData.nestedItems.map((item) => (
                              <TableRow key={item.id}>
                                 <TableCell component='th' scope='row'>
                                    <Avatar
                                       key={item.id}
                                       alt={item.name}
                                       src={item.image_src}
                                    />
                                 </TableCell>
                                 <TableCell>{item.name}</TableCell>
                                 <TableCell align='right'>
                                    {item.color}
                                 </TableCell>
                                 <TableCell align='right'>
                                    {numberFormat(item.price)}
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </Box>
                  <Box mt={2} />
                  <Box sx={{ margin: 1 }}>
                     <Typography variant='h6' gutterBottom component='div'>
                        Cliente
                     </Typography>
                     <Table size='small' aria-label='purchases'>
                        <TableHead>
                           <TableRow>
                              <TableCell>Nombre</TableCell>
                              <TableCell>Instagram</TableCell>
                              <TableCell align='right'>Dirección</TableCell>
                              <TableCell align='right'>Telefono</TableCell>
                              <TableCell align='right'>Ciudad</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           <TableRow>
                              <TableCell component='th' scope='row'>
                                 {row.nestedTableData.nestedClient.name}
                              </TableCell>
                              <TableCell>
                                 {
                                    row.nestedTableData.nestedClient
                                       .instagram_account
                                 }
                              </TableCell>
                              <TableCell align='right'>
                                 {row.nestedTableData.nestedClient.address}
                              </TableCell>
                              <TableCell align='right'>
                                 {row.nestedTableData.nestedClient.phone}
                              </TableCell>
                              <TableCell align='right'>
                                 {row.nestedTableData.nestedClient.city}
                              </TableCell>
                           </TableRow>
                        </TableBody>
                     </Table>
                  </Box>
               </Collapse>
            </TableCell>
         </TableRow>
      </React.Fragment>
   );
};
