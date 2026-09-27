export const getUserRole = (user) => {
  if (user?.isAdmin) return "admin";
  return String(user?.role || "student").trim().toLowerCase();
};

export const getDashboardPath = (user) => {
  const role = getUserRole(user);

  if (role === "admin") return "/admin";
  if (role === "cook") return "/cook/calendar";
  return "/";
};
