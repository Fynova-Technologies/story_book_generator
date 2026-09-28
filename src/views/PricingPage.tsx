import Footer from '../components/Footer/Footer'
import Navbar from '../components/Navbar/Navbar'
import PricingSection from '../section/PricingSection'
import PricingTableSection from '../section/PricingTableSection'

function PricingPage() {
  return (
    <div>
      <Navbar bglight= {true}/>
      <div className='bg-light-bg px-25 pt-25'>
      <PricingSection/>
      </div>
      <PricingTableSection/>
      <Footer/>
    </div>
  )
}

export default PricingPage
