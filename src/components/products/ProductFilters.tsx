import {
    Box,
    Paper,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Slider,
    InputAdornment,
    Chip,
    IconButton,
} from "@mui/material";
import { Search, X } from "lucide-react";

interface ProductFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedCategory: string;
    onCategoryChange: (value: string) => void;
    categories: string[];
    priceRange: number[];
    onPriceRangeChange: (value: number[]) => void;
    maxPrice: number;
}

function ProductFilters({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories,
    priceRange,
    onPriceRangeChange,
    maxPrice,
}: ProductFiltersProps) {
    const handleClearFilters = () => {
        onSearchChange("");
        onCategoryChange("");
        onPriceRangeChange([0, maxPrice]);
    };

    const hasActiveFilters = searchQuery || selectedCategory || priceRange[0] > 0 || priceRange[1] < maxPrice;

    return (
        <Paper sx={{ p: 3, mb: 4, bgcolor: "background.paper" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Filtry
                </Typography>
                {hasActiveFilters && (
                    <Chip
                        label="Wyczyść filtry"
                        onDelete={handleClearFilters}
                        deleteIcon={<X size={16} />}
                        size="small"
                        sx={{ bgcolor: "action.hover" }}
                    />
                )}
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "2fr 1fr 2fr" },
                    gap: 3,
                    alignItems: "start",
                }}
            >
                <TextField
                    label="Szukaj produktu"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={20} />
                            </InputAdornment>
                        ),
                        endAdornment: searchQuery && (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => onSearchChange("")}>
                                    <X size={16} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControl fullWidth>
                    <InputLabel>Kategoria</InputLabel>
                    <Select
                        value={selectedCategory}
                        label="Kategoria"
                        onChange={(e) => onCategoryChange(e.target.value)}
                    >
                        <MenuItem value="">Wszystkie</MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat} sx={{ textTransform: "capitalize" }}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Zakres cenowy: {priceRange[0].toFixed(0)} zł - {priceRange[1].toFixed(0)} zł
                    </Typography>
                    <Slider
                        value={priceRange}
                        onChange={(_, value) => onPriceRangeChange(value as number[])}
                        min={0}
                        max={maxPrice}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value.toFixed(0)} zł`}
                        sx={{
                            "& .MuiSlider-thumb": {
                                bgcolor: "primary.main",
                            },
                            "& .MuiSlider-track": {
                                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                            },
                        }}
                    />
                </Box>
            </Box>
        </Paper>
    );
}

export default ProductFilters;
