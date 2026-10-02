import Footer from '../components/Footer/Footer'
import Navbar from '../components/Navbar/Navbar'
import PricingSection from '../section/PricingSection'

function PricingPage() {
  return (
    <div>
      <Navbar bglight= {true}/>
      <div className='px-4 sm:px-10 lg:px-[100px] pt-24 md:pt-28 pb-10 md:pb-20'>
      <PricingSection/>
      </div>
      <Footer/>
    </div>
  )
}

export default PricingPage
