import { useCloset } from "../context/ClosetContext";
import { View, Text, Image, ScrollView } from "react-native";

export default function CategoryPage() {
  const { items } = useCloset();

  return (
    <ScrollView>
      {["Top", "Bottom", "Outerwear"].map((cat) => (
        <View key={cat}>
          <Text style={{ fontSize: 20 }}>{cat}</Text>
          {items
            .filter((i) => i.category === cat)
            .map((item) => (
              <Image
                key={item.id}
                source={{ uri: item.imageUri }}
                style={{ width: 100, height: 100 }}
              />
            ))}
        </View>
      ))}
    </ScrollView>
  );
}
