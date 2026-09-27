const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR :", err); //  ADD (debug ke liye)

  const status = err.status || err.statusCode || 500;
  const message = err.message || "BACKEND ERROR";
  const extraDetails = err.extraDetails || "Error from Backend";

  res.status(status).json({
    message,
    extraDetails,
  });
};

module.exports = errorMiddleware;
