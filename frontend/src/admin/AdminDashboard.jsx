import React, { useState } from "react";
import DonarList from "../donar/DonarList";
import AdminCashEntry from "./AdminCashEntry";

export default function AdminDashboard({ onLogout }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRecordAdded = () => {
    // Incrementing key forces DonarList to remount and re-fetch database logs
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="cms-dashboard fade-in">
      <div className="cms-header">
        <div>
          <h2>Donor Records CMS Portal</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
            Management panel for tracking contributions, offline receipts, and tax certificates.
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
    </div>
  );
}
