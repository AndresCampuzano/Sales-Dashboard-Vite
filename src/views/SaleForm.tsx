import { useState, useEffect } from 'react';
import {
   Box,
   Button,
   Container,
   Divider,
   LinearProgress,
   Stack,
   TextField,
   Typography,
   Autocomplete,
   Avatar,
   InputAdornment,
   RadioGroup,
   Radio,
   FormControl,
   FormLabel,
   FormControlLabel,
   CircularProgress,
   Card,
   CardActions,
   CardContent,
   CardMedia,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   DialogContentText,
   Breadcrumbs,
   Checkbox,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import { Client, Item, ItemList, Sale } from '../types/types';
import { Link, useNavigate } from 'react-router-dom';
import { numberFormat } from '../utils/numberFormat';
import { getClients } from '../services/client.service';
import { getItems } from '../services/item.service';
import { postSale } from '../services/sale.service';
import { CustomChip } from '../components/CustomChip.tsx';

export const SaleForm = () => {
   const [loading, setLoading] = useState<boolean>(true);
   const [clients, setClients] = useState<Client[]>([]);
   const [items, setItems] = useState<Item[]>([]);
   const [isSendingData, setIsSendingData] = useState<boolean>(false);
   // Modal states
   const [showDeleteItemFromListModal, setShowDeleteItemFromListModal] =
      useState<boolean>(false);
   const [showExitModal, setShowExitModal] = useState<boolean>(false);
   const [routeTo, setRouteTo] = useState<string>('');
   const [showSendSaleObjectModal, setShowSendSaleObjectModal] =
      useState<boolean>(false);

   // Form states
   const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);
   const [selectedClient, setSelectedClient] = useState<ClientOption | null>(
      null
   );
   const [clientInputValue, setClientInputValue] = useState('');
   const [selectedClientInfo, setSelectedClientInfo] = useState<Client | null>(
      null
   );
   const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);
   const [selectedItem, setSelectedItem] = useState<ItemOption | null>(null);
   const [itemInputValue, setItemInputValue] = useState('');
   const [selectedItemInfo, setSelectedItemInfo] = useState<Item | null>(null);
   const [selectedColor, setSelectedColor] = useState<string>('');
   const [isPriceWithDiscount, setIsPriceWithDiscount] =
      useState<boolean>(false);
   const [discountPrice, setDiscountPrice] = useState<number>(0);
   // Item list states
   const [itemList, setItemList] = useState<ItemList[]>([]);
   const [itemToDeleteIndex, setItemToDeleteIndex] = useState<number | null>(
      null
   );

   const navigate = useNavigate();

   interface ClientOption {
      id: string;
      label: string;
   }

   interface ItemOption {
      id: string;
      label: string;
   }

   /**
    * Fetches clients and items
    */
   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const clientsRes = await getClients();
            const itemsRes = await getItems();

            setClients(clientsRes);
            setItems(itemsRes);
         } catch (e) {
            console.error(e);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, []);

   /**
    * Sets client options data
    */
   useEffect(() => {
      if (clients.length) {
         const clientOptions = clients.map((x) => ({
            id: x._id as string,
            label: x.name,
         }));

         setClientOptions(clientOptions);
      }
   }, [clients]);

   /**
    * Recovers all client info based on selected client
    */
   useEffect(() => {
      if (!selectedClient) return;
      const client = clients.find((client) => client._id === selectedClient.id);
      if (!client) return;
      setSelectedClientInfo(client);
   }, [clients, selectedClient]);

   /**
    * Sets item options data
    */
   useEffect(() => {
      if (items.length) {
         const itemsOptions = items.map((x) => ({
            id: x._id as string,
            label: x.name,
         }));

         setItemOptions(itemsOptions);
      }
   }, [items]);

   /**
    * Recovers all item info based on selected item
    */
   useEffect(() => {
      if (!selectedItem) return;
      const item = items.find((item) => item._id === selectedItem.id);
      if (!item) return;
      setSelectedItemInfo(item);
      setSelectedColor(item.available_colors[0]);
   }, [items, selectedItem]);

   const onChangeItemColor = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedColor(e.target.value);
   };

   const onDiscountChange = () => {
      setIsPriceWithDiscount(!isPriceWithDiscount);
   };

   const onChangeDiscountPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value === '') {
         setDiscountPrice(0);
      } else {
         setDiscountPrice(parseInt(e.target.value));
      }
   };

   // If isPriceWithDiscount, sets discount price to the current item price
   useEffect(() => {
      if (isPriceWithDiscount) {
         setDiscountPrice(selectedItemInfo?.price as number);
      }
   }, [isPriceWithDiscount, selectedItemInfo]);

   /**
    * Posts sale object to API
    */
   const onSubmit = async () => {
      if (!selectedClientInfo) return;

      const data: Sale = {
         client_id: selectedClientInfo._id as string,
         items: itemList.map((item) => ({
            item_id: item._id as string,
            color: item.color,
            price: item.price,
         })),
      };

      try {
         setIsSendingData(true);
         await postSale(data);
         setShowSendSaleObjectModal(false);
         navigate('/');
      } catch (e) {
         console.error(e);
      } finally {
         setIsSendingData(false);
      }
   };

   /**
    * Saves current item in list and resets item selection
    */
   const onSaveItemInList = () => {
      // Saving current item in list
      if (!selectedItemInfo) return;
      const currentItem = {
         ...selectedItemInfo,
         // recovers discount price if isPriceWithDiscount is true
         price: isPriceWithDiscount ? discountPrice : selectedItemInfo.price,
      };
      setItemList((prev) => [
         ...prev,
         {
            ...currentItem,
            color: selectedColor,
         },
      ]);
      // Resetting item selection
      setSelectedItem(null);
      setSelectedItemInfo(null);
      setSelectedColor('');
      setIsPriceWithDiscount(false);
      setDiscountPrice(0);
   };

   /**
    * Deletes item from list based on item index
    */
   const onDeleteItemFromList = () => {
      if (itemToDeleteIndex === null) return;
      setItemList((prev) => {
         const newList = [...prev];
         newList.splice(itemToDeleteIndex, 1);
         return newList;
      });
      onCloseDeleteItemFromLisModal();
   };

   /**
    * Closes delete item modal and resets item index to delete
    */
   const onCloseDeleteItemFromLisModal = () => {
      setItemToDeleteIndex(null);
      setShowDeleteItemFromListModal(false);
   };

   /**
    * Opens delete item modal and sets item index to delete
    */
   const onOpenDeleteItemFromLisModal = (index: number) => {
      setItemToDeleteIndex(index);
      setShowDeleteItemFromListModal(true);
   };

   /**
    * Opens exit modal and sets route to go when confirmed
    */
   const onOpenExitModal = (route: string) => {
      setShowExitModal(true);
      setRouteTo(route);
   };

   /**
    * Closes exit modal and resets route to go
    */
   const onCloseExitModal = () => {
      setShowExitModal(false);
      setRouteTo('');
   };

   /**
    * Sets route to go when exit modal is confirmed
    */
   const onExit = () => {
      navigate(routeTo);
   };

   /**
    * Closes send sale object modal
    */
   const onCloseSendSaleObjectModal = () => {
      setShowSendSaleObjectModal(false);
   };

   /**
    * Opens send sale object modal
    */
   const onOpenSendSaleObjectModal = () => {
      setShowSendSaleObjectModal(true);
   };

   return (
      <>
         <main>
            <Container>
               <Box mt={6} />
               <Breadcrumbs separator='›'>
                  <Link color='inherit' to='/'>
                     Inicio
                  </Link>
                  <Link color='inherit' to='/dashboard/'>
                     Panel
                  </Link>
                  <Typography color='text.primary'>Nueva Venta</Typography>
               </Breadcrumbs>
               <Box mt={4} />
               <Typography variant='h3'>Nueva Venta</Typography>
               <Box mt={6} />
               <Typography variant='h4'>Cliente</Typography>
               <Box mt={1} />
               <Divider variant='fullWidth' />
               <Box mt={3} />
               {loading ? (
                  <>
                     <LinearProgress />
                  </>
               ) : (
                  <div>
                     <Typography variant='subtitle2'>
                        Selecciona un cliente existente o crea uno nuevo
                     </Typography>
                     <Box mt={2} />
                     <Autocomplete
                        disablePortal
                        id='combo-box-clients'
                        value={selectedClient}
                        onChange={(_: any, newValue: ClientOption | null) => {
                           setSelectedClient(newValue);
                        }}
                        inputValue={clientInputValue}
                        onInputChange={(_, newInputValue) => {
                           setClientInputValue(newInputValue);
                        }}
                        fullWidth
                        renderInput={(params) => (
                           <TextField {...params} label='Clientes' />
                        )}
                        size={'small'}
                        options={clientOptions}
                     />
                     <Box mt={2} />
                     <Button
                        variant='contained'
                        color={'inherit'}
                        startIcon={<AddIcon />}
                        size={'medium'}
                        onClick={() =>
                           onOpenExitModal('/dashboard/client-form')
                        }
                        fullWidth
                     >
                        Crear nuevo
                     </Button>
                     <Box mt={2} />
                     {selectedClientInfo ? (
                        <>
                           <Button
                              variant='contained'
                              color={'inherit'}
                              startIcon={<EditIcon />}
                              size={'medium'}
                              onClick={() => {
                                 const id = selectedClientInfo?._id;
                                 if (!id) return;
                                 onOpenExitModal(
                                    `/dashboard/client-form?id=${id}`
                                 );
                              }}
                              fullWidth
                           >
                              Editar seleccionado
                           </Button>
                        </>
                     ) : null}
                     <Box mt={2} />
                     {selectedClientInfo ? (
                        <>
                           <TextField
                              id='outlined-basic'
                              label='Nombre del cliente'
                              variant={'outlined'}
                              size={'small'}
                              value={selectedClientInfo?.name || ''}
                              fullWidth={true}
                              disabled={true}
                           />
                           <Box mt={2} />
                           <TextField
                              id='outlined-basic'
                              label='Cuenta de instagram'
                              variant={'outlined'}
                              size={'small'}
                              value={
                                 selectedClientInfo?.instagram_account || ''
                              }
                              fullWidth={true}
                              disabled={true}
                           />
                           <Box mt={2} />
                           <TextField
                              id='outlined-basic'
                              label='Dirección'
                              variant={'outlined'}
                              size={'small'}
                              value={selectedClientInfo?.address || ''}
                              fullWidth={true}
                              disabled={true}
                           />
                           <Box mt={2} />
                           <TextField
                              id='outlined-basic'
                              label='Ciudad'
                              variant={'outlined'}
                              size={'small'}
                              value={selectedClientInfo?.city || ''}
                              fullWidth={true}
                              disabled={true}
                           />
                           <Box mt={2} />
                           <TextField
                              id='outlined-basic'
                              label='Teléfono'
                              variant={'outlined'}
                              size={'small'}
                              value={selectedClientInfo?.phone || ''}
                              fullWidth={true}
                              disabled={true}
                           />
                           <Box mt={2} />
                           <TextField
                              id='outlined-basic'
                              label='Departamento'
                              variant={'outlined'}
                              size={'small'}
                              value={selectedClientInfo?.department || ''}
                              fullWidth={true}
                              disabled={true}
                           />
                        </>
                     ) : null}
                     <Box mt={3} />
                     <Typography variant='h4'>Productos</Typography>
                     <Box mt={1} />
                     <Divider variant='fullWidth' />
                     <Box mt={3} />

                     {itemList.map((item, index) => (
                        <div key={index}>
                           <Card sx={{ maxWidth: 345 }}>
                              <CardMedia
                                 sx={{ height: 140 }}
                                 image={item.image}
                                 title={item.name}
                              />
                              <CardContent>
                                 <Typography
                                    gutterBottom
                                    variant='h5'
                                    component='div'
                                 >
                                    {item.name}
                                 </Typography>
                                 <CustomChip color={item.color} />
                              </CardContent>
                              <CardActions>
                                 <Button
                                    size='small'
                                    onClick={() =>
                                       onOpenDeleteItemFromLisModal(index)
                                    }
                                 >
                                    Borrar
                                 </Button>
                              </CardActions>
                           </Card>
                           <Box mt={2} />
                        </div>
                     ))}

                     <Typography variant='subtitle2'>
                        Selecciona un producto existente o crea uno nuevo
                     </Typography>
                     <Box mt={2} />
                     <Autocomplete
                        disablePortal
                        id='combo-box-items'
                        value={selectedItem}
                        onChange={(_: any, newValue: ItemOption | null) => {
                           setSelectedItem(newValue);
                        }}
                        inputValue={itemInputValue}
                        onInputChange={(_, newInputValue) => {
                           setItemInputValue(newInputValue);
                        }}
                        fullWidth={true}
                        renderInput={(params) => (
                           <TextField {...params} label='Productos' />
                        )}
                        size={'small'}
                        options={itemOptions}
                     />
                     <Box mt={2} />
                     <Button
                        variant='contained'
                        color={'inherit'}
                        startIcon={<AddIcon />}
                        size={'medium'}
                        onClick={() => onOpenExitModal('/dashboard/item-form')}
                        fullWidth
                     >
                        Crear nuevo
                     </Button>
                     <Box mt={2} />
                     {selectedItemInfo ? (
                        <>
                           <Button
                              variant='contained'
                              color={'inherit'}
                              startIcon={<EditIcon />}
                              size={'medium'}
                              onClick={() => {
                                 const id = selectedItemInfo?._id;
                                 if (!id) return;
                                 onOpenExitModal(
                                    `/dashboard/item-form?id=${id}`
                                 );
                              }}
                              fullWidth
                           >
                              Editar seleccionado
                           </Button>
                        </>
                     ) : null}
                     <Box mt={2} />
                     {selectedItemInfo ? (
                        <>
                           <Avatar
                              alt={selectedItemInfo.name}
                              src={selectedItemInfo.image}
                              sx={{ width: 100, height: 100 }}
                           />
                           <Box mt={2} />
                           <Stack direction='row' spacing={3}>
                              <TextField
                                 id='outlined-basic'
                                 label='Nombre del producto'
                                 variant={'outlined'}
                                 size={'small'}
                                 sx={{ width: 220 }}
                                 value={selectedItemInfo?.name || ''}
                                 fullWidth={true}
                                 disabled={true}
                                 InputProps={{
                                    startAdornment: (
                                       <InputAdornment position='start'>
                                          $
                                       </InputAdornment>
                                    ),
                                 }}
                              />
                              <TextField
                                 id='outlined-basic'
                                 label='Precio'
                                 variant={'outlined'}
                                 size={'small'}
                                 sx={{ width: 220 }}
                                 value={selectedItemInfo?.price || ''}
                                 fullWidth={true}
                                 disabled={true}
                                 InputProps={{
                                    startAdornment: (
                                       <InputAdornment position='start'>
                                          $
                                       </InputAdornment>
                                    ),
                                 }}
                              />
                           </Stack>
                           <Box mt={2} />
                           <FormControl>
                              <FormLabel id='radio-buttons-group-item-color'>
                                 Colores disponibles
                              </FormLabel>
                              <RadioGroup
                                 aria-labelledby='radio-buttons-group-item-color'
                                 name='color-item-group'
                                 value={selectedColor}
                                 onChange={onChangeItemColor}
                              >
                                 {selectedItemInfo.available_colors.map(
                                    (color) => (
                                       <FormControlLabel
                                          value={color}
                                          control={<Radio />}
                                          label={color}
                                          key={color}
                                       />
                                    )
                                 )}
                              </RadioGroup>
                           </FormControl>
                           <Box mt={2} />
                           <FormControlLabel
                              control={
                                 <Checkbox
                                    checked={isPriceWithDiscount}
                                    onChange={onDiscountChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                 />
                              }
                              label='Precio con descuento'
                           />
                           {isPriceWithDiscount ? (
                              <>
                                 <Box mt={2} />
                                 <TextField
                                    id='outlined-basic'
                                    label='Precio con descuento'
                                    variant={'outlined'}
                                    size={'small'}
                                    value={discountPrice}
                                    fullWidth={true}
                                    onChange={onChangeDiscountPrice}
                                    InputProps={{
                                       startAdornment: (
                                          <InputAdornment position='start'>
                                             $
                                          </InputAdornment>
                                       ),
                                    }}
                                 />
                              </>
                           ) : null}
                           <Box mt={2} />
                           <Button
                              variant='contained'
                              color={'success'}
                              startIcon={<AddIcon />}
                              size={'medium'}
                              fullWidth
                              onClick={onSaveItemInList}
                           >
                              Agregar a la lista
                           </Button>
                           <Box mt={3} />
                           <Box mt={4} />
                        </>
                     ) : null}
                     {isSendingData && <CircularProgress />}
                     {itemList.length > 0 && (
                        <Button
                           variant='contained'
                           color={'primary'}
                           startIcon={<SendIcon />}
                           size={'medium'}
                           disabled={isSendingData}
                           fullWidth
                           onClick={onOpenSendSaleObjectModal}
                        >
                           Guardar
                        </Button>
                     )}
                  </div>
               )}
            </Container>
         </main>
         {/*Modals*/}
         {/*Confirmation delete modal*/}
         <Dialog
            open={showDeleteItemFromListModal}
            onClose={onCloseDeleteItemFromLisModal}
         >
            <DialogTitle id='alert-dialog-title'>
               Borrar {itemList[itemToDeleteIndex || 0]?.name}
            </DialogTitle>
            <DialogContent>
               <DialogContentText id='alert-dialog-description'>
                  ¿Deseas borrar el producto?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={onCloseDeleteItemFromLisModal}>Cancelar</Button>
               <Button onClick={onDeleteItemFromList}>Borrar</Button>
            </DialogActions>
         </Dialog>
         {/*Confirmation exit from current view modal*/}
         <Dialog open={showExitModal} onClose={onCloseExitModal}>
            <DialogTitle id='alert-dialog-title'>
               Salir de la vista actual
            </DialogTitle>
            <DialogContent>
               <DialogContentText id='alert-dialog-description'>
                  ¿Deseas salir de la vista actual? Todos los cambios se
                  perderán.
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={onCloseExitModal}>Cancelar</Button>
               <Button onClick={onExit}>Continuar</Button>
            </DialogActions>
         </Dialog>
         {/*Confirmation to Send Sales Object modal*/}
         <Dialog
            open={showSendSaleObjectModal}
            onClose={onCloseSendSaleObjectModal}
         >
            <DialogTitle id='alert-dialog-title'>Nueva Venta</DialogTitle>
            <DialogContent>
               <DialogContentText id='alert-dialog-description'>
                  ¿Deseas registrar nueva venta con siguientes datos?
                  <br />
                  <br />
                  <b>Cliente:</b> {selectedClientInfo?.name}
                  <br />
                  <b>Productos:</b>
                  <br />
                  {itemList.map((item, index) => (
                     <li key={index}>
                        {item.name} - <CustomChip color={item.color} />
                     </li>
                  ))}
                  <br />
                  <b>Total de productos: {itemList.length}</b>
                  <br />
                  <b>
                     Ganancias:{' '}
                     {numberFormat(itemList.reduce((a, b) => a + b.price, 0))}
                  </b>
                  {isSendingData && <LinearProgress />}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={onCloseSendSaleObjectModal}
                  disabled={isSendingData}
               >
                  Cancelar
               </Button>
               <Button onClick={onSubmit} disabled={isSendingData}>
                  Enviar
               </Button>
            </DialogActions>
         </Dialog>
      </>
   );
};
