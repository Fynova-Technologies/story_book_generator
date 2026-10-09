import { Link, useParams } from 'react-router-dom';
import StoryFlipBook from '../components/StoryFlipBook/StoryFlipBook';
import { sampleStories } from '../Data/sampleStories';

// A demo book anyone can read, served from public/samples (no account, no Supabase).
const SampleBookPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const story = sampleStories.find(s => s.slug === slug);
  if (!story) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-heading text-3xl font-bold text-light-text">Sample not found</h1>
        <Link to="/samples" className="font-body text-sm font-semibold text-light-primary hover:underline">Back to samples</Link>
      </div>
    );
  }
  return <StoryFlipBook story={story} back={{ to: '/samples', label: 'Back to samples' }} />;
};

export default SampleBookPage;
