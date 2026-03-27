import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");

  const withTimeout = (
    promise,
    timeoutMs = 15000,
    fallbackMessage = "Request timed out. Please try again."
  ) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(fallbackMessage)), timeoutMs)
      ),
    ]);
  };

  const getProfileByUserId = async (userId) => {
    const { data: profile, error } = await withTimeout(
      supabase.from("profiles").select("id").eq("id", userId).maybeSingle(),
      10000,
      "Profile check timed out."
    );

    if (error) {
      throw error;
    }

    return profile;
  };

  const isEmailConfirmed = (user) => {
    const confirmedAt =
      user?.email_confirmed_at ??
      user?.confirmed_at ??
      user?.app_metadata?.email_confirmed_at;

    if (typeof confirmedAt === "undefined") return true; 

    return Boolean(confirmedAt);
  };

  useEffect(() => {
    const checkAndMaybeOpenProfile = async (user) => {
      if (!user) return;

      if (!isEmailConfirmed(user)) return;

      const profile = await getProfileByUserId(user.id);
      if (!profile) setShowProfileModal(true);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (!session?.user) return;

          if (event !== "SIGNED_IN" && event !== "USER_UPDATED") return;
          await checkAndMaybeOpenProfile(session.user);
        } catch {
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isSignup) {
        const { error } = await withTimeout(
          supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin,
            },
          }),
          15000,
          "Sign up timed out. Check internet/Supabase config."
        );

        if (error) {
          setError(error.message);
        } else {
          setMessage("Check your email to verify your account.");
        }
      } else {
        const { data, error } = await withTimeout(
          supabase.auth.signInWithPassword({
            email,
            password,
          }),
          15000,
          "Login timed out. Check internet/Supabase config."
        );

        if (error) throw error;
        if (!data?.user) throw new Error("Login failed. No user returned.");

        const profile = await getProfileByUserId(data.user.id);
        if (!profile) {
          setShowProfileModal(true);
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const {
        data: { user },
        error: userError,
      } = await withTimeout(
        supabase.auth.getUser(),
        10000,
        "Session lookup timed out."
      );

      if (userError) throw userError;
      if (!user) throw new Error("User not found. Please login again.");

      const { error } = await withTimeout(
        supabase.from("profiles").insert({
          id: user.id,
          name,
          address,
          age: parseInt(age, 10),
        }),
        10000,
        "Saving profile timed out."
      );

      if (error) throw error;

      setShowProfileModal(false);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="logo">🌱 SmartAgriAssist</h1>

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
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="toggle-text">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? " Login" : " Sign up"}
          </span>
        </p>
      </div>

      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Complete Your Profile</h2>

            <form onSubmit={handleProfileSave}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Register"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;