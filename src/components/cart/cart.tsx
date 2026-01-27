import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import {
    Container,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Paper,
    Divider,
    IconButton
} from "@mui/material";
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const Cart = () => {
    const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <Container sx={{ textAlign: 'center', mt: 8 }}>
                <ShoppingBag size={64} style={{ opacity: 0.5, marginBottom: 16 }} />
                <Typography variant="h5" gutterBottom>
                    Twój koszyk jest pusty
                </Typography>
                <Button variant="contained" onClick={() => navigate("/products")} sx={{ mt: 2 }}>
                    Przeglądaj produkty
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                    Twój Koszyk ({items.length})
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Sprawdź i zmodyfikuj wybrane produkty przed złożeniem zamówienia
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Cart Items List */}
                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {items.map((item) => (
                            <Card key={item.id} elevation={3} sx={{ display: 'flex', p: 2, alignItems: 'center' }}>
                                {/* Placeholder for product image if available, otherwise just text layout */}
                                <Box sx={{ flexGrow: 1, ml: 2 }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Cena: {item.price} PLN
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 3 }}>
                                    <IconButton
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        size="small"
                                        color="primary"
                                    >
                                        <Minus size={20} />
                                    </IconButton>

                                    <Typography variant="body1" fontWeight="bold" sx={{ minWidth: '20px', textAlign: 'center' }}>
                                        {item.quantity}
                                    </Typography>

                                    <IconButton
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        size="small"
                                        color="primary"
                                    >
                                        <Plus size={20} />
                                    </IconButton>
                                </Box>

                                <IconButton
                                    onClick={() => removeFromCart(item.id)}
                                    color="error"
                                    aria-label="top"
                                >
                                    <Trash2 />
                                </IconButton>
                            </Card>
                        ))}
                    </Box>
                </Box>

                {/* Order Summary */}
                <Box sx={{ minWidth: { md: '350px' } }}>
                    <Paper elevation={4} sx={{ p: 3, position: 'sticky', top: 100 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            Podsumowanie
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body1">Wartość produktów:</Typography>
                            <Typography variant="body1" fontWeight="bold">{totalPrice.toFixed(2)} PLN</Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">Do zapłaty:</Typography>
                            <Typography variant="h5" color="primary" fontWeight="bold">{totalPrice.toFixed(2)} PLN</Typography>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={() => navigate("/checkout")}
                            sx={{ py: 1.5, fontSize: '1.1rem' }}
                        >
                            Przejdź do dostawy
                        </Button>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
};

export default Cart;