import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Category, DailyLog, LogItem, WeeklyReview } from "../types";

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

type LogsState = {
  hydrated: boolean;

  logs: Record<string, DailyLog>;
  weeklyReviews: Record<string, WeeklyReview>;

  // 追加：ユーザー作成カテゴリ
  categories: Record<string, Category>;
  addCategory: (name: string) => string; // idを返す（失敗時は""）
  renameCategory: (id: string, name: string) => void;
  removeCategory: (id: string) => void;

  ensureDay: (date: string) => DailyLog;

  setScore: (date: string, score: number) => void;
  setNote: (date: string, note: string) => void;

  addItem: (date: string, item: Omit<LogItem, "id">) => void;
  updateItem: (date: string, item: LogItem) => void;
  removeItem: (date: string, itemId: string) => void;

  setWeeklyReview: (review: WeeklyReview) => void;
};

function clampScore(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(10, Math.round(n)));
}

// 旧固定カテゴリが残っている場合に備えて、IDそのままでカテゴリを作っておく（ユーザーが後でリネーム/削除可能）
const LEGACY_CATEGORY_NAMES: Record<string, string> = {
  os: "OS",
  ml: "ML",
  math: "数学",
  english: "英語",
  dev: "開発",
  uni: "大学",
  health: "健康",
};

export const useLogsStore = create<LogsState>()(
  persist(
    (set, get) => ({
      hydrated: false,

      logs: {},
      weeklyReviews: {},

      categories: {},

      addCategory: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return "";
        const { categories } = get();

        // 同名があるなら既存を返す（連打防止）
        const existing = Object.values(categories).find((c) => c.name === trimmed);
        if (existing) return existing.id;

        const id = makeId();
        const next: Category = { id, name: trimmed, createdAt: Date.now() };
        set({ categories: { ...categories, [id]: next } });
        return id;
      },

      renameCategory: (id, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const { categories } = get();
        const cur = categories[id];
        if (!cur) return;
        set({ categories: { ...categories, [id]: { ...cur, name: trimmed } } });
      },

      removeCategory: (id) => {
        const { categories, logs } = get();
        if (!categories[id]) return;

        const nextCategories = { ...categories };
        delete nextCategories[id];

        // そのカテゴリが付いているログから categoryId を外す
        const nextLogs: Record<string, DailyLog> = {};
        for (const date of Object.keys(logs)) {
          const day = logs[date];
          nextLogs[date] = {
            ...day,
            items: day.items.map((it) => (it.categoryId === id ? { ...it, categoryId: undefined } : it)),
          };
        }

        set({ categories: nextCategories, logs: nextLogs });
      },

      ensureDay: (date) => {
        const { logs } = get();
        const existing = logs[date];
        if (existing) return existing;

        const created: DailyLog = { date, score: 0, items: [], note: "" };
        set({ logs: { ...logs, [date]: created } });
        return created;
      },

      setScore: (date, score) => {
        const { logs } = get();
        const day = logs[date] ?? { date, score: 0, items: [], note: "" };
        const next: DailyLog = { ...day, score: clampScore(score) };
        set({ logs: { ...logs, [date]: next } });
      },

      setNote: (date, note) => {
        const { logs } = get();
        const day = logs[date] ?? { date, score: 0, items: [], note: "" };
        const next: DailyLog = { ...day, note };
        set({ logs: { ...logs, [date]: next } });
      },

      addItem: (date, item) => {
        const { logs } = get();
        const day = logs[date] ?? { date, score: 0, items: [], note: "" };
        const newItem: LogItem = { id: makeId(), ...item };
        const next: DailyLog = { ...day, items: [newItem, ...day.items] };
        set({ logs: { ...logs, [date]: next } });
      },

      updateItem: (date, item) => {
        const { logs } = get();
        const day = logs[date] ?? { date, score: 0, items: [], note: "" };
        const nextItems = day.items.map((it) => (it.id === item.id ? item : it));
        const next: DailyLog = { ...day, items: nextItems };
        set({ logs: { ...logs, [date]: next } });
      },

      removeItem: (date, itemId) => {
        const { logs } = get();
        const day = logs[date];
        if (!day) return;
        const next: DailyLog = { ...day, items: day.items.filter((it) => it.id !== itemId) };
        set({ logs: { ...logs, [date]: next } });
      },

      setWeeklyReview: (review) => {
        const { weeklyReviews } = get();
        set({ weeklyReviews: { ...weeklyReviews, [review.weekStart]: review } });
      },
    }),
    {
      name: "ai-os-journal.v1",
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),

      migrate: (persisted: any, fromVersion) => {
        // 既存データを壊さない
        if (!persisted) return persisted;
        if (fromVersion >= 2) return persisted;

        const logs: Record<string, DailyLog> = persisted.logs ?? {};
        const categories: Record<string, Category> = persisted.categories ?? {};

        // 旧固定カテゴリのIDがログ内に残っていたら、カテゴリ定義を自動生成（IDはそのまま）
        const usedCategoryIds = new Set<string>();
        for (const date of Object.keys(logs)) {
          const day = logs[date];
          if (!day?.items) continue;
          for (const it of day.items) {
            if (typeof it?.categoryId === "string" && it.categoryId) {
              usedCategoryIds.add(it.categoryId);
            }
          }
        }

        const nextCategories: Record<string, Category> = { ...categories };
        for (const cid of usedCategoryIds) {
          if (nextCategories[cid]) continue;
          const name = LEGACY_CATEGORY_NAMES[cid] ?? cid;
          nextCategories[cid] = { id: cid, name, createdAt: Date.now() };
        }

        return {
          ...persisted,
          categories: nextCategories,
        };
      },

      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },

      partialize: (state) => ({
        logs: state.logs,
        weeklyReviews: state.weeklyReviews,
        categories: state.categories,
      }),
    }
  )
);
