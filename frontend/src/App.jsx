import { useEffect, useState } from "react";
import "./index.css";
import "./styles/admin-login.css";
import "./styles/admin-dashboard.css";
import Footer from "./components/footer/Footer";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import PublicPortal from "./portal/PublicPortal";
import {
  setupAxiosInterceptors,
  initializeJWTToken,
  clearJWTToken,
} from "./utils/axiosConfig";

function App() {
  const [activeTab, setActiveTab] = useState(
    () => window.location.hash.replace("#", "") || "home",
  );
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem("admin_session") === "true";
  });

  // Initialize JWT interceptors on app mount
  useEffect(() => {
    setupAxiosInterceptors();
    initializeJWTToken();

    const handleHashChange = () => {
      setActiveTab(window.location.hash.replace("#", "") || "home");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (activeTab === "home") {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    } else {
      window.history.replaceState(null, "", `#${activeTab}`);
    }
  }, [activeTab]);

  const handleLoginSuccess = () => {
    sessionStorage.setItem("admin_session", "true");
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_session");
    clearJWTToken();
    setIsAdminLoggedIn(false);
    setActiveTab("home");
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    if (tab === "home") {
      window.history.pushState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    } else {
      window.history.pushState(null, "", `#${tab}`);
    }
  };

  return (
    <div className="app-container">
      {activeTab === "admin" ? (
        <main className="admin-fullpage">
          <div className="fade-in admin-tab-wrap">
            {!isAdminLoggedIn ? (
              <AdminLogin onLoginSuccess={handleLoginSuccess} />
            ) : (
              <AdminDashboard onLogout={handleLogout} />
            )}
          </div>
        </main>
      ) : (
        <>
          <PublicPortal activeTab={activeTab} onNavigate={handleNavigate} />
          <Footer onNav={handleNavigate} />
        </>
      )}
    </div>
  );
}

export default App;
