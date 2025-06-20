// Updated AddPage with girl-style aesthetics, side-by-side image previews, and customizable category list
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { Buffer } from "buffer";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCloset } from "../context/ClosetContext";
import uuid from "react-native-uuid";
import PopupMessage from "../components/PopupMessage"; // adjust the path as needed
import { MaterialCommunityIcons } from "@expo/vector-icons"; // for icon

const REMOVE_BG_API_KEY = "PHrza2xuAaS4fxRvdnM81u6m";

export default function AddPage() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [processedUri, setProcessedUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [localCategories, setLocalCategories] = useState<string[]>([
    "Top",
    "Bottom",
    "Outerwear",
  ]);
  const { addItem, items } = useCloset();
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [popup, setPopup] = useState({ visible: false, message: "" });

  // All categories from closet items (dynamic, includes all previous additions)
  const closetCategories = Array.from(
    new Set(items.map((item) => item.category))
  );

  // Combine closet and local categories, deduplicated
  const allCategories = Array.from(
    new Set([...closetCategories, ...localCategories])
  );

  const pickImage = async (fromCamera = false) => {
    setProcessedUri(null);
    const result = await (fromCamera
      ? ImagePicker.launchCameraAsync({ base64: false })
      : ImagePicker.launchImageLibraryAsync({ base64: false }));

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      removeBackground(uri);
    }
  };

  const removeBackground = async (uri: string) => {
    setLoading(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const res = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        {
          image_file_b64: base64,
          size: "auto",
        },
        {
          headers: {
            "X-Api-Key": REMOVE_BG_API_KEY,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      const outputPath =
        FileSystem.documentDirectory +
        `no-bg-${Date.now()}-${Math.floor(Math.random() * 10000)}.png`;
      await FileSystem.writeAsStringAsync(
        outputPath,
        Buffer.from(res.data).toString("base64"),
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );

      setProcessedUri(outputPath);
    } catch (err) {
      console.error("Remove.bg error:", err);
      Alert.alert("Error", "Failed to remove background.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (category: string) => {
    if (!processedUri) return;

    addItem({
      id: uuid.v4(),
      imageUri: processedUri,
      category,
      dateAdded: new Date().toISOString(),
    });

    setPopup({
      visible: true,
      message: `Clothing saved in category: ${category}`,
    });
    setImageUri(null);
    setProcessedUri(null);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !allCategories.includes(newCategory.trim())) {
      setLocalCategories([...localCategories, newCategory.trim()]);
      setNewCategory("");
      setShowModal(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>✨ Add Your Cute Outfit</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => pickImage(false)}
          >
            <Text style={styles.buttonText}>Choose Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => pickImage(true)}
          >
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#f88"
            style={{ marginTop: 20 }}
          />
        )}

        {imageUri && processedUri && (
          <View style={styles.imageRow}>
            <View style={styles.imageContainer}>
              <Text style={styles.imageLabel}>Original</Text>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </View>
            <View style={styles.imageContainer}>
              <Text style={styles.imageLabel}>No BG</Text>
              <Image source={{ uri: processedUri }} style={styles.image} />
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Pick a Category:</Text>
        <View style={styles.categoryRow}>
          {allCategories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={styles.categoryButton}
              onPress={() => handleSave(cat)}
            >
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addCatButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={{ fontSize: 18, color: "#f88" }}>＋</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Enter New Category</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Dress"
              value={newCategory}
              onChangeText={setNewCategory}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddCategory}>
                <Text style={styles.modalBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <PopupMessage
        visible={popup.visible}
        message={popup.message}
        icon={
          <MaterialCommunityIcons
            name="heart-outline"
            size={32}
            color="#d63384"
          />
        }
        onClose={() => setPopup({ ...popup, visible: false })}
      />
    </SafeAreaView>
  );
}

// ...styles stay the same as before...

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fff0f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d63384",
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#f8b",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  imageContainer: {
    width: "48%",
    alignItems: "center",
  },

  imageLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    color: "#d63384",
    backgroundColor: "#ffe0f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  image: {
    width: "100%",
    aspectRatio: 3 / 4, // tall layout
    resizeMode: "contain",
    borderRadius: 16,
    backgroundColor: "#fff0f5",
    borderWidth: 1,
    borderColor: "#f7c8da",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 16,
    color: "#c2185b",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  categoryButton: {
    backgroundColor: "#ffe0ef",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  categoryText: {
    color: "#c2185b",
    fontWeight: "500",
  },
  addCatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#f88",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)", // semi-transparent black
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // ensure it stays on top
  },

  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#c2185b",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#f7c8da",
    borderRadius: 12,
    width: "100%",
    padding: 10,
    marginBottom: 20,
  },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalBtnText: {
    color: "#d63384",
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 16,
  },
});
