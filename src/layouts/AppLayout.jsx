import { Outlet, useLocation } from "react-router-dom";
import Header from "../pages/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AppLayout() {
  const location = useLocation();
  const hideHeader = location.pathname === "/login";

  return (
    <div className="app-layout">
      {!hideHeader && <Header />}
      <main className={hideHeader ? "app-main app-main--no-header" : "app-main"}>
        <Outlet />
      </main>
      {!hideHeader && <footer className="app-footer">© MooNSine</footer>}
      <ToastContainer theme="dark" position="top-right" autoClose={2500} pauseOnFocusLoss={false} />
    </div>
  );
}
