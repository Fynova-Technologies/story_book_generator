import StoryFlipBook from '../components/StoryFlipBook/StoryFlipBook';
import { useSelector } from 'react-redux';

const FlipBookPage = () => {
    const story = useSelector((state: any) => state.generatedStory.story);
    if (!story) return <p>Loading...</p>;
  return (
    <div className='bg-light-bg'>
      <StoryFlipBook story={story}/>
    </div>
  )
}

export default FlipBookPage
