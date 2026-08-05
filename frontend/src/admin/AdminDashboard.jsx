import React, { useState } from "react";
import DonarList from "../donar/DonarList";
import AdminCashEntry from "./AdminCashEntry";

export default function AdminDashboard({ onLogout }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleRecordAdded = () => {
    // Incrementing key forces DonarList to remount and re-fetch database logs
    setRefreshKey((prevKey) => prevKey + 1);
  };

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
    </div>
  );
}
