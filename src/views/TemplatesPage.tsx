import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import TemplateHero from "../section/Template/TemplateHero";
import TemplateSection from "../section/Template/TemplateSection";
import Footer from "../components/Footer/Footer";



const TemplatesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen overflow-x-hidden">

      
      <Navbar />

      {/* ── HERO SECTION ── */}
      <div >
        <TemplateHero onSearch={setSearchQuery} />
      </div>

      {/* ── FEATURED TEMPLATES ── */}
      <TemplateSection searchQuery={searchQuery} />

      <Footer />

    </div>
  );
};

export default TemplatesPage;
