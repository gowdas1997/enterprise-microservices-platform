import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import OrderConfirmationPage from "../pages/OrderConfirmationPage";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/order-confirmation"
          element={<OrderConfirmationPage />}
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;