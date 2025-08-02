import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ParticleRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log("ParticleRain mounting...");
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("No canvas found");
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let isActive = true;

    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas || !isActive) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      speed: number;
      opacity: number;
      size: number;
      color: string;
    }> = [];

    // Create particles
    const createParticles = () => {
      const colors = ['#00ff88', '#1fd2ff', '#a855f7'];
      
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          speed: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          size: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    createParticles();

    // Animation loop
    const animate = () => {
      if (!isActive || !canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        if (!isActive) return;
        
        // Update particle position
        particle.y += particle.speed;

        // Reset particle when it goes off screen
        if (particle.y > canvas.height) {
          particle.y = -10;
          particle.x = Math.random() * canvas.width;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw particle trail
        ctx.save();
        ctx.globalAlpha = particle.opacity * 0.3;
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = particle.size * 0.5;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x, particle.y - particle.speed * 3);
        ctx.stroke();
        ctx.restore();
      });

      if (isActive) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      console.log("ParticleRain cleanup...");
      isActive = false;
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default ParticleRain;