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
import MyHobbies from './app/myHobbies.jsx';
import Link from './app/link.jsx';
import CvPdf from "./assets/documents/cv.pdf"

const router = createBrowserRouter([
  {
    path: "/app",
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
    path: "/blog/:id",
    element: <BlogParams/>
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
  path: "/hobbies",
  element: <MyHobbies />
},
{
  path: "/fkri__17",
  element: <Link/>
},
  {
    path: "*",
    element: <NotFound/>
  },
  
]);

ReactDOM.createRoot(document.getElementById('m00tyourPage')).render(
  <React.StrictMode>
    <NoInternetConnection>
    <RouterProvider router={router} />
    </NoInternetConnection>
  </React.StrictMode>,

)
