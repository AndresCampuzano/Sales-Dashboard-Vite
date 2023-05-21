import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext.tsx';
import { useNavigate } from 'react-router-dom';

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
         <h1>HOME</h1>
         <form className='loginForm' onSubmit={handleSubmit}>
            <input
               placeholder='email'
               type='email'
               onChange={(e) => setEmail(e.target.value)}
               required={true}
            ></input>
            <input
               placeholder='password'
               type='password'
               onChange={(e) => setPassword(e.target.value)}
               required={true}
            ></input>
            <button type={'submit'}>Login</button>
         </form>
      </>
   );
};
