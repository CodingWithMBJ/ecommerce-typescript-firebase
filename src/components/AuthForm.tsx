import { useState, type FormEvent } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useToast } from "../contexts/ToastContext";
import { createUserProfile } from "../services/userService";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

const AuthForm = ({ mode }: AuthFormProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { addToast } = useToast();

  const isLogin = mode === "login";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      addToast("Email and password are required", "error");
      return;
    }

    if (!isLogin && password.length < 6) {
      addToast("Password must be at least 6 characters", "error");
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        addToast("Logged in successfully!", "success");
      } else {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        await createUserProfile({
          uid: credential.user.uid,
          email: credential.user.email,
          name: "",
          address: "",
        });

        addToast("Account created successfully!", "success");
      }

      setEmail("");
      setPassword("");
    } catch (err: any) {
      let message = "Something went wrong";

      switch (err.code) {
        case "auth/invalid-email":
          message = "Invalid email address";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          message = "Invalid email or password";
          break;
        case "auth/email-already-in-use":
          message = "Email already in use";
          break;
        case "auth/weak-password":
          message = "Password must be at least 6 characters";
          break;
      }

      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-container">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isLogin ? "current-password" : "new-password"}
        />
      </div>

      <button type="submit" className="btn" disabled={loading}>
        {loading
          ? isLogin
            ? "Logging in..."
            : "Registering..."
          : isLogin
            ? "Login"
            : "Register"}
      </button>
    </form>
  );
};

export default AuthForm;
