import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useLogsStore } from "../../src/store/useLogsStore";
import type { WeeklyReview } from "../../src/types";
import { addDays, weekStartMondayKey } from "../../src/utils/date";

export default function ReviewScreen() {
  const logs = useLogsStore((s) => s.logs);
  const weeklyReviews = useLogsStore((s) => s.weeklyReviews);
  const setWeeklyReview = useLogsStore((s) => s.setWeeklyReview);

  const weekStart = weekStartMondayKey(new Date());
  const weekKeys = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const summary = useMemo(() => {
    let totalItems = 0;
    let totalMinutes = 0;
    let totalScore = 0;
    let countDays = 0;

    for (const k of weekKeys) {
      const day = logs[k];
      if (!day) continue;
      countDays += 1;
      totalScore += day.score;
      totalItems += day.items.length;
      for (const it of day.items) totalMinutes += it.minutes ?? 0;
    }

    const avgScore = countDays === 0 ? 0 : Math.round((totalScore / countDays) * 10) / 10;
    return { totalItems, totalMinutes, avgScore, countDays };
  }, [logs, weekKeys]);

  const current: WeeklyReview =
    weeklyReviews[weekStart] ?? {
      weekStart,
      reflection: "",
      top3NextWeek: ["", "", ""],
    };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Text style={{ fontSize: 22, fontWeight: "900" }}>週次レビュー</Text>
      <Text style={{ color: "#666" }}>週の開始：{weekStart}（月曜）</Text>

      <View style={{ padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "#e5e5e5", gap: 6 }}>
        <Text style={{ fontWeight: "900" }}>今週の集計</Text>
        <Text>記録日数：{summary.countDays}日</Text>
        <Text>ログ件数：{summary.totalItems}件</Text>
        <Text>合計時間：{summary.totalMinutes}分</Text>
        <Text>平均スコア：{summary.avgScore}/10</Text>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "900" }}>振り返り（テンプレでOK）</Text>
        <TextInput
          multiline
          value={current.reflection}
          onChangeText={(t) => setWeeklyReview({ ...current, reflection: t })}
          placeholder={
            "・今週やったこと（自動集計＋補足）\n・伸びた点（1つ）\n・詰まった点（1つ）\n・来週の改善（1つ）"
          }
          style={{
            minHeight: 140,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 14,
            padding: 12,
            fontSize: 16,
            textAlignVertical: "top",
          }}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "900" }}>来週の最重要3つ（軽く）</Text>

        {([0, 1, 2] as const).map((i) => (
          <TextInput
            key={i}
            value={current.top3NextWeek[i]}
            onChangeText={(t) => {
              const next: WeeklyReview = {
                ...current,
                top3NextWeek: current.top3NextWeek.map((x, idx) => (idx === i ? t : x)) as [string, string, string],
              };
              setWeeklyReview(next);
            }}
            placeholder={`Top ${i + 1}`}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 14,
              padding: 12,
              fontSize: 16,
            }}
          />
        ))}
      </View>

      <Pressable
        onPress={() => setWeeklyReview(current)} // persistは自動
        style={{ padding: 14, borderRadius: 16, backgroundColor: "#111", alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontWeight: "900" }}>保存（自動保存でもOK）</Text>
      </Pressable>
    </ScrollView>
  );
}
