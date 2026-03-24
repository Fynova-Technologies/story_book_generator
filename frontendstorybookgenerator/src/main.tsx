import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import Page404 from './pages/Page404.tsx'
import HowItWorks from './section/HowItWorks.tsx'
import PricingPage from './pages/PricingPage.tsx'
import ContactusPage from './pages/ContactusPage.tsx'

const router = createBrowserRouter([
      {
        path:'/',
        element:<App/>,
      },
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
      },
      {
        path:'/how-it-works',
        element:<HowItWorks/>
      },
      
      {
        path:'/pricing',
        element:<PricingPage/>
      },
      {
        path:'/contact',
        element:<ContactusPage/>
      },
      {
        path:'*',
        element:<Page404/>
      }


])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <RouterProvider router={router}/>
  </StrictMode>,
)
