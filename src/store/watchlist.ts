import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MediaType, WatchlistItem } from "@/types/tmdb";

interface WatchlistState {
  items: WatchlistItem[];
  addItem: (item: Omit<WatchlistItem, "added_at">) => void;
  removeItem: (id: number, mediaType: MediaType) => void;
  clearAll: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        const exists = items.some(
          (w) => w.id === item.id && w.media_type === item.media_type
        );
        if (exists) return;
        set({
          items: [
            { ...item, added_at: new Date().toISOString() },
            ...items,
          ],
        });
      },

      removeItem: (id, mediaType) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === id && item.media_type === mediaType)
          ),
        }));
      },

      clearAll: () => set({ items: [] }),
    }),
    {
      name: "cinema-watchlist",
    }
  )
);
