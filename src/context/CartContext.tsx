import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";


export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}


interface CartContextType {
  items: CartItem[];
  
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);


  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Błąd podczas ładowania koszyka:", error);
      }
    }
  }, []);


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);


  const addToCart = (
    newItem: Omit<CartItem, "quantity">,
    quantityToAdd: number = 1 
  ) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === newItem.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...currentItems, { ...newItem, quantity: quantityToAdd }];
    });
  };


  const removeFromCart = (id: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };


  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };


  const clearCart = () => {
    setItems([]);
  };


  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};