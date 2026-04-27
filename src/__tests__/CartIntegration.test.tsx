import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { renderWithRedux } from "./test-utils";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addToCart } from "../redux/cartSlice";

const TestProduct = () => {
  const dispatch = useAppDispatch();

  const product = {
    id: "1",
    title: "Test Product",
    price: 25,
    image: "test-image.png",
    category: "testing",
    description: "A product for testing",
  };

  return (
    <button onClick={() => dispatch(addToCart(product))}>Add to Cart</button>
  );
};

const TestCart = () => {
  const cartItems = useAppSelector((state) => state.cart.items);

  return (
    <div>
      <h2>Cart</h2>

      {cartItems.map((item) => (
        <p key={item.id}>
          {item.title} - Quantity: {item.quantity}
        </p>
      ))}
    </div>
  );
};

describe("Cart integration", () => {
  test("cart updates when adding a product", () => {
    const { ui } = renderWithRedux(
      <>
        <TestProduct />
        <TestCart />
      </>,
    );

    render(ui);

    fireEvent.click(screen.getByText("Add to Cart"));

    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
    expect(screen.getByText(/Quantity: 1/i)).toBeInTheDocument();
  });
});
