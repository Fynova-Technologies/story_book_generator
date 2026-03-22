import Navbar from '../components/Navbar/Navbar'
import { Link } from 'react-router-dom'
import NotFoundImage from '../assets/images/image404.png'

function Page404() {
  return (
    <div>
        <div>
        <Navbar page404={true} />
        </div>
      <div className="grid place-items-center min-h-screen">
        <div className="border border-black p-4">
        <div>
            <h1
                className='font-heading text-4xl font-bold text-center mb-4'
            >Lost in the Pages? Let's guide you <br/>back to the story.</h1>
            <p className='text-center font-body'>Don't worrry every great journey has a small detour.</p>
        </div>
        <div>
            {/* Fix width and height of div */}
            <div className='flex justify-center'>
            <div className='w-80 h-80 grid place-items-center'>
            <img
                src={NotFoundImage}
                alt="404 not found"
                className='w-full h-full object-contain'
            />
            </div>
            </div>
            <div className='flex justify-center'>
            <Link to="/" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                Return to Home
            </Link>
            </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Page404
