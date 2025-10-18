import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const GoToChatSection = () => {
  const navigate = useNavigate();

  const handleGoToChat = () => {
    navigate("/chat");
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="text-center"
    >
      <div className="glass-card p-10 max-w-4xl mx-auto bg-white/70 backdrop-blur-lg border border-primary/20 rounded-2xl shadow-lg">
        <h3 className="text-3xl font-semibold text-primary mb-4">
          Go to AI Chat
        </h3>
        <p className="text-foreground/80 mb-8 max-w-2xl mx-auto">
          Our AI assistant and support team are ready to help you find the best
          advertising solution for your business.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* 🚀 Основная кнопка — переход к чатботу */}
          <motion.button
            onClick={handleGoToChat}
            className="neon-btn bg-[hsl(var(--primary))] text-white px-8 py-4 rounded-full shadow-lg hover:shadow-[0_0_25px_hsl(var(--primary)/0.6)] transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Chat with AI Assistant
          </motion.button>

          {/* 📞 Альтернативная кнопка — контактная форма */}
          <motion.button
            className="glass-card px-8 py-4 text-primary border border-primary/30 hover:bg-primary/10 rounded-full transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/support")}
          >
            Contact Support
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GoToChatSection;
