export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userEmail: string;
  reviewStars: number;
  reviewContent: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
