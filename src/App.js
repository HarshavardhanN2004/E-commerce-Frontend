import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Unauthorized from "./pages/Unauthorized";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import AdminPage from "./pages/AdminPage";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminCategories from "./pages/AdminCategories";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetails />}/>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:orderId" element={<Order />}/>
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />} >
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/products" element={<AdminProducts />}/>
          <Route path="/admin/orders" element={<AdminOrders />}/>
          <Route  path="/admin/orders/:orderId"element={<AdminOrderDetails />}/>
          <Route path="/admin/categories" element={<AdminCategories />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

