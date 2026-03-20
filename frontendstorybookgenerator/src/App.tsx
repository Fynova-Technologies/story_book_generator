import './App.css'
import Signup from './pages/Signup'
import { BrowserRouter, Outlet } from 'react-router-dom'
import HeroSection from './section/HeroSection'
import HowItWorks from './section/HowItWorks'
import LandingPage from './pages/LandingPage'

function App() {
  

  return (
   <div>
      {/* <main>
        <Outlet/>
      </main> */}
      {/* <HeroSection/> */}
      {/* <HowItWorks/> */}
      <LandingPage/>
   </div>
    
  )
}

export default App
