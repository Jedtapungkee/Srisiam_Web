import axios from "axios";

// Get dashboard statistics
export const getDashboardStats = async (token) => {
  return await axios.get("http://localhost:5000/api/admin/dashboard/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get sales chart data
export const getSalesChart = async (token, period = "7days") => {
  return await axios.get(`http://localhost:5000/api/admin/dashboard/sales-chart?period=${period}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};