import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const [users, setUsers] = useState(() => {
    try {
      const raw = localStorage.getItem("users");
      if (raw) return JSON.parse(raw);
    } catch (e) {
  
    }
    try {
      const defaults = [
        { username: "mathew", password: "1234", name: "Mathew" },
        { username: "admin", password: "admin", name: "Admin" },
        { username: "User", password: "123", name: "User" }
      ];
      localStorage.setItem("users", JSON.stringify(defaults));
      localStorage.removeItem("user");

    } catch (e) {}
    return [
      { username: "mathew", password: "1234", name: "Mathew" },
      { username: "admin", password: "admin", name: "Admin" },
      {username: "User", password: "123", name: "User" }
    ];
  });

  const persistUsers = (nextUsers) => {
    setUsers(nextUsers);
    try {
      localStorage.setItem("users", JSON.stringify(nextUsers));
    } catch (e) {
    
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    
    setTimeout(() => {
      if (isSignup) {
        if (!username.trim() || !password) {
          alert("Please provide a valid username and password.");
          setLoading(false);
          return;
        }
        if (password.length < 4) {
          alert("Password must be at least 4 characters.");
          setLoading(false);
          return;
        }

        const exists = users.some((u) => u.username === username);
        if (exists) {
          alert("Username already taken. Choose another one.");
          setLoading(false);
          return;
        }

        const newUser = { username, password, name: name || username };
        const next = [...users, newUser];
        persistUsers(next);
        localStorage.setItem("user", JSON.stringify(newUser));
        navigate("/profile");
      } else {
        const user = users.find(
          (u) => u.username === username && u.password === password
        );

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/profile");
        } else {
          alert("Invalid username or password");
        }
      }

      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>

        {isSignup && (
          <input
            type="text"
            placeholder="Full name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        <button type="submit" disabled={loading}>
          {loading ? (isSignup ? "Signing up..." : "Logging in...") : isSignup ? "Sign Up" : "Login"}
        </button>

        <div style={{ marginTop: 12 }}>
          <button
            type="button"
            onClick={() => setIsSignup((s) => !s)}
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
