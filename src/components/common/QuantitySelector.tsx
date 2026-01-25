import { Box, IconButton, TextField } from "@mui/material";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
    value: number;
    min?: number;
    max?: number;
    onChange: (value: number) => void;
}

function QuantitySelector({ value, min = 1, max = 99, onChange }: QuantitySelectorProps) {
    const handleDecrease = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleIncrease = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            onChange(newValue);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "background.paper",
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
                p: 0.5,
            }}
        >
            <IconButton
                onClick={handleDecrease}
                disabled={value <= min}
                size="small"
                sx={{
                    bgcolor: "action.hover",
                    "&:hover": { bgcolor: "action.selected" },
                }}
            >
                <Minus size={18} />
            </IconButton>
            <TextField
                value={value}
                onChange={handleInputChange}
                type="number"
                size="small"
                sx={{
                    width: 60,
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { border: "none" },
                    },
                    "& input": {
                        textAlign: "center",
                        fontWeight: 600,
                        MozAppearance: "textfield",
                        "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                            margin: 0,
                        },
                    },
                }}
                inputProps={{ min, max }}
            />
            <IconButton
                onClick={handleIncrease}
                disabled={value >= max}
                size="small"
                sx={{
                    bgcolor: "action.hover",
                    "&:hover": { bgcolor: "action.selected" },
                }}
            >
                <Plus size={18} />
            </IconButton>
        </Box>
    );
}

export default QuantitySelector;
