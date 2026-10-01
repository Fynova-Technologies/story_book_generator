import StyleCard from "../StyleCard/StyleCard";

// Same Figma card as the story style step, with the art style's 4:3 image.
const ArtStyleCard = ({ name, description, image, isSelected, onSelect }: {
  name: string;
  description: string;
  image: string;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <StyleCard
    name={name}
    description={description}
    previewImage={image}
    isSelected={isSelected}
    onSelect={onSelect}
    imageAspect="aspect-[4/3]"
  />
);

export default ArtStyleCard;
