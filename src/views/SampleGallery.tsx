import Footer from '../components/Footer/Footer'
import Navbar from '../components/Navbar/Navbar'
import FeatureSection from '../section/FeatureSection'

function SampleGallery() {
  return (
    <div>
      <Navbar bglight= {true}/>
      <div className='pt-16'>
      <FeatureSection/>
      </div>
      <Footer/>
    </div>
  )
}

export default SampleGallery
