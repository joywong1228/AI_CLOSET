// app/settings.tsx
import { View, Text } from "react-native";

export default function SettingsPage() {
  console.log("🛠 Settings page loaded");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>⚙️ Settings</Text>
    </View>
  );
}
