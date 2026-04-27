import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { getProducts } from "../services/productService";
import CategorySearch from "../components/CategorySearch";

jest.mock("../services/productService.ts", () => ({
  getProducts: jest.fn(),
}));

describe("CategorySearch", () => {
  test("renders categories from products", async () => {
    (getProducts as jest.Mock).mockResolvedValue([
      { id: "1", title: "Shirt", category: "clothing" },
      { id: "2", title: "Laptop", category: "electronics" },
    ]);

    render(<CategorySearch selectedCategory="" onCategoryChange={() => {}} />);

    expect(await screen.findByText("Clothing")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
  });

  test("calls onCategoryChange when category is selected", async () => {
    const mockCategoryChange = jest.fn();

    (getProducts as jest.Mock).mockResolvedValue([
      { id: "1", title: "Shirt", category: "clothing" },
    ]);

    render(
      <CategorySearch
        selectedCategory=""
        onCategoryChange={mockCategoryChange}
      />,
    );

    await screen.findByText("Clothing");

    const select = screen.getByLabelText("Category:");

    fireEvent.change(select, {
      target: { value: "clothing" },
    });

    expect(mockCategoryChange).toHaveBeenCalledWith("clothing");
  });
});
