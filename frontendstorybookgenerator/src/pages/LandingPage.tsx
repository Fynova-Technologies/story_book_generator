import Footer from '../components/Footer/Footer'
import AdventureSection from '../section/AdventureSection'
import FAQSection from '../section/FAQSection'
import FeatureSection from '../section/FeatureSection'
import HeroSection from '../section/HeroSection'
import HowItWorks from '../section/HowItWorks'
import PricingSection from '../section/PricingSection'
import ReviewsSection from '../section/ReviewSection'

function LandingPage() {
  return (
    <div>
      <HeroSection/>
      <div className='bg-light-bg dark:bg-dark-bg p-10'>

      <HowItWorks/>
      </div>

      <div>
        <FeatureSection/>
      </div>
      <div className='bg-light-bg dark:bg-dark-bg p-10'>

      <ReviewsSection/>
      </div>
      <div>
      <AdventureSection/>
      </div>
      <div className='bg-light-bg dark:bg-dark-bg p-10'>

      <PricingSection/>
      </div>
      <div>
        <FAQSection/>
      </div>
      <Footer/>
    </div>
  )
}

export default LandingPage
