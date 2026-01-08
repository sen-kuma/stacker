import React from "react";
import { ScrollView } from "react-native";
import { DailyEditor } from "../../src/components/DailyEditor";
import { todayKey } from "../../src/utils/date";

export default function TodayScreen() {
  const date = todayKey();
  return (
    <ScrollView>
      <DailyEditor date={date} title={`今日（${date}）`} />
    </ScrollView>
  );
}
