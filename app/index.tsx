import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { useCloset } from "../context/ClosetContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  const { items } = useCloset();

  // Sort by date added (newest first)
  const sortedItems = [...items].sort(
    (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  );

  const recentItems = sortedItems.slice(0, 5);

  const categories = [...new Set(items.map((item) => item.category))];

  const getItemsByCategory = (category: string) =>
    items.filter((item) => item.category === category);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff0f5" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Section title="🧠 AI Suggestion for Today" data={items.slice(0, 1)} />
        <Section title="💾 Your Saved Matches" data={items.slice(0, 3)} />
        <Section title="🆕 Recently Added" data={recentItems} />

        {/* Dynamic category sections */}
        {categories.map((category) => (
          <Section
            key={category}
            title={`✨ ${category}`}
            data={getItemsByCategory(category)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, data }: { title: string; data: any[] }) {
  if (data.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#d63384",
  },
  image: {
    width: 110,
    height: 140,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: "#ffe0f0",
    borderWidth: 1,
    borderColor: "#f7c8da",
  },
});
