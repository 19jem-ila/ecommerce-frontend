
import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import SignupPage from "./pages/auth/Signup";
import VerifyEmailPage from "./pages/auth/verifyEmail";
import ForgetPasswordPage from "./pages/auth/ForgetPass";
import ResetPasswordPage from "./pages/auth/ResetPass";
import Home  from "./pages/Home/Home";
import MainLayout from "./components/Layout/MainLayout";
import LensesPage from "./pages/lense/lense";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ProductListPage from "./pages/Products/Product"
import ProductDetailPage from "./pages/Products/ProductDetails"
import CartPage from "./pages/Cart/Cart"
import CheckoutPage from "./pages/checkout/Checkout";
import OrderConfirmationPage from "./pages/orderConfirmationPage/confirm";
import OrderHistoryPage from "./pages/orderHistory/Order";
import WishlistPage from "./pages/favourite/favouritePage";
import AdminDashboard from "./pages/dashboard/adminDashboard";
import ProfilePage from "./pages/profile/profile";
import SearchResults from "./pages/searchpage/serchResult"

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout/>}>
      <Route path="/" element={<Home/>} />
      <Route path="/register" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgetPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage/>} />
      <Route path="/products/category/:category" element={<ProductListPage />} />
      <Route path="/AdminDashboard" element={<AdminDashboard/>} />
     
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      <Route path="/orders" element={<OrderHistoryPage />} />
      <Route path="/favourite" element={<WishlistPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="products/category/lenses" element={<LensesPage/>} />
      <Route path="/profile" element={<ProfilePage/>} />
      <Route path="/search" element={<SearchResults />} />

     
      
      



      {/* <Route path="/" element={<HomePage />} /> */}

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
      
        
      </Route>

      {/* Catch-all for 404 */}
      <Route path="*" element={<div>Page Not Found</div>} />
      </Route>
    </Routes>
  );
};

export default App;
