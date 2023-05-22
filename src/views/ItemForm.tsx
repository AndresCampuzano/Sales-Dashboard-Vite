import { useState, useEffect } from 'react';
import {
   Autocomplete,
   Avatar,
   Box,
   Button,
   CircularProgress,
   Container,
   Divider,
   LinearProgress,
   TextField,
   Typography,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   Alert,
   InputAdornment,
   Breadcrumbs,
} from '@mui/material';
import { Item } from '../types/types';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import {
   deleteItem,
   getItem,
   postItem,
   updateItem,
} from '../services/item.service';
import { compressImage } from '../utils/compressImage';
import { COLORS } from '../constants/constants';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

interface ColorOption {
   label: string;
}

export const ItemForm = () => {
   const [loading, setLoading] = useState<boolean>(true);
   const [originalItem, setOriginalItem] = useState<Item | null>(null);
   const [isEditing, setIsEditing] = useState<boolean>(false);
   const [isBtnValid, setIsBtnValid] = useState<boolean>(false);
   const [isSendingData, setIsSendingData] = useState<boolean>(false);
   const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
   // Form states
   const [name, setName] = useState<string>('');
   const [price, setPrice] = useState<number>(20000);
   const [image, setImage] = useState<string>('');
   const [availableColors, setAvailableColors] = useState<ColorOption[]>([]);

   const [searchParams] = useSearchParams();
   const id = searchParams.get('id');

   const navigate = useNavigate();

   /**
    * Fetch item by id from API
    */
   useEffect(() => {
      if (!id) {
         setIsEditing(false);
         setLoading(false);
         return;
      }

      /**
       * Fetches the item from the API if there is an id
       */
      const fetchData = async () => {
         setLoading(true);
         setIsEditing(true);
         try {
            const data = await getItem(id);

            if (!data) {
               setIsEditing(false);
               setLoading(false);
               throw new Error('Item not found');
            }

            setIsEditing(true);
            setOriginalItem(data);
            setName(data.name);
            setPrice(data.price);
            setImage(data.image);
            setAvailableColors(
               data.available_colors.map((x) => ({ label: x }))
            );
         } catch (e) {
            console.error(e);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, [id]);

   /**
    * Validate if all fields are filled
    * TODO: Finish other validations
    */
   useEffect(() => {
      const validation: boolean = name.trim().length > 0;

      setIsBtnValid(validation);
   }, [name]);

   const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
   };

   const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Sets the price to 0 if the input is empty
      if (e.target.value === '') {
         setPrice(0);
      } else {
         setPrice(parseInt(e.target.value));
      }
   };

   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isBtnValid) return;

      const data: Item = {
         name,
         price,
         image,
         available_colors: availableColors.map((x) => x.label),
      };

      try {
         setIsSendingData(true);
         if (isEditing && originalItem?._id) {
            await updateItem(originalItem?._id, data);
         } else {
            await postItem(data);
         }
         navigate('/dashboard/sale-form');
      } catch (e) {
         console.error(e);
      } finally {
         setIsSendingData(false);
      }
   };

   const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      try {
         const image = await compressImage(e.target.files[0]);
         setImage(image);
      } catch (e) {
         console.error(e);
      }
   };

   const onDeleteItem = async () => {
      if (!originalItem?._id) return;

      try {
         setIsSendingData(true);
         await deleteItem(originalItem._id);
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
                     {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                  </Typography>
               </Breadcrumbs>
               <Box mt={4} />
               <Typography variant='h3'>
                  {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
               </Typography>
               <Box mt={6} />
               <Typography variant='h4'>Datos del producto</Typography>
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
                              Editando el producto: {originalItem?.name}
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
                           label='Precio'
                           variant={'outlined'}
                           size={'small'}
                           value={price}
                           type={'number'}
                           onChange={onChangePrice}
                           fullWidth
                           required
                           InputProps={{
                              startAdornment: (
                                 <InputAdornment position='start'>
                                    $
                                 </InputAdornment>
                              ),
                           }}
                        />
                        <Box mt={2} />
                        <input
                           type='file'
                           accept='image/*'
                           onChange={onChangeImage}
                        />
                        <Box mt={2} />
                        {image && (
                           <Avatar
                              alt={name}
                              src={image}
                              sx={{ width: 100, height: 100 }}
                           />
                        )}
                        <Box mt={2} />
                        <Alert severity='info'>
                           Si el producto tiene multiples colores, por ejemplo,
                           Colibrí, carga una sola imagen y luego agrega los
                           colores del mismo.
                        </Alert>
                        <Box mt={2} />
                        <Autocomplete
                           multiple
                           id='colors-autocomplete'
                           options={COLORS.map((x) => ({ label: x.label }))}
                           getOptionLabel={(option) => option.label}
                           value={availableColors}
                           filterSelectedOptions
                           onChange={(_, value) => {
                              setAvailableColors(value);
                           }}
                           isOptionEqualToValue={(option, value) =>
                              option.label === value.label
                           }
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label='Colores disponibles'
                                 placeholder='Colores disponibles'
                              />
                           )}
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
               Borrar {originalItem?.name}
            </DialogTitle>
            <DialogContent>
               <DialogContentText id='alert-dialog-description'>
                  ¿Deseas borrar el producto?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={onCloseDeleteModal}>Cancelar</Button>
               <Button onClick={onDeleteItem}>Borrar</Button>
            </DialogActions>
         </Dialog>
      </>
   );
};
