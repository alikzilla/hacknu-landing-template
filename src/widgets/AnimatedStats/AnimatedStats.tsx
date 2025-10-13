import { motion } from "framer-motion";
import AnimatedCounter from "../AnimatedCounter/AnimatedCounter";
import "./AnimatedStats.css";

interface StatItem {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

const AnimatedStats = () => {
  const statsData: StatItem[] = [
    { value: 98, suffix: "%", label: "Customer Satisfaction" },
    { value: 340, suffix: "%", label: "Average ROI Increase" },
    { value: 50, suffix: "K+", label: "Campaigns Created" },
    { value: 180, suffix: "+", label: "Countries Served" },
  ];

  return (
    <motion.section
      className="animated-stats-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="animated-stats-container container mx-auto">
        <div className="animated-stats-grid">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              className="animated-stats-card glass-card"
            >
              <div className="animated-stats-number holographic">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  duration={2.5}
                  className="tabular-nums"
                />
              </div>
              <p className="animated-stats-label">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default AnimatedStats;
