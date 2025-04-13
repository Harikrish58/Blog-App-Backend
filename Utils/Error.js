// Utility function to create and return a custom error object
export const errorHandler = (statusCode, message) => {
  const error = new Error();          // Create a new Error instance
  error.statusCode = statusCode;      // Assign a custom HTTP status code
  error.message = message;            // Assign a custom error message
  return error;                       // Return the customized error object
};
