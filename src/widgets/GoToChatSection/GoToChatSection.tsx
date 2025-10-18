import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const GoToChatSection = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative mx-auto max-w-5xl px-4 py-16 text-center"
      aria-labelledby="cta-title"
      id="bot"
    >
      {/* Фоновое свечение + лёгкая зернистость */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,theme(colors.green.500/20),transparent_60%)] blur-2xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(theme(colors.slate.500/20)_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      {/* Карточка */}
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-green-600/20 bg-white/70 p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] backdrop-blur-xl dark:bg-white/10">
        {/* Мягкое «кольцо» по границе */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[1px] rounded-[inherit] bg-[conic-gradient(from_130deg,theme(colors.green.500/55),transparent_25%,theme(colors.emerald.400/50),transparent_60%)] opacity-40 blur-sm"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/60 to-white/20 dark:from-white/10 dark:to-white/5"
        />

        {/* Шапка-бейдж */}
        <div className="relative mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-green-600/25 bg-green-500/10 px-4 py-1 text-xs font-medium text-green-700">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-600" />
          Shariah-Compliant • Халяль
        </div>

        <h3
          id="cta-title"
          className="relative text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl"
        >
          Чат с вашим ИИ-ассистентом
        </h3>

        <p className="relative mx-auto mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
          Получите понятный, пошаговый финансовый план без рибы: накопления на
          квартиру/авто, бюджет, вехи и ежедневные действия. Мы поможем
          двигаться к цели спокойно и прозрачно.
        </p>

        {/* Чипы преимуществ */}
        <div className="relative mx-auto mt-6 flex flex-wrap justify-center gap-2">
          {["Быстро", "Персонально", "24/7 поддержка"].map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              {chip}
            </span>
          ))}
          <span className="rounded-full border border-amber-400/40 bg-amber-300/20 px-3 py-1 text-xs text-amber-700">
            Халяль-решения
          </span>
        </div>

        {/* Кнопки */}
        <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.button
            onClick={() => navigate("/chat")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-8 py-4 font-medium text-white shadow-[0_10px_30px_-10px_rgba(22,163,74,0.8)] transition-all hover:bg-green-700 hover:shadow-[0_20px_40px_-10px_rgba(22,163,74,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/60"
            aria-label="Открыть чат с ИИ-ассистентом"
          >
            Открыть чат
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/support")}
            className="inline-flex items-center gap-2 rounded-full border border-green-600/30 bg-white/60 px-8 py-4 font-medium text-green-700 backdrop-blur transition-colors hover:bg-green-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/50 dark:bg-white/10"
          >
            Связаться с консультантом
          </motion.button>
        </div>

        {/* Сноска */}
        <p className="relative mx-auto mt-6 max-w-xl text-xs text-slate-500 dark:text-slate-400">
          Продолжая, вы принимаете Условия обслуживания и подтверждаете Политику
          конфиденциальности. Мы не используем решения с рибой и придерживаемся
          исламских принципов финансирования.
        </p>
      </div>
    </motion.section>
  );
};

export default GoToChatSection;
