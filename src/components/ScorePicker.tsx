import React from "react";
import { Pressable, Text, View } from "react-native";

type Grade = "S" | "A" | "B" | "C" | "F";

function scoreToGrade(score: number): Grade {
  const s = Math.max(0, Math.min(10, Math.round(score)));
  if (s >= 9) return "S";
  if (s >= 7) return "A";
  if (s >= 5) return "B";
  if (s >= 2) return "C";
  return "F";
}

// 5段階UIで選んだ値を、互換用に0-10へマッピング
const GRADE_TO_SCORE: Record<Grade, number> = {
  S: 10,
  A: 8,
  B: 6,
  C: 3,
  F: 0,
};

const GRADES: Grade[] = ["S", "A", "B", "C", "F"];

export function ScorePicker(props: { score: number; onChange: (n: number) => void }) {
  const { score, onChange } = props;
  const current = scoreToGrade(score);

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>今日のスコア：{current}</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {GRADES.map((g) => {
          const active = g === current;
          return (
            <Pressable
              key={g}
              onPress={() => onChange(GRADE_TO_SCORE[g])}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: active ? "#111" : "#ccc",
                backgroundColor: active ? "#111" : "transparent",
              }}
            >
              <Text style={{ color: active ? "#fff" : "#111", fontWeight: "800" }}>{g}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={{ color: "#777" }}>
        ※内部では互換のため0-10で保存（UIは5段階）
      </Text>
    </View>
  );
}
