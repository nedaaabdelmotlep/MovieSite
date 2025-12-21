import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) {
      navigate("/login");
      return;
    }
    try {
      setUser(JSON.parse(raw));
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Welcome, {user.username} 👋</h2>
        <p>This is your profile page.</p>

        <button onClick={handleLogout}>Logout</button>

        <Link to="/" className="home-link">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
