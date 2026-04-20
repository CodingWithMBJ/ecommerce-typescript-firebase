import { useEffect, useState, type FormEvent } from "react";
import type { Product } from "../types/product";
import type { ProductInput } from "../services/productService";
import { useToast } from "../contexts/ToastContext";

type ProductFormProps = {
  initialData?: Product | null;
  onSubmit: (data: ProductInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
};

const ProductForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  submitLabel,
}: ProductFormProps) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setPrice(String(initialData.price));
      setCategory(initialData.category);
      setDescription(initialData.description);
      setImage(initialData.image);
    } else {
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImage("");
    }
  }, [initialData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !price || !category || !description || !image) {
      addToast("All product fields are required", "error");
      return;
    }

    if (Number(price) <= 0) {
      addToast("Price must be greater than 0", "error");
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        title,
        price: Number(price),
        category,
        description,
        image,
      });

      if (!initialData) {
        setTitle("");
        setPrice("");
        setCategory("");
        setDescription("");
        setImage("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-container">
        <input
          type="text"
          placeholder="Product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="dashboard-actions">
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </button>

        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
