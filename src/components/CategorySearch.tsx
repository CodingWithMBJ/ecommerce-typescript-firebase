import React, { useEffect, useState } from "react";
import type { CategoryOption, CategorySearchProps } from "../types/form";
import { getProducts } from "../services/productService";

const CategorySearch = ({
  selectedCategory,
  onCategoryChange,
}: CategorySearchProps) => {
  const [options, setOptions] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const products = await getProducts();

        const uniqueCategories = Array.from(
          new Set(products.map((product) => product.category)),
        );

        const formattedOptions = uniqueCategories.map((category) => ({
          value: category,
          label: category.charAt(0).toUpperCase() + category.slice(1),
        }));

        setOptions(formattedOptions);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="category-container">
      <label htmlFor="category">Category:</label>
      <select
        id="category"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        disabled={loading}
      >
        <option value="">All categories</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySearch;
