import { createBrowserRouter } from 'react-router-dom';
import { Home } from '../views/Home.tsx';
import { Dashboard } from '../views/Dashboard.tsx';
import { ErrorPage } from '../views/ErrorPage.tsx';
import { SaleForm } from '../views/SaleForm.tsx';
import { Layout } from '../views/Layout.tsx';

export const router = createBrowserRouter([
   {
      path: '/',
      element: <Home />,
      errorElement: <ErrorPage />,
   },
   {
      path: '/dashboard',
      element: <Layout />,
      children: [
         {
            path: '',
            element: <Dashboard />,
         },
         {
            path: '/dashboard/sale-form',
            element: <SaleForm />,
         },
      ],
   },
]);
