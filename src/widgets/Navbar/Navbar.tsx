import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { List, X } from "phosphor-react";
import logo from "/public/logo.svg";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const { scrollY } = useScroll();

  // Progressive glassmorphic effect - starts ONLY when scrolling
  const glassOpacity = useTransform(
    scrollY,
    [0, 1, 80, 150],
    [0, 0, 0.15, 0.3]
  );
  const borderOpacity = useTransform(
    scrollY,
    [0, 1, 80, 150],
    [0, 0, 0.1, 0.2]
  );

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 1); // Trigger immediately when scrolling starts
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
  ];

  // Smooth scroll function
  const smoothScrollToTop = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Enhanced smooth scroll for nav items with better offset calculation
  const smoothScrollToSection = (
    e: React.MouseEvent<HTMLButtonElement>,
    href: string
  ): void => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const navbarHeight = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        backgroundColor: `rgba(0, 0, 0, ${glassOpacity.get()})`,
        borderBottomColor: `rgba(255, 255, 255, ${borderOpacity.get()})`,
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "backdrop-blur-xl shadow-lg shadow-black/25 border-b"
          : "bg-transparent backdrop-blur-none shadow-none border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Now Clickable */}
          <motion.button
            onClick={smoothScrollToTop}
            className="flex items-center space-x-3 cursor-pointer group focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
            type="button"
          >
            <motion.div
              className="flex items-center justify-center transition-all duration-300"
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <img src={logo} alt="Logo" />
            </motion.div>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={(e) => smoothScrollToSection(e, item.href)}
                className="text-black hover:text-green-400 transition-colors duration-200 relative group cursor-pointer focus:outline-none"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                type="button"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              className="text-black hover:text-green-400 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
            >
              Sign In
            </motion.button>
            <motion.button
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
            >
              Start Free Trial
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            type="button"
          >
            {isMobileMenuOpen ? <X size={24} /> : <List size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden mt-4 pb-4 border-t border-white/10"
          >
            <div className="mt-2 p-4 bg-black/40 backdrop-blur-xl border border-white/20 rounded-lg">
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={(e) => smoothScrollToSection(e, item.href)}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-200 py-3 px-4 text-left cursor-pointer focus:outline-none rounded-lg hover:bg-white/10 font-medium"
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ x: 5 }}
                    type="button"
                  >
                    {item.name}
                  </motion.button>
                ))}
                <div className="border-t border-white/10 pt-3 mt-2">
                  <div className="flex flex-col space-y-3">
                    <button
                      className="text-gray-300 hover:text-green-400 transition-colors duration-200 py-2 px-4 text-left rounded-lg hover:bg-white/10"
                      type="button"
                    >
                      Sign In
                    </button>
                    <button
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 text-center w-full"
                      type="button"
                    >
                      Start Free Trial
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
