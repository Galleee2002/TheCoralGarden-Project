import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "../cartStore";

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
  useCartStore.setState({ items: [] });
});

describe("cartStore", () => {
  describe("addItem", () => {
    it("adds a new item with quantity 1", () => {
      useCartStore.getState().addItem(mockItem);
      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({ ...mockItem, quantity: 1 });
    });

    it("increments quantity if item already exists", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().addItem(mockItem);
      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });

    it("adds multiple distinct items", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().addItem(mockItem2);
      expect(useCartStore.getState().items).toHaveLength(2);
    });
  });

  describe("removeItem", () => {
    it("removes an item by productId", () => {
      useCartStore.setState({ items: [{ ...mockItem, quantity: 1 }] });
      useCartStore.getState().removeItem(mockItem.productId);
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it("does not affect other items when removing one", () => {
      useCartStore.setState({
        items: [
          { ...mockItem, quantity: 1 },
          { ...mockItem2, quantity: 2 },
        ],
      });
      useCartStore.getState().removeItem(mockItem.productId);
      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].productId).toBe(mockItem2.productId);
    });
  });

  describe("updateQuantity", () => {
    it("updates the quantity of an item", () => {
      useCartStore.setState({ items: [{ ...mockItem, quantity: 1 }] });
      useCartStore.getState().updateQuantity(mockItem.productId, 5);
      expect(useCartStore.getState().items[0].quantity).toBe(5);
    });

    it("removes the item when quantity is set to 0", () => {
      useCartStore.setState({ items: [{ ...mockItem, quantity: 3 }] });
      useCartStore.getState().updateQuantity(mockItem.productId, 0);
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it("removes the item when quantity is negative", () => {
      useCartStore.setState({ items: [{ ...mockItem, quantity: 1 }] });
      useCartStore.getState().updateQuantity(mockItem.productId, -1);
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("clearCart", () => {
    it("empties the items array", () => {
      useCartStore.setState({
        items: [
          { ...mockItem, quantity: 2 },
          { ...mockItem2, quantity: 1 },
        ],
      });
      useCartStore.getState().clearCart();
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("totalItems", () => {
    it("returns 0 when cart is empty", () => {
      expect(useCartStore.getState().totalItems()).toBe(0);
    });

    it("sums all quantities", () => {
      useCartStore.setState({
        items: [
          { ...mockItem, quantity: 3 },
          { ...mockItem2, quantity: 2 },
        ],
      });
      expect(useCartStore.getState().totalItems()).toBe(5);
    });
  });

  describe("subtotal", () => {
    it("returns 0 when cart is empty", () => {
      expect(useCartStore.getState().subtotal()).toBe(0);
    });

    it("calculates price × quantity for each item", () => {
      useCartStore.setState({
        items: [
          { ...mockItem, quantity: 2 },   // 5000 × 2 = 10000
          { ...mockItem2, quantity: 1 },  // 12000 × 1 = 12000
        ],
      });
      expect(useCartStore.getState().subtotal()).toBe(22000);
    });
  });
});
