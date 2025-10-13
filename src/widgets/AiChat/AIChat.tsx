// Add this line in the top imports if not present
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaperPlaneTilt, Sparkle, X } from "phosphor-react";

const categories = {
  "Social Media Ads": [
    "What's the best time to post ads?",
    "How can I increase engagement on Instagram?",
    "Tips for creating viral content?",
    "Best format for Facebook ads?",
    "How to use reels effectively?",
  ],
  "Food Ads": [
    "What attracts customers to food ads?",
    "Should I show prices in food ads?",
    "What colors work best for food marketing?",
    "How to advertise healthy food?",
    "Best time for food delivery promotions?",
  ],
  "Real Estate Ads": [
    "How to highlight property features in ads?",
    "What platforms work best for real estate?",
    "Should I use drone shots?",
    "Targeting high‑income buyers?",
    "How to advertise rental properties?",
  ],
  "Event Promotions": [
    "How to promote a concert or event?",
    "What hashtags work well for events?",
    "How early should I start promoting?",
    "Tips for last‑minute ticket sales?",
    "Should I include testimonials in event ads?",
  ],
  "E‑commerce Ads": [
    "Best call to action for sales?",
    "Should I offer discounts in ads?",
    "How to retarget cart abandoners?",
    "Video vs image ads for e‑commerce?",
    "What's the best ad length for social platforms?",
  ],
};

const defaultSuggestions = [
  "What kind of ads can you help with?",
  "Tell me about your pricing.",
  "How does AI improve billboard ads?",
  "How can I reach more local customers?",
];

const ChatbotIcon = () => (
  <svg
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="#ffffff"
    stroke="#ffffff"
    className="w-6 h-6"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.48 4h4l.5.5v2.03h.52l.5.5V8l-.5.5h-.52v3l-.5.5H9.36l-2.5 2.76L6 14.4V12H3.5l-.5-.64V8.5h-.5L2 8v-.97l.5-.5H3V4.36L3.53 4h4V2.86A1 1 0 0 1 7 2a1 1 0 0 1 2 0 1 1 0 0 1-.52.83V4zM12 8V5H4v5.86l2.5.14H7v2.19l1.8-2.04.35-.15H12V8zm-2.12.51a2.71 2.71 0 0 1-1.37.74v-.01a2.71 2.71 0 0 1-2.42-.74l-.7.71c.34.34.745.608 1.19.79.45.188.932.286 1.42.29a3.7 3.7 0 0 0 2.58-1.07l-.7-.71zM6.49 6.5h-1v1h1v-1zm3 0h1v1h-1v-1z"
      />
    </g>
  </svg>
);

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hi! I'm your AI assistant. How can I help you optimize your billboard or ad campaigns today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Event listener for opening chatbot from FAQ section
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
    };

    window.addEventListener("openChatbot", handleOpenChatbot);
    return () => window.removeEventListener("openChatbot", handleOpenChatbot);
  }, []);

  // Click outside to close chatbot
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = (customMessage?: string) => {
    const userText = customMessage ?? inputValue.trim();
    if (!userText) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsBotTyping(true);

    setTimeout(() => {
      const botText = getBotResponse(userText);
      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content: botText,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsBotTyping(false);
    }, 1000);
  };

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    if (["hi", "hello", "hey", "hai"].some((greet) => msg.includes(greet))) {
      return "Hello again! How can I help you today?";
    }

    if (msg.includes("thank")) {
      return "You're welcome! 😊 Hope your doubts are cleared. Please contact us for more details.\n\nSay 'hi' to restart a new session.";
    }

    if (msg.includes("how is your pricing") || msg.includes("your pricing")) {
      return `Sure! Here's our pricing breakdown:

- ⭐ Starter: $49/month → Ideal for small businesses starting out.
- 🚀 Growth: $149/month → Best for mid-sized teams and automation.
- 🏆 Enterprise: $499/month → Full access, integrations, and priority support.

All plans come with a **14-day free trial**. 💡

Would you like to explore plan features or know if it's the right fit for you?`;
    }

    if (msg.includes("pricing") || msg.includes("cost")) {
      return "Our pricing starts at $49/month for Starter, $149/month for Growth, and $499/month for Enterprise. 14‑day free trial available.";
    }

    if (msg.includes("location") || msg.includes("targeting")) {
      return "We analyze foot traffic, demographic data, and location intelligence to recommend high‑impact billboard placements.";
    }

    if (msg.includes("roi") || msg.includes("return")) {
      return "Typical ROI is around 340%. We auto‑optimize campaigns in real‑time for maximum conversion and efficiency.";
    }

    if (msg.includes("ai") || msg.includes("how")) {
      return "Our AI uses machine learning to analyze campaign data, predict outcomes, and optimize ad placement automatically.";
    }

    for (const category in categories) {
      if (msg.includes(category.toLowerCase())) {
        const options = categories[category].join("\n- ");
        return `You're exploring ${category}. Here are some suggestions:\n- ${options}`;
      }
    }

    return "Great question! Choose a category below or ask one of the suggestions.";
  };

  const getSuggestionsForMessage = (msgContent: string) => {
    const content = msgContent.toLowerCase();

    if (
      content.includes("here's our pricing") ||
      content.includes("our pricing starts at") ||
      content.includes("14-day free trial")
    ) {
      return [
        "Are you satisfied with the pricing options?",
        "Do you want to explore the features of each plan?",
        "Can I talk to a human for custom plans?",
      ];
    }

    for (const category in categories) {
      if (content.includes(category.toLowerCase())) {
        return categories[category].slice(0, 3);
      }
    }

    if (
      content.includes("pricing") ||
      content.includes("cost") ||
      content.includes("roi") ||
      content.includes("ai")
    ) {
      return [
        "Can you explain ROI again?",
        "How does your pricing compare?",
        "Do you offer a trial?",
      ];
    }

    return defaultSuggestions;
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

  return (
    <div ref={chatRef}>
      {/* ✅ Custom Green Circle Button With Chatbot PNG Icon */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
        style={{
          backgroundColor: isOpen ? "#ef4444" : "#00FF66",
          border: isOpen ? "2px solid #ef4444" : "2px solid #00FF66",
        }}
      >
        {isOpen ? (
          <X size={24} color="white" />
        ) : (
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
            alt="Chatbot Icon"
            className="w-8 h-8 object-contain"
          />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-96 max-w-[90vw] h-[500px] glass-card overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="bg-gradient-primary p-4 text-background">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-background/20 rounded-full flex items-center justify-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                    alt="Chatbot Icon"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs opacity-80">Always here to help</p>
                <div className="ml-auto flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs">Online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 p-4 space-y-4 overflow-y-auto max-h-80 scroll-smooth"
            >
              {messages.map((msg) => (
                <div key={msg.id}>
                  <motion.div
                    className={`flex ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        msg.type === "user"
                          ? "bg-primary text-background ml-4"
                          : "bg-white/10 text-foreground mr-4"
                      }`}
                    >
                      {msg.type === "bot" && (
                        <div className="flex items-center space-x-2 mb-1">
                          <Sparkle
                            size={12}
                            className="text-primary"
                            weight="fill"
                          />
                          <span className="text-xs text-foreground/60">AI</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <p className="text-xs opacity-60 mt-1">{msg.timestamp}</p>
                    </div>
                  </motion.div>

                  {msg.type === "bot" && (
                    <div className="mt-2 ml-2 flex flex-wrap gap-2">
                      {getSuggestionsForMessage(msg.content).map(
                        (suggestion, i) => (
                          <motion.button
                            key={i}
                            onClick={() => handleSendMessage(suggestion)}
                            className="text-xs bg-white/10 hover:bg-white/20 rounded-full px-3 py-1"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {suggestion}
                          </motion.button>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isBotTyping && (
                <motion.div
                  className="text-sm text-foreground opacity-80 animate-pulse"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="ml-2">AI is typing...</span>
                </motion.div>
              )}
            </div>

            <div className="px-4 pb-2 text-xs text-center text-foreground/40">
              Thank you! Please support and contact us for more detailing.
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  placeholder="Type your message..."
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <motion.button
                  onClick={() => handleSendMessage()}
                  className="w-8 h-8 bg-primary text-background rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={!inputValue.trim()}
                >
                  <PaperPlaneTilt size={14} weight="fill" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChat;
