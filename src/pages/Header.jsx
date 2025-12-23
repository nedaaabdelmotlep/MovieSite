import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">🎬 MooNSine</Link>
        <nav className="nav">
          <NavLink to="/movies" className={({ isActive }) => (isActive ? "active" : undefined)}>Movies</NavLink>
          <NavLink to="/search" className={({ isActive }) => (isActive ? "active" : undefined)}>Search</NavLink>
          {user && (
            <NavLink to="/watchlist" className={({ isActive }) => (isActive ? "active" : undefined)}>Watchlist</NavLink>
          )}
        </nav>
        <div className="auth">
          {user ? (
            <>
              <button className="btn btn-ghost" onClick={() => navigate("/profile")}>{user.username}</button>
              <button className="btn btn-secondary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={() => "btn btn-primary"}>Login</NavLink>
              <NavLink to="/login?mode=signup" className={() => "btn btn-ghost"}>Signup</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
