import Analytics from "@/features/analytics/ui/Analytics";
import { JourneyType } from "@/features/roadmap/model";

export const sampleBranching: JourneyType = {
  journey_id: "islamic_mortgage_roadmap_v1",
  title: "Путь к исламской ипотеке",
  description:
    "От подушки безопасности и оценки бюджета до выбора продукта (Мурабаха / Убывающая мушарака / Иджара) и заселения.",
  category: "financial",
  theme: { colors: { primary: "#136f63", accent: "#eab308", bg: "#f8fafc" } },
  goal: {
    title: "Купить квартиру по исламскому финансированию",
    target_value: 100,
    current_value: 42,
    unit: "%",
    deadline: "2027-12-31",
    progress_percent: 42,
  },
  progress: { overall_percent: 42 },

  nodes: [
    {
      id: "n1",
      title: "Подушка безопасности 3–6 мес",
      type: "milestone",
      icon: "🛟",
      status: "in_progress",
      progress: { percent: 70 },
      subnodes: [
        {
          id: "n1.s1",
          title: "Открыть «Копилку» и внести 100 000 ₸",
          type: "task",
          status: "unlocked",
          suggested_action: { action: "transfer", amount: 100000 },
        },
        {
          id: "n1.s2",
          title: "Автоплатёж 25 000 ₸/нед",
          type: "task",
          status: "unlocked",
          suggested_action: {
            action: "autopay",
            amount: 25000,
            period: "weekly",
          },
        },
      ],
    },

    {
      id: "n2",
      title: "Оценка бюджета и допустимой нагрузки",
      type: "learning",
      icon: "🧮",
      status: "unlocked",
      progress: { percent: 0 },
      dependencies: ["n1"],
      subnodes: [
        {
          id: "n2.s1",
          title: "Рассчитать ежемес. платёж ≤ 35% дохода",
          type: "task",
          status: "unlocked",
          suggested_action: { action: "calc_affordability" },
        },
      ],
    },

    {
      id: "n3",
      title: "Первичный скоринг / соответствие шариату",
      type: "milestone",
      icon: "🕌",
      status: "unlocked",
      progress: { percent: 0 },
      dependencies: ["n2"],
      subnodes: [
        {
          id: "n3.s1",
          title: "Загрузить ИИН и справку о доходах",
          type: "task",
          status: "unlocked",
          suggested_action: { action: "upload_docs", docs: ["iin", "income"] },
        },
      ],
    },

    {
      id: "n4",
      title: "Первоначальный взнос (мин. 20%)",
      type: "milestone",
      icon: "💰",
      status: "in_progress",
      progress: { percent: 35 },
      dependencies: ["n3"],
      subnodes: [
        {
          id: "n4.s1",
          title: "Пополнить 200 000 ₸",
          type: "task",
          status: "unlocked",
          suggested_action: { action: "transfer", amount: 200000 },
        },
        {
          id: "n4.s2",
          title: "Настроить автоперевод 50 000 ₸/мес",
          type: "task",
          status: "unlocked",
          suggested_action: {
            action: "autopay",
            amount: 50000,
            period: "monthly",
          },
        },
      ],
    },

    {
      id: "n5",
      title: "Выбор схемы финансирования",
      type: "challenge",
      icon: "🧭",
      status: "unlocked",
      progress: { percent: 0 },
      dependencies: ["n4"],
      subnodes: [
        {
          id: "n5.s1",
          title: "Сравнить ПФД",
          type: "task",
          status: "unlocked",
        },
      ],
    },

    {
      id: "n5a",
      title: "Мурабаха (покупка-перепродажа)",
      type: "milestone",
      icon: "📜",
      status: "locked",
      progress: { percent: 0 },
      dependencies: ["n5"],
    },
    {
      id: "n5b",
      title: "Убывающая мушарака (совместная доля)",
      type: "milestone",
      icon: "🤝",
      status: "locked",
      progress: { percent: 0 },
      dependencies: ["n5"],
    },
    {
      id: "n5c",
      title: "Иджара с выкупом (лизинг)",
      type: "milestone",
      icon: "🏠",
      status: "locked",
      progress: { percent: 0 },
      dependencies: ["n5"],
    },

    {
      id: "n6",
      title: "Подбор объекта и оценка",
      type: "task",
      icon: "🧾",
      status: "locked",
      progress: { percent: 0 },
      dependencies: ["n5a", "n5b", "n5c"],
      subnodes: [
        {
          id: "n6.s1",
          title: "Предварительный договор",
          type: "task",
          status: "unlocked",
        },
        {
          id: "n6.s2",
          title: "Оценка недвижимости",
          type: "task",
          status: "unlocked",
        },
      ],
    },

    {
      id: "n7",
      title: "Такафул и финальные документы",
      type: "milestone",
      icon: "🧾",
      status: "locked",
      progress: { percent: 0 },
      dependencies: ["n6"],
      subnodes: [
        {
          id: "n7.s1",
          title: "Оформить такафул",
          type: "task",
          status: "unlocked",
        },
      ],
    },

    {
      id: "n8",
      title: "Сделка / заселение",
      type: "milestone",
      icon: "🎉",
      status: "locked",
      progress: { percent: 0 },
      dependencies: ["n7"],
    },

    {
      id: "n9",
      title: "График выплат и досрочное погашение",
      type: "learning",
      icon: "📈",
      status: "locked",
      progress: { percent: 0 },
      dependencies: ["n8"],
      subnodes: [
        {
          id: "n9.s1",
          title: "Настроить автоплатёж",
          type: "task",
          status: "unlocked",
          suggested_action: { action: "autopay", amount: 0 },
        },
        {
          id: "n9.s2",
          title: "План досрочного (ежеквартально)",
          type: "task",
          status: "unlocked",
        },
      ],
    },
  ],

  connections: [
    { id: "c1", from: "n1", to: "n2", type: "curved" },
    { id: "c2", from: "n2", to: "n3", type: "curved" },
    { id: "c3", from: "n3", to: "n4", type: "curved" },
    { id: "c4", from: "n4", to: "n5", type: "curved" },
    // разветвление на три схемы
    { id: "c5a", from: "n5", to: "n5a", type: "curved" },
    { id: "c5b", from: "n5", to: "n5b", type: "curved" },
    { id: "c5c", from: "n5", to: "n5c", type: "curved" },
    // любой выбранный путь ведёт к подбору объекта
    { id: "c6a", from: "n5a", to: "n6", type: "curved" },
    { id: "c6b", from: "n5b", to: "n6", type: "curved" },
    { id: "c6c", from: "n5c", to: "n6", type: "curved" },
    { id: "c7", from: "n6", to: "n7", type: "curved" },
    { id: "c8", from: "n7", to: "n8", type: "curved" },
    { id: "c9", from: "n8", to: "n9", type: "curved" },
  ],

  ai_guides: {
    persona: "supportive_financial_coach",
    language: "ru",
    max_suggestions_per_day: 3,
    advice_templates: {
      save_small:
        "Отлично — переведите {amount}₸ в накопления. Это приблизит шаг «{node_title}».",
      motivate: "Шаг «{node_title}» готов! Дальше — «{next_title}».",
      percent_nudge: "Добавим ещё {amount}% к первоначальному взносу?",
      doc_hint: "Готов(ы) загрузить документы? Я подскажу формат и список.",
    },
  },
};

export const sampleData: JourneyType = sampleBranching;

const AnalyticsPage = () => {
  return <Analytics journey={sampleData} />;
};

export default AnalyticsPage;
