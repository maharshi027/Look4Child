import React, { useState } from "react";
import axios from "axios";

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call new JWT login endpoint
      const { data } = await axios.post("/api/auth/login", { password });
      if (data.success) {
        // Store JWT tokens in localStorage
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("tokenExpiry", data.expiresIn);

        // Configure axios to include token in all requests
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${data.accessToken}`;

        // Callback to parent component
        onLoginSuccess();
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card fade-in">
        <div className="admin-login-icon">🔒</div>
        <h2>Admin Portal Access</h2>
        <p>Enter the administrator password to manage donor records.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Administrator Password</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">🔑</span>
              <input
                id="password"
                type="password"
                className="form-input form-input-with-icon"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              marginTop: "1rem",
            }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Unlocking Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
