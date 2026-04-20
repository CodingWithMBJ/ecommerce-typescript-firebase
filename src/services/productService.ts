import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import type { Product } from "../types/product";

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, "products"));

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<Product, "id">),
  }));
};

export const getProductById = async (
  productId: string,
): Promise<Product | null> => {
  const snapshot = await getDoc(doc(db, "products", productId));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Product, "id">),
  };
};

export const createProduct = async (product: ProductInput) => {
  const docRef = await addDoc(collection(db, "products"), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

export const updateProduct = async (
  productId: string,
  updates: Partial<ProductInput>,
) => {
  await updateDoc(doc(db, "products", productId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProduct = async (productId: string) => {
  await deleteDoc(doc(db, "products", productId));
};
