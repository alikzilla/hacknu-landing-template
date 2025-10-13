import { motion } from "framer-motion";
import { UsersFour, ArrowLeft, ArrowRight } from "phosphor-react";
import { useState, useEffect } from "react";
import TestimonialCard from "./TestimonialCard";

const TestimonialsSection = () => {
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechFlow Corp",
      content:
        "ADmyBRAND AI transformed our billboard campaigns completely. We saw a 340% increase in ROI within the first quarter. The AI targeting is incredibly precise.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b605?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "Marcus Rodriguez",
      role: "CEO",
      company: "Urban Retail",
      content:
        "The geo-targeting capabilities are game-changing. We can now optimize our billboard placements in real-time based on foot traffic data. Absolutely revolutionary.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "Emily Johnson",
      role: "Brand Manager",
      company: "Lifestyle Co",
      content:
        "What used to take our team weeks now happens in minutes. The AI ad creator understands our brand voice perfectly and generates compelling campaigns instantly.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "David Kim",
      role: "Digital Strategist",
      company: "Growth Partners",
      content:
        "The analytics dashboard provides insights we never had before. Predictive analytics help us stay ahead of trends and optimize campaigns before they even launch.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "Lisa Thompson",
      role: "CMO",
      company: "InnovateCorp",
      content:
        "ADmyBRAND's automation features save us countless hours. The platform manages our global campaigns seamlessly while maintaining brand consistency across all markets.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "Ahmed Hassan",
      role: "Operations Director",
      company: "Metro Dynamics",
      content:
        "The white-label solution allowed us to offer advanced AI advertising to our clients. It's become our most requested service and a major revenue driver.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    },
  ];

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="relative py-20 overflow-hidden" id="testimonials">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      <div className="absolute inset-0 particles opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center space-x-2 glass-card px-4 py-2 mb-6"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <UsersFour size={16} className="text-primary" weight="fill" />
            <span className="text-sm text-foreground/80">Customer Stories</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">Trusted by</span>{" "}
            <span className="holographic">Industry Leaders</span>
          </h2>

          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            See how companies worldwide are revolutionizing their advertising
            strategies with ADmyBRAND AI Suite.
          </p>
        </motion.div>

        {/* Continuous Sliding Testimonials */}
        <div className="relative max-w-7xl mx-auto mb-16">
          <div
            className="overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
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
              {duplicatedTestimonials.map((testimonial, index) => (
                <div key={index} className="flex-shrink-0 w-80">
                  <TestimonialCard {...testimonial} delay={0} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
        >
          {[
            { value: "98%", label: "Customer Satisfaction" },
            { value: "340%", label: "Average ROI Increase" },
            { value: "50K+", label: "Campaigns Created" },
            { value: "180+", label: "Countries Served" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center glass-card p-6 rounded-xl group hover:bg-white/5 transition-all duration-300"
              whileHover={{ y: -5, scale: 1.05 }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-foreground/70 group-hover:text-foreground/90 transition-colors duration-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
