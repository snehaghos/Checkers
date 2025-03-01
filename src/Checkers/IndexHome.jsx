import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Wave from "react-wavify";

const IndexHome = () => {
  const navigate = useNavigate();
  const [waveOptions, setWaveOptions] = useState({
    height: 50,
    amplitude: 30,
    speed: 0.2,
    points: 4,
  });
  const [flick, setFlick] = useState(false); 

  const handleWaveClick = () => {
    setFlick(true); 
    setWaveOptions({
      height: 80,
      amplitude: 80,
      speed: 0.6,
      points: 6,
    });

    // Reset after 500ms
    setTimeout(() => {
      setWaveOptions({
        height: 50,
        amplitude: 30,
        speed: 0.2,
        points: 4,
      });
      setFlick(false);
    }, 500);
  };

  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/checkers.jpg')" }}>
      <motion.div
        className="absolute bottom-0 left-0 w-full cursor-pointer"
        onClick={handleWaveClick}
        animate={{ scale: flick ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        {/* Background Wave */}
        <Wave fill="rgba(255, 255, 255, 0.15)" paused={false} options={waveOptions} className="blur-md" />

        {/* Foreground Wave */}
        <Wave
          fill="rgba(255, 255, 255, 0.3)"
          paused={false}
          options={{ ...waveOptions, speed: waveOptions.speed + 0.1 }}
          className="absolute bottom-0 left-0 w-full"
        />
      </motion.div>

      {/* Game Title & Buttons */}
      <motion.div
        className="text-6xl font-extrabold font-luckiestGuy text-white cursor-pointer drop-shadow-2xl flex justify-center flex-col gap-6 items-center h-[100vh] relative md:text-6xl sm:text-4xl xs:text-2xl"
        initial={{ opacity: 0, y: "-100vh" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 70, duration: 3.5 }}
      >
        Checkers
        <div className="flex gap-4 flex-wrap justify-center">
          <div
            className="text-white text-2xl font-bold text-center flex gap-3 justify-center items-center cursor-pointer drop-shadow-2xl bg-gray-100/40 p-4 rounded-md md:text-xl sm:text-lg xs:text-base"
            onClick={() => navigate("/vsOne")}
          >
            <img src="/images/vspeople.png" alt="" className="h-10 w-10 md:h-8 md:w-8 sm:h-6 sm:w-6 xs:h-5 xs:w-5" />
            <div>One</div>
          </div>

          <div
            className="text-white text-2xl font-bold text-center flex gap-3 justify-center items-center cursor-pointer drop-shadow-2xl bg-gray-100/40 p-4 rounded-md md:text-xl sm:text-lg xs:text-base"
            onClick={() => navigate("/vsComp")}
          >
            <img src="/images/vscom.png" alt="" className="h-10 w-10 md:h-8 md:w-8 sm:h-6 sm:w-6 xs:h-5 xs:w-5" />
            <div>Vs Computer</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IndexHome;