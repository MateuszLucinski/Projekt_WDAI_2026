import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/homepage/home";
import Products from "./components/products/products";
import Cart from "./components/cart/cart";
import Account from "./components/account/account";
import Register from "./components/register/register";
import Login from "./components/login/login";


function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <nav>
        <Link to="/">Strona główna</Link> | <Link to="/products">Wyszukaj</Link> |{" "}
        <Link to="/cart">Koszyk</Link> | <Link to="/account">Moje Konto</Link>  <Link to="/login">Zaloguj</Link>
      </nav>

      {/* Routes */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="cart" element={<Cart />} />
          <Route path="account" element={<Account />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Routes>
      </main>
      <footer>
      
      </footer>
    </BrowserRouter>

  );
}

export default App;
