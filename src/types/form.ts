export type CategoryOption = {
  value: string;
  label: string;
};

export type CategorySearchProps = {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
};

export type SearchBarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
};

export type FormProps = {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
};
