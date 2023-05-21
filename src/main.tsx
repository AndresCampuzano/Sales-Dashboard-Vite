import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    RouterProvider,
} from "react-router-dom";
import {router} from "./router/routes";
import './index.css'
import {AuthProvider} from "./context/authContext.tsx";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <AuthProvider>
          <RouterProvider router={router} />
      </AuthProvider>
  </React.StrictMode>,
)
