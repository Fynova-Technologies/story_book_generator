import './App.css'
import Signup from './pages/Signup'
import { BrowserRouter, Outlet } from 'react-router-dom'
import HeroSection from './section/HeroSection'

function App() {
  

  return (
   <div>
      {/* <main>
        <Outlet/>
      </main> */}
      <HeroSection/>
   </div>
    
  )
}

export default App
