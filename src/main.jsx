import React, { Children } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Contac from './app/contac.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world! <a href='/contact/dodokjr'>Dodokjr</a></div>,
  },
  {
      path: "/contact/:id",
      element: <Contac/>
  },
  {
    path: "/contact/:id/:name",
    element: <App/>
  }
  
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
