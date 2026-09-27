import Navbar from "../components/Navbar/Navbar";
import TemplateHero from "../section/Template/TemplateHero";
import TemplateSection from "../section/Template/TemplateSection";
import Footer from "../components/Footer/Footer";



const TemplatesPage = () => {
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Handle search logic here
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">

      
      <Navbar />

      {/* ── HERO SECTION ── */}
      <div >
        <TemplateHero onSearch={handleSearch} />
      </div>

      {/* ── FEATURED TEMPLATES ── */}
      <TemplateSection />

      <Footer />

    </div>
  );
};

export default TemplatesPage;
