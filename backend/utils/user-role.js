const getUserRole = (user) => {
  if (user?.isAdmin) {
    return "admin";
  }

  return String(user?.role || "student").trim().toLowerCase();
};

module.exports = getUserRole;
