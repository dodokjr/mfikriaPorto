import React, { Children } from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.jsx'
import './assets/index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Contac from './app/contac.jsx';
import ProjectApp from './app/projectApp.jsx';
import Blog from './app/blog.jsx';
import BlogParams from './app/paramsApps/blogParams.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/project",
    element: <ProjectApp/>
  },
  {
    path: "/blog",
    element: <Blog/>
  },
  {
      path: "/contact/:id",
      element: <Contac/>
  },
  
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
