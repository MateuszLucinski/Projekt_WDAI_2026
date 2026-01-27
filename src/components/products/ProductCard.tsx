import { Link } from "react-router-dom";
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    Chip,
} from "@mui/material";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "../../types/types";
import { useCart } from "../../context/CartContext";
import { useEffect, useState } from "react";

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {

    const { addToCart } = useCart();

    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [reviewsCount, setReviewsCount] = useState<number>(0);
    const [loadingReviews, setLoadingReviews] = useState(true);

    useEffect(() => {
        const fetchReviewsStats = async () => {
            try {
                const res = await fetch(
                    `http://localhost:3002/api/items/${product.id}/reviews`
                );

                if (!res.ok) {
                    setAverageRating(null);
                    setReviewsCount(0);
                    return;
                }

                const data = await res.json();
                setAverageRating(data.averageRating);
                setReviewsCount(data.reviewsCount);
            } catch (err) {
                console.error("Błąd pobierania opinii:", err);
                setAverageRating(null);
                setReviewsCount(0);
            } finally {
                setLoadingReviews(false);
            }
        };

        fetchReviewsStats();
    }, [product.id]);



    const handleAddToCart = ({product} : ProductCardProps) => {
        if (product) {
            addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image
            }, 1);
            
            // Opcjonalnie: alert o sukcesie
            alert(`Dodano 1 szt. produktu do koszyka!`);
        }
    };

    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "visible",
            }}
        >
            <Chip
                label={product.category}
                size="small"
                sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    zIndex: 1,
                    bgcolor: "primary.main",
                    color: "white",
                    fontWeight: 500,
                    textTransform: "capitalize",
                }}
            />
            <CardMedia
                component="img"
                sx={{
                    height: 200,
                    objectFit: "contain",
                    bgcolor: "white",
                    p: 2,
                }}
                image={product.image}
                alt={product.title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                    gutterBottom
                    variant="h6"
                    component={Link}
                    to={`/products/${product.id}`}
                    sx={{
                        textDecoration: "none",
                        color: "text.primary",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "3.6em",
                        "&:hover": {
                            color: "primary.main",
                        },
                    }}
                >
                    {product.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                    <Star size={16} fill="#facc15" color="#facc15" />
                    {loadingReviews && <Typography variant="body2" color="text.secondary">
                        {5} ({1})
                    </Typography>}
                    {!loadingReviews && <Typography variant="body2" color="text.secondary">
                        {averageRating} ({reviewsCount})
                    </Typography>}
                </Box>
                <Typography
                    variant="h5"
                    color="primary.main"
                    sx={{ fontWeight: 700 }}
                >
                    {product.price.toFixed(2)} zł
                </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCart size={18} />}
                    onClick={()=>handleAddToCart({product})}
                >
                    Do koszyka
                </Button>
            </CardActions>
        </Card>
    );
}

export default ProductCard;
