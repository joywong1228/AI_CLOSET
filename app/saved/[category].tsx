import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCloset } from "../../context/ClosetContext";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

export default function CategorySavedPage() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { items } = useCloset();
  const router = useRouter();

  const catItems = items.filter((item) => item.category === category);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff0f5" }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{`✨ ${category}`}</Text>
        <View style={{ width: 50 }} /> {/* Spacer for centering */}
      </View>
      <FlatList
        data={catItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUri }} style={styles.image} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No items in this category.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    backgroundColor: "#ffe0ef",
    borderBottomWidth: 1,
    borderColor: "#f7c8da",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#d63384",
    textAlign: "center",
    flex: 1,
  },
  backText: {
    color: "#c2185b",
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 10,
  },
  listContent: {
    padding: 16,
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffe0ef",
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    aspectRatio: 3 / 4,
    shadowColor: "#f4a6c8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "95%",
    height: "90%",
    borderRadius: 12,
    resizeMode: "contain",
    backgroundColor: "#fff0f5",
  },
  emptyBox: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyText: {
    color: "#d63384",
    fontWeight: "600",
    fontSize: 16,
  },
});
