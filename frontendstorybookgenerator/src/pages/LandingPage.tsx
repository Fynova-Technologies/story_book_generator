import ReviewCard from '../components/ReviewCard/ReviewCard'
import FeatureSection from '../section/FeatureSection'
import HeroSection from '../section/HeroSection'
import HowItWorks from '../section/HowItWorks'
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
    </div>
  )
}

export default LandingPage
