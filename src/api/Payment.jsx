import axios from "axios";

export const createPromptPayQRCode = async (token, data) => {
  return await axios.post("http://localhost:5000/api/payment/promptpay", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const checkPaymentStatus = async (token, paymentId) => {
  return await axios.get(
    `http://localhost:5000/api/payment/status/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const createQrCode = async (token, orderId, amount) => {
  return await axios.post(
    "http://localhost:5000/api/payment/promptpay",
    {
      orderId: parseInt(orderId),
      amount: parseFloat(amount),
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const verifySlip = async (token, formData) => {
  return await axios.post(
    "http://localhost:5000/api/payment/verify-slip",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
