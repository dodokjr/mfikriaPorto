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
import Store from './app/Store.jsx'
import LoginForm from'./app/components/admin/LoginForm.jsx'
import Dashboard from'./app/components/admin/Dashboard.jsx'

const router = createBrowserRouter([
  { path: "/app", element: <App /> },
  { path: "/project", element: <ProjectApp /> },
  { path: "/project/:id", element: <ProjectParams /> },
  { path: "/blog", element: <Blog /> },
  { path: "/blog/:id", element: <BlogParams /> },
  { path: "/contact/:id", element: <Contac /> },
  { path: "/hobbies", element: <MyHobbies /> },
  { path: "/me", element: <Link /> },
  { path: "/store", element: <Store /> },
  { path: "/auth/ff/", element: <LoginForm /> },
  { path: "/auth/ff/Dashboard", element: <Dashboard /> },
  { path: "*", element: <NotFound /> }
])

ReactDOM.createRoot(document.getElementById('m00tyourPage')).render(
  <React.StrictMode>
    <NoInternetConnection>
      <RouterProvider router={router} />
    </NoInternetConnection>
  </React.StrictMode>
)