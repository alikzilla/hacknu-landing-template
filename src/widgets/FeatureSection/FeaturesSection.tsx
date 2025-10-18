import { useState } from "react";
import {
  Brain,
  Wallet,
  Target,
  ChartLine,
  ShieldCheck,
  Compass,
} from "phosphor-react";
import { HandCoins } from "lucide-react";
// ^ заменил часть иконок для смыслового акцента; все будут одинакового размера

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
};

const CARD_W = 320; // px — ширина карточки
const GAP = 32; // px — промежуток между карточками

const FeatureCard = ({ icon, title, description, gradient }: Feature) => (
  <div
    className={`glass-card h-full w-[${CARD_W}px] flex-shrink-0 rounded-2xl bg-gradient-to-br ${gradient} p-6`}
  >
    <div className="mb-4 flex items-center space-x-4">
      <div className="flex h-12 w-12 items-center justify-center text-foreground/90">
        {/* фиксированный размер иконок для идеального выравнивания */}
        <div className="grid h-8 w-8 place-items-center">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
    </div>
    <p className="leading-relaxed text-foreground/70">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => {
  const [paused, setPaused] = useState(false);

  // ✅ Фичи с фокусом на исламский банкинг/фин-план
  const features: Feature[] = [
    {
      icon: <Target size={24} />,
      title: "Цели и роудмэпы",
      description:
        "Автоплан накопления на квартиру/авто/хадж. Сроки, ежемесячные суммы, вехи и чек-листы.",
      gradient: "from-primary/20 to-emerald-200/20",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Шариат-комплаенс",
      description:
        "Подсказки без рибы, без спекуляций и харам-доходов. Этический фильтр инструментов.",
      gradient: "from-amber-200/20 to-primary/20",
    },
    {
      icon: <HandCoins size={24} />,
      title: "Халяль-финансирование",
      description:
        "Модели Мурабаха/Иджара/Мушарака: расчёт взноса, график платежей и стоимость владения.",
      gradient: "from-emerald-200/20 to-cyan-200/20",
    },
    {
      icon: <ChartLine size={24} />,
      title: "Прогресс и KPI",
      description:
        "Прогресс к взносу, норма сбережений, прогноз даты цели. Геймификация: XP, серия, квесты.",
      gradient: "from-primary/20 to-amber-200/20",
    },
    {
      icon: <Wallet size={24} />,
      title: "Бюджет без рибы",
      description:
        "Распределение дохода по «халяль-конвертам»: базовые нужды, цели, благотворительность.",
      gradient: "from-cyan-200/20 to-primary/20",
    },
    {
      icon: <Wallet size={24} />,
      title: "Закят и садака",
      description:
        "Подсказки по расчёту закята, напоминания и резерв под благотворительность.",
      gradient: "from-amber-200/20 to-cyan-200/20",
    },
    {
      icon: <Brain size={24} />,
      title: "AI-советник",
      description:
        "Персональные шаги: где оптимизировать траты, как ускорить накопления, что сделать сегодня.",
      gradient: "from-emerald-200/20 to-primary/20",
    },
    {
      icon: <Compass size={24} />,
      title: "Сценарии и риски",
      description:
        "Если цены/ставки вырастут или доход снизится — альтернативные маршруты без харам-решений.",
      gradient: "from-primary/20 to-emerald-200/20",
    },
  ];

  // Удваиваем массив для бесшовной ленты
  const doubled = [...features, ...features];

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-background py-16 md:py-20"
    >
      {/* Title */}
      <div className="container mx-auto mb-12 px-6 text-center">
        <div className="glass-card mb-6 inline-flex items-center space-x-2 px-4 py-2">
          <ShieldCheck size={18} className="text-primary" weight="fill" />
          <span className="text-sm text-foreground/80">
            Shariah-Compliant • Халяль
          </span>
        </div>

        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          <span className="holographic">Халяльные</span>{" "}
          <span className="text-foreground">финансовые роудмэпы</span>
        </h2>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-foreground/70">
          Простые планы накоплений и халяль-финансирование без рибы — с
          понятными шагами каждый день.
        </p>
      </div>

      {/* MARQUEE */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Трек: 200% ширины, две одинаковые серии карточек */}
        <div
          className="marquee-track flex"
          style={{
            // переменные для точной геометрии
            // @ts-ignore – кастомные CSS-переменные
            ["--cardW" as any]: `${CARD_W}px`,
            ["--gap" as any]: `${GAP}px`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {doubled.map((f, i) => (
            <div key={i} style={{ marginRight: GAP }}>
              <FeatureCard {...f} />
            </div>
          ))}
        </div>

        {/* мягкие маски по краям */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>

      {/* локальные стили для бесшовного marquee */}
      <style>{`
        .marquee-track {
          width: calc( (var(--cardW) + var(--gap)) * ${features.length} * 2 );
          animation: marquee 28s linear infinite;
          will-change: transform;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-1 * (var(--cardW) + var(--gap)) * ${features.length})); }
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
