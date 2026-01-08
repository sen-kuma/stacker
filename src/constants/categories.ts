import type { CategoryId } from "../types";

export const CATEGORIES: Record<CategoryId, { label: string }> = {
  os: { label: "OS" },
  ml: { label: "ML" },
  math: { label: "数学" },
  english: { label: "英語" },
  dev: { label: "開発" },
  uni: { label: "大学" },
  health: { label: "体調" },
};

export const CATEGORY_ORDER: CategoryId[] = ["os", "ml", "math", "english", "dev", "uni", "health"];
