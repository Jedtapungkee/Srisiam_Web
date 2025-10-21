import axios from "axios";
import API_BASE_URL from "../config/api";

// Get dashboard statistics
export const getDashboardStats = async (token) => {
  return await axios.get(`${API_BASE_URL}/api/admin/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get sales chart data
export const getSalesChart = async (token, period = "7days") => {
  return await axios.get(`${API_BASE_URL}/api/admin/dashboard/sales-chart?period=${period}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};