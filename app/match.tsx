import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function MatchPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>💘 Outfit Matcher</Text>
        <Text style={styles.subtitle}>Let's style your day, cutie!</Text>

        <TouchableOpacity
          style={styles.matchButton}
          onPress={() => router.push("/match/choose-style")}
        >
          <Text style={styles.matchText}>🎀 Choose Your Style</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.matchButton}
          onPress={() => router.push("/match/by-item")}
        >
          <Text style={styles.matchText}>👗 Match With a Specific Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.matchButton}>
          <Text style={styles.matchText}>🌤️ Match with Weather</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.matchButton}>
          <Text style={styles.matchText}>🕒 Last Minute Look</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.matchButton}>
          <Text style={styles.matchText}>📅 Match My Event</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.matchButton}>
          <Text style={styles.matchText}>💖 My Favorite Combos</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff0f8",
  },
  container: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#d63384",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#b68abf",
    marginBottom: 30,
  },
  matchButton: {
    backgroundColor: "#ffe0ef",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 18,
    width: "90%",
    shadowColor: "#d63384",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  matchText: {
    color: "#d63384",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Avenir",
  },
});
