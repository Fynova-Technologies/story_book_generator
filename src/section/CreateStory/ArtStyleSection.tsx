import { useEffect, useState } from "react";
import ArtStyleCard from "../../components/ArtStyleCard/ArtStyleCard";
const watercolorImg = "/assets/images/artstyle/Watercolor.png";
const animeImg = "/assets/images/artstyle/anime.png";
const clay3dImg = "/assets/images/artstyle/3D.png";
const ghibliImg = "/assets/images/artstyle/Ghibli.png";
const photorealisticImg = "/assets/images/artstyle/Realistic.png";
import { useDispatch, useSelector } from "react-redux";
import { setArtStyle } from "../../store/slices/storyWizardSlice";
import { RootState } from "../../store/store";
import StepPanel, { SelectedPill } from "./StepPanel";



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
    description: "Rounded, sculpted characters with soft lighting, like a modern animated film.",
    image: clay3dImg, 
  },
  {
    id: "anime",
    name: "Anime",
    description: "Clean lines, big expressive eyes and bold colors in Japanese animation style.",
    image: animeImg, 
  },
  {
    id: "ghibli",
    name: "Ghibli",
    description: "Hand-painted, warm and whimsical scenes with lush, detailed backgrounds.",
   image: ghibliImg, 
  },
  {
    id: "photorealistic",
    name: "Photorealistic",
    description: "Lifelike images with natural light and detail, like real photographs.",
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
  };
  useEffect(() => {
    onValidChange(selectedArtStyle !== null);
  }, [selectedArtStyle, onValidChange]);

  return (
    <StepPanel
      centered
      title="Choose Art Style"
      subtitle="Select the visual style for your storybook illustrations."
      aside={selectedArtStyle && <SelectedPill label={artStyles.find((s) => s.id === selectedArtStyle)?.name ?? ""} />}
    >

      {/* ── ART STYLE GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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

    </StepPanel>
  );
};

export default ArtStyleSection;
