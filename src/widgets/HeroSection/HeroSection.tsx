import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Sparkle, Rocket } from "phosphor-react";

gsap.registerPlugin(ScrollTrigger);

// Кастомный хук печати
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

// Компонент печатаемого текста
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

  // Плавный скролл к блоку фич
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      const offsetTop = featuresSection.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="w-full container lg:px-20 px-6 relative min-h-screen flex items-center justify-center overflow-hidden pt-[100px]"
    >
      {/* Фон города */}
      <div ref={cityRef} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background"></div>
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        <div className="absolute inset-0 particles opacity-20"></div>
      </div>

      {/* Контент */}
      <div
        ref={contentRef}
        className="relative z-10 container mx-auto px-6 text-center"
      >
        {/* Бейдж */}
        <motion.div
          className="inline-flex items-center space-x-2 glass-card px-4 py-2 mb-8 floating"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Sparkle size={16} className="text-primary" weight="fill" />
          <span className="text-sm text-foreground/80">На базе Halal AI</span>
        </motion.div>

        {/* Заголовок с печатью */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <TypingText className="holographic" speed={150} delay={1000}>
            Халяльный ИИ
          </TypingText>
          <br />
          <TypingText className="text-foreground" speed={120} delay={2500}>
            финансовый помощник
          </TypingText>
        </motion.h1>

        {/* Подзаголовок */}
        <motion.p
          className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-3xl mx-auto leading-relaxed"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Понятные шариат-совместимые планы без рибы: копим на квартиру/авто,
          ведём бюджет, получаем ежедневные шаги и прозрачные вехи на пути к
          цели.
        </motion.p>

        {/* Статы (примерные) */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mb-10"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {[
            { label: "Сгенерировано планов", value: "25K+" },
            { label: "Средний рост сбережений", value: "↑ 28%" },
            { label: "Регионов обслуживания", value: "20+" },
          ].map((stat, index) => (
            <div key={index} className="text-center floating">
              <div className="text-2xl md:text-3xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-sm text-foreground/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA-кнопки */}
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
              <span>Начать бесплатно</span>
            </span>
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </motion.button>

          {/* Индикатор скролла */}
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
              Листайте ниже
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
              <span>Смотреть демо</span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
