import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setReady(true);
  }, [navigate, user]);

  if (!ready) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Welcome, {user.username} 👋</h2>
        <p>This is your profile page.</p>

        <button className="btn btn-secondary" onClick={() => { logout(); navigate("/login"); }}>Logout</button>

        <Link to="/" className="btn btn-ghost home-link">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
