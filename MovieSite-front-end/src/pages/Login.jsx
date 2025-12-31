import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, status } = useAuthStore();

  // If URL has ?mode=signup, open the form in signup mode
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode") || params.get("signup");
    if (mode && mode.toLowerCase() === "signup") {
      setIsSignup(true);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const action = isSignup ? register : login;
    const res = isSignup
      ? await action(username, password, email, fullName)
      : await action(username, password);
    if (!res.ok) {
      setErrors({ message: res?.error?.message || "Authentication failed" });
      return;
    }
    navigate("/profile");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>

        <input
          type="email"
          placeholder={isSignup ? "Email" : "Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={isSignup}
        />
        {isSignup && (
          <input
            type="text"
            placeholder="Full Name (optional)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}

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

        {errors.username && <p className="error-text">{errors.username}</p>}
        {errors.password && <p className="error-text">{errors.password}</p>}
        {errors.message && <p className="error-text">{errors.message}</p>}
        {errors.general && <p className="error-text">{errors.general}</p>}

          <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
          {status === "loading" ? (isSignup ? "Signing up..." : "Logging in...") : isSignup ? "Sign Up" : "Login"}
        </button>

        <div className="form-toggle">
          <button
            type="button"
            className="toggle-link"
            onClick={() => {
              setIsSignup((s) => !s);
              setErrors({});
            }}
          >
            {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}
