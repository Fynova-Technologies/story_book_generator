import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import Page404 from './pages/Page404.tsx'
import HowItWorks from './pages/HowItWorks.tsx'
import PricingPage from './pages/PricingPage.tsx'
import ContactusPage from './pages/ContactusPage.tsx'
import DashboardLayout from './layouts/DashboardLayout.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Collection from './pages/Collection.tsx'
import VideoSection from './section/Dashboard/VideoSection.tsx'
import SampleGallery from './pages/SampleGallery.tsx'
import AccountSettings from './pages/AccountSettings.tsx'
import CreateStory from './pages/CreateStory.tsx'
import TemplatesPage from './pages/TemplatesPage.tsx'
import TemplateSection from './section/Template/TemplateSection.tsx'
import FeatureSection from './section/FeatureSection.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import AuthLayout from './components/AuthLayout/AuthLayout.tsx'
import FeaturedStoryPage from './pages/FeaturedStoryPage.tsx'
import FlipBookPage from './pages/FlipBookPage.tsx'
// import { initAuthListener } from './firebase/authService.ts'
// import { setLoading } from './store/slices/authSlice.ts';


// initAuthListener();

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
     <RouterProvider router={router}/>
     </Provider>
  </StrictMode>
)
