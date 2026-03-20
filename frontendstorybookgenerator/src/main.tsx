import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {
        path:'/',
        element:<LandingPage/>
      },
      {
        path:'/signup',
        element:<Signup/>
      },
      {
        path:'/login',
        element:<Login/>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <RouterProvider router={router}/>
  </StrictMode>,
)
