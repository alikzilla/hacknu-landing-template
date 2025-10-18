import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question, Plus, Minus } from "phosphor-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does ADmyBRAND's AI technology work?",
      answer:
        "Our AI technology uses advanced machine learning algorithms to analyze vast amounts of data including audience behavior, location demographics, foot traffic patterns, and campaign performance. It then automatically optimizes ad placement, targeting, and creative elements to maximize your ROI. The system continuously learns from each campaign to improve future performance.",
    },
    {
      question: "What makes your billboard advertising different?",
      answer:
        "Unlike traditional billboard advertising, our AI-powered platform provides real-time optimization, precision targeting, and predictive analytics. We use geo-intelligence to identify optimal locations, audience analysis for perfect targeting, and automated campaign management to ensure maximum impact with minimal effort.",
    },
    {
      question: "Can I integrate ADmyBRAND with my existing marketing tools?",
      answer:
        "Absolutely! ADmyBRAND offers comprehensive API access and integrations with popular marketing platforms including Google Analytics, Facebook Ads Manager, Salesforce, HubSpot, and many more. Our Growth and Enterprise plans include dedicated integration support.",
    },
    {
      question: "How quickly can I see results from my campaigns?",
      answer:
        "Most clients see initial results within 24-48 hours of campaign launch. Our AI begins optimizing immediately upon deployment, and significant improvements in metrics like CTR and conversions typically appear within the first week. Full optimization and maximum ROI are usually achieved within 2-4 weeks.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "We offer comprehensive support across all plans. Starter includes email support, Growth adds priority support and phone access, while Enterprise includes a dedicated account manager and 24/7 premium support. All plans include access to our knowledge base, video tutorials, and community forum.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes! All plans come with a 14-day free trial that includes full access to our AI features, analytics dashboard, and campaign management tools. No credit card required to start, and you can upgrade or cancel anytime during the trial period.",
    },
    {
      question: "How do you ensure ad quality and brand safety?",
      answer:
        "Our AI includes advanced brand safety filters and quality controls. We use content analysis to ensure ads meet platform standards, brand consistency checks to maintain your visual identity, and automated fraud detection to protect your investment. Enterprise plans include custom brand safety rules.",
    },
    {
      question: "Can I use ADmyBRAND for international campaigns?",
      answer:
        "Yes! We support campaigns in 180+ countries with localized AI models that understand regional preferences, cultural nuances, and local regulations. Our global network includes premium billboard inventory worldwide with real-time availability and pricing.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Function to scroll to contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to open chatbot
  const openChatbot = () => {
    // Dispatch custom event to open chatbot
    const chatbotEvent = new CustomEvent("openChatbot");
    window.dispatchEvent(chatbotEvent);

    // Alternative: If you have a global function to open chatbot
    // window.openChatbot?.();

    // Alternative: If you store chatbot state in a global variable
    // window.chatbotOpen = true;
  };

  return (
    <section className="relative py-20 overflow-hidden" id="faq">
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
            <Question size={16} className="text-primary" weight="fill" />
            <span className="text-sm text-foreground/80">Got Questions?</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">Frequently Asked</span>{" "}
            <span className="holographic">Questions</span>
          </h2>

          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about ADmyBRAND AI Suite. Can't
            find what you're looking for? Our AI assistant is here to help!
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="mb-4"
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="w-full glass-card p-6 text-left hover:bg-white/5 transition-all duration-300 group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-primary flex-shrink-0"
                  >
                    {openIndex === index ? (
                      <Minus size={20} weight="bold" />
                    ) : (
                      <Plus size={20} weight="bold" />
                    )}
                  </motion.div>
                </div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="glass-card mx-4 p-6 mt-2 border-t border-primary/20">
                      <motion.p
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="text-foreground/80 leading-relaxed"
                      >
                        {faq.answer}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
