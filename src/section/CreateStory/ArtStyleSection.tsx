import { useEffect, useState } from "react";
import ArtStyleCard from "../../components/ArtStyleCard/ArtStyleCard";
import watercolorImg from "../../assets/images/artstyle/Watercolor.png"
import animeImg from "../../assets/images/artstyle/anime.png"
import clay3dImg from "../../assets/images/artstyle/3D.png"
import ghibliImg from "../../assets/images/artstyle/Ghibli.png"
import photorealisticImg from "../../assets/images/artstyle/Realistic.png"
import { useDispatch, useSelector } from "react-redux";
import { setArtStyle } from "../../store/slices/storyWizardSlice";
import { RootState } from "../../store/store";



const artStyles = [
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Soft, blended colors perfect for dreamy and emotional stories. Creates a classic storybook feel.",
    image: watercolorImg, 
  },
  {
    id: "clay3d",
    name: "3D",
    description: "Soft, blended colors perfect for dreamy and emotional stories. Creates a classic storybook feel.",
    image: clay3dImg, 
  },
  {
    id: "anime",
    name: "Anime",
    description: "Soft, blended colors perfect for dreamy and emotional stories. Creates a classic storybook feel.",
    image: animeImg, 
  },
  {
    id: "ghibli",
    name: "Ghibli",
    description: "Soft, blended colors perfect for dreamy and emotional stories. Creates a classic storybook feel.",
   image: ghibliImg, 
  },
  {
    id: "photorealistic",
    name: "Photorealistic",
    description: "Soft, blended colors perfect for dreamy and emotional stories. Creates a classic storybook feel.",
    image: photorealisticImg,
  },
];
interface props{
  onValidChange:(valid:boolean)=>void;
}
const ArtStyleSection = ( { onValidChange }: props) => {
  const dispatch = useDispatch();
  const storedArtStyle = useSelector((state: RootState) => state.story?.artStyle || "");
  
  

  // ✅ Selected art style stored in state - initialize from Redux
  const [selectedArtStyle, setSelectedArtStyle] = useState<string | null>(null);

  // Initialize from Redux on mount
  useEffect(() => {
    if (storedArtStyle) {
      const matchingStyle = artStyles.find(style => style.name === storedArtStyle);
      if (matchingStyle) {
        setSelectedArtStyle(matchingStyle.id);
      }
    }
  }, [storedArtStyle]);

  const handleSelect = (styleId: string, styleName: string) => {
    // ✅ Store selected art style
    setSelectedArtStyle(styleId);

    // ✅ Dispatch to Redux
    dispatch(setArtStyle(styleName));

    console.log("Selected art style:", styleName);
    
  };
  useEffect(() => {
    onValidChange(selectedArtStyle !== null);
  }, [selectedArtStyle, onValidChange]);

  return (
    <div className="bg-light-on-primary dark:bg-dark-bg rounded-3xl p-6 md:p-8  border-light-outline-secondary dark:border-dark-primary-30">

      {/* ── HEADING ── */}
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-2">
          Choose Art Style
        </h2>
        <p className="font-body text-sm text-light-outline dark:text-dark-text">
          Select the visual style for your storybook illustrations.
        </p>
      </div>

      {/* ✅ Selected art style display */}
      {selectedArtStyle && (
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-primary-10 dark:bg-dark-primary-10 border border-dark-primary-30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary dark:text-dark-primary">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span className="font-body text-sm font-semibold text-light-primary dark:text-dark-primary">
              {artStyles.find((s) => s.id === selectedArtStyle)?.name} selected
            </span>
          </div>
        </div>
      )}

      {/* ── ART STYLE GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {artStyles.map((style) => (
          <ArtStyleCard
            key={style.id}
            name={style.name}
            description={style.description}
            image={style.image}
            isSelected={selectedArtStyle === style.id}
            onSelect={() => handleSelect(style.id, style.name)}
          />
        ))}
      </div>

    </div>
  );
};

export default ArtStyleSection;
