import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Chip,
    Divider,
    Skeleton,
    Alert,
    Paper,
    Breadcrumbs,
} from "@mui/material";
import { ShoppingCart, Star, Package, ArrowLeft, Check } from "lucide-react";
import QuantitySelector from "../common/QuantitySelector";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import type { Product, Review } from "../../types/types";

function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: 1,
            productId: Number(id),
            userId: 1,
            userName: "Jan Kowalski",
            rating: 5,
            text: "Świetny produkt! Polecam każdemu, jakość bardzo dobra.",
            date: "2026-01-15",
        },
        {
            id: 2,
            productId: Number(id),
            userId: 2,
            userName: "Anna Nowak",
            rating: 4,
            text: "Bardzo dobry produkt, szybka dostawa. Trochę droższy niż konkurencja.",
            date: "2026-01-10",
        },
    ]);

    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Produkt nie znaleziony");
                return res.json();
            })
            .then((data) => {
                setProduct({ ...data, stock: Math.floor(Math.random() * 50) + 1 });
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleAddReview = (rating: number, text: string) => {
        const newReview: Review = {
            id: reviews.length + 1,
            productId: Number(id),
            userId: 999,
            userName: "Użytkownik",
            rating,
            text,
            date: new Date().toISOString().split("T")[0],
        };
        setReviews([newReview, ...reviews]);
    };

    if (loading) {
        return (
            <Box>
                <Skeleton variant="text" width={200} height={40} />
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: 4,
                        mt: 2,
                    }}
                >
                    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                    <Box>
                        <Skeleton variant="text" height={60} />
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" height={100} />
                    </Box>
                </Box>
            </Box>
        );
    }

    if (error || !product) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error || "Nie znaleziono produktu"}
            </Alert>
        );
    }

    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : product.rating.rate;

    return (
        <Box>
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ArrowLeft size={16} />
                        Strona główna
                    </Box>
                </Link>
                <Link to="/products" style={{ textDecoration: "none", color: "inherit" }}>
                    Produkty
                </Link>
                <Typography color="text.primary">{product.title}</Typography>
            </Breadcrumbs>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 4,
                }}
            >
                <Paper
                    sx={{
                        p: 4,
                        bgcolor: "white",
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 400,
                    }}
                >
                    <img
                        src={product.image}
                        alt={product.title}
                        style={{
                            maxWidth: "100%",
                            maxHeight: 350,
                            objectFit: "contain",
                        }}
                    />
                </Paper>

                <Box>
                    <Chip
                        label={product.category}
                        sx={{
                            mb: 2,
                            bgcolor: "primary.main",
                            color: "white",
                            textTransform: "capitalize",
                        }}
                    />
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                        {product.title}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={20}
                                fill={i < Math.round(averageRating) ? "#facc15" : "transparent"}
                                color="#facc15"
                            />
                        ))}
                        <Typography variant="body1" color="text.secondary">
                            {averageRating.toFixed(1)} ({reviews.length} opinii)
                        </Typography>
                    </Box>

                    <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700, mb: 3 }}>
                        {product.price.toFixed(2)} zł
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                        {product.description}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                        <Package size={20} />
                        <Typography>
                            Dostępność:{" "}
                            <Box component="span" sx={{ color: product.stock > 0 ? "success.main" : "error.main", fontWeight: 600 }}>
                                {product.stock > 0 ? `${product.stock} szt. w magazynie` : "Brak w magazynie"}
                            </Box>
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Ilość:
                        </Typography>
                        <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} />
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<ShoppingCart size={20} />}
                        disabled={product.stock === 0}
                    >
                        Dodaj do koszyka
                    </Button>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2, color: "text.secondary" }}>
                        <Check size={16} />
                        <Typography variant="body2">Darmowa dostawa od 200 zł</Typography>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ my: 6 }} />

            <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 4 }}>
                    Opinie klientów ({reviews.length})
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" },
                        gap: 4,
                    }}
                >
                    <ReviewForm onSubmit={handleAddReview} />
                    <ReviewList reviews={reviews} />
                </Box>
            </Box>
        </Box>
    );
}

export default ProductDetails;
