import { useState } from "react";
import Form from "../components/Form";
import Products from "../components/Products";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <section className="section">
      <Form
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <Products selectedCategory={selectedCategory} searchTerm={searchTerm} />
    </section>
  );
};

export default Home;
