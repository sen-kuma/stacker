import React from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { useLogsStore } from "../store/useLogsStore";
import type { LogItem } from "../types";

export function LogItemRow(props: { item: LogItem; onEdit: () => void; onDelete: () => void }) {
  const { item, onEdit, onDelete } = props;
  const categories = useLogsStore((s) => s.categories);

  const categoryName =
    item.categoryId && categories[item.categoryId]
      ? categories[item.categoryId].name
      : item.categoryId
        ? item.categoryId
        : "未分類";

  return (
    <Pressable
      onPress={onEdit}
      style={{
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 14,
        padding: 12,
        gap: 6,
        backgroundColor: "#fff",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <View
            style={{
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <Text style={{ fontWeight: "900" }}>{categoryName}</Text>
          </View>

          {typeof item.minutes === "number" ? (
            <Text style={{ color: "#666", fontWeight: "700" }}>{item.minutes}分</Text>
          ) : null}
        </View>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#f2caca",
            backgroundColor: "#fff5f5",
          }}
        >
          <Text style={{ color: "#b00020", fontWeight: "900" }}>削除</Text>
        </Pressable>
      </View>

      <Text style={{ fontSize: 16, fontWeight: "800" }}>{item.text}</Text>

      {item.evidenceUrl ? (
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            Linking.openURL(item.evidenceUrl!);
          }}
        >
          <Text style={{ color: "#1a73e8", textDecorationLine: "underline" }}>
            証拠：{item.evidenceUrl}
          </Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}
