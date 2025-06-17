import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ClosetItem = {
  id: string;
  imageUri: string;
  category: string;
  dateAdded: string;
  favorite?: boolean; // <--- NEW: favorite flag!
};

type ClosetContextType = {
  items: ClosetItem[];
  addItem: (item: ClosetItem) => void;
  removeItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
};

const ClosetContext = createContext<ClosetContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  toggleFavorite: () => {},
});

export const useCloset = () => useContext(ClosetContext);

export const ClosetProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem("closetItems").then((data) => {
      if (mounted) {
        setItems(data ? JSON.parse(data) : []);
        setIsReady(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Persist to storage
  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem("closetItems", JSON.stringify(items));
    }
  }, [items, isReady]);

  const addItem = (item: ClosetItem) => {
    if (!isReady) return;
    setItems((prev) => [{ ...item, favorite: false }, ...prev]);
  };

  const removeItem = (id: string) => {
    if (!isReady) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFavorite = (id: string) => {
    if (!isReady) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  if (!isReady) return null;

  return (
    <ClosetContext.Provider
      value={{ items, addItem, removeItem, toggleFavorite }}
    >
      {children}
    </ClosetContext.Provider>
  );
};
