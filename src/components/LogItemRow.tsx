import React from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { CATEGORIES } from "../constants/categories";
import type { LogItem } from "../types";

export function LogItemRow(props: {
  item: LogItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { item, onEdit, onDelete } = props;

  return (
    <View
      style={{
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        gap: 6,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
        <Text style={{ fontWeight: "700" }}>{CATEGORIES[item.categoryId].label}</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable onPress={onEdit}>
            <Text style={{ fontWeight: "700" }}>編集</Text>
          </Pressable>
          <Pressable onPress={onDelete}>
            <Text style={{ fontWeight: "700" }}>削除</Text>
          </Pressable>
        </View>
      </View>

      <Text style={{ fontSize: 16 }}>{item.text}</Text>

      {(item.minutes ?? 0) > 0 && (
        <Text style={{ color: "#555" }}>時間：{item.minutes}分</Text>
      )}

      {!!item.evidenceUrl && (
        <Pressable onPress={() => Linking.openURL(item.evidenceUrl!)}>
          <Text style={{ color: "#0a58ca", textDecorationLine: "underline" }}>
            証拠リンクを開く
          </Text>
        </Pressable>
      )}
    </View>
  );
}
