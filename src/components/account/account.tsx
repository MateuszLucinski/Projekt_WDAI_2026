import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Avatar,
    Divider,
    Stack
} from "@mui/material";
import { User, Mail, Shield, LogOut, ListOrdered } from "lucide-react";

function Account() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleOrderHist = () => {
        if(user?.isAdmin){
             navigate("/all_orders");
        }
        else{
            navigate("/orders");
        }   
    }

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(30, 30, 30, 0.8)',
                    borderRadius: 4
                }}
            >
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                        Twoje Konto
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Zarządzaj swoimi danymi i zamówieniami
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            mb: 2,
                            bgcolor: 'primary.main',
                            fontSize: '2rem'
                        }}
                    >
                        {user?.email?.[0].toUpperCase() || <User />}
                    </Avatar>

                    <Typography variant="h5" fontWeight="600" gutterBottom>
                        {user?.email?.split('@')[0]}
                    </Typography>
                </Box>

                {user ? (
                    <Box sx={{ mb: 4, p: 3, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Mail size={20} style={{ opacity: 0.7 }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Adres Email
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.email}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ opacity: 0.1 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Shield size={20} style={{ opacity: 0.7 }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Rola użytkownika
                                    </Typography>
                                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                                        {user.isAdmin ? 'Administrator' : 'Użytkownik'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Box>
                ) : (
                    <Typography color="error" align="center" sx={{ mb: 3 }}>
                        Brak danych użytkownika. Zaloguj się ponownie.
                    </Typography>
                )}

                <Stack spacing={2}>
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<ListOrdered />}
                        onClick={handleOrderHist}
                        fullWidth
                        sx={{ py: 1.5, borderColor: 'rgba(255, 255, 255, 0.2)', color: 'text.primary' }}
                    >
                        Historia Zamówień
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        size="large"
                        startIcon={<LogOut />}
                        onClick={handleLogout}
                        fullWidth
                        sx={{ py: 1.5 }}
                    >
                        Wyloguj się
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}

export default Account;