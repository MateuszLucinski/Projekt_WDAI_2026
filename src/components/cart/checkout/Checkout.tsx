import { useState } from "react";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
      // Mapujemy produkty na obietnice fetch
      const orderPromises = items.map((item) =>
        fetch("http://localhost:3002/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            itemId: item.id,
            quantity: item.quantity,
          }),
        }).then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Błąd serwera: ${response.status} - ${errorText}`);
          }
          return response.json();
        })
      );

      await Promise.all(orderPromises);

      clearCart();
      alert("Zamówienia zostały złożone pomyślnie!");
      navigate("/orders");
    } catch (error) {
      console.error("Błąd składania zamówienia", error);
      alert("Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.");
    }
  };

  return (
    <div>
      <h2>Finalizacja Zamówienia</h2>
      <p>Do zapłaty: <strong>{totalPrice.toFixed(2)} PLN</strong></p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Adres dostawy:
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            style={{ width: "100%", height: "100px", padding: "8px" }}
            placeholder="Wpisz pełny adres dostawy..."
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "0.7rem 1.5rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Zamawiam i płacę
        </button>
      </form>
    </div>
  );
};

export default Checkout;