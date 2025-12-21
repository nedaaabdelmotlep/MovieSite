import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">🎬 MooNSine</h1>
      <p className="home-subtitle">Discover. Watch. Enjoy.</p>
      <div className="home-links">
        <Link to="/login" className="Login-btn">Login</Link>
        <Link to="/profile" className="Profile-btn">Profile</Link>
      </div>
    </div>
  );
}
