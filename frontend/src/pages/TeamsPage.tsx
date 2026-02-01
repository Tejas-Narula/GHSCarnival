import { useState } from "react";

import Header from "../components/TeamsPage/Header";
import bg from "../assets/TeamsPage/background.svg";


export default function TeamsPage() {
  return (
    <>
      <div data-page="teams" className="relative min-h-screen w-full overflow-hidden">
        {/* Background Layer */}
        <div
          className="fixed inset-0 -z-10 bg-no-repeat bg-center bg-cover"
          style={{ backgroundImage: `url(${bg})` }}
        />

        {/* Header - Absolute so it doesn't push the center content down */}
        <div className="absolute top-0 left-0 w-full p-6">
          <Header />
        </div>

        {/* Main Centering Container */}
        <div className="flex flex-col items-center justify-center min-h-screen p-3">
          <h2
            className="text-[36px] md:text-[80px] font-kdam text-center
              bg-gradient-to-r from-[#FFBE86] to-[#8D89FF]
              bg-clip-text text-transparent"
          >
            COMING SOON
          </h2>
        </div>
      </div>
    </>
  );
}