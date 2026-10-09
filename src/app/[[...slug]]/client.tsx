'use client'

import { StrictMode } from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import LandingPage from '../../views/LandingPage'
import Login from '../../views/Login'
import Signup from '../../views/Signup'
import Page404 from '../../views/Page404'
import HowItWorks from '../../views/HowItWorks'
import PricingPage from '../../views/PricingPage'
import ContactusPage from '../../views/ContactusPage'
import DashboardLayout from '../../layouts/DashboardLayout'
import Dashboard from '../../views/Dashboard'
import Collection from '../../views/Collection'
import VideoSection from '../../section/Dashboard/VideoSection'
import SampleGallery from '../../views/SampleGallery'
import AccountSettings from '../../views/AccountSettings'
import CreateStory from '../../views/CreateStory'
import TemplatesPage from '../../views/TemplatesPage'
import TemplateSection from '../../section/Template/TemplateSection'
import FeatureSection from '../../section/FeatureSection'
import { Provider } from 'react-redux'
import { store } from '../../store/store'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import FeaturedStoryPage from '../../views/FeaturedStoryPage'
import FlipBookPage from '../../views/FlipBookPage'
import SampleBookPage from '../../views/SampleBookPage'
import ResetPassword from '../../views/ResetPassword'
import { initAuthListener } from '../../services/authService'
// import { setLoading } from '../../store/slices/authSlice';


initAuthListener();

const router = createBrowserRouter([
      {
        path:'/',
        element:<LandingPage/>
      },
      {
        path:'/signup',
        element:(
          <AuthLayout authentication={false}>
            <Signup/>
          </AuthLayout>
                
        )
      },
      {
        path:'/login',
        element:(
          <AuthLayout authentication={false}>
            <Login/>
          </AuthLayout>
        )
      },
      {
        path:'/reset-password',
        element:<ResetPassword/>
      },
      {
        path:'/how-it-works',
        element:<HowItWorks/>
      },
      {
        path:'/templates',
        element:<TemplatesPage/>              
      },
      
      {
        path:'/pricing',
        element:<PricingPage/>
      },
      {
        path:'/samples',
        element:<SampleGallery/>
      },
      {
        path:'/samples/:slug',
        element:<SampleBookPage/>
      },
      {
        path:'/contact',
        element:<ContactusPage/>
      },
      {
        path:'/stories',
        element:<FeaturedStoryPage/>
      },
      {
        path:'/dashboard',
        element:(
          <AuthLayout authentication={true}>
            <DashboardLayout/>
          </AuthLayout>

        ),
        children:[
          {
            path:"/dashboard/",
            element:<Dashboard/>
          },
          {
            path:'/dashboard/collection',
            element:<Collection/>
          },
          {
            path:'/dashboard/templates',
            element:<TemplateSection inDashboard/>
          },
          {
            path:'/dashboard/how-it-works',
            element:<VideoSection/>
          },
          {
            path:'/dashboard/sample-gallery',
            element:<FeatureSection/>
          },
        ]
      },
      {
        path:'/account',
        element:(
          <AuthLayout authentication={true}>
            <AccountSettings/>
          </AuthLayout>
        )
      },
      {
        path:'/create-story',
        element:(
          <AuthLayout authentication={true}>
            <CreateStory/>
          </AuthLayout>

        )
      },
      {
        path:'/flipbook/:id',
        element:(
          <AuthLayout authentication={true}>
            <FlipBookPage/>
          </AuthLayout>
        )

      },
      {
        path:'*',
        element:<Page404/>
      },


])

export default function ClientApp() {
  return (
  <StrictMode>
    <Provider store={store}>
     <RouterProvider router={router}/>
     </Provider>
  </StrictMode>
)
}
