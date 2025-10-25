import axios from "axios";
import API_BASE_URL from "../config/api";


export const createUserCart = async (token, cart) => {
  return await axios.post(`${API_BASE_URL}/api/user/cart`, cart, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const listUserCart = async (token) => {
  return await axios.get(`${API_BASE_URL}/api/user/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const createUserOrder = async(token) => {
  return await axios.post(`${API_BASE_URL}/api/user/order`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const listUserOrders = async(token) => {
  return await axios.get(`${API_BASE_URL}/api/user/order`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const cancelUserOrder = async(token, orderId) => {
  return await axios.patch(`${API_BASE_URL}/api/user/order/${orderId}/cancel`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}