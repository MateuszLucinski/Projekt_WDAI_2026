import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import {
    Box,
    Typography,
    Container,
    Paper,
    Divider,
    Chip,
    Button // Dodany przycisk do resetu
} from "@mui/material";
import { Calendar, Hash, ShoppingBag, Trash2 } from "lucide-react";

interface Order {
    id: number;
    userId: number;
    itemId: number;
    quantity: number;
    createdAt: string;
    reviewStars?: number | null;
    reviewContent?: string | null;
}

const AdminOrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const { token, user } = useAuth();

    const fetchOrders = async () => {
        if (!user?.id) return;
        try {
            const response = await axios.get(
                `http://localhost:3002/api/orders`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(response.data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    };

    useEffect(() => {
        if (token && user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchOrders();
        }
    }, [token, user]);

    // Funkcja do resetowania opinii
    const handleResetReview = async (orderId: number) => {
        try {
            await axios.patch(
                `http://localhost:3002/api/orders/${orderId}/review/reset`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Odśwież listę po udanym resecie
            fetchOrders();
        } catch (error) {
            console.error("Błąd podczas resetowania opinii", error);
            alert("Nie udało się usunąć opinii. Upewnij się, że masz uprawnienia admina.");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                    Wszystkie Zamówienia
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Panel Administratora - Zarządzanie historią i opiniami
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
                                                <Typography color="text.secondary">Użytkownik ID:</Typography>
                                                <Typography fontWeight="medium">{order.userId}</Typography>
                                            </Box>
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
                                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                                position: 'relative'
                                            }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Typography variant="subtitle2" color="primary" gutterBottom>
                                                        Opinia klienta
                                                    </Typography>
                                                    {/* Przycisk Resetu dla Admina */}
                                                    <Button 
                                                        size="small" 
                                                        color="error" 
                                                        startIcon={<Trash2 size={14} />}
                                                        onClick={() => handleResetReview(order.id)}
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        Usuń opinię
                                                    </Button>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Typography component="span" sx={{ color: '#facc15' }}>
                                                        {'★'.repeat(order.reviewStars)}
                                                        <Typography component="span" sx={{ color: 'text.disabled' }}>
                                                            {'★'.repeat(5 - (order.reviewStars || 0))}
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
                                            <Box sx={{ 
                                                p: 2, 
                                                border: '1px dashed rgba(255, 255, 255, 0.2)', 
                                                borderRadius: 2,
                                                textAlign: 'center' 
                                            }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Brak opinii dla tego zamówienia
                                                </Typography>
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

export default AdminOrderHistory;