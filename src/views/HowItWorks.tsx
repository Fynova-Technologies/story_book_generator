import Navbar from "../components/Navbar/Navbar"
import HowItWorksSection from "../section/HowItWorksSection"
import Footer from "../components/Footer/Footer"

function HowItWorks() {
  return (
    <div>
      <Navbar bglight= {true}/>
      <div className='px-4 sm:px-10 lg:px-[100px] pt-24 md:pt-28 pb-10 md:pb-20'>
      <HowItWorksSection/>
      </div>
      <Footer/>
    </div>
  )
}

export default HowItWorks
