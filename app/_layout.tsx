import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useLogsStore } from "../src/store/useLogsStore";

export default function RootLayout() {
  const hydrated = useLogsStore((s) => s.hydrated);

  // hydratedがtrueになるまで、軽くローディング
  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="log/[date]" options={{ title: "ログ詳細" }} />
    </Stack>
  );
}
