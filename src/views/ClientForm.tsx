import { useState, useEffect } from 'react';
import {
   Autocomplete,
   Box,
   Breadcrumbs,
   Button,
   CircularProgress,
   Container,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   Divider,
   LinearProgress,
   TextField,
   Typography,
} from '@mui/material';
import { Client } from '../types/types';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import {
   deleteClient,
   getClient,
   postClient,
   updateClient,
} from '../services/client.service';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CO_PLACES } from '../constants/constants.ts';

export const ClientForm = () => {
   const [loading, setLoading] = useState<boolean>(true);
   const [originalClient, setOriginalClient] = useState<Client | null>(null);
   const [isEditing, setIsEditing] = useState<boolean>(false);
   const [isBtnValid, setIsBtnValid] = useState<boolean>(false);
   const [isSendingData, setIsSendingData] = useState<boolean>(false);
   const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
   // Form states
   const [name, setName] = useState<string>('');
   const [instagramAccount, setInstagramAccount] = useState<string>('');
   const [address, setAddress] = useState<string>('');
   const [phone, setPhone] = useState<string>('');
   // Departments and cities
   const [selectedDepartment, setSelectedDepartment] = useState<string>('');
   const [departmentInputValue, setDepartmentInputValue] = useState<string>('');
   const [citiesOptions, setCitiesOptions] = useState<string[]>([]);
   const [selectedCity, setSelectedCity] = useState<string>('');
   const [cityInputValue, setCityInputValue] = useState<string>('');

   const [searchParams] = useSearchParams();
   const id = searchParams.get('id');

   const navigate = useNavigate();

   const departmentOptions = CO_PLACES.map((place) => place.department);

   /**
    * Fetch client by id from API
    */
   useEffect(() => {
      if (!id) {
         setIsEditing(false);
         setLoading(false);
         return;
      }

      const fetchData = async () => {
         setLoading(true);
         setIsEditing(true);
         try {
            const data = await getClient(id);

            if (!data) {
               setIsEditing(false);
               setLoading(false);
               throw new Error('Client not found');
            }

            setIsEditing(true);
            setOriginalClient(data);
            setName(data.name);
            setInstagramAccount(data.instagram_account);
            setAddress(data.address);
            setSelectedDepartment(data.department);
            setSelectedCity(data.city);
            setPhone(data.phone.toString());
         } catch (e) {
            console.error(e);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, [id]);

   /**
    * Loads cities options based on selected department
    */
   useEffect(() => {
      if (!selectedDepartment) return;
      setSelectedCity('');

      const selectedDepartmentObj = CO_PLACES.find(
         (place) => place.department === selectedDepartment
      );

      if (!selectedDepartmentObj) {
         throw new Error('Department not found');
      }

      const options = selectedDepartmentObj.cities;
      setCitiesOptions(options);
      // In edit mode, set the original client city as selected
      setSelectedCity(selectedCity || options[0]);
   }, [selectedDepartment]);

   /**
    * Validate if all fields are filled
    */
   useEffect(() => {
      if (
         name.trim().length > 0 &&
         instagramAccount.trim().length > 0 &&
         address.trim().length > 0 &&
         phone.trim().length > 0 &&
         selectedDepartment.trim().length > 0 &&
         selectedCity.trim().length > 0
      ) {
         setIsBtnValid(true);
      } else {
         setIsBtnValid(false);
      }
   }, [
      name,
      instagramAccount,
      address,
      phone,
      selectedDepartment,
      selectedCity,
   ]);

   const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
   };

   const onChangeInstagramAccount = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      setInstagramAccount(e.target.value);
   };

   const onChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddress(e.target.value);
   };

   const onChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPhone(e.target.value);
   };

   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isBtnValid) return;

      // delete spaces and dashes
      const phoneNumber = phone.replace(/\s/g, '').replace(/-/g, '');

      const data: Client = {
         name,
         instagram_account: instagramAccount,
         address,
         phone: parseInt(phoneNumber),
         department: selectedDepartment,
         city: selectedCity,
      };

      try {
         setIsSendingData(true);
         if (isEditing && originalClient?._id) {
            await updateClient(originalClient?._id, data);
         } else {
            await postClient(data);
         }
         navigate('/dashboard/sale-form');
      } catch (e) {
         console.error(e);
      } finally {
         setIsSendingData(false);
      }
   };

   const onDeleteClient = async () => {
      if (!originalClient?._id) return;

      try {
         setIsSendingData(true);
         await deleteClient(originalClient._id);
         navigate('/dashboard/sale-form');
      } catch (e) {
         console.error(e);
      } finally {
         setIsSendingData(false);
         setShowDeleteModal(false);
      }
   };

   const onOpenDeleteModal = () => {
      setShowDeleteModal(true);
   };

   const onCloseDeleteModal = () => {
      setShowDeleteModal(false);
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
                  <Typography color='text.primary'>
                     {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
                  </Typography>
               </Breadcrumbs>
               <Box mt={4} />
               <Typography variant='h3'>
                  {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
               </Typography>
               <Box mt={6} />
               <Typography variant='h4'>Datos del cliente</Typography>
               <Box mt={1} />
               <Divider variant='fullWidth' />
               <Box mt={3} />
               {loading ? (
                  <LinearProgress />
               ) : (
                  <form onSubmit={onSubmit}>
                     <Box width={'100%'} maxWidth={'500px'}>
                        {isEditing && (
                           <Typography variant={'body1'}>
                              Editando el cliente: {originalClient?.name}
                           </Typography>
                        )}
                        <Box mt={3} />
                        <TextField
                           id='outlined-basic'
                           label='Nombre'
                           variant={'outlined'}
                           size={'small'}
                           value={name}
                           onChange={onChangeName}
                           fullWidth
                           required
                        />
                        <Box mt={2} />
                        <TextField
                           id='outlined-basic'
                           label='Cuenta de instagram'
                           variant={'outlined'}
                           size={'small'}
                           value={instagramAccount}
                           onChange={onChangeInstagramAccount}
                           fullWidth
                           required
                        />
                        <Box mt={2} />
                        <TextField
                           id='outlined-basic'
                           label='Dirección'
                           variant={'outlined'}
                           size={'small'}
                           value={address}
                           onChange={onChangeAddress}
                           fullWidth
                           required
                        />
                        <Box mt={2} />
                        <Autocomplete
                           disablePortal
                           disableClearable
                           id='combo-box-departments'
                           value={selectedDepartment}
                           onChange={(_: any, newValue: string) => {
                              setSelectedDepartment(newValue);
                           }}
                           inputValue={departmentInputValue}
                           onInputChange={(_, newInputValue) => {
                              setDepartmentInputValue(newInputValue);
                           }}
                           fullWidth
                           renderInput={(params) => (
                              <TextField {...params} label='Departamento' />
                           )}
                           size={'small'}
                           options={departmentOptions}
                        />
                        <Box mt={2} />
                        <Autocomplete
                           disablePortal
                           disableClearable
                           id='combo-box-cities'
                           value={selectedCity}
                           onChange={(_: any, newValue: string) => {
                              setSelectedCity(newValue);
                           }}
                           inputValue={cityInputValue}
                           onInputChange={(_, newInputValue) => {
                              setCityInputValue(newInputValue);
                           }}
                           fullWidth
                           renderInput={(params) => (
                              <TextField {...params} label='Ciudad' />
                           )}
                           size={'small'}
                           options={citiesOptions}
                        />
                        <Box mt={2} />

                        <TextField
                           id='outlined-basic'
                           label='Teléfono'
                           variant={'outlined'}
                           size={'small'}
                           value={phone}
                           type={'tel'}
                           onChange={onChangePhone}
                           fullWidth
                           required
                        />
                        <Box mt={3} />
                        {isSendingData ? (
                           <CircularProgress />
                        ) : (
                           <Button
                              variant='contained'
                              color={'primary'}
                              startIcon={<SendIcon />}
                              size={'medium'}
                              type={'submit'}
                              fullWidth
                              disabled={!isBtnValid}
                           >
                              {isEditing ? 'Editar' : 'Guardar'}
                           </Button>
                        )}
                        <Box mt={2} />
                        {isEditing && (
                           <Button
                              variant='contained'
                              color={'inherit'}
                              startIcon={<DeleteIcon />}
                              size={'medium'}
                              fullWidth
                              onClick={onOpenDeleteModal}
                           >
                              Eliminar
                           </Button>
                        )}
                     </Box>
                  </form>
               )}
               <Box mt={4} />
            </Container>
         </main>
         <Dialog open={showDeleteModal} onClose={onCloseDeleteModal}>
            <DialogTitle id='alert-dialog-title'>
               Borrar {originalClient?.name}
            </DialogTitle>
            <DialogContent>
               <DialogContentText id='alert-dialog-description'>
                  ¿Deseas borrar el cliente?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={onCloseDeleteModal}>Cancelar</Button>
               <Button onClick={onDeleteClient}>Borrar</Button>
            </DialogActions>
         </Dialog>
      </>
   );
};
