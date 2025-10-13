import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CursorEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [clickEffect, setClickEffect] = useState(false);

  useEffect(() => {
    console.log("CursorEffect mounting...");
    let timeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsMoving(false);
      }, 100);
    };

    const handleClick = () => {
      setClickEffect(true);
      setTimeout(() => setClickEffect(false), 300);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      console.log("CursorEffect cleanup...");
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
        }}
        animate={{
          scale: isMoving ? 1.2 : 1,
          rotate: isMoving ? 360 : 0,
        }}
        transition={{
          scale: { duration: 0.1 },
          rotate: { duration: 0.8, ease: "linear" }
        }}
      >
        <div className="relative w-8 h-8">
          {/* Lantern Core */}
          <div className="absolute inset-0 bg-primary rounded-full opacity-80"></div>
          
          {/* Glow Effect */}
          <div 
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
              filter: 'blur(4px)',
              transform: 'scale(2)',
            }}
          ></div>

          {/* Speed Trail */}
          {isMoving && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      </motion.div>

      {/* Click Effect */}
      {clickEffect && (
        <motion.div
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: mousePosition.x - 25,
            top: mousePosition.y - 25,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-12 border-2 border-primary rounded-full"></div>
        </motion.div>
      )}

      {/* Trailing Dots */}
      <motion.div
        className="fixed pointer-events-none z-[9997]"
        style={{
          left: mousePosition.x - 2,
          top: mousePosition.y - 2,
        }}
        animate={{
          scale: isMoving ? [1, 1.5, 1] : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-1 h-1 bg-primary/60 rounded-full"></div>
      </motion.div>

      <motion.div
        className="fixed pointer-events-none z-[9996]"
        style={{
          left: mousePosition.x - 1,
          top: mousePosition.y - 1,
        }}
        animate={{
          scale: isMoving ? [1, 1.2, 1] : 0.8,
        }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div className="w-0.5 h-0.5 bg-primary/40 rounded-full"></div>
      </motion.div>
    </>
  );
};

export default CursorEffect;