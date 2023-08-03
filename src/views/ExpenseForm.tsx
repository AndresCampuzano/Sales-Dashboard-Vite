import { useState, useEffect } from 'react';
import {
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
   Breadcrumbs,
   FormLabel,
   RadioGroup,
   FormControlLabel,
   Radio,
   FormControl,
} from '@mui/material';
import { ExpenseInterface } from '../types/types';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
   deleteExpense,
   getExpense,
   postExpense,
   updateExpense,
} from '../services/expense.service.ts';
import { EXPENSES_TYPES } from '../constants/constants.ts';

export const ExpenseForm = () => {
   const [loading, setLoading] = useState<boolean>(true);
   const [originalExpense, setOriginalExpense] =
      useState<ExpenseInterface | null>(null);
   const [isEditing, setIsEditing] = useState<boolean>(false);
   const [isBtnValid, setIsBtnValid] = useState<boolean>(false);
   const [isSendingData, setIsSendingData] = useState<boolean>(false);
   const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
   // Form states
   const [name, setName] = useState<string>('');
   const [type, setType] = useState<string>('');
   const [description, setDescription] = useState<string>('');

   const [searchParams] = useSearchParams();
   const id = searchParams.get('id');

   const navigate = useNavigate();

   /**
    * Fetch expense by id from API
    */
   useEffect(() => {
      if (!id) {
         setIsEditing(false);
         setLoading(false);
         setType(EXPENSES_TYPES[0].value);
         return;
      }

      /**
       * Fetches the expense from the API if there is an id
       */
      const fetchData = async () => {
         setLoading(true);
         setIsEditing(true);
         try {
            const data = await getExpense(id);

            if (!data) {
               setIsEditing(false);
               setLoading(false);
               throw new Error('Expense not found');
            }

            setIsEditing(true);
            setOriginalExpense(data);
            setName(data.name);
            setType(data.type);
            setDescription(data?.description || '');
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
    */
   useEffect(() => {
      const validation: boolean =
         type.trim().length > 0 && type === 'other'
            ? name.trim().length > 0
            : true;

      setIsBtnValid(validation);
   }, [name, type]);

   const onChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
      setType(e.target.value);
   };

   const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
   };

   const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(e.target.value);
   };

   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isBtnValid) return;

      const data: ExpenseInterface = {
         name:
            type === 'other'
               ? name
               : (EXPENSES_TYPES.find((exp) => exp.value === type)
                    ?.label as string),
         type,
         description,
      };

      try {
         setIsSendingData(true);
         if (isEditing && originalExpense?._id) {
            await updateExpense(originalExpense?._id, data);
         } else {
            await postExpense(data);
         }
         navigate('/dashboard');
      } catch (e) {
         console.error(e);
      } finally {
         setIsSendingData(false);
      }
   };

   const onDeleteExpense = async () => {
      if (!originalExpense?._id) return;

      try {
         setIsSendingData(true);
         await deleteExpense(originalExpense._id);
         navigate('/dashboard');
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
                     {isEditing ? 'Editar Gasto' : 'Nuevo Gasto'}
                  </Typography>
               </Breadcrumbs>
               <Box mt={4} />
               <Typography variant='h3'>
                  {isEditing ? 'Editar Gasto' : 'Nuevo Gasto'}
               </Typography>
               <Box mt={6} />
               <Typography variant='h4'>Datos del gasto</Typography>
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
                              Editando el gasto: {originalExpense?.name}
                           </Typography>
                        )}
                        <Box mt={3} />
                        <FormControl>
                           <FormLabel id='radio-buttons-group-item-color'>
                              Tipo de gasto
                           </FormLabel>
                           <RadioGroup
                              aria-labelledby='radio-buttons-group-item-color'
                              name='color-item-group'
                              value={type}
                              onChange={onChangeType}
                           >
                              {EXPENSES_TYPES.map((expense) => (
                                 <FormControlLabel
                                    value={expense.value}
                                    control={<Radio />}
                                    label={expense.label}
                                    key={expense.value}
                                 />
                              ))}
                           </RadioGroup>
                        </FormControl>
                        <Box mt={2} />
                        {type === 'other' ? (
                           <>
                              <TextField
                                 id='outlined-basic-name'
                                 label='Tipo del gasto'
                                 variant={'outlined'}
                                 size={'small'}
                                 value={name}
                                 onChange={onChangeName}
                                 fullWidth
                                 required
                              />
                              <Box mt={2} />
                           </>
                        ) : null}
                        <TextField
                           id='outlined-basic-description'
                           label='Descripción (opcional)'
                           variant={'outlined'}
                           size={'small'}
                           value={description}
                           onChange={onChangeDescription}
                           fullWidth
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
               Borrar {originalExpense?.name}
            </DialogTitle>
            <DialogContent>
               <DialogContentText id='alert-dialog-description'>
                  ¿Deseas borrar el gasto?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={onCloseDeleteModal}>Cancelar</Button>
               <Button onClick={onDeleteExpense}>Borrar</Button>
            </DialogActions>
         </Dialog>
      </>
   );
};
