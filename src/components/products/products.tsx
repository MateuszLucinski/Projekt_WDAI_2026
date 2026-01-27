import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Skeleton, Alert, Chip } from "@mui/material";
import { Package } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import type { Product } from "../../types/types";

function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);

    useEffect(() => {
        fetch("http://localhost:3001/api/items")
            .then((res) => {
                if (!res.ok) throw new Error("Błąd pobierania produktów");
                return res.json();
            })
            .then((data) => {
                const productsWithStock = data.map((p: Product) => ({
                    ...p,
                    stock: Math.floor(Math.random() * 50) + 1,
                }));
                setProducts(productsWithStock);
                const maxPrice = Math.max(...data.map((p: Product) => p.price));
                setPriceRange([0, Math.ceil(maxPrice)]);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const categories = useMemo(() => {
        const cats = [...new Set(products.map((p) => p.category))];
        return cats.sort();
    }, [products]);

    const maxPrice = useMemo(() => {
        if (products.length === 0) return 1000;
        return Math.ceil(Math.max(...products.map((p) => p.price)));
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !selectedCategory || product.category === selectedCategory;
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [products, searchQuery, selectedCategory, priceRange]);

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                    Wszystkie produkty
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Przeglądaj naszą pełną ofertę produktów
                </Typography>
            </Box>

            {!loading && (
                <ProductFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    categories={categories}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    maxPrice={maxPrice}
                />
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Package size={20} />
                <Typography variant="body1">
                    {loading ? "Ładowanie..." : `Znaleziono ${filteredProducts.length} produktów`}
                </Typography>
                {selectedCategory && (
                    <Chip
                        label={selectedCategory}
                        onDelete={() => setSelectedCategory("")}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                    />
                )}
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                    gap: 3,
                }}
            >
                {loading
                    ? Array.from({ length: 8 }).map((_, index) => (
                        <Box key={index}>
                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                            <Skeleton variant="text" sx={{ mt: 1 }} />
                            <Skeleton variant="text" width="60%" />
                        </Box>
                    ))
                    : filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
            </Box>

            {!loading && filteredProducts.length === 0 && (
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        Nie znaleziono produktów spełniających kryteria
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Spróbuj zmienić filtry wyszukiwania
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default Products;