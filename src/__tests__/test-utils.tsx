import { configureStore } from "@reduxjs/toolkit";
import React, { type ReactNode } from "react";
import { Provider } from "react-redux";
import cartReducer from "../redux/cartSlice";

export function renderWithRedux(children: ReactNode) {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
  });

  return {
    store,
    ui: <Provider store={store}>{children}</Provider>,
  };
}
