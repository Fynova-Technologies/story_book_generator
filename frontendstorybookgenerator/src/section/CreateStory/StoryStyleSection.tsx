import { useEffect, useState } from 'react';
import StyleCard from '../../components/StyleCard/StyleCard';
import storybook from "../../assets/images/storystyle/storybook.png";
import manga from "../../assets/images/storystyle/manga.png";
import comic from "../../assets/images/storystyle/comic.png";
import { useDispatch, useSelector } from 'react-redux';
import { setStoryStyle } from '../../store/slices/storyWizardSlice';
import { RootState } from '../../store/store';

// ── Default styles data ────────────────────────────────────
const storystyles = [
  {
    id:           "storybook",
    name:         "Storybook",
    description:  "Soft illustrations with text below, classic children's feel",
    previewImage: storybook,
  },
  {
    id:           "manga",
    name:         "Manga",
    description:  "Black & white, expressive, Japanese-style panels",
    previewImage: manga,
  },
  {
    id:           "comic",
    name:         "Comic",
    description:  "Colorful panels with speech bubbles and bold outlines",
    previewImage: comic,
  },
];

// ── Section Component ──────────────────────────────────────
const StoryStyleSection = ({ onValidChange }: any) => {
  const dispatch = useDispatch();
  const storedStoryStyle = useSelector((state: RootState) => state.story?.storyStyle || "");
  
  // ✅ Selected story style stored in state - initialize from Redux
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);

  // Initialize from Redux on mount
  useEffect(() => {
    if (storedStoryStyle) {
      const matchingStyle = storystyles.find(style => style.name === storedStoryStyle);
      if (matchingStyle) {
        setSelectedStyleId(matchingStyle.id);
      }
    }
  }, [storedStoryStyle]);

  const handleSelect = (id: string) => {
    const style = storystyles.find(s => s.id === id);
    if (style) {
      // ✅ Store selected story style
      setSelectedStyleId(id);
      
      // ✅ Dispatch to Redux
      dispatch(setStoryStyle(style.name));
      
      console.log("Selected story style:", style.name);
    }
  };

  useEffect(() => {
    onValidChange?.(selectedStyleId !== null);
  }, [selectedStyleId, onValidChange]);

  return (
    <div className="bg-light-on-primary dark:bg-dark-bg rounded-3xl p-6 md:p-8  border-light-outline-secondary dark:border-dark-primary-30">

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-2">
          Choose Story Style
        </h2>
        <p className="font-body text-sm text-light-outline dark:text-dark-text">
          Select how you want your story to be presented.
        </p>
      </div>

      {/* ✅ Selected story style display */}
      {selectedStyleId && (
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-primary-10 dark:bg-dark-primary-10 border border-dark-primary-30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary dark:text-dark-primary">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span className="font-body text-sm font-semibold text-light-primary dark:text-dark-primary">
              {storystyles.find((s) => s.id === selectedStyleId)?.name} selected
            </span>
          </div>
        </div>
      )}

      {/* ── STORY STYLE GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {storystyles.map((style) => (
          <StyleCard
            key={style.id}
            id={style.id}
            name={style.name}
            description={style.description}
            previewImage={style.previewImage}
            isSelected={selectedStyleId === style.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

    </div>
  );
};

export default StoryStyleSection;
