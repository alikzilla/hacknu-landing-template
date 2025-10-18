import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { List, X } from "phosphor-react";
import logo from "/public/logo.svg";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 1);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: "Возможности", href: "#features" },
    { name: "Бот", href: "#bot" },
    { name: "Вопросы", href: "#faq" },
  ];

  const smoothScrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const smoothScrollToSection = (
    e: React.MouseEvent<HTMLButtonElement>,
    href: string
  ) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const navbarHeight = 72;
      const y =
        el.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 12;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full container lg:px-20 px-6 fixed inset-x-0 top-3 z-50 pointer-events-none"
      aria-label="Главная навигация"
    >
      <motion.div
        className={`pointer-events-auto mx-auto flex items-center justify-between rounded-full border px-4 py-1 md:px-6 md:py-3 backdrop-blur-md transition-all ${
          isScrolled ? "translate-y-0" : "translate-y-0"
        }`}
      >
        {/* ЛОГО (кнопка наверх) */}
        <motion.button
          onClick={smoothScrollToTop}
          className="flex items-center gap-3 rounded-full px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60"
          whileHover={{ scale: 1.04, rotate: 0.2 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          aria-label="Прокрутить вверх"
          title="На главную"
        >
          <img src={logo} alt="Логотип" className="lg:h-14 h-10 w-auto" />
        </motion.button>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <motion.button
              key={item.name}
              onClick={(e) => smoothScrollToSection(e, item.href)}
              className="relative text-sm text-slate-800 hover:text-green-600 focus:outline-none"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              aria-label={`Перейти к разделу: ${item.name}`}
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-green-500 transition-all duration-300 group-hover:w-full" />
            </motion.button>
          ))}
        </div>

        {/* CTA DESKTOP */}
        <div className="hidden md:flex items-center gap-3">
          <motion.button
            className="rounded-full bg-green-500 px-5 py-2 text-sm font-medium text-white shadow-[0_10px_20px_-10px_rgba(34,197,94,0.6)] transition hover:bg-green-600"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            type="button"
          >
            Начать бесплатно
          </motion.button>
        </div>

        {/* MOBILE TOGGLE */}
        <motion.button
          className="md:hidden rounded-full p-2 text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          whileTap={{ scale: 0.95 }}
          type="button"
          aria-label="Переключить меню"
          title="Меню"
        >
          {isMobileMenuOpen ? <X size={22} /> : <List size={22} />}
        </motion.button>
      </motion.div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 6, height: "auto" }}
          exit={{ opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-auto mx-auto mt-3 w-[92%] max-w-5xl rounded-3xl border border-slate-900/10 bg-white/75 p-3 backdrop-blur-md shadow-lg"
          style={{ boxShadow: "0 16px 40px -16px rgba(0,0,0,0.18)" }}
          aria-label="Мобильное меню"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={(e) => smoothScrollToSection(e, item.href)}
                className="w-full rounded-xl px-4 py-3 text-left text-slate-800 hover:bg-slate-900/5 focus:outline-none"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                aria-label={`Перейти к разделу: ${item.name}`}
              >
                {item.name}
              </motion.button>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-8 border-t border-slate-900/10 pt-3">
              <button className="rounded-full bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                Начать бесплатно
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
