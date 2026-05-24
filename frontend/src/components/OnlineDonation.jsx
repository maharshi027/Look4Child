import React, { useState } from "react";
import axios from "axios";

export default function OnlineDonation() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Simulation state
  const [simulationData, setSimulationData] = useState(null);
  const [showSimModal, setShowSimModal] = useState(false);

  const presetAmounts = [250, 500, 1000, 2500, 5000];

  const handlePresetSelect = (amount) => {
    setSelectedPreset(amount);
    setFormData({ ...formData, amount: amount.toString() });
  };

  const handleAmountChange = (e) => {
    setSelectedPreset(null);
    setFormData({ ...formData, amount: e.target.value });
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create order
      const { data } = await axios.post(
        "/api/donations/initiate-online",
        formData,
      );

      if (data.success) {
        if (data.simulation) {
          // Trigger developer simulation modal
          setSimulationData({
            order: data.order,
            donationId: data.donationId,
          });
          setShowSimModal(true);
        } else {
          // Real Razorpay flow
          const options = {
            key: "YOUR_RAZORPAY_KEY_ID", // Will fallback or read backend if configured
            amount: data.order.amount,
            currency: "INR",
            name: "Dream Girl Foundation",
            description: "Girl Empowerment Initiatives",
            order_id: data.order.id,
            handler: async function (response) {
              try {
                const verifyRes = await axios.post(
                  "/api/donations/verify-online",
                  response,
                );
                if (verifyRes.data.success) {
                  alert(
                    "Donation Successful! Opening Tax Exemption Certificate...",
                  );
                  window.open(
                    `${import.meta.env.VITE_APP_URL}/api/certificate/download-certificate/${verifyRes.data.donationId}`,
                    "_blank",
                  );
                  // Reset form
                  setFormData({ name: "", email: "", phone: "", amount: "" });
                  setSelectedPreset(null);
                }
              } catch (err) {
                alert("Payment verification failed");
              }
            },
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone,
            },
            theme: { color: "#F43F5E" },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        }
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to initiate payment gateway connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Simulated validation loop
  const handleSimulatePayment = async (status) => {
    if (status === "cancel") {
      setShowSimModal(false);
      setSimulationData(null);
      alert("Payment simulation cancelled.");
      return;
    }

    setLoading(true);
    setShowSimModal(false);

    try {
      const mockPayload = {
        razorpay_order_id: simulationData.order.id,
        razorpay_payment_id:
          "pay_sim_" + Math.random().toString(36).substring(2, 10),
        razorpay_signature: "mock_signature_approved",
      };

      const verifyRes = await axios.post(
        "/api/donations/verify-online",
        mockPayload,
      );

      if (verifyRes.data.success) {
        alert("Simulated Donation Successful! Thank you for your support.");
        // Open PDF certificate download in new tab
        window.open(
          `${import.meta.env.VITE_APP_URL}/api/certificate/download-certificate/${verifyRes.data.donationId}`,
          "_blank",
        );
        // Reset form
        setFormData({ name: "", email: "", phone: "", amount: "" });
        setSelectedPreset(null);
      }
    } catch (error) {
      console.error(error);
      alert("Verification of simulated payment failed.");
    } finally {
      setLoading(false);
      setSimulationData(null);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <form onSubmit={handlePaySubmit} className="donation-form fade-in">
        <h2>Make a Secure Contribution</h2>
        <p className="donation-form-subtitle">
          Your donation helps us provide education, nutrition, and medical help
          to underprivileged girls.
        </p>

        {/* Amount Chips Selection */}
        <div className="form-group">
          <label>Select Donation Amount (INR)</label>
          <div className="amount-selector">
            {presetAmounts.map((amt) => (
              <div
                key={amt}
                className={`amount-chip ${selectedPreset === amt ? "selected" : ""}`}
                onClick={() => handlePresetSelect(amt)}
              >
                ₹{amt}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Amount Input */}
        <div className="form-group">
          <label htmlFor="custom-amount">Or Enter Custom Amount (INR)</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">₹</span>
            <input
              id="custom-amount"
              type="number"
              className="form-input form-input-with-icon"
              placeholder="Other amount..."
              value={formData.amount}
              onChange={handleAmountChange}
              required
              min="1"
            />
          </div>
        </div>

        {/* Donor Name */}
        <div className="form-group">
          <label htmlFor="donor-name">Full Name</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">👤</span>
            <input
              id="donor-name"
              type="text"
              className="form-input form-input-with-icon"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="form-group">
          <label htmlFor="donor-email">Email Address</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">✉️</span>
            <input
              id="donor-email"
              type="email"
              className="form-input form-input-with-icon"
              placeholder="donor@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label htmlFor="donor-phone">Phone Number (Optional)</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">📞</span>
            <input
              id="donor-phone"
              type="tel"
              className="form-input form-input-with-icon"
              placeholder="+91 XXXXX XXXXX"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-donate-submit"
          disabled={loading}
        >
          {loading
            ? "Processing Securely..."
            : `Donate ₹${formData.amount || "0"}`}
        </button>
      </form>

      {/* Simulated Razorpay Checkout Modal (Developer Sandbox) */}
      {showSimModal && simulationData && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: "440px" }}>
            <div className="simulation-banner">
              <div className="simulation-banner-title">
                <span>🛠️</span> Sandbox Mode (Simulation Active)
              </div>
              <div>
                Razorpay credentials are not defined in the environment. We have
                triggered a mock payment sequence.
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💳</div>
              <h3 style={{ fontSize: "1.25rem" }}>
                Simulated Checkout Gateway
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
                Testing secure payment execution loop for Dream Girl Foundation.
              </p>
            </div>

            <div
              style={{
                backgroundColor: "var(--light-gray)",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                }}
              >
                <span>Order ID:</span>
                <strong
                  style={{ fontSize: "0.75rem", fontFamily: "monospace" }}
                >
                  {simulationData.order.id}
                </strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                }}
              >
                <span>Recipient:</span>
                <strong>Dream Girl Foundation</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.9rem",
                  borderTop: "1px solid var(--border)",
                  paddingTop: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                <span>Total Amount:</span>
                <strong style={{ color: "var(--primary)" }}>
                  ₹{simulationData.order.amount / 100}
                </strong>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleSimulatePayment("cancel")}
                style={{ justifyContent: "center" }}
              >
                Decline Test
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSimulatePayment("success")}
                style={{
                  justifyContent: "center",
                  backgroundColor: "var(--success)",
                }}
              >
                Approve Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
