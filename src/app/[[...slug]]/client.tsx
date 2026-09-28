'use client'

import { StrictMode } from 'react'
import App from '../../App'
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
import { initAuthListener } from '../../firebase/authService'
// import { setLoading } from '../../store/slices/authSlice';


initAuthListener();

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
        path:'/how-it-works',
        element:(
          <AuthLayout authentication={false}>
            <HowItWorks/>
          </AuthLayout>
        )
      },
      {
        path:'/templates',
        element:(
          <AuthLayout authentication={false}>
              <TemplatesPage/>
          </AuthLayout>)              
      },
      
      {
        path:'/pricing',
        element:(
          <AuthLayout authentication={false}>
        <PricingPage/>
        </AuthLayout>

        )
      },
      {
        path:'/samples',
        element:(
          <AuthLayout authentication={false}>
            <SampleGallery/>
          </AuthLayout>

        )
      },
      {
        path:'/contact',
        element:(
          <AuthLayout authentication={false}>
        <ContactusPage/>
        </AuthLayout>

        )
      },
      {
        path:'/stories',
        element:(
          <AuthLayout authentication={false}>
            <FeaturedStoryPage/>
          </AuthLayout>
        )
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
            element:(
              <AuthLayout authentication={true}>
              <Dashboard/>
              </AuthLayout>

            )
          },
          {
            path:'/dashboard/collection',
            element:<Collection/>
          },
          {
            path:'/dashboard/templates',
            element:<TemplateSection/>
          },
          {
            path:'/dashboard/videosection',
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
        path:'/flipbook',
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
