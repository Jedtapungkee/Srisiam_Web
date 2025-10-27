import axios from "axios";
import API_BASE_URL from "../config/api";

export const CurrentAdmin = async (token) => {
  return await axios.post(
    `${API_BASE_URL}/api/current-admin`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const forgotPassword = async (email) => {
  return await axios.post(`${API_BASE_URL}/api/forgot-password`, { email });
};

export const verifyOtp = async (email, otp) => {
  return await axios.post(`${API_BASE_URL}/api/verify-otp`, { email, otp });
};

export const resetPassword = async (email, otp, newPassword) => {
  return await axios.post(`${API_BASE_URL}/api/reset-password`, { email, otp, newPassword });
};
