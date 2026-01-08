import React, { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { CATEGORIES, CATEGORY_ORDER } from "../constants/categories";
import type { CategoryId, LogItem } from "../types";

type Draft = {
  categoryId: CategoryId;
  text: string;
  minutes: string;     // input用
  evidenceUrl: string; // input用
};

export function AddOrEditItemModal(props: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<LogItem, "id">) => void;
  initial?: LogItem; // edit用
}) {
  const { visible, onClose, onSubmit, initial } = props;

  const initialDraft: Draft = useMemo(() => {
    return {
      categoryId: initial?.categoryId ?? "os",
      text: initial?.text ?? "",
      minutes: initial?.minutes ? String(initial.minutes) : "",
      evidenceUrl: initial?.evidenceUrl ?? "",
    };
  }, [initial]);

  const [draft, setDraft] = useState<Draft>(initialDraft);

  // initialが変わったときに反映（編集→別の編集に切り替えた時など）
  React.useEffect(() => {
    setDraft(initialDraft);
  }, [initialDraft]);

  const canSubmit = draft.text.trim().length > 0;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: "800" }}>
          {initial ? "ログを編集" : "ログを追加"}
        </Text>

        <Text style={{ fontWeight: "700" }}>カテゴリ</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {CATEGORY_ORDER.map((id) => {
            const active = draft.categoryId === id;
            return (
              <Pressable
                key={id}
                onPress={() => setDraft((d) => ({ ...d, categoryId: id }))}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: active ? "#111" : "#ccc",
                  backgroundColor: active ? "#111" : "transparent",
                }}
              >
                <Text style={{ color: active ? "#fff" : "#111", fontWeight: "700" }}>
                  {CATEGORIES[id].label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={{ fontWeight: "700" }}>今日やったこと（1行）</Text>
        <TextInput
          value={draft.text}
          onChangeText={(t) => setDraft((d) => ({ ...d, text: t }))}
          placeholder="例：OSTEP 1章を読んだ / AtCoder 1問解いた"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 14,
            padding: 12,
            fontSize: 16,
          }}
        />

        <Text style={{ fontWeight: "700" }}>時間（分・任意）</Text>
        <TextInput
          value={draft.minutes}
          onChangeText={(t) => setDraft((d) => ({ ...d, minutes: t }))}
          placeholder="例：30"
          keyboardType="number-pad"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 14,
            padding: 12,
            fontSize: 16,
          }}
        />

        <Text style={{ fontWeight: "700" }}>証拠URL（任意）</Text>
        <TextInput
          value={draft.evidenceUrl}
          onChangeText={(t) => setDraft((d) => ({ ...d, evidenceUrl: t }))}
          placeholder="例：GitHubのコミットURL / ノートの写真URL"
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 14,
            padding: 12,
            fontSize: 16,
          }}
        />

        <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
          <Pressable
            onPress={onClose}
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#ddd",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "800" }}>キャンセル</Text>
          </Pressable>

          <Pressable
            disabled={!canSubmit}
            onPress={() => {
              const minutesNum = Number(draft.minutes);
              onSubmit({
                categoryId: draft.categoryId,
                text: draft.text.trim(),
                minutes: Number.isFinite(minutesNum) && minutesNum > 0 ? minutesNum : undefined,
                evidenceUrl: draft.evidenceUrl.trim() || undefined,
              });
              onClose();
            }}
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 16,
              backgroundColor: canSubmit ? "#111" : "#999",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "800", color: "#fff" }}>
              {initial ? "保存" : "追加"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Modal>
  );
}
