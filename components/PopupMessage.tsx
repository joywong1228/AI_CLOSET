import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";

type PopupMessageProps = {
  visible: boolean;
  message: string;
  onClose: () => void;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
};

export default function PopupMessage({
  visible,
  message,
  onClose,
  icon,
  actionText,
  onAction,
}: PopupMessageProps) {
  const [fadeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      {/* Pressable covers the whole overlay to close when tapped */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.popupBox} pointerEvents="box-none">
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Text style={styles.msgText}>{message}</Text>
        {actionText && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              onAction?.();
              onClose();
            }}
          >
            <Text style={styles.actionBtnText}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,182,193,0.14)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  popupBox: {
    backgroundColor: "#fff0f7",
    paddingVertical: 30,
    paddingHorizontal: 28,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#f7c8da",
    alignItems: "center",
    shadowColor: "#d63384",
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 9,
    minWidth: 220,
    maxWidth: 320,
  },
  icon: {
    marginBottom: 10,
  },
  msgText: {
    color: "#d63384",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  actionBtn: {
    marginTop: 8,
    backgroundColor: "#ffe0ef",
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 9,
  },
  actionBtnText: {
    color: "#c2185b",
    fontWeight: "700",
    fontSize: 15,
  },
});
