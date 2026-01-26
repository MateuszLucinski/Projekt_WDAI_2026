import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Cart = () => {
    const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
    const navigate = useNavigate();

    if (items.length === 0) {
        return <div>Twoj koszyk jest pusty</div>;
    }

    return (
        <div>
            <h2>Koszyk</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {items.map((item) => (
                    <div key={item.id} style={{ border: "1px solid #ccc", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <h3>{item.title}</h3>
                            <p>Cena: {item.price} PLN</p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                            <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: "1rem", color: "red" }}>Usuń</button>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: "2rem", borderTop: "2px solid #ccc", paddingTop: "1rem" }}>
                <h3>Suma: {totalPrice.toFixed(2)} PLN</h3>
                <button onClick={() => navigate("/checkout")} style={{ padding: "0.5rem 1rem", fontSize: "1.2rem", backgroundColor: "#4CAF50", color: "white", border: "none", cursor: "pointer" }}>
                    Przejdź do zamówienia
                </button>
            </div>
        </div>
    );
};

export default Cart;