import { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";

export default function Hero() {
  const [vantaEffect, setVantaEffect] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: heroRef.current,
          THREE: THREE,
          color: 0x7f00ff,
          backgroundColor: 0x060818,
          points: 8.0,
          maxDistance: 22.0,
          spacing: 18.0,
          showDots: true,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

return (
<div
  ref={heroRef}
  className="w-full min-h-[100vh] flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-16 gap-8 lg:gap-10 relative overflow-hidden"
>
  {/* LEFT TEXT */}
  <div className="max-w-2xl text-left z-10 mt-16 lg:mt-0">
    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight">
      Learn Any <br />
      Language With{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        AI
      </span>
    </h1>

    <p className="text-gray-300 text-base sm:text-lg mt-4 sm:mt-6">
      22 Indian Languages • Real-Time Voice Feedback • AI Pronunciation Scoring
    </p>

    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 sm:mt-10">
      <button className="bg-gradient-to-r from-blue-400 to-purple-500 px-8 py-3 rounded-full text-white font-semibold hover:scale-105 transition">
        Start Learning →
      </button>

      <button className="px-8 py-3 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition">
        Explore Features →
      </button>
    </div>
  </div>

  {/* RIGHT SIDE CARD */}
  <div className="flex-1 flex justify-center lg:justify-end items-center w-full lg:w-auto mt-8 lg:mt-0">
    <div className="bg-[#0C0F1D]/90 backdrop-blur-xl border border-white/5 rounded-2xl px-6 py-6 sm:px-8 sm:py-6 shadow-xl w-full max-w-sm lg:w-[480px]">

      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 
            flex items-center justify-center shadow-lg">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white" opacity="0.9">
            <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
            <path d="M4 20a8 8 0 0116 0" opacity="0.2" />
          </svg>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white">
            Pronunciation Analysis
          </h3>
          <p className="text-green-400 text-sm">
            98% Accuracy Match
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
            style={{ width: "98%" }}
          ></div>
        </div>
      </div>

    </div>
  </div>
</div>


);

}
