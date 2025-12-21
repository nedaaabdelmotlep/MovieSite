import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const url = isSignup
      ? "http://127.0.0.1:8000/api/auth/register/"
      : "http://127.0.0.1:8000/api/auth/login/";

    const body = { username, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        // backend بيرجع errors كـ object
        setErrors(data);
        setLoading(false);
        return;
      }

      // نجاح: خزّني اليوزر
      localStorage.setItem("user", JSON.stringify(data.user || { username }));

      navigate("/profile");
    } catch (err) {
      console.error("Fetch error:", err);
      setErrors({
        general:
          "Network error: Backend is not reachable. Make sure Django is running on http://127.0.0.1:8000 and CORS is allowed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i
            className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            onClick={() => setShowPassword((s) => !s)}
          ></i>
        </div>

        {/* رسائل الخطأ */}
        {errors.username && <p className="error-text">{errors.username}</p>}
        {errors.password && <p className="error-text">{errors.password}</p>}
        {errors.message && <p className="error-text">{errors.message}</p>}
        {errors.general && <p className="error-text">{errors.general}</p>}

        <button type="submit" disabled={loading}>
          {loading ? (isSignup ? "Signing up..." : "Logging in...") : isSignup ? "Sign Up" : "Login"}
        </button>

        <div style={{ marginTop: 12 }}>
          <button
            type="button"
            onClick={() => {
              setIsSignup((s) => !s);
              setErrors({});
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "#00e6e6",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}
