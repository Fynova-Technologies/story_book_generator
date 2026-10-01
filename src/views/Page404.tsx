import Navbar from '../components/Navbar/Navbar'
import { Link } from 'react-router-dom'
const NotFoundImage = "/assets/images/image404.png";
import Footer from '../components/Footer/Footer'

function Page404() {
  return (
    <div>
      <Navbar bglight={true} />
      <main className="flex flex-col items-center px-4 pt-28 md:pt-40 pb-20 text-center">
        <h1 className='font-heading text-3xl sm:text-4xl md:text-5xl md:leading-[58px] font-bold text-light-text max-w-[820px] mb-4'>
          Lost in the pages? Let’s guide you back to the story.
        </h1>
        <p className='font-body text-lg md:text-2xl text-light-outline'>
          Don't worry every great journey has a small detour.
        </p>
        <img
          src={NotFoundImage}
          alt="404 not found"
          className='w-full max-w-[760px] aspect-[960/560] object-cover my-8 md:my-12'
        />
        <Link
          to="/"
          className='bg-light-primary hover:opacity-90 text-light-on-primary font-body font-semibold text-base md:text-[17px] py-3.5 px-10 rounded-full transition-opacity'
        >
          Back to home
        </Link>
      </main>
      <Footer/>
    </div>
  )
}

export default Page404
