export type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}
