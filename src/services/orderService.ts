import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export type OrderItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id: string;
  userId: string;
  userEmail: string | null;
  items: OrderItem[];
  totalPrice: number;
  createdAt?: {
    seconds?: number;
    nanoseconds?: number;
  };
};

export type CreateOrderInput = {
  userId: string;
  userEmail: string | null;
  items: OrderItem[];
  totalPrice: number;
};

export const createOrder = async ({
  userId,
  userEmail,
  items,
  totalPrice,
}: CreateOrderInput) => {
  const docRef = await addDoc(collection(db, "orders"), {
    userId,
    userEmail,
    items,
    totalPrice,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const ordersQuery = query(
    collection(db, "orders"),
    where("userId", "==", userId),
  );

  const snapshot = await getDocs(ordersQuery);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<Order, "id">),
  }));
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const snapshot = await getDoc(doc(db, "orders", orderId));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Order, "id">),
  };
};
