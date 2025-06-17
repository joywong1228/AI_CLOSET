import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const router = useRouter();

  const tabs = [
    {
      name: "",
      icon: "home-outline",
      label: "Home",
      family: "Ionicons",
    },
    {
      name: "match",
      icon: "brain",
      label: "Match",
      family: "MaterialCommunityIcons",
    },
    {
      name: "add",
      icon: "plus-circle",
      label: "Add",
      center: true,
      family: "MaterialCommunityIcons",
    },
    {
      name: "saved",
      icon: "content-save-outline",
      label: "Saved",
      family: "MaterialCommunityIcons",
    },
    {
      name: "settings",
      icon: "cog-outline",
      label: "Settings",
      family: "MaterialCommunityIcons",
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;
        const onPress = () => router.push(tab.name ? "/" + tab.name : "/");

        const iconSize = tab.center ? 56 : 24;
        const iconColor = tab.center
          ? "#fff" // force center button (＋) to always be white
          : isFocused
          ? "#d63384" // vibrant pink when active
          : "#b68abf"; // soft pastel purple when inactive

        const IconComponent =
          tab.family === "MaterialCommunityIcons"
            ? MaterialCommunityIcons
            : Ionicons;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={onPress}
            style={tab.center ? styles.centerButton : styles.tabButton}
          >
            <IconComponent
              name={tab.icon as any}
              size={iconSize}
              color={iconColor}
            />
            {!tab.center && <Text style={styles.label}>{tab.label}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 85,
    paddingBottom: 10,
    paddingTop: 6,
    borderTopWidth: 2,
    borderTopColor: "#ffd6e8",
    backgroundColor: "#fff0f8",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#f4a6c8",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  centerButton: {
    position: "relative",
    top: -30,
    backgroundColor: "#fbc4d8",
    borderRadius: 50,
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff0f8",
    shadowColor: "#ff90b3",
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#d63384",
    marginTop: 4,
    fontFamily: "Avenir",
  },
});
