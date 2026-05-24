import {
  validateRequired,
  AuthenticationError,
  handleControllerError,
  ServerError,
} from "../utils/errorHandler.js";
import {
  generateTokens,
  verifyRefreshToken,
  generateAccessToken,
} from "../utils/jwtUtils.js";

/**
 * Admin Login - Verify password and return JWT tokens
 * POST /api/auth/login
 * Body: { password: string }
 * Returns: { accessToken, refreshToken, expiresIn }
 */
export const login = (req, res) => {
  try {
    const { password } = req.body || {};

    validateRequired({ password }, ["password"]);

    const adminPass = process.env.ADMIN_PASSWORD || "admin123";

    if (password !== adminPass) {
      throw new AuthenticationError("Invalid password");
    }

    // Generate JWT tokens
    const payload = {
      role: "admin",
      timestamp: new Date().toISOString(),
    };

    const { accessToken, refreshToken, accessTokenExpiry } =
      generateTokens(payload);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiry,
      tokenType: "Bearer",
    });
  } catch (error) {
    handleControllerError(error, res, "Admin Login");
  }
};

/**
 * Refresh Access Token - Generate new access token using refresh token
 * POST /api/auth/refresh-token
 * Body: { refreshToken: string }
 * Returns: { accessToken, expiresIn }
 */
export const refreshAccessToken = (req, res) => {
  try {
    const { refreshToken } = req.body || {};

    validateRequired({ refreshToken }, ["refreshToken"]);

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Generate new access token with same payload
    const newPayload = {
      role: decoded.role,
      timestamp: new Date().toISOString(),
    };

    const newAccessToken = generateAccessToken(newPayload);
    const accessTokenExpiry = process.env.JWT_ACCESS_TOKEN_EXPIRY || "15m";

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
      expiresIn: accessTokenExpiry,
      tokenType: "Bearer",
    });
  } catch (error) {
    handleControllerError(error, res, "Refresh Access Token");
  }
};

/**
 * Verify Password (deprecated - use login instead)
 * Kept for backward compatibility
 */
export const verifyPassword = (req, res) => {
  try {
    const { password } = req.body || {};

    validateRequired({ password }, ["password"]);

    const adminPass = process.env.ADMIN_PASSWORD || "admin123";

    if (password === adminPass) {
      return res.status(200).json({ success: true, message: "Access granted" });
    }

    throw new AuthenticationError("Invalid password");
  } catch (error) {
    handleControllerError(error, res, "Authentication");
  }
};
