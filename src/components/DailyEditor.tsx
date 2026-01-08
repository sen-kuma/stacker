import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useLogsStore } from "../store/useLogsStore";
import type { LogItem } from "../types";
import { AddOrEditItemModal } from "./AddOrEditItemModal";
import { LogItemRow } from "./LogItemRow";
import { ScorePicker } from "./ScorePicker";

export function DailyEditor(props: { date: string; title?: string }) {
  const { date, title } = props;

  const day = useLogsStore((s) => s.logs[date]);
  const ensureDay = useLogsStore((s) => s.ensureDay);
  const setScore = useLogsStore((s) => s.setScore);
  const setNote = useLogsStore((s) => s.setNote);
  const addItem = useLogsStore((s) => s.addItem);
  const updateItem = useLogsStore((s) => s.updateItem);
  const removeItem = useLogsStore((s) => s.removeItem);

  // 確実に日付の箱を作る
  React.useEffect(() => {
    ensureDay(date);
  }, [date, ensureDay]);

  const safeDay = day ?? { date, score: 0, items: [], note: "" };

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<LogItem | undefined>(undefined);

  const headerTitle = useMemo(() => title ?? `ログ：${date}`, [title, date]);

  return (
    <View style={{ padding: 16, gap: 14 }}>
      <Text style={{ fontSize: 22, fontWeight: "900" }}>{headerTitle}</Text>

      <ScorePicker score={safeDay.score} onChange={(n) => setScore(date, n)} />

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "800" }}>今日の一言（任意）</Text>
        <TextInput
          value={safeDay.note ?? ""}
          onChangeText={(t) => setNote(date, t)}
          placeholder="例：集中できた/眠かった/明日はここを改善"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 14,
            padding: 12,
            fontSize: 16,
          }}
        />
      </View>

      <Pressable
        onPress={() => {
          setEditing(undefined);
          setModalVisible(true);
        }}
        style={{
          padding: 14,
          borderRadius: 16,
          backgroundColor: "#111",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "900" }}>＋ ログを追加</Text>
      </Pressable>

      <View style={{ gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "900" }}>今日の積み上げ</Text>
        {safeDay.items.length === 0 ? (
          <Text style={{ color: "#666" }}>まだ何もありません。1行だけでも追加すると勝ち。</Text>
        ) : (
          safeDay.items.map((it) => (
            <LogItemRow
              key={it.id}
              item={it}
              onEdit={() => {
                setEditing(it);
                setModalVisible(true);
              }}
              onDelete={() => removeItem(date, it.id)}
            />
          ))
        )}
      </View>

      <AddOrEditItemModal
        visible={modalVisible}
        initial={editing}
        onClose={() => setModalVisible(false)}
        onSubmit={(payload) => {
          if (editing) {
            updateItem(date, { ...editing, ...payload });
          } else {
            addItem(date, payload);
          }
        }}
      />
    </View>
  );
}
