import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Container,
    Button,
    useTheme,
    useMediaQuery,
    Badge,
} from "@mui/material";
import {
    Menu,
    X,
    Home,
    Search,
    ShoppingCart,
    User,
    LogIn,
} from "lucide-react";

interface LayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { label: "Strona główna", path: "/", icon: Home },
    { label: "Produkty", path: "/products", icon: Search },
    { label: "Koszyk", path: "/cart", icon: ShoppingCart },
    { label: "Moje Konto", path: "/account", icon: User },
    { label: "Zaloguj", path: "/login", icon: LogIn },
];

function Layout({ children }: LayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box sx={{ width: 280, height: "100%", bgcolor: "background.paper" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                    E-Shop
                </Typography>
                <IconButton onClick={handleDrawerToggle} sx={{ color: "text.primary" }}>
                    <X size={24} />
                </IconButton>
            </Box>
            <List sx={{ pt: 2 }}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.path} disablePadding sx={{ px: 1, mb: 0.5 }}>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                onClick={handleDrawerToggle}
                                sx={{
                                    borderRadius: 2,
                                    bgcolor: isActive ? "primary.main" : "transparent",
                                    "&:hover": {
                                        bgcolor: isActive ? "primary.dark" : "action.hover",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <Icon
                                        size={20}
                                        color={isActive ? "#fff" : theme.palette.text.secondary}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    sx={{
                                        "& .MuiTypography-root": {
                                            fontWeight: isActive ? 600 : 400,
                                            color: isActive ? "#fff" : "text.primary",
                                        },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <AppBar
                position="sticky"
                sx={{
                    bgcolor: "background.paper",
                    borderBottom: 1,
                    borderColor: "divider",
                }}
                elevation={0}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {isMobile && (
                                <IconButton
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{ color: "text.primary" }}
                                >
                                    <Menu size={24} />
                                </IconButton>
                            )}
                            <Typography
                                variant="h5"
                                component={Link}
                                to="/"
                                sx={{
                                    fontWeight: 700,
                                    color: "primary.main",
                                    textDecoration: "none",
                                    letterSpacing: "-0.5px",
                                }}
                            >
                                E-Shop
                            </Typography>
                        </Box>

                        {!isMobile && (
                            <Box sx={{ display: "flex", gap: 1 }}>
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    const Icon = item.icon;
                                    return (
                                        <Button
                                            key={item.path}
                                            component={Link}
                                            to={item.path}
                                            startIcon={
                                                item.path === "/cart" ? (
                                                    <Badge badgeContent={0} color="secondary">
                                                        <Icon size={18} />
                                                    </Badge>
                                                ) : (
                                                    <Icon size={18} />
                                                )
                                            }
                                            sx={{
                                                color: isActive ? "primary.main" : "text.secondary",
                                                fontWeight: isActive ? 600 : 400,
                                                "&:hover": {
                                                    bgcolor: "action.hover",
                                                    color: "primary.main",
                                                },
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    );
                                })}
                            </Box>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: 280,
                        bgcolor: "background.paper",
                    },
                }}
            >
                {drawer}
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                <Container maxWidth="xl">{children}</Container>
            </Box>

            <Box
                component="footer"
                sx={{
                    py: 3,
                    bgcolor: "background.paper",
                    borderTop: 1,
                    borderColor: "divider",
                    mt: "auto",
                }}
            >
                <Container maxWidth="xl">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © 2026 E-Shop. Wszystkie prawa zastrzeżone.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}

export default Layout;
