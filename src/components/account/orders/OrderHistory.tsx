import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import ReviewForm from "./ReviewForm"; // importujemy komponent ReviewForm
import { Box, Typography } from "@mui/material";

interface Order {
    id: number;
    userId: number;
    itemId: number;
    quantity: number;
    createdAt: string;
    reviewStars?: number | null;
    reviewContent?: string | null;
}

const OrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const { token, user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) return;
            try {
                const response = await axios.get(
                    `http://localhost:3002/api/orders/${user.id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        };

        if (token && user) {
            fetchOrders();
        }
    }, [token, user]);

    const handleAddReview = async (orderId: number, rating: number, text: string) => {
        try {
            await axios.post(
                `http://localhost:3002/api/orders/${orderId}/review`,
                {
                    reviewStars: rating,
                    reviewContent: text,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Aktualizacja lokalnego stanu zamówień
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId
                        ? { ...order, reviewStars: rating, reviewContent: text }
                        : order
                )
            );
        } catch (error) {
            console.error("Błąd przy dodawaniu opinii", error);
            alert(error);
        }
    };

    return (
        <div>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Twoje Zamówienia
            </Typography>

            {orders.length === 0 ? (
                <Typography>Brak zamówień.</Typography>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {orders.map((order) => (
                        <li
                            key={order.id}
                            style={{
                                border: "1px solid #ddd",
                                margin: "10px 0",
                                padding: "10px",
                                borderRadius: 4,
                            }}
                        >
                            <Typography>
                                <strong>Zamówienie #{order.id}</strong>
                            </Typography>
                            <Typography>
                                Data: {new Date(order.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography>ID Produktu: {order.itemId}</Typography>
                            <Typography>Ilość: {order.quantity}</Typography>

                            {order.reviewStars ? (
                                <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                                    <Typography sx={{ fontWeight: 600 }}>
                                        Twoja opinia:
                                    </Typography>
                                    <Typography>Ocena: {order.reviewStars} / 5</Typography>
                                    <Typography>Treść: {order.reviewContent}</Typography>
                                </Box>
                            ) : (
                                <Box sx={{ mt: 2 }}>
                                    <ReviewForm
                                        onSubmit={(rating, text) =>
                                            handleAddReview(order.id, rating, text)
                                        }
                                    />
                                </Box>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderHistory;
