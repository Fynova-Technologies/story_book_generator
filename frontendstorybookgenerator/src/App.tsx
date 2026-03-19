import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'

function App() {

  return (
    <BrowserRouter>
    <Navbar/>
      {/* <Signup/> */}
    </BrowserRouter>
    
  )
}

export default App
