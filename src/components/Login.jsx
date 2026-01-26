import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./Login.css";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (isSignup) {
      // SIGN UP (email verification sent)
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage(
          "Verification email sent. Please confirm before logging in."
        );
      }
    } else {
      // LOGIN (only works after verification)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Email not confirmed") {
          setError("Please verify your email before logging in.");
        } else {
          setError(error.message);
        }
      }
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="logo">🌱 SmartAgriAssist</h1>
        <p className="subtitle">
          {isSignup
            ? "Create your account"
            : "Welcome back, login to continue"}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}
          {message && <p className="message">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isSignup
              ? "Sign Up"
              : "Login"}
          </button>
        </form>

        <p className="toggle-text">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? " Login" : " Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
