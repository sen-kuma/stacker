import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { DailyLog, LogItem, WeeklyReview } from "../types";

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

type LogsState = {
  hydrated: boolean;

  logs: Record<string, DailyLog>;
  weeklyReviews: Record<string, WeeklyReview>;

  ensureDay: (date: string) => DailyLog;

  setScore: (date: string, score: number) => void;
  setNote: (date: string, note: string) => void;

  addItem: (date: string, item: Omit<LogItem, "id">) => void;
  updateItem: (date: string, item: LogItem) => void;
  removeItem: (date: string, itemId: string) => void;

  setWeeklyReview: (review: WeeklyReview) => void;
};

export const useLogsStore = create<LogsState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      logs: {},
      weeklyReviews: {},

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
        const next: DailyLog = { ...day, score: Math.max(0, Math.min(10, score)) };
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
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
      partialize: (state) => ({
        logs: state.logs,
        weeklyReviews: state.weeklyReviews,
      }),
    }
  )
);
