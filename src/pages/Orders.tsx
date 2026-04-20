import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useToast } from "../contexts/ToastContext";
import { getUserOrders, type Order } from "../services/orderService";

const Orders = () => {
  const { user } = useUser();
  const { addToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getUserOrders(user.uid);
        setOrders(data);
      } catch (error) {
        console.error(error);
        addToast("Failed to load order history", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, addToast]);

  const formatDate = (seconds?: number) => {
    if (!seconds) return "Unknown date";
    return new Date(seconds * 1000).toLocaleString();
  };

  if (isLoading) {
    return <p>Loading orders...</p>;
  }

  return (
    <section className="section orders-page">
      <h1>Order History</h1>

      {orders.length === 0 ? (
        <div>
          <p>You have no previous orders yet.</p>
          <Link to="/" className="btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-layout">
          <section className="orders-list">
            {orders.map((order) => (
              <article key={order.id} className="order-card">
                <h2>Order #{order.id.slice(0, 8)}</h2>
                <p>Date: {formatDate(order.createdAt?.seconds)}</p>
                <p>Items: {order.items.length}</p>
                <p>Total: ${order.totalPrice.toFixed(2)}</p>

                <button
                  type="button"
                  className="btn"
                  onClick={() => setSelectedOrder(order)}
                >
                  View Details
                </button>
              </article>
            ))}
          </section>

          <aside className="order-details">
            {selectedOrder ? (
              <>
                <h2>Order Details</h2>
                <p>
                  <strong>Order ID:</strong> {selectedOrder.id}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {formatDate(selectedOrder.createdAt?.seconds)}
                </p>
                <p>
                  <strong>Total:</strong> ${selectedOrder.totalPrice.toFixed(2)}
                </p>

                <section className="order-items">
                  {selectedOrder.items.map((item) => (
                    <article key={item.productId} className="order-item">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="order-item-img"
                      />

                      <div>
                        <h3>{item.title}</h3>
                        <p>Price: ${item.price.toFixed(2)}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </article>
                  ))}
                </section>
              </>
            ) : (
              <p>Select an order to view its details.</p>
            )}
          </aside>
        </div>
      )}
    </section>
  );
};

export default Orders;
