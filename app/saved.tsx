import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useCloset, ClosetItem } from "../context/ClosetContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SavedPage() {
  const { items, removeItem, toggleFavorite } = useCloset();
  const router = useRouter();

  // Extract unique categories except special ones
  const itemCategories = Array.from(
    new Set(
      items
        .map((item) => item.category)
        .filter(
          (cat) => cat !== "Favorite" && cat !== "Saved Match" && cat !== "All"
        )
    )
  );

  // Build dropdown: All, Saved Match, Favorite, [others...]
  const categories = [
    "All",
    "Saved Match",
    "Favorite",
    ...itemCategories.filter(
      (cat, i, arr) =>
        arr.indexOf(cat) === i && cat !== "Favorite" && cat !== "Saved Match"
    ),
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [popupItem, setPopupItem] = useState<null | ClosetItem>(null);

  // Sync selection if categories change
  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // Filter items
  let filteredItems: ClosetItem[] = [];
  if (selectedCategory === "All") {
    filteredItems = items;
  } else if (selectedCategory === "Saved Match") {
    filteredItems = items.filter((item) => item.category === "Saved Match");
  } else if (selectedCategory === "Favorite") {
    filteredItems = items.filter((item) => item.favorite);
  } else {
    filteredItems = items.filter((item) => item.category === selectedCategory);
  }

  // Use latest reference for popup item
  const latestPopupItem =
    popupItem && items.find((i) => i.id === popupItem.id)
      ? items.find((i) => i.id === popupItem.id)
      : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff0f5" }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setDropdownVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.headerTitle}>
              {`✨ ${selectedCategory} `}
              <Ionicons name="chevron-down" size={18} color="#d63384" />
            </Text>
          </TouchableOpacity>
          {dropdownVisible && (
            <>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setDropdownVisible(false)}
              />
              <View style={styles.dropdownMenuContainer}>
                <View style={styles.dropdownList}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.dropdownItem,
                        cat === selectedCategory && styles.dropdownItemActive,
                      ]}
                      onPress={() => {
                        setSelectedCategory(cat);
                        setDropdownVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          cat === selectedCategory &&
                            styles.dropdownItemTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>
        <View style={{ width: 50 }} />
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setPopupItem(item)}
          >
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            {/* Optional: show a small heart icon if favorited */}
            {item.favorite && (
              <View style={styles.heartIcon}>
                <Ionicons name="heart" size={22} color="#d63384" />
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No items in this category.</Text>
          </View>
        }
      />

      {latestPopupItem && (
        <Pressable
          style={styles.popupOverlay}
          onPress={() => setPopupItem(null)}
        >
          <View style={styles.popupBox}>
            <Image
              source={{ uri: latestPopupItem.imageUri }}
              style={styles.popupImage}
            />
            <Text style={styles.popupText}>{latestPopupItem.category}</Text>
            <TouchableOpacity
              style={styles.popupBtn}
              onPress={() => {
                toggleFavorite(latestPopupItem.id);
              }}
            >
              <Text style={styles.popupBtnText}>
                {latestPopupItem.favorite
                  ? "💗 Remove from Favorite"
                  : "♡ Add to Favorite"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.popupBtn, { backgroundColor: "#ffe0ef" }]}
              onPress={() => {
                removeItem(latestPopupItem.id);
                setPopupItem(null);
              }}
            >
              <Text style={[styles.popupBtnText, { color: "#d63384" }]}>
                🗑 Remove Item
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}
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
  dropdownButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#d63384",
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
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
  heartIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#fff0f5",
    borderRadius: 20,
    padding: 2,
    zIndex: 10,
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
  dropdownMenuContainer: {
    position: "absolute",
    top: 40,
    left: "50%",
    transform: [{ translateX: -105 }],
    zIndex: 100,
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    width: 210,
    shadowColor: "#f4a6c8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  dropdownItemActive: {
    backgroundColor: "#ffe0ef",
  },
  dropdownItemText: {
    fontSize: 18,
    color: "#d63384",
  },
  dropdownItemTextActive: {
    fontWeight: "bold",
    color: "#c2185b",
  },
  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.16)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popupBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    width: 270,
    alignItems: "center",
    shadowColor: "#f4a6c8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 20,
    elevation: 20,
  },
  popupImage: {
    width: 120,
    height: 150,
    borderRadius: 14,
    marginBottom: 16,
  },
  popupText: {
    fontSize: 16,
    color: "#d63384",
    fontWeight: "600",
    marginBottom: 16,
  },
  popupBtn: {
    backgroundColor: "#f8b",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    alignItems: "center",
    width: "100%",
  },
  popupBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
