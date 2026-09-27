const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
  currentUser: `${API_BASE_URL}/api/auth/user`,
  contact: `${API_BASE_URL}/api/form/contact`,
  services: `${API_BASE_URL}/api/data/service`,
  adminUsers: `${API_BASE_URL}/api/admin/users`,
  adminUser: (id) => `${API_BASE_URL}/api/admin/users/${id}`,
  adminUserUpdate: (id) => `${API_BASE_URL}/api/admin/users/update/${id}`,
  adminUserDelete: (id) => `${API_BASE_URL}/api/admin/users/delete/${id}`,
  adminContacts: `${API_BASE_URL}/api/admin/contacts`,
  adminContactDelete: (id) => `${API_BASE_URL}/api/admin/contacts/delete/${id}`,
  adminServices: `${API_BASE_URL}/api/admin/services`,
  adminMenu: `${API_BASE_URL}/api/admin/menu`,
  adminMenuDay: (day) => `${API_BASE_URL}/api/admin/menu/${day}`,
  adminRecipes: `${API_BASE_URL}/api/admin/recipes`,
  sendMenuNotification: `${API_BASE_URL}/api/notifications/send-menu`,
  sendAvailabilityReminder: `${API_BASE_URL}/api/notifications/remind-availability`,
  latestMenuNotification: `${API_BASE_URL}/api/notifications/latest-menu`,
  myNotifications: `${API_BASE_URL}/api/notifications/my`,
  mealAttendance: (date) => `${API_BASE_URL}/api/attendance?date=${date}`,
  leaveCalendar: `${API_BASE_URL}/api/attendance/leaves`,
  mealFeedback: `${API_BASE_URL}/api/attendance/feedback`,
  billingAdjustment: (from, to, dailyRate) =>
    `${API_BASE_URL}/api/attendance/billing-adjustment?from=${from}&to=${to}&dailyRate=${dailyRate}`,
  cookAttendance: (date) => `${API_BASE_URL}/api/cook/attendance?date=${date}`,
  cookAnalytics: (from, to) => `${API_BASE_URL}/api/cook/analytics?from=${from}&to=${to}`,
  cookMenu: `${API_BASE_URL}/api/cook/menu`,
};

export const parseListResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.msg)) return data.msg;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};
