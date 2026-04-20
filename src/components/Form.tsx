import CategorySearch from "./CategorySearch";
import SearchBar from "./SearchBar";
import type { FormProps } from "../types/form";

const Form = ({
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}: FormProps) => {
  return (
    <section className="form-wrapper">
      <div className="form-controls">
        <CategorySearch
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          placeholder="Search products..."
        />
      </div>
    </section>
  );
};

export default Form;
