import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FavoriteItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

interface FavoritesState {
  items: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleFavorite: (item) => {
        set((state) => {
          const exists = state.items.some((i) => i.productId === item.productId);
          if (exists) {
            return { items: state.items.filter((i) => i.productId !== item.productId) };
          }
          return { items: [...state.items, item] };
        });
      },

      isFavorite: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },
    }),
    {
      name: "coral-garden-favorites",
    },
  ),
);
