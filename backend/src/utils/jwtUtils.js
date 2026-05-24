import jwt from "jsonwebtoken";
import { ServerError } from "./errorHandler.js";

// ============================================================================
// JWT TOKEN GENERATION & VERIFICATION
// ============================================================================

/**
 * Generate JWT Access Token
 * @param {Object} payload - Token payload (user data)
 * @returns {string} JWT access token
 * @throws {ServerError}
 */
export const generateAccessToken = (payload) => {
  try {
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET;
    const expiry = process.env.JWT_ACCESS_TOKEN_EXPIRY || "15m";

    if (!secret) {
      throw new ServerError("JWT_ACCESS_TOKEN_SECRET not configured");
    }

    const token = jwt.sign(payload, secret, { expiresIn: expiry });
    return token;
  } catch (error) {
    throw new ServerError(`Failed to generate access token: ${error.message}`);
  }
};

/**
 * Generate JWT Refresh Token
 * @param {Object} payload - Token payload (user data)
 * @returns {string} JWT refresh token
 * @throws {ServerError}
 */
export const generateRefreshToken = (payload) => {
  try {
    const secret = process.env.JWT_REFRESH_TOKEN_SECRET;
    const expiry = process.env.JWT_REFRESH_TOKEN_EXPIRY || "7d";

    if (!secret) {
      throw new ServerError("JWT_REFRESH_TOKEN_SECRET not configured");
    }

    const token = jwt.sign(payload, secret, { expiresIn: expiry });
    return token;
  } catch (error) {
    throw new ServerError(`Failed to generate refresh token: ${error.message}`);
  }
};

/**
 * Verify JWT Access Token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {ServerError}
 */
export const verifyAccessToken = (token) => {
  try {
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET;

    if (!secret) {
      throw new ServerError("JWT_ACCESS_TOKEN_SECRET not configured");
    }

    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ServerError("Access token has expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new ServerError("Invalid access token");
    }
    throw new ServerError(`Token verification failed: ${error.message}`);
  }
};

/**
 * Verify JWT Refresh Token
 * @param {string} token - JWT refresh token to verify
 * @returns {Object} Decoded token payload
 * @throws {ServerError}
 */
export const verifyRefreshToken = (token) => {
  try {
    const secret = process.env.JWT_REFRESH_TOKEN_SECRET;

    if (!secret) {
      throw new ServerError("JWT_REFRESH_TOKEN_SECRET not configured");
    }

    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ServerError("Refresh token has expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new ServerError("Invalid refresh token");
    }
    throw new ServerError(
      `Refresh token verification failed: ${error.message}`,
    );
  }
};

/**
 * Generate both access and refresh tokens
 * @param {Object} payload - Token payload (user data)
 * @returns {Object} {accessToken, refreshToken}
 */
export const generateTokens = (payload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || "15m",
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || "7d",
  };
};
