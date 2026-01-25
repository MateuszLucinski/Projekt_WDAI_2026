import { Box, Paper, Typography, Avatar, Rating } from "@mui/material";
import { Review } from "../../types/types";

interface ReviewListProps {
    reviews: Review[];
}

function ReviewList({ reviews }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: "center", bgcolor: "background.paper" }}>
                <Typography color="text.secondary">
                    Brak opinii. Bądź pierwszy i podziel się swoją opinią!
                </Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {reviews.map((review) => (
                <Paper key={review.id} sx={{ p: 3, bgcolor: "background.paper" }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Avatar
                            sx={{
                                bgcolor: "primary.main",
                                width: 44,
                                height: 44,
                                fontWeight: 600,
                            }}
                        >
                            {review.userName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {review.userName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(review.date).toLocaleDateString("pl-PL")}
                                </Typography>
                            </Box>
                            <Rating
                                value={review.rating}
                                readOnly
                                size="small"
                                sx={{
                                    mb: 1,
                                    "& .MuiRating-iconFilled": {
                                        color: "#facc15",
                                    },
                                }}
                            />
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                {review.text}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
}

export default ReviewList;
