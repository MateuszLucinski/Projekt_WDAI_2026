import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/homepage/home";
import Products from "./components/products/products";
import Cart from "./components/cart/cart";
import Account from "./components/account/account";
import Register from "./components/register/register";
import Login from "./components/login/login";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import OrderHistory from "./components/orders/OrderHistory";
import Checkout from "./components/checkout/Checkout";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <nav>
            <Link to="/">Strona główna</Link> | <Link to="/products">Wyszukaj</Link> |{" "}
            <Link to="/cart">Koszyk</Link> | <Link to="/account">Moje Konto</Link> | <Link to="/login">Zaloguj</Link>
          </nav>

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/account" element={<Account />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/checkout" element={<Checkout />} />
              </Route>
            </Routes>
          </main>
          <footer>

          </footer>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
