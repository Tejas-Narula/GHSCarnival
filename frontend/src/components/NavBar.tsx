import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaCrown,
  FaChartBar,
  FaFileAlt,
  FaUsers,
} from "react-icons/fa";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-screen bg-white border-t py-[10px] md:py-[16px] lg:py-[20px] z-50">
      <div className="flex justify-around text-[11px] md:text-[12px] lg:text-[14px] text-gray-500 px-[20px] md:px-[40px] lg:px-[80px] xl:px-[120px]">
        <NavItem
          icon={<FaHome />}
          label="Home"
          active={location.pathname === "/"}
          onClick={() => navigate("/")}
        />
        <NavItem
          icon={<FaInfoCircle />}
          label="About"
          active={location.pathname === "/about"}
          onClick={() => navigate("/about")}
        />
        <NavItem
          icon={<FaCrown />}
          label="Block Captains"
          active={location.pathname === "/hostel-blocks"}
          onClick={() => navigate("/hostel-blocks")}
        />
        <NavItem
          icon={<FaChartBar />}
          label="Live Scores"
          active={location.pathname === "/live-scores"}
          onClick={() => navigate("/live-scores")}
        />
        <NavItem
          icon={<FaFileAlt />}
          label="Guidelines"
          active={location.pathname === "/guidelines"}
          onClick={() => navigate("/guidelines")}
        />
        <NavItem
          icon={<FaUsers />}
          label="Dev Team"
          active={location.pathname === "/teams"}
          onClick={() => navigate("/teams")}
        />
      </div>
    </div>
  );
};

const NavItem = ({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center cursor-pointer transition-colors duration-200 ${
      active ? "text-[#FF8736]" : "text-gray-500 hover:text-[#FF8736]"
    }`}
  >
    <div className="text-[18px] md:text-[22px] lg:text-[26px]">{icon}</div>
    <span className="mt-[2px] md:mt-[4px]">{label}</span>
  </div>
);

export default NavBar;
