import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCloset } from "../../context/ClosetContext";

export default function MatchByItem() {
  const { items } = useCloset();
  const router = useRouter();

  // Group items by category
  const categories = Array.from(new Set(items.map((item) => item.category)));

  const handleChoose = (item: any) => {
    // Later: Match logic can go here
    router.push("/match/result"); // or show a modal / loader
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff0f8" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>🎯 Match with a Specific Item</Text>
        <Text style={styles.subtext}>Pick a piece to style your outfit!</Text>

        {categories.map((category) => {
          const filtered = items.filter((item) => item.category === category);
          if (filtered.length === 0) return null;

          return (
            <View key={category} style={styles.categoryBlock}>
              <Text style={styles.categoryTitle}>💖 {category}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filtered.map((item) => (
                  <View key={item.id} style={styles.itemCard}>
                    <Image
                      source={{ uri: item.imageUri }}
                      style={styles.image}
                    />
                    <TouchableOpacity
                      onPress={() => handleChoose(item)}
                      style={styles.chooseButton}
                    >
                      <Text style={styles.chooseText}>Choose This</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d63384",
    textAlign: "center",
  },
  subtext: {
    textAlign: "center",
    fontSize: 14,
    color: "#b68abf",
    marginBottom: 20,
  },
  categoryBlock: {
    gap: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#c2185b",
    marginBottom: 10,
    paddingLeft: 6,
  },
  itemCard: {
    width: 140,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    shadowColor: "#f4a6c8",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  image: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 10,
    backgroundColor: "#ffe0ef",
    marginBottom: 10,
  },
  chooseButton: {
    backgroundColor: "#ffcce5",
    paddingVertical: 8,
    borderRadius: 12,
  },
  chooseText: {
    textAlign: "center",
    color: "#d63384",
    fontWeight: "600",
  },
});
