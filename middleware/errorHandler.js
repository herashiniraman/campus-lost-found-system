function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: "404 Not Found - The requested resource does not exist"
  });
}

function errorHandler(err, req, res, next) {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    error: "Server Error",
    message: err.message || "An unexpected internal server error occurred"
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
