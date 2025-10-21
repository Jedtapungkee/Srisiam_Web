import axios from "axios";
import API_BASE_URL from "../config/api";

export const getOrdersAdmin = async (token) => {
  return await axios.get(`${API_BASE_URL}/api/admin/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getListAllUsers = async (token) => {
  return await axios.get(`${API_BASE_URL}/api/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeOrderStatus = async (token, orderId, orderStatus) => {
  return await axios.put(
    `${API_BASE_URL}/api/admin/order`,
    {
      orderId,
      orderStatus,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const changeUserStatus = async (token,value) => {
  return await axios.post(
    `${API_BASE_URL}/api/change-status`,value,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const changeUserRole = async (token,value) => {
  return await axios.post(
    `${API_BASE_URL}/api/change-role`,value,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
