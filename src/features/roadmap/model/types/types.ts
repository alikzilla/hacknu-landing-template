export type RewardType = {
  id: string;
  title?: string;
  type: "badge" | "xp" | "cashback";
  icon?: string;
  earned?: boolean;
  earned_at?: string;
  value?: number;
};

export type ActionType = {
  id: string;
  title: string;
  type: "action";
  completed?: boolean;
  payload?: any;
};

export type SubnodeType = {
  id: string;
  title: string;
  type: "task" | "milestone" | "challenge" | "learning";
  status?: "locked" | "unlocked" | "in_progress" | "completed";
  points?: number;
  suggested_action?: { action: string; amount?: number; [k: string]: any };
};

export type NodeType = {
  id: string;
  title: string;
  summary?: string;
  description?: string;
  type?: "milestone" | "task" | "challenge" | "learning";
  icon?: string;
  position?: { x: number; y: number } | null;
  status?: "locked" | "unlocked" | "in_progress" | "completed";
  priority?: "low" | "medium" | "high";
  estimates?: { eta_days?: number; effort_hours?: number };
  progress?: {
    target_value?: number;
    current_value?: number;
    percent?: number;
  };
  dependencies?: string[];
  subnodes?: SubnodeType[];
  actions?: ActionType[];
  rewards?: RewardType[];
  ai_hints?: {
    advice?: string[];
    reminders?: ("weekly" | "monthly" | string)[];
    risk_notes?: string;
  };
};

export type ConnectionType = {
  id: string;
  from: string;
  to: string;
  type?: "direct" | "curved" | "conditional";
  condition?: string;
};

export type JourneyType = {
  journey_id: string;
  title: string;
  description?: string;
  category?: string;
  theme?: {
    style?: string;
    colors?: { primary?: string; accent?: string; bg?: string };
    pattern?: string;
  };
  meta?: any;
  goal?: {
    title?: string;
    target_value?: number;
    current_value?: number;
    unit?: string;
    deadline?: string;
    progress_percent?: number;
  };
  progress?: { overall_percent?: number; last_updated?: string };
  nodes: NodeType[];
  connections?: ConnectionType[];
  rewards?: RewardType[];
  ai_guides?: {
    persona?: string;
    language?: string;
    max_suggestions_per_day?: number;
    advice_templates?: Record<string, string>;
  };
};

export type Suggestion = {
  chosen_node_id: string | null;
  suggested_actions: { id: string; label: string; payload?: any }[];
  messages: string[];
};
