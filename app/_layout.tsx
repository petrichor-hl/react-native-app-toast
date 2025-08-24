import AppToast from "@/components/AppToast";
import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";

const InitialLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <InitialLayout />
      <AppToast />
    </View>
  );
}
