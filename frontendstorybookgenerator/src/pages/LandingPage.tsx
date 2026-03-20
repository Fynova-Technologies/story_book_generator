import React from 'react'
import HeroImage from '../assets/images/heroImg.png'

function LandingPage() {
  return (
   <div
      className='w-full bg-cover bg-center bg-no-repeat'
      style={{
        backgroundImage: `url(${HeroImage})`,
        aspectRatio: 'auto',        // keeps original ratio
        backgroundSize: 'cover',  // shows full image
        height: '100vh'             // or use natural image height
      }}
    >
    </div>
  )
}

export default LandingPage
