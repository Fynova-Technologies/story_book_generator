import HeroSection from '../section/HeroSection'
import HowItWorks from '../section/HowItWorks'

function LandingPage() {
  return (
    <div>
      <HeroSection/>
      <div className='bg-light-bg dark:bg-dark-bg p-10'>

      <HowItWorks/>
      </div>
    </div>
  )
}

export default LandingPage
