import { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Rating,
    Alert,
} from "@mui/material";
import { Send } from "lucide-react";

interface ReviewFormProps {
    onSubmit: (rating: number, text: string) => void;
}

function ReviewForm({ onSubmit }: ReviewFormProps) {
    const [rating, setRating] = useState<number | null>(0);
    const [text, setText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!rating || rating === 0) {
            setError("Wybierz ocenę (1-5 gwiazdek)");
            return;
        }

        if (text.trim().length < 10) {
            setError("Opinia musi zawierać minimum 10 znaków");
            return;
        }

        onSubmit(rating, text.trim());
        setRating(0);
        setText("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <Paper sx={{ p: 3, bgcolor: "background.paper" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Dodaj opinię
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Twoja ocena
                    </Typography>
                    <Rating
                        value={rating}
                        onChange={(_, newValue) => setRating(newValue)}
                        size="large"
                        sx={{
                            "& .MuiRating-iconFilled": {
                                color: "#facc15",
                            },
                            "& .MuiRating-iconHover": {
                                color: "#fbbf24",
                            },
                        }}
                    />
                </Box>

                <TextField
                    label="Twoja opinia"
                    multiline
                    rows={4}
                    fullWidth
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Opisz swoje doświadczenia z produktem (min. 10 znaków)"
                    sx={{ mb: 2 }}
                    helperText={`${text.length}/10 znaków minimum`}
                />

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Dziękujemy za dodanie opinii!
                    </Alert>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    endIcon={<Send size={18} />}
                >
                    Wyślij opinię
                </Button>
            </Box>
        </Paper>
    );
}

export default ReviewForm;
