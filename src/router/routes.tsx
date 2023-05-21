import { createBrowserRouter } from 'react-router-dom';
import { Home } from '../views/Home.tsx';
import { Dashboard } from '../views/Dashboard.tsx';
import { ErrorPage } from '../views/ErrorPage.tsx';
import { Layout } from '../views/Layout.tsx';
import { SaleForm } from '../views/SaleForm.tsx';
import { ClientForm } from '../views/ClientForm.tsx';
import { ItemForm } from '../views/ItemForm.tsx';

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
         {
            path: '/dashboard/client-form',
            element: <ClientForm />,
         },
         {
            path: '/dashboard/item-form',
            element: <ItemForm />,
         },
      ],
   },
]);
