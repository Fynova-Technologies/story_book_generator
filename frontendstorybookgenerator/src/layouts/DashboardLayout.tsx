import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#F5F3EE]">
      <Sidebar />
      <main className="flex-1 pl-[300px]">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
