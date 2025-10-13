import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Sparkle, Rocket } from "phosphor-react";
import citySkyline from "@/assets/city-skyline.jpg";

gsap.registerPlugin(ScrollTrigger);

// Custom Typing Effect Hook
const useTypingEffect = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};

// Typing Text Component
const TypingText = ({
  children,
  className = "",
  speed = 100,
  delay = 0,
}: {
  children: string;
  className?: string;
  speed?: number;
  delay?: number;
}) => {
  const [startTyping, setStartTyping] = useState(false);
  const { displayText, isComplete } = useTypingEffect(
    startTyping ? children : "",
    speed
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartTyping(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span className={className}>
      {displayText}
      {!isComplete && startTyping && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="inline-block"
        >
          |
        </motion.span>
      )}
    </span>
  );
};

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to features section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      const offsetTop = featuresSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={heroRef}
      id="home" // Added ID for navigation
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* City Background */}
      <div
        ref={cityRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${citySkyline})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background"></div>
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        <div className="absolute inset-0 particles opacity-20"></div>
      </div>

      {/* Hero Content */}
      <div
        ref={contentRef}
        className="relative z-10 container mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center space-x-2 glass-card px-4 py-2 mb-8 floating"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Sparkle size={16} className="text-primary" weight="fill" />
          <span className="text-sm text-foreground/80">
            Powered by Advanced AI Technology
          </span>
        </motion.div>

        {/* Main Headline with Typing Effect */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <TypingText className="holographic" speed={150} delay={1000}>
            AI-Powered
          </TypingText>
          <br />
          <TypingText className="text-foreground" speed={120} delay={2500}>
            Billboard Revolution
          </TypingText>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-3xl mx-auto leading-relaxed"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Transform your advertising with intelligent ad creation,
          geo-targeting, and real-time campaign optimization powered by
          cutting-edge AI.
        </motion.p>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mb-10"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {[
            { label: "AI Campaigns Created", value: "50K+" },
            { label: "Average ROI Increase", value: "340%" },
            { label: "Global Locations", value: "180+" },
          ].map((stat, index) => (
            <div key={index} className="text-center floating">
              <div className="text-2xl md:text-3xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-sm text-foreground/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <motion.button
            className="neon-btn group relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center space-x-2">
              <Rocket size={20} weight="fill" />
              <span>Start Free Trial</span>
            </span>
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </motion.button>

          {/* Scroll Indicator - Enhanced with click functionality */}
          <motion.button
            onClick={scrollToFeatures}
            className="flex flex-col items-center space-y-2 mx-4 cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xs text-foreground/50 uppercase tracking-wide group-hover:text-primary/70 transition-colors duration-300">
              Scroll to explore
            </span>
            <motion.div
              className="w-px h-8 bg-gradient-to-b from-primary to-transparent group-hover:from-primary/80 transition-colors duration-300"
              animate={{ scaleY: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.button>

          <motion.button
            className="glass-card px-8 py-4 text-foreground hover:bg-white/10 transition-all duration-300 rounded-full group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center space-x-2">
              <Play size={20} weight="fill" className="text-primary" />
              <span>Watch Demo</span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
