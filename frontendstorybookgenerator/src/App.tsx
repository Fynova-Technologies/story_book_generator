import './App.css'
import Signup from './pages/Signup'
import { BrowserRouter } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
    {/* <Navbar/> */}
      <Signup/>
    </BrowserRouter>
    
  )
}

export default App
