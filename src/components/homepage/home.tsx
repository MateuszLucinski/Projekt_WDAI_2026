import { useState, useEffect } from "react";
import { Box, Typography, Skeleton, Alert } from "@mui/material";
import ProductCard from "../products/ProductCard";
import type { Product } from "../../types/types";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <Box>
      <Box sx={{ textAlign: "center", mb: 4, py: 3 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
          Witaj w E-Shop
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Odkryj najlepsze produkty w atrakcyjnych cenach.
        </Typography>
      </Box>

      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Polecane produkty
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
            <Box key={index}>
              <Skeleton variant="rectangular" height={180} />
              <Skeleton variant="text" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" />
            </Box>
          ))
          : products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </Box>
    </Box>
  );
}

export default Home;
