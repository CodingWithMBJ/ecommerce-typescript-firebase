import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../types/product";

export type CartItem = Product & {
  quantity: number;
};

type CartState = {
  items: CartItem[];
  checkoutMessage: string;
};

const loadCartFromSessionStorage = (): CartItem[] => {
  const savedCart = sessionStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};

const saveCartToSessionStorage = (items: CartItem[]) => {
  sessionStorage.setItem("cart", JSON.stringify(items));
};

const initialState: CartState = {
  items: loadCartFromSessionStorage(),
  checkoutMessage: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }

      state.checkoutMessage = "";
      saveCartToSessionStorage(state.items);
    },

    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((product) => product.id === action.payload);

      if (item) {
        item.quantity += 1;
      }

      saveCartToSessionStorage(state.items);
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((product) => product.id === action.payload);

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (product) => product.id !== action.payload,
          );
        }
      }

      saveCartToSessionStorage(state.items);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToSessionStorage(state.items);
    },

    emptyCart: (state) => {
      state.items = [];
      saveCartToSessionStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.checkoutMessage =
        "Checkout successful! Your cart has been cleared.";
      sessionStorage.removeItem("cart");
    },

    clearCheckoutMessage: (state) => {
      state.checkoutMessage = "";
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  emptyCart,
  clearCart,
  clearCheckoutMessage,
} = cartSlice.actions;

export default cartSlice.reducer;
