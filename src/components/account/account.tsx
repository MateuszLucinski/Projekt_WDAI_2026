import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Account() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Twoje Konto</h1>
            {user ? (
                <div style={{ marginBottom: "2rem" }}>
                    <p><strong>Email:</strong> {user.email}</p>
                    {user.role && <p><strong>Rola:</strong> {user.role}</p>}
                </div>
            ) : (
                <p>Brak danych użytkownika</p>
            )}

            <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
                <Link to="/orders" style={{ fontSize: "1.1rem", color: "blue" }}>
                    📜 Zobacz historię zamówień
                </Link>

                <button
                    onClick={handleLogout}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#ff4444",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        width: "fit-content"
                    }}
                >
                    Wyloguj się
                </button>
            </div>
        </div>
    );
}

export default Account;