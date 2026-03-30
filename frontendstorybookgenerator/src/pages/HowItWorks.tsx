import Navbar from "../components/Navbar/Navbar"
import HowItWorksSection from "../section/HowItWorksSection"
import Footer from "../components/Footer/Footer"

function HowItWorks() {
  return (
    <div>
      <Navbar bglight= {true}/>
      <div className='bg-light-bg px-25 pt-25'>
      <HowItWorksSection/>
      </div>
      <Footer/>
    </div>
  )
}

export default HowItWorks
