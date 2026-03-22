import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import Page404 from './pages/Page404.tsx'
import FeatureSection from './section/FeatureSection.tsx'

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
        path:'/featuresection',
        element:<FeatureSection/>
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
