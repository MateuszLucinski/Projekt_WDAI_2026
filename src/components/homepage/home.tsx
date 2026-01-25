import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Skeleton,
  Alert,
} from "@mui/material";
import { Sparkles } from "lucide-react";
import ProductCard from "../products/ProductCard";
import { Product } from "../../types/types";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
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
      <Box
        sx={{
          textAlign: "center",
          mb: 6,
          py: 4,
          background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(236,72,153,0.1) 100%)",
          borderRadius: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 2 }}>
          <Sparkles size={32} color="#6366f1" />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            Witaj w E-Shop
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
          Odkryj najlepsze produkty w atrakcyjnych cenach. Szybka dostawa i gwarancja satysfakcji.
        </Typography>
      </Box>

      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 600 }}>
        Polecane produkty
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" />
            </Grid>
          ))
          : products.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}

export default Home;
