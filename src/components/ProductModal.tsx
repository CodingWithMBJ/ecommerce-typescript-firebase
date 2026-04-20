import type { ProductModalProps } from "../types/product";
import { useAppDispatch } from "../redux/hooks";
import { addToCart } from "../redux/cartSlice";
import { useToast } from "../contexts/ToastContext";

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    addToast(`${product.title} added to cart`, "success");
  };

  return (
    <aside className="product-modal">
      <div
        className="product-modal-overlay"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <article className="product-modal-content">
        <button type="button" className="close-btn btn" onClick={onClose}>
          X
        </button>

        <figure className="product-card-header">
          <img
            src={product.image}
            alt={product.title}
            className="product-card-img"
          />
        </figure>

        <section className="product-card-body">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>
          <p className="product-category">Category: {product.category}</p>
        </section>

        <section className="product-card-footer">
          <button
            type="button"
            className="add-btn btn"
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
        </section>
      </article>
    </aside>
  );
};

export default ProductModal;
