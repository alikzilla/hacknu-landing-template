import { motion } from "framer-motion";
import { IconContext } from "phosphor-react";
import { useEffect, useState } from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient?: string;
  delay?: number;
}

const FeatureCard = ({
  icon,
  title,
  description,
  gradient = "from-primary/20 to-accent/20",
  delay = 0,
}: FeatureCardProps) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const getIconSize = () => {
    if (isMobile) return 20;
    if (isDesktop) return 32;
    return 24;
  };

  const getHoverScale = () => {
    if (isMobile) return 1.01;
    if (isDesktop) return 1.02;
    return 1.015;
  };

  const getHoverY = () => {
    if (isMobile) return -3;
    if (isDesktop) return -10;
    return -5;
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={
        isDesktop
          ? {
              y: getHoverY(),
              scale: getHoverScale(),
            }
          : {}
      }
      className="group relative w-full h-full"
    >
      <div className="glass-card p-4 sm:p-5 lg:p-8 h-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl feature-card">
        {/* Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
        ></div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 glow-effect"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            className="icon-container w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-primary/10 flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden"
            whileHover={
              isDesktop
                ? {
                    rotate: [0, -10, 10, 0],
                    scale: 1.2,
                  }
                : isMobile
                ? {}
                : {
                    rotate: [0, -5, 5, 0],
                    scale: 1.1,
                  }
            }
            transition={{
              rotate: { duration: 0.5 },
              scale: { duration: 0.3 },
            }}
          >
            {/* Icon glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-primary/20 rounded-xl icon-glow"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <IconContext.Provider
              value={{
                size: getIconSize(),
                weight: "duotone",
              }}
            >
              <motion.div
                className="text-primary group-hover:text-white transition-colors duration-300 relative z-10 icon-rotate"
                animate={{
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {icon}
              </motion.div>
            </IconContext.Provider>
          </motion.div>

          {/* Title */}
          <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-foreground mb-2 sm:mb-3 lg:mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
            {title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm lg:text-base text-foreground/70 leading-relaxed group-hover:text-foreground/90 transition-colors duration-300 line-clamp-4">
            {description}
          </p>

          {/* Hover Line */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 lg:h-1 bg-gradient-primary rounded-full hover-line"
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Corner Decoration */}
        <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 corner-dot-1"></div>
        <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-2 sm:left-3 lg:left-4 w-0.5 h-0.5 sm:w-1 sm:h-1 lg:w-1 lg:h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 corner-dot-2"></div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
