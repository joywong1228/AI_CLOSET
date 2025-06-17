import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCloset } from "../../context/ClosetContext";

export default function MatchResultPage() {
  const router = useRouter();
  const { items } = useCloset();
  const { itemId } = useLocalSearchParams();

  const baseItem = items.find((item) => item.id === itemId);
  const matchItems = items.filter((item) => item.id !== itemId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff0f8" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🧸 Matched Outfit Result</Text>

        {baseItem && (
          <View style={styles.baseItemBox}>
            <Text style={styles.label}>Your Pick:</Text>
            <Image
              source={{ uri: baseItem.imageUri }}
              style={styles.baseImage}
            />
          </View>
        )}

        <Text style={styles.label}>Suggested Matches 💫</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {matchItems.slice(0, 5).map((item) => (
            <Image
              key={item.id}
              source={{ uri: item.imageUri }}
              style={styles.suggestedImage}
            />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>🔙 Try Another Match</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 24,
    color: "#d63384",
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#c2185b",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  baseItemBox: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#ffe6f0",
    borderRadius: 16,
    padding: 16,
  },
  baseImage: {
    width: 180,
    height: 240,
    resizeMode: "cover",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  suggestedImage: {
    width: 100,
    height: 130,
    resizeMode: "cover",
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#fff",
  },
  backBtn: {
    marginTop: 30,
    backgroundColor: "#ffcce5",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  backText: {
    color: "#d63384",
    fontWeight: "700",
    fontSize: 16,
  },
});
