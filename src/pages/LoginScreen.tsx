import { useEffect, useState } from "react";
import AuthForm from "../components/AuthForm";
import { useUser } from "../contexts/UserContext";
import { useToast } from "../contexts/ToastContext";

const LoginScreen = () => {
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const { user } = useUser();
  const { addToast } = useToast();

  useEffect(() => {
    const shouldShowLogoutToast = localStorage.getItem("showLogoutToast");

    if (shouldShowLogoutToast === "true") {
      addToast("Logged out successfully", "success");
      localStorage.removeItem("showLogoutToast");
    }
  }, [addToast]);

  return (
    <section className="login-screen">
      <h1>Welcome, {user?.email || "Guest"}</h1>

      <AuthForm mode={showLogin ? "login" : "register"} />

      <p>{showLogin ? "Don't have an account?" : "Already have an account?"}</p>

      <button type="button" onClick={() => setShowLogin((prev) => !prev)}>
        {showLogin ? "Register" : "Login"}
      </button>
    </section>
  );
};

export default LoginScreen;
