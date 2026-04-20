import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  emptyCart,
} from "../redux/cartSlice";

const ShoppingCart = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const totalProducts = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <section className="section">
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <section className="cart-list">
            {cartItems.map((item) => (
              <article key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.title}
                  className="cart-item-img"
                />

                <div className="cart-item-info">
                  <h2>{item.title}</h2>
                  <p>Price: ${item.price.toFixed(2)}</p>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      className="btn quantity-btn"
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                    >
                      -
                    </button>

                    <span className="quantity">{item.quantity}</span>

                    <button
                      type="button"
                      className="btn quantity-btn"
                      onClick={() => dispatch(increaseQuantity(item.id))}
                    >
                      +
                    </button>
                  </div>

                  <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <button
                  type="button"
                  className="btn remove-btn"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </button>
              </article>
            ))}
          </section>

          <section className="cart-summary">
            <p>Total products: {totalProducts}</p>
            <p>Total price: ${totalPrice.toFixed(2)}</p>

            <div className="cart-summary-actions">
              <button
                type="button"
                className="btn empty-cart-btn"
                onClick={() => dispatch(emptyCart())}
              >
                Empty Cart
              </button>

              <Link to="/checkout" className="btn checkout-btn">
                Proceed to Checkout
              </Link>
            </div>
          </section>
        </>
      )}
    </section>
  );
};

export default ShoppingCart;
