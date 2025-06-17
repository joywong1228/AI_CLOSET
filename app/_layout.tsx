// app/_layout.tsx
import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomTabBar from "../components/CustomTabBar";
import { ClosetProvider } from "../context/ClosetContext";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <ClosetProvider>
        <Tabs
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{ headerShown: false }}
        />
      </ClosetProvider>
    </SafeAreaProvider>
  );
}
