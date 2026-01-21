import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaInstagram,
  FaGlobe,
  FaClock,
  FaChartBar,
} from "react-icons/fa";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center bg-[#F3F3F3]">
      {/* ANIMATION KEYFRAMES - UPDATED TO PLAY ONCE */}
      <style>
        {`
          @keyframes floatOnce {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0px); opacity: 1; }
          }
          .animate-float-once {
            animation: floatOnce 1.2s ease-out forwards;
          }
        `}
      </style>

      {/* MOBILE/DESKTOP RESPONSIVE FRAME */}
      <div
        className="relative w-full max-w-[390px] md:max-w-[768px] lg:max-w-[1024px] min-h-screen overflow-y-auto bg-[#F3F3F3]"
        style={{
          backgroundImage: "url(/Background.png)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
        }}
      >
        {/* SOFT OVERLAY (reduced opacity) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/25 to-white/35 pointer-events-none" />

        {/* CONTENT */}
        <div className="relative z-10 px-[20px] md:px-[40px] lg:px-[60px] pt-[24px]">
          {/* LOGO + TAGLINE */}
          <div className="flex flex-col items-center mt-[24px]">
            <img
              src="/ghs_carnival_logo.png"
              alt="GHS Carnival Logo"
              className="h-[90px] md:h-[120px] lg:h-[140px] object-contain drop-shadow-md animate-float-once"
            />

            <h1
              className="text-[#232165] text-center font-medium mt-[10px] text-[20px] md:text-[24px] lg:text-[28px]"
              style={{
                fontFamily: "'Kdam Thmor Pro', sans-serif",
              }}
            >
              Games, Glory & Hostel Stories
            </h1>
          </div>

          {/* HERO IMAGE */}
          <div className="mt-[28px] flex justify-center">
            <img
              src="/ghs.png"
              alt="GHS Carnival"
              className="w-full max-w-[367px] md:max-w-[600px] lg:max-w-[800px] h-auto object-cover rounded-[22px] shadow-lg"
            />
          </div>

          {/* DOTS */}
          <div className="flex justify-center gap-[6px] mt-[10px]">
            <span className="w-[6px] h-[6px] rounded-full bg-[#FF8736]" />
            <span className="w-[6px] h-[6px] rounded-full bg-gray-300" />
            <span className="w-[6px] h-[6px] rounded-full bg-gray-300" />
          </div>

          {/* TITLE */}
          <h2
            className="mt-[18px] text-center text-[#FF8736] text-[26px] md:text-[32px] lg:text-[38px]"
            style={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          >
            The Annual Carnival
          </h2>

          {/* DESCRIPTION */}
          <p
            className="mt-[12px] text-center text-[14px] md:text-[16px] lg:text-[18px] leading-[22px] md:leading-[26px] lg:leading-[30px] text-[#2F2F2F] max-w-[700px] mx-auto"
            style={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          >
            Returning back in 2026, the annual GHS Carnival is better than ever,
            with jaw-dropping cultural performances and thrilling sporting events
            by our very own students.
          </p>

          {/* EVENT GALLERY */}
          <h3 className="mt-[28px] text-center text-[#FF8736] text-[26px] md:text-[32px] lg:text-[38px] font-semibold">
            Event Gallery
          </h3>

          <div className="mt-[14px] grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[10px] md:gap-[14px] lg:gap-[18px] max-w-[800px] mx-auto">
            <div className="h-[72px] md:h-[100px] lg:h-[120px] rounded-[12px] bg-gray-300" />
            <div className="h-[72px] md:h-[100px] lg:h-[120px] rounded-[12px] bg-gray-300" />
            <div className="h-[72px] md:h-[100px] lg:h-[120px] rounded-[12px] bg-gray-300" />
            <div className="h-[72px] md:h-[100px] lg:h-[120px] rounded-[12px] bg-gray-300 hidden md:block" />
            <div className="h-[72px] md:h-[100px] lg:h-[120px] rounded-[12px] bg-gray-300 hidden lg:block" />
            <div className="h-[72px] md:h-[100px] lg:h-[120px] rounded-[12px] bg-gray-300 hidden lg:block" />
          </div>

          {/* QUICK LINKS */}
          <div className="mt-[28px] mb-[100px] bg-white rounded-[20px] shadow-lg px-[18px] md:px-[24px] lg:px-[32px] py-[18px] md:py-[24px] max-w-[600px] mx-auto">
            <h4 className="text-[18px] md:text-[20px] lg:text-[22px] font-bold mb-[14px]">Quick Links</h4>

            <div className="space-y-[14px] md:space-y-[18px] text-[14px] md:text-[16px] font-semibold">
              <a
                href="https://www.instagram.com/ghs.carnival_muj/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[12px] hover:text-[#FF8736] transition-colors"
              >
                <FaInstagram className="text-[20px] md:text-[24px] text-pink-500" />
                <span>GHS Carnival’s Official Page</span>
              </a>

              <div
                onClick={() => navigate("/guidelines")}
                className="flex items-center gap-[12px] cursor-pointer hover:text-[#FF8736] transition-colors"
              >
                <FaGlobe className="text-[20px] md:text-[24px] text-blue-500" />
                <span>Guidelines / Rulebook</span>
              </div>

              <div
                onClick={() => navigate("/live-scores")}
                className="flex items-center gap-[12px] cursor-pointer hover:text-[#FF8736] transition-colors"
              >
                <FaClock className="text-[20px] md:text-[24px] text-yellow-500" />
                <span>Cultural Events Updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* FLOATING LIVE SCORES CAPSULE - RESPONSIVE POSITIONING */}
        <div
          onClick={() => navigate("/live-scores")}
          className="fixed bottom-[80px] left-1/2 -translate-x-1/2
                     md:bottom-[100px] lg:bottom-[120px]
                     px-[18px] md:px-[24px] lg:px-[32px] h-[48px] md:h-[56px] lg:h-[64px] rounded-full
                     bg-[#FF8736] text-white opacity-75 hover:opacity-100
                     flex items-center gap-[8px] md:gap-[12px]
                     shadow-lg cursor-pointer
                     active:scale-95 transition-all z-50"
        >
          <FaChartBar className="text-[18px] md:text-[22px] lg:text-[24px]" />
          <span className="text-[13px] md:text-[15px] lg:text-[17px] font-semibold">Live Score</span>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
