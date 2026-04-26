import { useEffect, useState } from "react";
import ImageUploadCard from "../../components/ImageUploadCard/ImageUploadCard";
import { useDispatch, useSelector } from "react-redux";
import { setImages } from "../../store/slices/storyWizardSlice";
import { RootState } from "../../store/store";

const MAX_PHOTOS = 5;
const MIN_PHOTOS = 5;

interface props{
  onValidChange:(valid:boolean)=>void;
}
const UploadPhotoSection = ({
  onValidChange,
}:props) => {
  const dispatch = useDispatch();
  const storedImages = useSelector((state: RootState) => state.story?.images || []);

  const [photos, setPhotos] = useState<{ image: string | null; description: string }[]>(
    Array(MAX_PHOTOS).fill(null).map(() => ({ image: null, description: "" }))
  );
  const [sizes, setSizes] = useState<number[]>(Array(MAX_PHOTOS).fill(0));

  // Initialize from Redux on mount
  useEffect(() => {
    if (storedImages.length > 0) {
      const initializedPhotos = Array(MAX_PHOTOS).fill(null).map((_, index) => {
        const stored = storedImages[index];
        return stored ? { image: stored.image, description: stored.description } : { image: null, description: "" };
      });
      setPhotos(initializedPhotos);
    }
  }, [storedImages]);

  // const uploadedCount = photos.filter((p) => p.image !== null).length;
  const totalSize = sizes.reduce((sum, s) => sum + s, 0);

  const handleImageUpload = (index: number, image: string) => {
    setPhotos((prev) =>
      prev.map((p, i) => (i === index ? { ...p, image } : p))
    );
  };

  const handleDescriptionChange = (index: number, description: string) => {
    setPhotos((prev) =>
      prev.map((p, i) => (i === index ? { ...p, description } : p))
    );
  };

  const handleFileSizeChange = (index: number, size: number) => {
    setSizes((prev) =>
      prev.map((s, i) => (i === index ? size : s))
    );
  };

  // send the data to the store and mark step as valid if minimum photos uploaded
  useEffect(() => {
  if(photos.filter(p=>p.image !== null).length >= MIN_PHOTOS){
    if(totalSize <= 10){
    dispatch(setImages(photos));
    onValidChange(true);
    }
  }else{
    onValidChange(false);
  }
},[photos]);

  // console.log(photos);
  

  return (
    <div className="bg-light-on-primary dark:bg-dark-bg rounded-3xl p-2 md:p-8  border-light-outline-secondary dark:border-dark-primary-30">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="font-heading text-3xl font-bold text-light-text dark:text-dark-text">
            Gather Your Heroes
          </h2>
          <p className="font-body text-sm text-light-outline dark:text-dark-text mt-1.5">
            Upload 5-10 photos of the main character. Add a small description to help our AI create magic.
          </p>
        </div>

        {/* Draft saved badge */}
        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full  border-light-outline-secondary dark:border-dark-primary-30 bg-light-bg dark:bg-dark-primary-10 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="font-body text-xs text-light-primary dark:text-dark-text">
            Draft saved automatically
          </span>
        </div>
      </div>

      {/* ── UPLOADED PHOTOS HEADER ── */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <h3 className="font-heading font-bold text-base text-light-text dark:text-dark-text">
          Uploaded Photos
        </h3>
        {/* show limit exceed */}
        {totalSize > 10 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 flex-shrink-0">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="font-body text-sm font-medium text-red-700 dark:text-red-400">
              10MB Limit Exceeded
            </p>
          </div>
        )}
        
        <span className={`font-body text-sm font-semibold opacity-60 bg-light-bg dark:bg-dark-primary-10 px-3 py-1 rounded-full border ${totalSize > 10 ? 'text-red-600 dark:text-red-400 border-red-300 dark:border-red-700' : 'text-light-outline dark:text-dark-text border-light-outline-secondary dark:border-dark-primary-30'}`}>
          {totalSize.toFixed(1)} / 10 MB
        </span>
      </div>

      {/* ── PHOTO GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo, index) => (
          <ImageUploadCard
            key={index}
            previewImage={photo.image}
            description={photo.description}
            onImageUpload={(image: string) => handleImageUpload(index, image)}
            onDescriptionChange={(desc: string) => handleDescriptionChange(index, desc)}
            onFileSizeChange={(size: number) => handleFileSizeChange(index, size)}
          />
        ))}
      </div>

      {/* ── PRO TIP ── */}
      <div className="mt-6 p-4 rounded-2xl bg-dark-primary-10 dark:bg-dark-primary-10 border border-dark-primary-30 flex items-start gap-3">
        {/* Bulb Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary dark:text-dark-primary">
            <line x1="9" y1="18" x2="15" y2="18"/>
            <line x1="10" y1="22" x2="14" y2="22"/>
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
          </svg>
        </div>
        <div>
          <p className="font-heading text-sm font-semibold text-light-text dark:text-dark-text">
            Pro Tip for Magic Results
          </p>
          <p className="font-body text-sm text-light-outline dark:text-dark-text opacity-70 mt-0.5 leading-relaxed">
            Clear, front-facing photos with good lighting work best. Avoid photos where faces are covered by sunglasses or masks.
          </p>
        </div>
      </div>

    </div>
  );
};

export default UploadPhotoSection;
