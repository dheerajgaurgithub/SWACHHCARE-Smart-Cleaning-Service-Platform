class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capture the stack trace, excluding the constructor call
    Error.captureStackTrace(this, this.constructor);
  }

  // Static method to create a new AppError
  static create(message, statusCode) {
    return new AppError(message, statusCode);
  }

  // Static method to create a validation error
  static validationError(message = 'Validation Error') {
    return new AppError(message, 400);
  }

  // Static method to create an unauthorized error
  static unauthorized(message = 'You are not authorized to access this resource') {
    return new AppError(message, 401);
  }

  // Static method to create a forbidden error
  static forbidden(message = 'You do not have permission to perform this action') {
    return new AppError(message, 403);
  }

  // Static method to create a not found error
  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }

  // Static method to create a conflict error
  static conflict(message = 'Resource already exists') {
    return new AppError(message, 409);
  }

  // Static method to create an internal server error
  static internalServerError(message = 'Internal Server Error') {
    return new AppError(message, 500);
  }
}

export default AppError;
