import Footer from '../components/Footer/Footer'
import AdventureSection from '../section/AdventureSection'
import FAQSection from '../section/FAQSection'
import FeatureSection from '../section/FeatureSection'
import HeroSection from '../section/HeroSection'
import HowItWorksSection from '../section/HowItWorksSection'
import PricingSection from '../section/PricingSection'
import ReviewsSection from '../section/ReviewSection'

// Every section sits on the paper background; the grey blocks are each section's own panel.
function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection/>
      <div className='px-4 sm:px-10 lg:px-20 py-10 md:py-20'>
        <HowItWorksSection/>
      </div>
      <FeatureSection/>
      <div className='px-4 sm:px-10 lg:px-20 py-10 md:py-20'>
        <ReviewsSection/>
      </div>
      <AdventureSection/>
      <div className='px-4 sm:px-10 lg:px-[100px] py-10 md:py-20'>
        <PricingSection/>
      </div>
      <FAQSection/>
      <Footer/>
    </div>
  )
}

export default LandingPage
