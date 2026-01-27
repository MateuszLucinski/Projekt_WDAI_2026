import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./components/homepage/home";
import Products from "./components/products/products";
import ProductDetails from "./components/products/ProductDetails";
import Cart from "./components/cart/cart";
import Account from "./components/account/account";
import Register from "./components/register/register";
import Login from "./components/login/login";
import OrderHistory from "./components/account/orders/OrderHistory";
import Checkout from "./components/cart/checkout/Checkout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminOrderHistory from "./components/account/orders/AdminOrderHistory";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
                <Route path="/account" element={<Account />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/all_orders" element={<AdminOrderHistory />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/cart" element={<Cart />} />
            </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
