import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../components/SearchBar";

describe("SearchBar", () => {
  test("renders the search input", () => {
    render(
      <SearchBar
        searchTerm=""
        onSearchChange={() => {}}
        placeholder="Search products..."
      />,
    );

    expect(
      screen.getByPlaceholderText("Search products..."),
    ).toBeInTheDocument();
  });

  test("calls onSearchChange when typing", () => {
    const mockSearchChange = jest.fn();

    render(
      <SearchBar
        searchTerm=""
        onSearchChange={mockSearchChange}
        placeholder="Search products..."
      />,
    );

    const input = screen.getByPlaceholderText("Search products...");

    fireEvent.change(input, {
      target: { value: "phone" },
    });

    expect(mockSearchChange).toHaveBeenCalledWith("phone");
  });
});
