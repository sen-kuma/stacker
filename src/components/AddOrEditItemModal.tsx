import React from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useLogsStore } from "../store/useLogsStore";
import type { LogItem } from "../types";

type Payload = Omit<LogItem, "id">;

export function AddOrEditItemModal(props: {
  visible: boolean;
  initial?: LogItem;
  onClose: () => void;
  onSubmit: (payload: Payload) => void;
}) {
  const { visible, initial, onClose, onSubmit } = props;

  const categories = useLogsStore((s) => s.categories);
  const addCategory = useLogsStore((s) => s.addCategory);

  const [text, setText] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<string | undefined>(undefined);
  const [minutes, setMinutes] = React.useState<string>(""); // input用
  const [evidenceUrl, setEvidenceUrl] = React.useState<string>("");
  const [newCategoryName, setNewCategoryName] = React.useState<string>("");

  React.useEffect(() => {
    if (!visible) return;

    setText(initial?.text ?? "");
    setCategoryId(initial?.categoryId);
    setMinutes(typeof initial?.minutes === "number" ? String(initial.minutes) : "");
    setEvidenceUrl(initial?.evidenceUrl ?? "");
    setNewCategoryName("");
  }, [visible, initial]);

  const categoryList = React.useMemo(() => {
    const arr = Object.values(categories);
    arr.sort((a, b) => a.createdAt - b.createdAt);
    return arr;
  }, [categories]);

  const canSave = text.trim().length > 0;

  const submit = () => {
    if (!canSave) return;

    const m = minutes.trim() === "" ? undefined : Number(minutes);
    const payload: Payload = {
      text: text.trim(),
      categoryId,
      minutes: Number.isFinite(m as number) ? (m as number) : undefined,
      evidenceUrl: evidenceUrl.trim() === "" ? undefined : evidenceUrl.trim(),
    };

    onSubmit(payload);
    onClose();
  };

  const createCategoryAndSelect = () => {
    const id = addCategory(newCategoryName);
    if (!id) return;
    setCategoryId(id);
    setNewCategoryName("");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", padding: 16, justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 18, padding: 14, gap: 12, maxHeight: "85%" }}>
          <Text style={{ fontSize: 18, fontWeight: "900" }}>
            {initial ? "ログを編集" : "ログを追加"}
          </Text>

          <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ gap: 12 }}>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "800" }}>内容</Text>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="例：DPの復習、英語音読、OS本30分、筋トレ…"
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 14,
                  padding: 12,
                  fontSize: 16,
                }}
              />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "800" }}>カテゴリ</Text>

              {categoryList.length === 0 ? (
                <Text style={{ color: "#666" }}>
                  まだカテゴリがありません。下で作成してください。
                </Text>
              ) : (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {categoryList.map((c) => {
                    const active = c.id === categoryId;
                    return (
                      <Pressable
                        key={c.id}
                        onPress={() => setCategoryId(active ? undefined : c.id)}
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderRadius: 999,
                          borderWidth: 1,
                          borderColor: active ? "#111" : "#ccc",
                          backgroundColor: active ? "#111" : "transparent",
                        }}
                      >
                        <Text style={{ color: active ? "#fff" : "#111", fontWeight: "800" }}>
                          {c.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}

              <View style={{ gap: 8, marginTop: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: "800" }}>＋ 新しいカテゴリ</Text>
                <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                  <TextInput
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                    placeholder="例：アルゴリズム / 研究 / 生活"
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: "#ddd",
                      borderRadius: 14,
                      padding: 12,
                      fontSize: 16,
                    }}
                  />
                  <Pressable
                    onPress={createCategoryAndSelect}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 14,
                      borderRadius: 14,
                      backgroundColor: newCategoryName.trim() ? "#111" : "#bbb",
                    }}
                    disabled={!newCategoryName.trim()}
                  >
                    <Text style={{ color: "#fff", fontWeight: "900" }}>作成</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "800" }}>所要時間（分・任意）</Text>
              <TextInput
                value={minutes}
                onChangeText={(t) => setMinutes(t.replace(/[^\d]/g, ""))}
                keyboardType="number-pad"
                placeholder="例：30"
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 14,
                  padding: 12,
                  fontSize: 16,
                }}
              />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "800" }}>証拠URL（任意）</Text>
              <TextInput
                value={evidenceUrl}
                onChangeText={setEvidenceUrl}
                placeholder="例：https://..."
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 14,
                  padding: 12,
                  fontSize: 16,
                }}
              />
            </View>
          </ScrollView>

          <View style={{ flexDirection: "row", gap: 10, justifyContent: "flex-end" }}>
            <Pressable
              onPress={onClose}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "#ccc",
              }}
            >
              <Text style={{ fontWeight: "900" }}>キャンセル</Text>
            </Pressable>

            <Pressable
              onPress={submit}
              disabled={!canSave}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 14,
                backgroundColor: canSave ? "#111" : "#bbb",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900" }}>保存</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
