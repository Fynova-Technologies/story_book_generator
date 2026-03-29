// ArtStyleCard.jsx
const ArtStyleCard = ({ 
    title, 
    description,
    image
}:any) => {
  return (
    <div className="mx-5 bg-light-bg rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 w-80 p-3 ">
      
      {/* Image Placeholder */}
      <div className=" bg-gray-700 flex items-center justify-center rounded-2xl">
        <span className="text-gray-400 text-sm"><img src={image} alt="image" className="rounded-2xl w-full h-full object-contain" /></span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-body text-light-text text-lg font-semibold mb-1">
          {title}
        </h3>
        <p className="font-body text-light-text text-sm">
          {description}
        </p>
      </div>

    </div>
  );
};

export default ArtStyleCard;