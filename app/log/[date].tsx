import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { DailyEditor } from "../../src/components/DailyEditor";

export default function LogDetailScreen() {
  const params = useLocalSearchParams<{ date: string }>();
  const date = params.date ?? "";

  return (
    <ScrollView>
      <DailyEditor date={date} />
    </ScrollView>
  );
}
