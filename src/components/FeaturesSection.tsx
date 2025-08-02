import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Brain,
  Target,
  MapPin,
  ChartLine,
  Palette,
  Lightning,
  Robot,
  Globe,
} from "phosphor-react";

gsap.registerPlugin(ScrollTrigger);

// ✅ FeatureCard component definition since it's imported
const FeatureCard = ({
  icon,
  title,
  description,
  gradient,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}) => (
  <motion.div
    className={`glass-card p-6 h-full rounded-2xl bg-gradient-to-br ${gradient}`}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.05, y: -5 }} // ✅ Zoom + Lift
  >
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 flex items-center justify-center">{icon}</div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
    </div>
    <p className="text-foreground/70 leading-relaxed">{description}</p>
  </motion.div>
);

const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.children;
      if (cards && cards.length > 0) {
        // Responsive card dimensions
        const getCardWidth = (): number => {
          if (window.innerWidth < 640) return 280; // Mobile
          if (window.innerWidth < 1024) return 320; // Tablet
          return 380; // Desktop
        };

        const getGap = (): number => {
          if (window.innerWidth < 640) return 16; // Mobile
          if (window.innerWidth < 1024) return 24; // Tablet
          return 32; // Desktop
        };

        const cardWidth = getCardWidth();
        const gap = getGap();
        const totalWidth = (cardWidth + gap) * cards.length;
        const scrollDistance = Math.max(
          0,
          totalWidth - window.innerWidth + 100
        );

        // Only apply horizontal scroll on larger screens
        if (window.innerWidth >= 768 && scrollDistance > 0) {
          gsap.to(cardsRef.current, {
            x: -scrollDistance,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              scrub: 1,
              start: "top top",
              end: () => "+=" + scrollDistance,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        }

        // Entrance animation for all screens
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, sectionRef);

    return () => {
      try {
        if (ctx) ctx.revert();
        ScrollTrigger.killAll();
      } catch (error) {
        console.log("Cleanup error:", error);
      }
    };
  }, []);

  const features = [
    {
      icon: <Brain size={24} />,
      title: "AI Ad Creator",
      description:
        "Generate compelling ad copy, visuals, and campaigns with advanced AI algorithms that understand your brand voice and target audience.",
      gradient: "from-primary/20 to-cyber-green/20",
    },
    {
      icon: <Target size={24} />,
      title: "Smart Targeting",
      description:
        "Leverage AI-powered audience analysis to identify and reach your ideal customers with precision-targeted billboard placements.",
      gradient: "from-accent/20 to-cyber-blue/20",
    },
    {
      icon: <MapPin size={24} />,
      title: "Geo-Flex Mapping",
      description:
        "Real-time location intelligence to optimize billboard placement, track foot traffic, and measure campaign effectiveness.",
      gradient: "from-cyber-purple/20 to-primary/20",
    },
    {
      icon: <ChartLine size={24} />,
      title: "Analytics Suite",
      description:
        "Comprehensive dashboard with real-time metrics, ROI tracking, and predictive analytics to maximize your advertising impact.",
      gradient: "from-primary/20 to-accent/20",
    },
    {
      icon: <Palette size={24} />,
      title: "Brand Studio",
      description:
        "AI-powered design tools that maintain brand consistency across all campaigns while adapting to local market preferences.",
      gradient: "from-cyber-blue/20 to-cyber-purple/20",
    },
    {
      icon: <Lightning size={24} />,
      title: "Campaign AI",
      description:
        "Automated campaign optimization that adjusts bidding, placement, and creative elements in real-time for maximum performance.",
      gradient: "from-cyber-green/20 to-primary/20",
    },
    {
      icon: <Robot size={24} />,
      title: "Automation Hub",
      description:
        "Set it and forget it automation for routine tasks, budget management, and performance optimization across all campaigns.",
      gradient: "from-accent/20 to-cyber-green/20",
    },
    {
      icon: <Globe size={24} />,
      title: "Global Network",
      description:
        "Access to premium billboard inventory worldwide with AI-recommended placements based on your campaign objectives.",
      gradient: "from-cyber-purple/20 to-cyber-blue/20",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-12 sm:py-16 md:py-20 overflow-hidden"
      id="features" // ✅ Confirmed: matches navbar href="#features"
    >
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      <div className="absolute inset-0 particles opacity-10"></div>

      {/* Section Header */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-14 md:mb-16"
        >
          <motion.div
            className="inline-flex items-center space-x-2 glass-card px-3 sm:px-4 py-2 mb-4 sm:mb-6"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Lightning
              size={
                typeof window !== "undefined" && window.innerWidth < 640
                  ? 14
                  : 16
              }
              className="text-primary"
              weight="fill"
            />
            <span className="text-xs sm:text-sm text-foreground/80">
              AI-Powered Features
            </span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 px-2">
            <span className="holographic">Next-Gen</span>{" "}
            <span className="text-foreground">Advertising Tools</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed px-4">
            Discover the power of AI-driven advertising with our comprehensive
            suite of tools designed to revolutionize how you create, manage, and
            optimize billboard campaigns.
          </p>
        </motion.div>
      </div>

      {/* Responsive Cards Layout */}
      <div className="relative overflow-hidden">
        <div
          ref={cardsRef}
          className="flex gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 py-6 sm:py-8 md:flex-row flex-col md:overflow-visible"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-full sm:max-w-sm md:w-80 lg:w-96"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                delay={index * 0.1}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
