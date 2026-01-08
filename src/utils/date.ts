function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

// 月曜始まりの週の開始日（日本向け）
export function weekStartMondayKey(base: Date = new Date()): string {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // Sun=0..Sat=6
  const diff = (day + 6) % 7; // Mon=0, Tue=1, ... Sun=6
  d.setDate(d.getDate() - diff);
  return toDateKey(d);
}

export function addDays(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return toDateKey(dt);
}
