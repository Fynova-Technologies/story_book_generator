import ArtStyleCard from "../../components/ArtStyleCard/ArtStyleCard";
import Anime from "../../assets/images/artstyle/anime.png"

const ArtStyleSection = () => {
  const data = [
    { title: "Anime", description: "Japanese animation style",image:Anime },
    { title: "Realistic", description: "Highly detailed visuals",image:Anime },
    { title: "3D Render", description: "Modern 3D design",image:Anime },
    { title: "Pixel Art", description: "Retro game style",image:Anime },
    {
    title: "Cartoon",
    description: "Bright colors and simplified shapes for fun, playful visuals.",
    image:Anime
    },
    {
    title: "Fantasy",
    description: "Magical worlds with mythical creatures and imaginative environments.",
    image:Anime
    },
    {
    title: "Minimalist",
    description: "Clean and simple design with fewer details and lots of space.",
    image:Anime
    }
  ];

  return (
    <div className="bg-light-on-primary rounded-3xl p-10">
      
      {/* Container */}
      <div className="max-w-7xl mx-auto px-2">

        {/* Heading */}
        <div className="flex flex-col items-center">
        <h2 className="font-heading text-light-text text-3xl font-bold mb-2">
            Choose Art Styles
        </h2>
        <p className="text-light-text mb-6">
            Select the visual style for your storybook illustrations
        </p>
        </div>

        {/* Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 ">
          {data.map((item, index) => (
            <ArtStyleCard
              key={index}
              title={item.title}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default ArtStyleSection;