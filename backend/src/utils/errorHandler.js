export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Unauthorized: Invalid credentials") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

export class ServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500);
    this.name = "ServerError";
  }
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Validate required fields
 * @param {Object} data - Data object to validate
 * @param {Array} fields - Required field names
 * @throws {ValidationError}
 */
export const validateRequired = (data, fields) => {
  for (const field of fields) {
    if (!data[field]) {
      throw new ValidationError(`${field} is required`);
    }
  }
};

/**
 * Validate amount is positive number
 * @param {*} amount - Amount to validate
 * @throws {ValidationError}
 */
export const validateAmount = (amount) => {
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new ValidationError("Invalid donation amount");
  }
  return numericAmount;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @throws {ValidationError}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format");
  }
};

/**
 * Check if record exists
 * @param {*} record - Record to check
 * @param {string} resourceName - Name of resource for error message
 * @throws {NotFoundError}
 */
export const checkRecordExists = (record, resourceName = "Record") => {
  if (!record) {
    throw new NotFoundError(resourceName);
  }
};

/**
 * Handle controller errors with consistent response format
 * @param {Error} error - Error object
 * @param {Object} res - Express response object
 * @param {string} context - Error context for logging
 */
export const handleControllerError = (error, res, context = "Operation") => {
  console.error(`${context} Error:`, error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.message,
    });
  }

  // Handle MongoDB cast errors
  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
      error: "Invalid ID format",
    });
  }

  // Handle MongoDB validation errors
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors)
      .map((err) => err.message)
      .join(", ");
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      error: messages,
    });
  }

  // Handle unexpected errors
  return res.status(500).json({
    success: false,
    message: `${context} failed`,
    error: error.message || "An unexpected error occurred",
  });
};

// ============================================================================
// EXPRESS MIDDLEWARE FOR ERROR HANDLING
// ============================================================================

/**
 * Global error handler middleware for Express
 * Use as: app.use(globalErrorHandler)
 */
export const globalErrorHandler = (err, req, res, next) => {
  console.error("Unhandled Server Error:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.message,
    });
  }

  // Handle unexpected errors
  res.status(500).json({
    success: false,
    message: "Internal server error occurred",
    error: err.message || "An unexpected error occurred",
  });
};

/**
 * Async error wrapper for route handlers
 * Use as: router.get('/path', asyncHandler(controller))
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ============================================================================
// RESPONSE HELPERS
// ============================================================================

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (
  res,
  data,
  message = "Success",
  statusCode = 200,
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {*} error - Error details
 */
export const sendError = (res, message, statusCode = 500, error = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: error ? error.message : message,
  });
};
