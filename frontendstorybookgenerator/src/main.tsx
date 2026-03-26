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
import DashboardLayout from './layouts/DashboardLayout.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Collection from './pages/Collection.tsx'
import VideoSection from './section/Dashboard/VideoSection.tsx'
import AccountNav from './components/AccountNav/AccountNav.tsx'
import AccountSettings from './pages/AccountSettings.tsx'

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
        path:'/dashboard',
        element:<DashboardLayout/>,
        children:[
          {
            path:"/dashboard",
            element:<Dashboard/>
          },
          {
            path:'/dashboard/collection',
            element:<Collection/>
          },
          {
            path:'/dashboard/videosection',
            element:<VideoSection/>
          },
        ]
      },
      {
        path:'/account',
        element:<AccountSettings/>
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
