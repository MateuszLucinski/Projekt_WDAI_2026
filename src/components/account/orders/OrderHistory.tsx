import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import ReviewForm from "./ReviewForm";
import {
    Box,
    Typography,
    Container,
    Paper,
    Divider,
    Chip
} from "@mui/material";
import { Calendar, Hash, ShoppingBag } from "lucide-react";

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
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                    Twoje Zamówienia
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Historia Twoich zakupów i opinie
                </Typography>
            </Box>

            {orders.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, opacity: 0.7 }}>
                    <ShoppingBag size={64} style={{ marginBottom: 16 }} />
                    <Typography variant="h6">Brak zamówień.</Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {orders.map((order) => (
                        <Paper
                            key={order.id}
                            elevation={3}
                            sx={{
                                p: 0,
                                overflow: 'hidden',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            {/* Order Header */}
                            <Box sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                p: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 2
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Chip
                                        icon={<Hash size={16} />}
                                        label={`Zamówienie #${order.id}`}
                                        color="primary"
                                        variant="outlined"
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                        <Calendar size={16} />
                                        <Typography variant="body2">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider />

                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                                    {/* Order Details */}
                                    <Box sx={{ flex: 1, minWidth: { md: '300px' } }}>
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            Szczegóły produktu
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography color="text.secondary">Produkt ID:</Typography>
                                                <Typography fontWeight="medium">{order.itemId}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography color="text.secondary">Ilość:</Typography>
                                                <Typography fontWeight="medium">{order.quantity}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Review Section */}
                                    <Box sx={{ flex: 2 }}>
                                        {order.reviewStars ? (
                                            <Box sx={{
                                                p: 2,
                                                bgcolor: 'background.default',
                                                borderRadius: 2,
                                                border: '1px solid rgba(255, 255, 255, 0.05)'
                                            }}>
                                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                                    Twoja opinia
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Typography component="span" sx={{ color: '#facc15' }}>
                                                        {'★'.repeat(order.reviewStars)}
                                                        <Typography component="span" sx={{ color: 'text.disabled' }}>
                                                            {'★'.repeat(5 - order.reviewStars)}
                                                        </Typography>
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        ({order.reviewStars}/5)
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                                    "{order.reviewContent}"
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                                                    Oceń produkt
                                                </Typography>
                                                <ReviewForm
                                                    onSubmit={(rating, text) =>
                                                        handleAddReview(order.id, rating, text)
                                                    }
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default OrderHistory;
