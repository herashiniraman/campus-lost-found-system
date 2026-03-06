function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: "404 Not Found - The requested resource does not exist"
  });
}

function errorHandler(err, req, res, next) {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};