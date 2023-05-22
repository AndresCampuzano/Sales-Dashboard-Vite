import { useContext } from 'react';
import { AuthContext } from '../context/authContext.tsx';
import { Navigate, Outlet } from 'react-router-dom';

export const Layout = () => {
   const { status, handleLogOut } = useContext(AuthContext);

   if (status === 'checking') {
      return (
         <>
            <p className='loading'>Checking credentials, wait a moment...</p>
         </>
      );
   }

   if (status === 'no-authenticated') return <Navigate to='/' />;

   return (
      <>
         <nav>
            <button onClick={handleLogOut}>Cerrar session</button>
         </nav>
         <Outlet />
      </>
   );
};
