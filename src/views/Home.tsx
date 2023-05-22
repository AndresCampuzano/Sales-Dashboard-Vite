import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export const Home = () => {
   const { handleLoginWithEmail } = useContext(AuthContext);
   const { status, userId, handleLogOut } = useContext(AuthContext);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const navigate = useNavigate();

   // If user is authenticated, sends to /dashboard, otherwise sends to /
   useEffect(() => {
      if (status === 'authenticated') {
         navigate('/dashboard');
      }
   }, [navigate, status]);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
         await handleLoginWithEmail(email, password);
      } catch (error) {
         console.error(error);
      }
   };

   if (status === 'checking') {
      return (
         <>
            <p className='loading'>Checking credentials, wait a moment...</p>
         </>
      );
   }

   if (status === 'authenticated') {
      return (
         <>
            <h1>HOME</h1>
            <h5>
               Your ID is: <span>{userId}</span>
            </h5>
            <button onClick={handleLogOut}>Logout</button>
         </>
      );
   }

   return (
      <>
         <Container>
            <Box mt={12} />
            <Typography variant='h3'>Iniciar Sesión</Typography>
            <Box mt={6} />
            <form className='loginForm' onSubmit={handleSubmit}>
               <Box width={'100%'} maxWidth={'500px'}>
                  <TextField
                     id='email'
                     label='Email'
                     variant={'outlined'}
                     size={'small'}
                     type={'email'}
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     fullWidth
                     required
                  />
                  <Box mt={2} />
                  <TextField
                     id='password'
                     label='Contraseña'
                     variant={'outlined'}
                     size={'small'}
                     type={'password'}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     fullWidth
                     required
                  />
                  <Box mt={3} />
                  <Button
                     variant='contained'
                     color={'primary'}
                     startIcon={<SendIcon />}
                     size={'medium'}
                     type={'submit'}
                     disabled={
                        email.trim().length === 0 ||
                        password.trim().length === 0
                     }
                  >
                     Ingresar
                  </Button>
               </Box>
            </form>
         </Container>
      </>
   );
};
