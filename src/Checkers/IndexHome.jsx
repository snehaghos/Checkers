import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';



const IndexHome = () => {
    const gameStartRef = useRef(null);
  
    const navigate=useNavigate();
    const homeStyle = {
      backgroundImage: "url('/images/checkers.jpg')",
      height: "100vh",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
  };
  
  const flyInAnimation = {
      initial: { y: '-100vh', opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { type: 'spring', stiffness: 70, duration: 3.5 },
  };
  
  return (
      <div style={homeStyle}>
          <motion.div
              className="text-8xl font-extrabold font-luckiestGuy text-white cursor-pointer drop-shadow-2xl flex justify-center flex-col gap-6 items-center h-[100vh] "
              initial="initial"
              animate="animate"
              variants={flyInAnimation}
          >
              Checkers
              <div className='flex gap-4'>
                  <div 
                      className='text-white text-2xl font-bold text-center cursor-pointer drop-shadow-2xl bg-gray-100/40 p-4 rounded-md' 
                      onClick={() => navigate('/vsOne')}>
                      One vs One
                  </div>
                  <div 
                      className='text-white text-2xl font-bold text-center cursor-pointer drop-shadow-2xl bg-gray-100/40 p-4 rounded-md' 
                      onClick={() => navigate('/vsComp')}>
                      Vs Computer
                  </div>
              </div>
          </motion.div>
      </div>
  
  );
};

export default IndexHome;
