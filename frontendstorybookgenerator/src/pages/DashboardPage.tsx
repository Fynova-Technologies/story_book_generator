import { useState } from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import Collection from './Collection';
import TemplateSection from '../section/Template/TemplateSection';
import FeatureSection from '../section/FeatureSection';
import VideoSection from '../section/Dashboard/VideoSection';
import DashboardSection from '../section/Dashboard/DashboardSection';

type Section = "Dashboard" | "My Collection" | "Templates" | "Sample Gallery" | "How it Works";
function DashboardPage() {
    const [activeSection, setActiveSection] = useState<Section>("Dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "Dashboard":
        return <DashboardSection />;
      case "My Collection":
        return <Collection/>;
      case "Templates":
        return <TemplateSection/>;
      case "Sample Gallery":
        return <FeatureSection/>;
      case "How it Works":
        return <VideoSection/>;
      default:
        return <DashboardSection />;
    }
  };
  return (
    <div>
    {/* Left Sidebar */}
      <Sidebar />
      
          {/* ── RIGHT — Active Section ── */}
          <div className="flex-1 w-full">
            {renderSection()}
          </div>
    </div>
  )
}

export default DashboardPage
