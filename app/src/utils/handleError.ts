export const handleApiError = (error: any) => {
  try {
    if (error.response) {
      // Server responded with a status other than 2xx
      if (error.response.status === 500) {
        return 'Server error. Please try again later.';
      } else {
        return `Error: ${error.response.data.message || 'An error occurred'}`;
      }
    } else if (error.request) {
      // No response from the server (Network error)
      return 'Network error. Please check your internet connection.';
    } else {
      // Other errors (e.g., Axios setup, unexpected errors)
      return 'An unexpected error occurred. Please try again.';
    }
  } catch (err) {
    // Catch any errors within this error handler
    return 'An error occurred while handling the error.';
  }
};
