import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginScreen from "./pages/LoginScreen";
import PageLayout from "./layouts/PageLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ShoppingCart from "./pages/ShoppingCart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import "./styles/index.css";

const App = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginScreen />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PageLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cart" element={<ShoppingCart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
