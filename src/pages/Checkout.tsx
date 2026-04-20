import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearCart, clearCheckoutMessage } from "../redux/cartSlice";
import { useUser } from "../contexts/UserContext";
import { useToast } from "../contexts/ToastContext";
import { createOrder } from "../services/orderService";

const Checkout = () => {
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const { addToast } = useToast();

  const cartItems = useAppSelector((state) => state.cart.items);
  const checkoutMessage = useAppSelector((state) => state.cart.checkoutMessage);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      addToast("Your cart is empty", "error");
      return;
    }

    if (!user) {
      addToast("You must be logged in to complete checkout", "error");
      return;
    }

    try {
      await createOrder({
        userId: user.uid,
        userEmail: user.email,
        items: cartItems.map((item) => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalPrice,
      });

      dispatch(clearCart());
      addToast("Order placed successfully!", "success");
    } catch (error) {
      console.error("Checkout failed:", error);
      addToast("Failed to place order", "error");
    }
  };

  return (
    <section className="section">
      <h1>Checkout</h1>

      {checkoutMessage ? (
        <div>
          <p>{checkoutMessage}</p>
          <button
            type="button"
            className="btn"
            onClick={() => dispatch(clearCheckoutMessage())}
          >
            Dismiss
          </button>
        </div>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <p>Total amount: ${totalPrice.toFixed(2)}</p>
          <button
            type="button"
            className="btn checkout-btn"
            onClick={handleCheckout}
          >
            Complete Purchase
          </button>
        </div>
      )}
    </section>
  );
};

export default Checkout;
