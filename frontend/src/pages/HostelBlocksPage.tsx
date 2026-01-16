import { useState } from "react";
import NavBar from "../components/NavBar";

const blocks = [
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "B9",
  "B10",
  "B12",
];
const girlsBlocks = ["G1", "G2", "G3", "G4", "G5", "G6", "G7"];
const blockData: Record<string, { firstName: string; lastName: string }> = {
  B1: { firstName: "RANVEER ", lastName: "PILANIA" },
  B2: { firstName: "DEVRAJ", lastName: "RATHORE" },
  B3: { firstName: "YASHU", lastName: "PANDEY" },
  B4: { firstName: "DHRUV", lastName: "SINGH" },
  B5: { firstName: "HARSH VARDHAN", lastName: "SINGH" },
  B6: { firstName: "LUVYA", lastName: "SHETTY" },
  B7: { firstName: "ANANT", lastName: "SHRIVASTAVA" },
  B8: { firstName: "MIHIR", lastName: "KAPOOR" },
  B9: { firstName: "JAI", lastName: "DALAL" },
  B10: { firstName: "TARANG", lastName: "JOSHI" },
  B12: { firstName: "ADITYA", lastName: "RAWAT" },
};

const girlsBlockData: Record<string, { firstName: string; lastName: string }> =
  {
    G1: { firstName: "YASHI", lastName: "RAJ" },
    G2: { firstName: "RIYA", lastName: "RANJAN" },
    G3: { firstName: "SAMRIDDHI", lastName: "RANA" },
    G4: { firstName: "AKSHA", lastName: "ALI" },
    G5: { firstName: "SIA", lastName: "KAPILA" },
    G6: { firstName: "SHIFA", lastName: "KHAN" },
    G7: { firstName: "YUVIKA", lastName: "" },
  };

export default function HostelBlocksPage(): JSX.Element {
  const [openBlock, setOpenBlock] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<"boys" | "girls">(
    "boys"
  );

  return (
    <div className="relative h-[100dvh] overflow-hidden bg-[#f3efe9]">
      <img
        src="/Background.png"
        alt=""
        aria-hidden
        className="absolute top-0 left-0 w-full h-auto z-0"
      />
      <div className="absolute inset-0 bg-[#f3efe9]/70 z-0" />

      <div className="relative z-10 flex flex-col items-center pt-6 pb-4">
        <img
          src="/ghs_carnival_logo.png"
          alt="GHS Carnival"
          className="h-20 object-contain"
        />

        <p
          className="
            mt-2 mb-2 text-xl font-medium tracking-[0.3em] text-center
            bg-gradient-to-r from-[#e6b980] to-[#c78bf4]
            bg-clip-text text-transparent font-heading
          "
        >
          BLOCK CAPTAINS
        </p>
      </div>
      <div className="relative z-10 flex justify-center mb-6">
        <div className="relative flex items-center  bg-white/40 backdrop-blur-md
    border border-white/40
    shadow-[0_8px_24px_rgba(0,0,0,0.08)] rounded-full h-[44px] w-[220px] p-[3px]">
          <span
            className={`absolute left-[3px] top-[3px] h-[38px] w-[106px] rounded-full
        bg-[#3f352a]
        transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${selectedGender === "girls" ? "translate-x-[108px]" : ""}
      `}
          />

          <button
            onClick={() => {
              setSelectedGender("boys");
              setOpenBlock(null);
            }}
            className={`relative z-10 flex-1 h-full flex items-center justify-center
        text-sm tracking-wider font-heading transition-colors duration-300
        ${selectedGender === "boys" ? "text-[#f3efe9]" : "text-[#7a7267]"}
      `}
          >
            BOYS
          </button>

          <button
            onClick={() => {
              setSelectedGender("girls");
              setOpenBlock(null);
            }}
            className={`relative z-10 flex-1 h-full flex items-center justify-center
        text-sm tracking-wider font-heading transition-colors duration-300
        ${selectedGender === "girls" ? "text-[#f3efe9]" : "text-[#7a7267]"}
      `}
          >
            GIRLS
          </button>
        </div>
      </div>

      <div
        className="
          relative z-10
          h-[calc(100dvh-176px)]
          overflow-y-auto overscroll-contain
          px-4 pb-24
        "
      >
        <div className="max-w-[300px] mx-auto space-y-4">
          {(selectedGender === "boys" ? blocks : girlsBlocks).map(
            (block, index) => {
              const isOpen = openBlock === block;

              return (
                <div
                  key={block}
                  style={{
                    animation:
                      "fadeSlideIn 0.8s cubic-bezier(0.4,0,0.2,1) forwards",
                    animationDelay: `${index * 70}ms`,
                    opacity: 0,
                    ["--slide-from" as any]:
                      selectedGender === "girls" ? "-70px" : "70px",
                  }as React.CSSProperties}
                  className={`rounded-3xl min-h-[90px]
    transition-all duration-1000 ease-in-out
    ${isOpen ? "bg-[#fbf8f3] shadow-lg shadow-[#e7d4b1]/40" : "bg-[#e6e4de]"}`}
                >
                  <button
                    onClick={() => setOpenBlock(isOpen ? null : block)}
                    className="w-full flex justify-between px-4 py-3 text-left"
                  >
                    <span
                      className={`font-carnival transition-all duration-500 ease-in
                      ${
                        isOpen
                          ? "text-2xl text-[#3f352a] translate-y-3"
                          : "text-3xl font-medium text-[#7a7267] font-heading"
                      }`}
                    >
                      {block}
                    </span>

                    <span
                      className={`transition-transform duration-1000 text-[#7a7267]
                      ${isOpen ? "rotate-180" : ""}`}
                    >
                      ⌄
                    </span>
                  </button>

                  <div
                    className={`
    px-4 overflow-hidden transition-all duration-500 ease-in-out
    ${isOpen ? "max-h-40 opacity-100 pb-4" : "max-h-0 opacity-0 pb-0"}
  `}
                  >
                    <p className="font-body text-[18px] leading-tight text-[#d18b47]">
                      {selectedGender === "boys"
                        ? blockData[block].firstName
                        : girlsBlockData[block].firstName}
                    </p>
                    <p className="font-body text-[18px] leading-tight text-[#d18b47]">
                      {selectedGender === "boys"
                        ? blockData[block].lastName
                        : girlsBlockData[block].lastName}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
      <style>
        {`
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateX(var(--slide-from));
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
`}
      </style>

      <NavBar />
    </div>
  );
}
