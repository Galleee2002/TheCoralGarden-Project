import { describe, it, expect, beforeEach } from "vitest";
import { useFavoritesStore } from "../favoritesStore";

const mockItem = {
  productId: "prod-1",
  name: "Filtro de Agua",
  price: 5000,
  image: "",
  slug: "filtro-de-agua",
};

const mockItem2 = {
  productId: "prod-2",
  name: "Bomba de Acuario",
  price: 12000,
  image: "",
  slug: "bomba-de-acuario",
};

beforeEach(() => {
  useFavoritesStore.setState({ items: [] });
});

describe("favoritesStore", () => {
  describe("toggleFavorite", () => {
    it("adds an item that does not exist", () => {
      useFavoritesStore.getState().toggleFavorite(mockItem);
      expect(useFavoritesStore.getState().items).toHaveLength(1);
      expect(useFavoritesStore.getState().items[0]).toEqual(mockItem);
    });

    it("removes an item that already exists (toggle off)", () => {
      useFavoritesStore.setState({ items: [mockItem] });
      useFavoritesStore.getState().toggleFavorite(mockItem);
      expect(useFavoritesStore.getState().items).toHaveLength(0);
    });

    it("only removes the toggled item, not others", () => {
      useFavoritesStore.setState({ items: [mockItem, mockItem2] });
      useFavoritesStore.getState().toggleFavorite(mockItem);
      const { items } = useFavoritesStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].productId).toBe(mockItem2.productId);
    });
  });

  describe("isFavorite", () => {
    it("returns true for an item in favorites", () => {
      useFavoritesStore.setState({ items: [mockItem] });
      expect(useFavoritesStore.getState().isFavorite(mockItem.productId)).toBe(true);
    });

    it("returns false for an item not in favorites", () => {
      expect(useFavoritesStore.getState().isFavorite("non-existent")).toBe(false);
    });

    it("returns false after toggling an item out", () => {
      useFavoritesStore.setState({ items: [mockItem] });
      useFavoritesStore.getState().toggleFavorite(mockItem);
      expect(useFavoritesStore.getState().isFavorite(mockItem.productId)).toBe(false);
    });
  });
});
