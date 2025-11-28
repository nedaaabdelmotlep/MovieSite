import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
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
        <Link to="/" className="home-link">Back to Home</Link>
      </div>
    </div>
  );
}

