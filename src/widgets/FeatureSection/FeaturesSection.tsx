import { motion } from "framer-motion";
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
import { useState } from "react";

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
  <div
    className={`glass-card p-6 h-full rounded-2xl bg-gradient-to-br ${gradient} flex-shrink-0 w-80`}
  >
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 flex items-center justify-center">{icon}</div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
    </div>
    <p className="text-foreground/70 leading-relaxed">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  const features = [
    {
      icon: <Brain size={24} />,
      title: "AI Ad Creator",
      description:
        "Generate compelling ad copy, visuals, and campaigns with AI that understands your brand and audience.",
      gradient: "from-primary/20 to-cyber-green/20",
    },
    {
      icon: <Target size={24} />,
      title: "Smart Targeting",
      description:
        "Reach your ideal customers with AI-powered targeting and location-based recommendations.",
      gradient: "from-accent/20 to-cyber-blue/20",
    },
    {
      icon: <MapPin size={24} />,
      title: "Geo-Flex Mapping",
      description:
        "Real-time location intelligence to optimize billboard placement and performance.",
      gradient: "from-cyber-purple/20 to-primary/20",
    },
    {
      icon: <ChartLine size={24} />,
      title: "Analytics Suite",
      description:
        "Comprehensive dashboard with ROI tracking and predictive analytics.",
      gradient: "from-primary/20 to-accent/20",
    },
    {
      icon: <Palette size={24} />,
      title: "Brand Studio",
      description:
        "AI design tools that ensure brand consistency and local adaptation.",
      gradient: "from-cyber-blue/20 to-cyber-purple/20",
    },
    {
      icon: <Lightning size={24} />,
      title: "Campaign AI",
      description:
        "Automatic optimization of bidding, placement, and creatives in real time.",
      gradient: "from-cyber-green/20 to-primary/20",
    },
    {
      icon: <Robot size={24} />,
      title: "Automation Hub",
      description:
        "Set it and forget it — automate budget management and performance tracking.",
      gradient: "from-accent/20 to-cyber-green/20",
    },
    {
      icon: <Globe size={24} />,
      title: "Global Network",
      description:
        "Access premium billboard inventory worldwide with AI recommendations.",
      gradient: "from-cyber-purple/20 to-cyber-blue/20",
    },
  ];

  return (
    <section
      id="features"
      className="relative py-16 md:py-20 overflow-hidden bg-background"
    >
      {/* Заголовок */}
      <div className="container mx-auto px-6 text-center mb-12">
        <div>
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 mb-6">
            <Lightning size={18} className="text-primary" weight="fill" />
            <span className="text-sm text-foreground/80">
              AI-Powered Features
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="holographic">Next-Gen</span>{" "}
            <span className="text-foreground">Advertising Tools</span>
          </h2>

          <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Explore powerful AI-driven tools that transform how you create,
            manage, and optimize ad campaigns.
          </p>
        </div>
      </div>

      <motion.div
        className="flex gap-8"
        animate={{
          x: [0, -1920], // Adjust based on card width
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25, // Adjust speed here (lower = faster)
            ease: "linear",
          },
        }}
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            gradient={feature.gradient}
            delay={index * 0.1}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
