import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import MoviesList from "./pages/MoviesList";
import MovieDetails from "./pages/MovieDetails";
import Search from "./pages/Search";
import Watchlist from "./pages/Watchlist";
import AppLayout from "./layouts/AppLayout";
import { useAuthStore } from "./store/auth";

function RequireAuth() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<MoviesList />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/search" element={<Search />} />
          <Route element={<RequireAuth />}>
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
