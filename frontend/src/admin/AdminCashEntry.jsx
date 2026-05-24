import React, { useState } from "react";
import axios from "axios";

export default function AdminCashEntry({ onRecordAdded }) {
  const [cashRecord, setCashRecord] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/donations/record-cash",
        cashRecord,
      );
      if (data.success) {
        alert("In-Hand Cash Donation Logged Successfully!");
        // Clear form
        setCashRecord({
          name: "",
          email: "",
          phone: "",
          amount: "",
        });
        e.target.reset();

        // Trigger list refresh in parent dashboard
        if (onRecordAdded) {
          onRecordAdded();
        }

        // Open certificate in new tab instantly
        window.open(
          `${import.meta.env.VITE_APP_URL}/api/certificate/download-certificate/${data.donationId}`,
          "_blank",
        );
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving cash entry to DB");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cms-cash-card fade-in">
      <h3>Record Cash Collection</h3>
      <p>Log offline in-hand donations and issue instant tax receipts.</p>

      <form onSubmit={handleManualSubmit}>
        <div className="form-group">
          <label>Donor's Full Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="John Doe"
            value={cashRecord.name}
            onChange={(e) =>
              setCashRecord({ ...cashRecord, name: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Donor's Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="john.doe@example.com"
            value={cashRecord.email}
            onChange={(e) =>
              setCashRecord({ ...cashRecord, email: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Donor's Contact No</label>
          <input
            type="text"
            className="form-input"
            placeholder="+91 XXXXX XXXXX"
            value={cashRecord.phone}
            onChange={(e) =>
              setCashRecord({ ...cashRecord, phone: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Collected Amount (INR)</label>
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 5000"
            value={cashRecord.amount}
            onChange={(e) =>
              setCashRecord({ ...cashRecord, amount: e.target.value })
            }
            required
            min="1"
          />
        </div>

        <button type="submit" className="btn btn-save-cash" disabled={loading}>
          {loading ? "Logging..." : "Log & Generate Receipt"}
        </button>
      </form>
    </div>
  );
}
