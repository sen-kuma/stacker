export type CategoryId = "os" | "ml" | "math" | "english" | "dev" | "uni" | "health";

export type LogItem = {
  id: string;
  categoryId: CategoryId;
  text: string;
  minutes?: number;      // 任意
  evidenceUrl?: string;  // 任意（最初はURLのみ）
};

export type DailyLog = {
  date: string;   // "YYYY-MM-DD"
  score: number;  // 0-10
  items: LogItem[];
  note?: string;  // 任意
};

export type WeeklyReview = {
  weekStart: string; // 月曜の "YYYY-MM-DD"
  reflection: string;
  top3NextWeek: [string, string, string];
};
