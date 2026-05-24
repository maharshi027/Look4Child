import { verifyAccessToken } from "./jwtUtils.js";
import { AuthenticationError } from "./errorHandler.js";

// ============================================================================
// JWT AUTHENTICATION MIDDLEWARE
// ============================================================================

/**
 * Middleware to verify JWT access token from Authorization header
 * Extracts token from "Bearer <token>" format
 * Adds decoded token to req.user
 */
export const verifyJWTMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("Missing or invalid Authorization header");
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      throw new AuthenticationError(error.message);
    }
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || "Authentication failed",
      error: error.message,
    });
  }
};

/**
 * Optional JWT verification - doesn't throw error if token missing
 * Adds decoded token to req.user if valid, otherwise req.user is undefined
 */
export const optionalJWTMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
      } catch (error) {
        console.log("Optional JWT verification warning:", error.message);
        // Continue without user context
      }
    }

    next();
  } catch (error) {
    next();
  }
};
