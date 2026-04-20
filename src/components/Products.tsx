import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product } from "../types/product";
import ProductModal from "./ProductModal";
import ProductForm from "./ProductForm";
import { useAppDispatch } from "../redux/hooks";
import { addToCart } from "../redux/cartSlice";
import { useToast } from "../contexts/ToastContext";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type ProductInput,
} from "../services/productService";

type ProductsProps = {
  selectedCategory: string;
  searchTerm: string;
};

const Products = ({ selectedCategory, searchTerm }: ProductsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductInput) => createProduct(data),
    onSuccess: async () => {
      addToast("Product created successfully", "success");
      setShowCreateForm(false);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      addToast("Failed to create product", "error");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      productId,
      updates,
    }: {
      productId: string;
      updates: Partial<ProductInput>;
    }) => updateProduct(productId, updates),
    onSuccess: async () => {
      addToast("Product updated successfully", "success");
      setEditingProduct(null);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      addToast("Failed to update product", "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: async () => {
      addToast("Product deleted successfully", "success");
      setSelectedProduct(null);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      addToast("Failed to delete product", "error");
    },
  });

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    const matchesSearch = searchTerm
      ? product.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    addToast(`${product.title} added to cart`, "success");
  };

  const handleCreateProduct = async (data: ProductInput) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdateProduct = async (data: ProductInput) => {
    if (!editingProduct) return;

    await updateMutation.mutateAsync({
      productId: editingProduct.id,
      updates: data,
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    await deleteMutation.mutateAsync(productId);
  };

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products.</p>;

  return (
    <>
      <div className="dashboard-actions" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className="btn"
          onClick={() => setShowCreateForm((prev) => !prev)}
        >
          {showCreateForm ? "Close Product Form" : "Add Product"}
        </button>
      </div>

      {showCreateForm && (
        <ProductForm
          submitLabel="Create Product"
          onSubmit={handleCreateProduct}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {editingProduct && (
        <ProductForm
          initialData={editingProduct}
          submitLabel="Update Product"
          onSubmit={handleUpdateProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      <section className="section product-list">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <article
              className="product-card"
              key={product.id}
              onClick={() => setSelectedProduct(product)}
            >
              <figure className="product-card-header">
                <img
                  src={product.image}
                  alt={product.title}
                  className="product-card-img"
                />
              </figure>

              <section className="product-card-body">
                <h2 className="product-title">{product.title}</h2>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-category">{product.category}</p>
              </section>

              <section className="product-card-footer">
                <button
                  type="button"
                  className="btn add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  Add to cart
                </button>

                <button
                  type="button"
                  className="btn view-product-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(product);
                  }}
                >
                  View
                </button>

                <button
                  type="button"
                  className="btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProduct(product);
                  }}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProduct(product.id);
                  }}
                >
                  Delete
                </button>
              </section>
            </article>
          ))
        )}

        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </section>
    </>
  );
};

export default Products;
