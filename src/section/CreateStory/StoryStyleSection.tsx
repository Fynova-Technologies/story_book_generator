import { useEffect, useState } from 'react';
import StyleCard from '../../components/StyleCard/StyleCard';
const storybook = "/assets/images/storystyle/storybook.png";
const manga = "/assets/images/storystyle/manga.png";
const comic = "/assets/images/storystyle/comic.png";
import { useDispatch, useSelector } from 'react-redux';
import { setStoryStyle } from '../../store/slices/storyWizardSlice';
import { RootState } from '../../store/store';
import StepPanel, { SelectedPill } from './StepPanel';

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
const StoryStyleSection = ({ onValidChange }: { onValidChange: (valid: boolean) => void }) => {
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
    }
  };

  useEffect(() => {
    onValidChange?.(selectedStyleId !== null);
  }, [selectedStyleId, onValidChange]);

  return (
    <StepPanel
      centered
      title="Choose Your Story Style"
      subtitle="Select how you want your story to look and feel"
      aside={selectedStyleId && <SelectedPill label={storystyles.find((s) => s.id === selectedStyleId)?.name ?? ""} />}
    >

      {/* ── STORY STYLE GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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

    </StepPanel>
  );
};

export default StoryStyleSection;
