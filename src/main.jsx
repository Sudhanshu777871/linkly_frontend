import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './components/screens/Layout.jsx'
import Home from './components/screens/Home.jsx'
import Default from './components/screens/Default.jsx'
import Track from './components/screens/Track.jsx'
import Login from './components/screens/Login.jsx'
import Signup from './components/screens/Signup.jsx'
import Manage from './components/screens/Manage.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home />} />
      <Route path='/track' element={< Track />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/manage' element={<Manage />} />
      <Route path='*' element={< Default />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
