import type { SearchBarProps } from "../types/form";
import React from "react";

const SearchBar = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search products...",
}: SearchBarProps) => {
  return (
    <div className="searchbar-container">
      <label htmlFor="search">Search:</label>
      <input
        id="search"
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;
