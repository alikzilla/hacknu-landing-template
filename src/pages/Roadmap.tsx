import { Roadmap } from "@/features/roadmap";
import { JourneyType } from "@/features/roadmap/model";

export const sampleLinear: JourneyType = {
  journey_id: "linear_test",
  title: "Линейный путь — тест",
  description: "Простой тест-кейс без ветвлений",
  category: "financial",
  theme: { colors: { primary: "#1E6F55", accent: "#D9B44A", bg: "#F9FAF9" } },
  goal: {
    title: "Линейная цель",
    target_value: 100,
    current_value: 40,
    unit: "%",
    deadline: "2030-01-01",
    progress_percent: 40,
  },
  progress: { overall_percent: 40 },
  nodes: [
    {
      id: "a1",
      title: "Шаг 1",
      type: "milestone",
      icon: "🪙",
      status: "completed",
      progress: { percent: 100 },
    },
    {
      id: "a2",
      title: "Шаг 2",
      type: "milestone",
      icon: "🪙",
      status: "in_progress",
      progress: { percent: 40 },
      dependencies: ["a1"],
      subnodes: [
        {
          id: "a2.s1",
          title: "+10%",
          type: "task",
          status: "unlocked",
          suggested_action: { action: "percent", amount: 10 },
        },
      ],
    },
    {
      id: "a3",
      title: "Шаг 3",
      type: "milestone",
      icon: "🪙",
      status: "locked",
      progress: { percent: 0 },
      dependencies: ["a2"],
    },
  ],
  connections: [
    { id: "e1", from: "a1", to: "a2", type: "curved" },
    { id: "e2", from: "a2", to: "a3", type: "curved" },
  ],
  ai_guides: {
    advice_templates: {
      save_small: "Переведи {amount}₸ в '{node_title}' → станет {percent}%",
    },
  },
};

export const sampleBranching: JourneyType = {
  journey_id: "branch_test",
  title: "Развилка — тест",
  description: "Ветвящийся путь, проверка навигации",
  category: "financial",
  theme: { colors: { primary: "#2563eb", accent: "#f59e0b", bg: "#f8fafc" } },
  goal: {
    title: "Развилка",
    target_value: 100,
    current_value: 55,
    unit: "%",
    deadline: "2030-01-01",
    progress_percent: 55,
  },
  progress: { overall_percent: 55 },
  nodes: [
    {
      id: "b1",
      title: "Старт",
      type: "milestone",
      icon: "🏁",
      status: "completed",
      progress: { percent: 100 },
    },
    {
      id: "b2",
      title: "Вклад",
      type: "milestone",
      icon: "💼",
      status: "in_progress",
      progress: { percent: 60 },
      dependencies: ["b1"],
    },
    {
      id: "b3",
      title: "Инвестиции",
      type: "milestone",
      icon: "📈",
      status: "locked",
      progress: { percent: 10 },
      dependencies: ["b2"],
    },
    {
      id: "b4",
      title: "Альтернатива",
      type: "milestone",
      icon: "🧭",
      status: "locked",
      progress: { percent: 0 },
      dependencies: ["b2"],
    },
  ],
  connections: [
    { id: "be1", from: "b1", to: "b2", type: "curved" },
    { id: "be2", from: "b2", to: "b3", type: "curved" },
    { id: "be3", from: "b2", to: "b4", type: "curved" },
  ],
  ai_guides: {
    advice_templates: { save_small: "Добавь {amount}₸ в '{node_title}'" },
  },
};

export const sampleData: JourneyType = sampleBranching;

const RoadmapPage = () => {
  return <Roadmap data={sampleData} />;
};

export default RoadmapPage;
