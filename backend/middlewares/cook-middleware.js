const getUserRole = require("../utils/user-role");

const cookMiddleware = (req, res, next) => {
  const role = getUserRole(req.user);

  if (role !== "cook") {
    return res.status(403).json({
      message: "Access denied. Cook authorization is required.",
    });
  }

  next();
};

module.exports = cookMiddleware;
