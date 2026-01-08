import { Link } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { useLogsStore } from "../../src/store/useLogsStore";
import { todayKey } from "../../src/utils/date";

export default function LogScreen() {
  const logs = useLogsStore((s) => s.logs);

  const dates = useMemo(() => {
    const keys = Object.keys(logs);
    keys.sort((a, b) => (a < b ? 1 : -1)); // 降順
    // 何もないと寂しいので、今日だけは表示用に確保
    if (keys.length === 0) keys.push(todayKey());
    return keys;
  }, [logs]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "900" }}>ログ一覧</Text>

      {dates.map((date) => {
        const day = logs[date];
        const preview = day?.items?.[0]?.text ?? "";
        const score = day?.score ?? 0;

        return (
          <Link
            key={date}
            href={{ pathname: "/log/[date]", params: { date } }}
            style={{
              padding: 14,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#e5e5e5",
            }}
          >
            <View style={{ gap: 6 }}>
              <Text style={{ fontWeight: "900", fontSize: 16 }}>
                {date}（score {score}/10）
              </Text>
              <Text style={{ color: "#666" }} numberOfLines={2}>
                {preview ? preview : "（まだログがありません）"}
              </Text>
            </View>
          </Link>
        );
      })}
    </ScrollView>
  );
}
