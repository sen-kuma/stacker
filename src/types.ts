export type Category = {
  id: string;
  name: string;
  createdAt: number;
};

export type LogItem = {
  id: string;

  // 変更：固定カテゴリではなく、ユーザー作成カテゴリのID（未設定も可）
  categoryId?: string;

  text: string;
  minutes?: number; // 任意
  evidenceUrl?: string; // 任意
};

export type DailyLog = {
  date: string; // "YYYY-MM-DD"

  // 互換性のため number のまま保持（UIはS/A/B/C/Fで操作）
  score: number; // 0-10

  items: LogItem[];
  note?: string; // 今日の一言
};

export type WeeklyReview = {
  weekStart: string; // 月曜の "YYYY-MM-DD"
  reflection: string;
  top3NextWeek: [string, string, string];
};
