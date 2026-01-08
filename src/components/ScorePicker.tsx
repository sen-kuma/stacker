import React from "react";
import { Pressable, Text, View } from "react-native";

export function ScorePicker(props: { score: number; onChange: (n: number) => void }) {
  const { score, onChange } = props;

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>今日のスコア：{score}/10</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {Array.from({ length: 11 }, (_, i) => i).map((n) => {
          const active = n === score;
          return (
            <Pressable
              key={n}
              onPress={() => onChange(n)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: active ? "#111" : "#ccc",
                backgroundColor: active ? "#111" : "transparent",
              }}
            >
              <Text style={{ color: active ? "#fff" : "#111", fontWeight: "600" }}>{n}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
