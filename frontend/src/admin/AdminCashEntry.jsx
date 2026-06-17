import React, { useState } from "react";
import axios from "axios";

export default function AdminCashEntry({ onRecordAdded }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cashRecord, setCashRecord] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    panNo: "",
    amount: "",
    donationDate: new Date().toISOString().split("T")[0],
    gatewayName: "CASH",
    referenceNumber: "",
  });

  const validateForm = () => {
    const newErrors = {};
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!cashRecord.name.trim()) newErrors.name = "Name is required";
    if (!cashRecord.email.trim()) newErrors.email = "Email is required";
    if (!cashRecord.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Invalid email format";
    if (!cashRecord.phone.trim()) newErrors.phone = "Phone is required";
    if (!cashRecord.address.trim()) newErrors.address = "Address is required";
    if (!cashRecord.panNo.trim()) newErrors.panNo = "PAN is required";
    if (!panRegex.test(cashRecord.panNo.toUpperCase()))
      newErrors.panNo = "Invalid PAN format (e.g., ABCDE1234F)";
    if (!cashRecord.amount || parseFloat(cashRecord.amount) <= 0)
      newErrors.amount = "Amount must be > 0";
    if (cashRecord.gatewayName !== "CASH" && !cashRecord.referenceNumber.trim())
      newErrors.referenceNumber = "Reference number is required for non-cash payment";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveRecord = async (keepValues = false) => {
    if (!validateForm()) return false;
    setLoading(true);
    try {
      const { data } = await axios.post("/api/donations/record-cash", {
        name: cashRecord.name,
        email: cashRecord.email,
        phone: cashRecord.phone,
        address: cashRecord.address,
        panNo: cashRecord.panNo,
        amount: cashRecord.amount,
        donationDate: cashRecord.donationDate,
        paymentMode: cashRecord.gatewayName === "CASH" ? "CASH" : "ONLINE",
        gatewayName: cashRecord.gatewayName,
        txnId: cashRecord.referenceNumber,
      });

      if (data.success) {
        alert("✅ Donation recorded successfully!");
        
        if (onRecordAdded) {
          onRecordAdded();
        }

        // Trigger PDF generation downloads
        window.open(
          `${import.meta.env.VITE_APP_URL}/api/receipt/download-receipt/${data.donationId}`,
          "_blank"
        );
        setTimeout(() => {
          window.open(
            `${import.meta.env.VITE_APP_URL}/api/certificate/download-certificate/${data.donationId}`,
            "_blank"
          );
        }, 600);

        if (!keepValues) {
          // Clear form fully
          setCashRecord({
            name: "",
            email: "",
            phone: "",
            address: "",
            panNo: "",
            amount: "",
            donationDate: new Date().toISOString().split("T")[0],
            gatewayName: "CASH",
            referenceNumber: "",
          });
        } else {
          // Keep common values but clear reference number
          setCashRecord(prev => ({
            ...prev,
            referenceNumber: "",
          }));
        }
        setErrors({});
        return true;
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to record donation.");
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCashRecord({ ...cashRecord, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="cms-cash-card compact-card fade-in">
      <form onSubmit={(e) => { e.preventDefault(); saveRecord(false); }} className="compact-form">
        <div className="compact-grid">
          {/* Row 1 */}
          <div className="form-group">
            <label>Full Name <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              className={`form-input compact-input ${errors.name ? "input-error" : ""}`}
              placeholder="Full Name"
              value={cashRecord.name}
              onChange={handleInputChange}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Address <span className="required">*</span></label>
            <input
              type="text"
              name="address"
              className={`form-input compact-input ${errors.address ? "input-error" : ""}`}
              placeholder="Address"
              value={cashRecord.address}
              onChange={handleInputChange}
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          {/* Row 2 */}
          <div className="form-group">
            <label>Amount <span className="required">*</span></label>
            <input
              type="number"
              name="amount"
              className={`form-input compact-input ${errors.amount ? "input-error" : ""}`}
              placeholder="Amount"
              value={cashRecord.amount}
              onChange={handleInputChange}
            />
            {errors.amount && <span className="error-text">{errors.amount}</span>}
          </div>
          <div className="form-group">
            <label>Mobile Number <span className="required">*</span></label>
            <input
              type="text"
              name="phone"
              className={`form-input compact-input ${errors.phone ? "input-error" : ""}`}
              placeholder="Mobile Number"
              value={cashRecord.phone}
              onChange={handleInputChange}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          {/* Row 3 */}
          <div className="form-group">
            <label>Email Id <span className="required">*</span></label>
            <input
              type="email"
              name="email"
              className={`form-input compact-input ${errors.email ? "input-error" : ""}`}
              placeholder="Email Id"
              value={cashRecord.email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Pan No. <span className="required">*</span></label>
            <input
              type="text"
              name="panNo"
              className={`form-input compact-input ${errors.panNo ? "input-error" : ""}`}
              placeholder="Enter Your Pan No."
              value={cashRecord.panNo}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: "panNo",
                    value: e.target.value.toUpperCase(),
                  },
                })
              }
            />
            {errors.panNo && <span className="error-text">{errors.panNo}</span>}
          </div>

          {/* Row 4 */}
          <div className="form-group">
            <label>Date <span className="required">*</span></label>
            <input
              type="date"
              name="donationDate"
              className="form-input compact-input"
              value={cashRecord.donationDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mode of Payment <span className="required">*</span></label>
            <select
              name="gatewayName"
              className="form-input compact-input"
              value={cashRecord.gatewayName}
              onChange={handleInputChange}
            >
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="CHEQUE">Cheque</option>
              <option value="BANK TRANSFER">Bank Transfer</option>
              <option value="NEFT">NEFT</option>
            </select>
          </div>

          {/* Row 5 */}
          <div className="form-group full-width">
            <label>Reference Number {cashRecord.gatewayName !== "CASH" && <span className="required">*</span>}</label>
            <input
              type="text"
              name="referenceNumber"
              className={`form-input compact-input ${errors.referenceNumber ? "input-error" : ""}`}
              placeholder={cashRecord.gatewayName === "CASH" ? "Reference Number / Txn ID (Optional)" : "Reference Number / Txn ID"}
              value={cashRecord.referenceNumber}
              onChange={handleInputChange}
            />
            {errors.referenceNumber && <span className="error-text">{errors.referenceNumber}</span>}
          </div>
        </div>

        {/* Color-coded Action Buttons */}
        <div className="compact-actions">
          <button
            type="submit"
            disabled={loading}
            className="action-btn-red submit-btn"
          >
            {loading ? "..." : "✓ Save"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => saveRecord(false)}
            className="action-btn-blue submit-btn"
          >
            {loading ? "..." : "✓ Save & Next"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => saveRecord(true)}
            className="action-btn-green submit-btn"
          >
            {loading ? "..." : "✓ Save & Copy"}
          </button>
        </div>
      </form>
    </div>
  );
}
