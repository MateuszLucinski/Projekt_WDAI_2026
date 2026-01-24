import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
    const { items, totalPrice, clearCart } = useCart();
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [address, setAddress] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) return alert("Podaj adres dostawy");
        if (!user?.id) return alert("Błąd użytkownika - brak ID");

        try {
            // Backend (Service2) expects 1 order per book: { userId, bookId, quantity }
            // We loop through cart items and send multiple requests.
            const orderPromises = items.map((item) =>
                axios.post(
                    "http://localhost:3002/api/orders",
                    {
                        userId: user.id,
                        bookId: item.id,
                        quantity: item.quantity,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
            );

            await Promise.all(orderPromises);

            clearCart();
            alert("Zamówienia zostały złożone (jako osobne pozycje per produkt)");
            navigate("/orders");
        } catch (error) {
            console.error("Błąd składania zamówienia", error);
            alert("Wystąpił błąd podczas składania zamówienia");
        }
    };

    return (
        <div>
            <h2>Finalizacja Zamówienia</h2>
            <p>Do zapłaty: {totalPrice} PLN</p>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>Adres dostawy:</label>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        style={{ width: "100%", height: "100px" }}
                    />
                </div>
                <button type="submit" style={{ padding: "0.5rem 1rem", backgroundColor: "#4CAF50", color: "white", border: "none" }}>
                    Zamawiam i płacę
                </button>
            </form>
        </div>
    );
};

export default Checkout;
