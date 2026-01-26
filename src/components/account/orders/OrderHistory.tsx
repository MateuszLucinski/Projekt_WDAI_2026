import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

interface Order {
    id: number;
    userId: number;
    bookId: number;
    quantity: number;
    createdAt: string;
}

const OrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const { token, user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) return;
            try {
                // Backend API expects userId in path
                const response = await axios.get(`http://localhost:3002/api/orders/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        };

        if (token && user) {
            fetchOrders();
        }
    }, [token, user]);

    return (
        <div>
            <h2>Twoje Zamówienia</h2>
            {orders.length === 0 ? (
                <p>Brak zamówień.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {orders.map((order) => (
                        <li key={order.id} style={{ border: "1px solid #ddd", margin: "10px 0", padding: "10px" }}>
                            <p><strong>Zamówienie #{order.id}</strong></p>
                            <p>Data: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p>ID Produktu (Książki): {order.bookId}</p>
                            <p>Ilość: {order.quantity}</p>
                            {/* Backend does not store Price or Title in Order model */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderHistory;
