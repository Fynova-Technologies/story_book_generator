import './App.css'
import Signup from './pages/Signup'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'

function App() {

  return (
    <BrowserRouter>
    <Navbar/>
      <Signup/>
    </BrowserRouter>
    
  )
}

export default App
