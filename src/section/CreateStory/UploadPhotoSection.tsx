import { useEffect, useRef, useState } from "react";
import PhotoRow, { PhotoDropzone, PickedPhoto } from "../../components/PhotoRow/PhotoRow";
import StepPanel from "./StepPanel";
import { useDispatch, useSelector } from "react-redux";
import { setImages, StoryImage } from "../../store/slices/storyWizardSlice";
import { RootState } from "../../store/store";
import { formatBytes, MAX_TOTAL_BYTES } from "../../lib/compressPhoto";
import { CUSTOM_ROLES, templateFlow } from "../../Data/templateParts";

const MAX_PHOTOS = 5;
const TIPS = ["One person per photo", "Face clearly visible", "Good light, no sunglasses or masks"];

interface props{
  onValidChange:(valid:boolean)=>void;
}
const UploadPhotoSection = ({
  onValidChange,
}:props) => {
  const dispatch = useDispatch();
  const storedImages = useSelector((state: RootState) => state.story?.images || []);
  const template = useSelector((state: RootState) => state.story?.template);
  const roles = template ? templateFlow(template).roles : CUSTOM_ROLES;

  // Only photos that exist; a restored draft may arrive after mount, so take it once when it does.
  const [photos, setPhotos] = useState<StoryImage[]>([]);
  const hasInitializedFromRedux = useRef(false);
  useEffect(() => {
    if (!hasInitializedFromRedux.current && storedImages.length > 0) {
      setPhotos(storedImages.filter((p) => p.image));
      hasInitializedFromRedux.current = true;
    }
  }, [storedImages]);

  const totalSize = photos.reduce((sum, p) => sum + (p.size || 0), 0);
  const overLimit = totalSize > MAX_TOTAL_BYTES;

  const addPhotos = (picked: PickedPhoto[]) => {
    hasInitializedFromRedux.current = true;
    setPhotos((prev) => [...prev, ...picked.map((p) => ({ ...p, description: "", characterName: "" }))].slice(0, MAX_PHOTOS));
  };

  const update = (index: number, change: Partial<StoryImage>) => setPhotos((prev) => {
    // A new image needs uploading again; a role belongs to the person, so every photo of them gets it.
    const name = prev[index].characterName.trim();
    return prev.map((p, i) => {
      if (i === index) return { ...p, ...change, ...("image" in change && { path: undefined }) };
      if ("role" in change && name && p.characterName.trim() === name) return { ...p, role: change.role };
      return p;
    });
  });

  // Names typed on other photos, offered as suggestions so several photos of one person match exactly.
  const knownNames = [...new Set(photos.map((p) => p.characterName.trim()).filter(Boolean))];

  // send the data to the store and mark step as valid once every photo is named
  useEffect(() => {
    const isValid = photos.length > 0 && photos.every((p) => p.characterName.trim()) && !overLimit;
    onValidChange(isValid);
    if (isValid) dispatch(setImages(photos));
  }, [photos, overLimit, dispatch, onValidChange]);

  return (
    <StepPanel
      narrow
      title="Gather Your Heroes"
      subtitle="Add a photo of each person, one per photo, up to 5. Reuse a name to give someone more than one look."
    >
      <ul className="-mt-4 md:-mt-6 mb-6 flex flex-wrap gap-2.5" aria-label="Photo tips">
        {TIPS.map((tip) => (
          <li key={tip} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0]/90 shadow-sm font-body text-[13px] text-[#334155]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1B874B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
            {tip}
          </li>
        ))}
      </ul>

      {overLimit && (
        <p role="alert" className="mb-4 px-4 py-2.5 rounded-2xl bg-red-50 border border-red-200 font-body text-sm font-semibold text-red-700">
          These photos come to {formatBytes(totalSize)}, over the {formatBytes(MAX_TOTAL_BYTES)} limit. Remove or replace one to continue.
        </p>
      )}

      {photos.length === 0 ? (
        <PhotoDropzone slots={MAX_PHOTOS} onPhotos={addPhotos} />
      ) : (
        <div className="flex flex-col gap-6">
          {photos.map((photo, index) => (
            <PhotoRow
              key={photo.path || photo.image!.slice(-40)}
              image={photo.image!}
              characterName={photo.characterName}
              description={photo.description}
              role={photo.role}
              roles={roles}
              nameOptions={knownNames}
              onChange={(change) => update(index, change)}
              onRemove={() => setPhotos((prev) => prev.filter((_, i) => i !== index))}
            />
          ))}
          {photos.length < MAX_PHOTOS && <PhotoDropzone compact slots={MAX_PHOTOS - photos.length} onPhotos={addPhotos} />}
        </div>
      )}
    </StepPanel>
  );
};

export default UploadPhotoSection;
