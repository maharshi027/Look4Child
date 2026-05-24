// src/donar/DonarList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DonarList() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("date-desc");

  // Edit modal state
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    amount: "",
    paymentMode: "",
    paymentStatus: "",
  });

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/donations/all-records");
      setDonations(response.data);
    } catch (error) {
      console.error("Error fetching donor history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this donor record?")) {
      try {
        await axios.delete(`/api/donations/delete/${id}`);
        alert("Record deleted successfully.");
        fetchDonations();
      } catch (err) {
        console.error(err);
        alert("Failed to delete record.");
      }
    }
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setEditForm({
      donorName: record.donorName,
      donorEmail: record.donorEmail,
      donorPhone: record.donorPhone || "",
      amount: record.amount,
      paymentMode: record.paymentMode,
      paymentStatus: record.paymentStatus,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/donations/update/${editingRecord._id}`,
        editForm
      );
      if (data.success) {
        alert("Record updated successfully!");
        setEditingRecord(null);
        fetchDonations();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update donor record.");
    }
  };

  // Metrics calculations (Only on successful transactions)
  const successfulDonations = donations.filter((d) => d.paymentStatus === "SUCCESS");
  const totalRaised = successfulDonations.reduce((acc, curr) => acc + curr.amount, 0);
  const numDonors = successfulDonations.length;
  const averageDonation = numDonors > 0 ? Math.round(totalRaised / numDonors) : 0;
  
  const cashTotal = successfulDonations
    .filter((d) => d.paymentMode === "CASH")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const onlineTotal = successfulDonations
    .filter((d) => d.paymentMode === "ONLINE")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Filtering & Sorting logic
  const filteredDonations = donations
    .filter((d) => {
      const matchSearch =
        d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.donorPhone && d.donorPhone.includes(searchTerm));
      
      const matchMode = filterMode === "ALL" || d.paymentMode === filterMode;
      const matchStatus = filterStatus === "ALL" || d.paymentStatus === filterStatus;

      return matchSearch && matchMode && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "date-asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "amount-desc") {
        return b.amount - a.amount;
      } else if (sortBy === "amount-asc") {
        return a.amount - b.amount;
      }
      return 0;
    });

  if (loading && donations.length === 0) {
    return <div className="cms-loading" style={{textAlign: "center", padding: "3rem"}}>Loading Donor Records Database...</div>;
  }

  return (
    <div className="cms-container fade-in">
      {/* Metrics Section */}
      <div className="cms-metrics">
        <div className="metric-card">
          <div className="metric-icon-bg" style={{ backgroundColor: "#ecfdf5", color: "#059669" }}>
            🪙
          </div>
          <div className="metric-details">
            <p>Total Raised</p>
            <h3>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
              }).format(totalRaised)}
            </h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-bg" style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}>
            👥
          </div>
          <div className="metric-details">
            <p>Active Donors</p>
            <h3>{numDonors}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-bg" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>
            📈
          </div>
          <div className="metric-details">
            <p>Average Ticket</p>
            <h3>₹{averageDonation}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-bg" style={{ backgroundColor: "#fdf2f8", color: "#db2777" }}>
            📊
          </div>
          <div className="metric-details">
            <p>Online vs Cash</p>
            <h3 style={{ fontSize: "1.1rem" }}>
              ₹{onlineTotal} / ₹{cashTotal}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Database Table Panel */}
      <div className="cms-records-panel">
        <div className="cms-toolbar">
          <div className="cms-search-wrapper">
            <input
              type="text"
              placeholder="Search donor name, email or contact..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingRight: "2.5rem" }}
            />
            <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }}>🔍</span>
          </div>

          <select
            className="cms-toolbar-select"
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
          >
            <option value="ALL">All Modes</option>
            <option value="CASH">Cash Only</option>
            <option value="ONLINE">Online Only</option>
          </select>

          <select
            className="cms-toolbar-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>

          <select
            className="cms-toolbar-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>

        <div className="cms-table-container">
          {filteredDonations.length === 0 ? (
            <div className="cms-empty-state">
              <div className="cms-empty-icon">📁</div>
              <h3>No donor records match your parameters</h3>
              <p>Try refining your search or log a cash entry on the right pane.</p>
            </div>
          ) : (
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Donor Profile</th>
                  <th>Contribution</th>
                  <th>Payment Type</th>
                  <th>Log Status</th>
                  <th>Action Logs</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((d) => (
                  <tr key={d._id} className="fade-in">
                    <td>
                      <div className="donor-name-cell">{d.donorName}</div>
                      <div className="donor-subinfo">{d.donorEmail}</div>
                      {d.donorPhone && <div className="donor-subinfo" style={{fontSize: '0.7rem'}}>📞 {d.donorPhone}</div>}
                    </td>
                    <td>
                      <div className="amount-cell">₹{d.amount}</div>
                      <div className="donor-subinfo" style={{ fontSize: "0.75rem" }}>
                        {new Date(d.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${d.paymentMode.toLowerCase()}`}>
                        {d.paymentMode === "CASH" ? "💵 Cash" : "🌐 Online"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${d.paymentStatus.toLowerCase()}`}>
                        {d.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <div className="cms-actions">
                        {d.paymentStatus === "SUCCESS" ? (
                          <a
                            href={`/api/certificate/download-certificate/${d._id}`}
                            className="action-btn action-btn-print"
                            title="Download Certificate"
                            target="_blank"
                            rel="noreferrer"
                          >
                            🖨️
                          </a>
                        ) : (
                          <button className="action-btn" style={{ opacity: 0.3, cursor: "not-allowed" }} disabled>
                            🖨️
                          </button>
                        )}
                        <button
                          className="action-btn action-btn-edit"
                          title="Edit Record"
                          onClick={() => handleEditClick(d)}
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn action-btn-delete"
                          title="Delete Record"
                          onClick={() => handleDelete(d._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingRecord && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Donor Record</h3>
              <button className="modal-close-btn" onClick={() => setEditingRecord(null)}>
                ×
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Donor Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.donorName}
                  onChange={(e) => setEditForm({ ...editForm, donorName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={editForm.donorEmail}
                  onChange={(e) => setEditForm({ ...editForm, donorEmail: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.donorPhone}
                  onChange={(e) => setEditForm({ ...editForm, donorPhone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Donation Amount (INR)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label>Mode</label>
                  <select
                    className="form-input"
                    value={editForm.paymentMode}
                    onChange={(e) => setEditForm({ ...editForm, paymentMode: e.target.value })}
                  >
                    <option value="CASH">CASH</option>
                    <option value="ONLINE">ONLINE</option>
                  </select>
                </div>
                <div>
                  <label>Status</label>
                  <select
                    className="form-input"
                    value={editForm.paymentStatus}
                    onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value })}
                  >
                    <option value="SUCCESS">SUCCESS</option>
                    <option value="PENDING">PENDING</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </div>
              </div>
              <div className="modal-buttons">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingRecord(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
