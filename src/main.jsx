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
import NotFound from './app/notFound.jsx';
import NoInternetConnection from './app/noInternetConnection.jsx';
import { ProjectParams } from './app/paramsApps/projectParams.jsx';

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
  {
    path: "/project/:id",
    element: <ProjectParams/>
},
  {
    path: "*",
    element: <NotFound/>
  },
  
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NoInternetConnection>
    <RouterProvider router={router} />
    </NoInternetConnection>
  </React.StrictMode>,
)
