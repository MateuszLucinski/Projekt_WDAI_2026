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
import { Product } from "../../types/types";

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {
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
                    <Typography variant="body2" color="text.secondary">
                        {product.rating.rate} ({product.rating.count})
                    </Typography>
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
                    sx={{
                        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                        },
                    }}
                >
                    Do koszyka
                </Button>
            </CardActions>
        </Card>
    );
}

export default ProductCard;
