import axios from "axios";
import API_BASE_URL from "../config/api";

export const checkPaymentStatus = async (token, paymentId) => {
  return await axios.get(
    `${API_BASE_URL}/api/payment/status/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const createQrCode = async (token, orderId, amount) => {
  return await axios.post(
    `${API_BASE_URL}/api/payment/promptpay`,
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
    `${API_BASE_URL}/api/payment/verify-slip`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// Stripe Payment Intent
export const createStripePaymentIntent = async (token, orderId, amount) => {
  return await axios.post(
    `${API_BASE_URL}/api/payment/stripe/create-payment-intent`,
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

// Confirm Stripe Payment 
export const confirmStripePayment = async (token, paymentIntentId) => {
  return await axios.post(
    `${API_BASE_URL}/api/payment/stripe/confirm-payment`,
    {
      paymentIntentId: paymentIntentId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
