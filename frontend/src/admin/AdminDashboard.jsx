import React, { useState } from "react";
import DonarList from "../donar/DonarList";
import AdminCashEntry from "./AdminCashEntry";
import AdminStatsDashboard from "./AdminStatsDashboard";
import AdminRecordsPanel from "./AdminRecordsPanel";
import { ngoCollections } from "./ngoCollections";

export default function AdminDashboard({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleRecordAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

<<<<<<< HEAD
  const handleLogout = () => {
    localStorage.clear();
    delete window.axios?.defaults.headers.common["Authorization"];
    onLogout();
  };

  const getPageTitle = () => {
    switch (activeMenu) {
      case "dashboard":
        return "Dashboard";
      case "donor-list":
        return "Donor List";
      case "donation-entry":
        return "Record Donation";
      case "children":
        return "Children Records";
      case "employees":
        return "Employee Records";
      case "duties":
        return "Duty Roster";
      case "programs":
        return "Program Control";
      default:
        return "Admin Dashboard";
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">L4C Foundation CMS</h2>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            title="Close sidebar"
          >
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-item ${activeMenu === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveMenu("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={`sidebar-item ${activeMenu === "donor-list" ? "active" : ""}`}
            onClick={() => setActiveMenu("donor-list")}
          >
            👥 Donor List
          </button>
          <button
            className={`sidebar-item ${activeMenu === "donation-entry" ? "active" : ""}`}
            onClick={() => setActiveMenu("donation-entry")}
          >
            💰 Donation Entry
          </button>
          <button
            className={`sidebar-item ${activeMenu === "children" ? "active" : ""}`}
            onClick={() => setActiveMenu("children")}
          >
            👧 Children Records
          </button>
          <button
            className={`sidebar-item ${activeMenu === "employees" ? "active" : ""}`}
            onClick={() => setActiveMenu("employees")}
          >
            👥 Employee Records
          </button>
          <button
            className={`sidebar-item ${activeMenu === "duties" ? "active" : ""}`}
            onClick={() => setActiveMenu("duties")}
          >
            📅 Duty Roster
          </button>
          <button
            className={`sidebar-item ${activeMenu === "programs" ? "active" : ""}`}
            onClick={() => setActiveMenu("programs")}
          >
            🧭 Programs
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main-content">
        {/* Top Header */}
        <header className="admin-top-header">
          <button
            className="hamburger-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle sidebar"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1 className="page-title">{getPageTitle()}</h1>
          <div className="header-right">
            <span className="user-email">
              {localStorage.getItem("adminEmail")}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content-area">
          {activeMenu === "dashboard" && (
            <div className="content-section fade-in">
              <AdminStatsDashboard />
            </div>
          )}

          {activeMenu === "donor-list" && (
            <div className="content-section fade-in">
              <DonarList key={refreshKey} />
            </div>
          )}

          {activeMenu === "donation-entry" && (
            <div className="content-section fade-in">
              <AdminCashEntry onRecordAdded={handleRecordAdded} />
            </div>
          )}

          {activeMenu === "children" && (
            <div className="content-section fade-in">
              <AdminRecordsPanel config={ngoCollections.children} />
            </div>
          )}

          {activeMenu === "employees" && (
            <div className="content-section fade-in">
              <AdminRecordsPanel config={ngoCollections.employees} />
            </div>
          )}

          {activeMenu === "duties" && (
            <div className="content-section fade-in">
              <AdminRecordsPanel config={ngoCollections.duties} />
            </div>
          )}

          {activeMenu === "programs" && (
            <div className="content-section fade-in">
              <AdminRecordsPanel config={ngoCollections.programs} />
            </div>
          )}
        </main>
      </div>
=======
  return (
    <div
      className={`cms-dashboard fade-in ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
      <aside className="cms-sidebar">
        <div className="cms-sidebar-header">
          <div className="cms-sidebar-brand">
            <div className="cms-sidebar-brand-icon">👥</div>
            <div className="cms-sidebar-brand-copy">
              <h2>Employee CMS</h2>
              <p>Records and cash logging</p>
            </div>
          </div>
          <button
            type="button"
            className="cms-sidebar-toggle"
            onClick={() => setIsSidebarCollapsed((prevValue) => !prevValue)}
            aria-label={
              isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            ☰
          </button>
        </div>

        <nav className="cms-sidebar-nav" aria-label="Admin navigation">
          <button type="button" className="cms-nav-item active">
            <span className="cms-nav-icon">📁</span>
            <span className="cms-nav-label">Employee Records</span>
          </button>
          <button type="button" className="cms-nav-item">
            <span className="cms-nav-icon">💰</span>
            <span className="cms-nav-label">Cash Entry</span>
          </button>
          <button
            type="button"
            className="cms-nav-item cms-nav-item-logout"
            onClick={onLogout}
          >
            <span className="cms-nav-icon">↩</span>
            <span className="cms-nav-label">Logout</span>
          </button>
        </nav>
      </aside>

      <section className="cms-dashboard-content">
        <div className="cms-header">
          <div>
            <h2>Employee Records CMS Portal</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
              Management panel for employee records, offline cash entries, and
              certificate downloads.
            </p>
          </div>
          <button className="btn-logout" onClick={onLogout}>
            Exit Admin Session
          </button>
        </div>

        <div className="cms-workspace">
          <div className="cms-workspace-list">
            {/* We mount DonarList with refreshKey so that it re-polls API on cash log */}
            <DonarList key={refreshKey} />
          </div>
          <div className="cms-workspace-form">
            <AdminCashEntry onRecordAdded={handleRecordAdded} />
          </div>
        </div>
      </section>
>>>>>>> fix-Readme
    </div>
  );
}
