import { motion } from "framer-motion";
import { Star, Quotes } from "phosphor-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  delay?: number;
}

const TestimonialCard = ({
  name,
  role,
  company,
  content,
  rating,
  avatar,
  delay = 0,
}: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0, scale: 0.9 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative max-w-md mx-auto"
    >
      <div className="glass-card p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

        {/* Quote Icon */}
        <motion.div
          className="absolute top-4 right-4 text-primary/20 group-hover:text-primary/40 transition-colors duration-300"
          whileHover={{ rotate: 5, scale: 1.1 }}
        >
          <Quotes size={32} weight="fill" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          {/* Rating */}
          <div className="flex items-center space-x-1 mb-4">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={16}
                weight="fill"
                className={`${
                  index < rating
                    ? "text-yellow-400"
                    : "text-muted-foreground/30"
                } transition-colors duration-300`}
              />
            ))}
          </div>

          {/* Testimonial Text */}
          <blockquote className="text-foreground/80 text-lg leading-relaxed mb-6 group-hover:text-foreground/90 transition-colors duration-300">
            "{content}"
          </blockquote>

          {/* Profile */}
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <motion.div
              className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    name
                  )}&background=00ff88&color=0a0a0a&bold=true`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>

            {/* Name & Role */}
            <div className="flex-1">
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                {name}
              </h4>
              <p className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors duration-300">
                {role} at {company}
              </p>
            </div>
          </div>
        </div>

        {/* Hover Accent */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-primary rounded-full"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />

        {/* Corner Decorations */}
        <div className="absolute top-2 left-2 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
