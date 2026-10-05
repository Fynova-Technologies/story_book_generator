import { useEffect, useRef, useState } from "react";
import ImageUploadCard from "../../components/ImageUploadCard/ImageUploadCard";
import StepPanel from "./StepPanel";
import { useDispatch, useSelector } from "react-redux";
import { setImages, StoryImage } from "../../store/slices/storyWizardSlice";
import { RootState } from "../../store/store";

const MAX_PHOTOS = 5;
const MIN_PHOTOS = 1;

interface props{
  onValidChange:(valid:boolean)=>void;
}
const UploadPhotoSection = ({
  onValidChange,
}:props) => {
  const dispatch = useDispatch();
  const storedImages = useSelector((state: RootState) => state.story?.images || []);

  const [photos, setPhotos] = useState<StoryImage[]>(
    Array(MAX_PHOTOS).fill(null).map(() => ({ image: null, description: "", characterName: "" }))
  );
  const [sizes, setSizes] = useState<number[]>(Array(MAX_PHOTOS).fill(0));
  const hasInitializedFromRedux = useRef(false);

  // Initialize from Redux on mount only once
  useEffect(() => {
    if (!hasInitializedFromRedux.current && storedImages.length > 0) {
      const initializedPhotos = Array(MAX_PHOTOS).fill(null).map((_, index) => {
        const stored = storedImages[index];
        return stored
          ? { ...stored, characterName: stored.characterName || "" }
          : { image: null, description: "", characterName: "" };
      });
      setPhotos(initializedPhotos);
      hasInitializedFromRedux.current = true;
    }
  }, [storedImages]);

  const totalSize = sizes.reduce((sum, s) => sum + s, 0);

  const handleImageUpload = (index: number, image: string) => {
    setPhotos((prev) =>
      // A new image replaces the uploaded one, so it needs uploading again.
      prev.map((p, i) => (i === index ? { ...p, image, path: undefined } : p))
    );
  };

  const handleRemove = (index: number) => {
    setPhotos((prev) =>
      prev.map((p, i) => (i === index ? { image: null, description: "", characterName: "" } : p))
    );
    setSizes((prev) => prev.map((s, i) => (i === index ? 0 : s)));
  };

  const handleDescriptionChange = (index: number, description: string) => {
    setPhotos((prev) =>
      prev.map((p, i) => (i === index ? { ...p, description } : p))
    );
  };

  const handleNameChange = (index: number, characterName: string) => {
    setPhotos((prev) =>
      prev.map((p, i) => (i === index ? { ...p, characterName } : p))
    );
  };

  // Names typed on other cards, offered as suggestions so several photos of one person match exactly.
  const knownNames = [...new Set(photos.map((p) => p.characterName.trim()).filter(Boolean))];

  const handleFileSizeChange = (index: number, size: number) => {
    setSizes((prev) =>
      prev.map((s, i) => (i === index ? size : s))
    );
  };

  // send the data to the store and mark step as valid if minimum photos uploaded
  useEffect(() => {
    const uploaded = photos.filter((p) => p.image !== null);
    const hasMinPhotos = uploaded.length >= MIN_PHOTOS;
    const allNamed = uploaded.every((p) => p.characterName.trim());
    const isValid = hasMinPhotos && allNamed && totalSize <= 10;

    onValidChange(isValid);

    if (isValid) {
      dispatch(setImages(photos));
    }
  }, [photos, totalSize, dispatch, onValidChange]);


  const uploadedCount = photos.filter((p) => p.image !== null).length;
  const nextEmpty = photos.findIndex((p) => p.image === null);

  return (
    <StepPanel
      title="Gather Your Characters"
      subtitle="Upload up to 5 photos with one person in each, and say who is in every photo. Use the same name on several photos of one person, and the names you'll use in the story. Add a short note on who they are (age, what they love) and we'll answer some questions for you."
    >

      {/* ── UPLOADED PHOTOS HEADER ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="font-heading font-bold text-xl text-light-text">
          Uploaded Photos
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {/* show limit exceed */}
          {totalSize > 10 && (
            <div role="alert" className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 flex-shrink-0">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="font-body text-xs font-bold text-red-700">
                10MB limit exceeded
              </p>
            </div>
          )}
          <span className={`font-body text-xs font-bold px-3 py-1 rounded-full ${totalSize > 10 ? "bg-red-50 text-red-600" : "bg-white/60 text-light-outline"}`}>
            {totalSize.toFixed(1)} / 10 MB
          </span>
          <span className="font-body text-xs font-bold px-3 py-1 rounded-full bg-light-primary/10 text-light-primary">
            {uploadedCount} / {MAX_PHOTOS}
          </span>
        </div>
      </div>

      {/* ── PHOTO GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {photos.map((photo, index) => (
          <ImageUploadCard
            key={index}
            previewImage={photo.image}
            description={photo.description}
            onImageUpload={(image: string) => handleImageUpload(index, image)}
            onDescriptionChange={(desc: string) => handleDescriptionChange(index, desc)}
            characterName={photo.characterName}
            onNameChange={(name: string) => handleNameChange(index, name)}
            onRemove={() => handleRemove(index)}
            dimmed={nextEmpty !== -1 && index > nextEmpty}
            nameOptions={knownNames}
            onFileSizeChange={(size: number) => handleFileSizeChange(index, size)}
          />
        ))}
      </div>

      {/* ── PRO TIP ── */}
      <div className="mt-4 p-6 rounded-2xl border border-white bg-linear-to-b from-[#E0F2FE]/50 to-white shadow-sm">
        <div className="flex items-center gap-4">
          {/* Bulb Icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 shrink-0">
            <line x1="9" y1="18" x2="15" y2="18"/>
            <line x1="10" y1="22" x2="14" y2="22"/>
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
          </svg>
          <p className="font-heading text-lg font-bold text-light-text">
            Pro Tip for Magic Results
          </p>
        </div>
        <p className="font-body text-base text-light-outline mt-4 leading-relaxed">
          Clear, front-facing photos of one person with good lighting work best. Crop out other people, and avoid photos where faces are covered by sunglasses or masks.
        </p>
      </div>

    </StepPanel>
  );
};

export default UploadPhotoSection;
