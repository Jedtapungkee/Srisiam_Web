import axios from "axios";
import API_BASE_URL from "../config/api";


export const createAddress = async (token, form) => {
  return await axios.post(`${API_BASE_URL}/api/user/address`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const listAddress = async(token)=>{
    return await axios.get(`${API_BASE_URL}/api/user/address`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const removeAddress = async(token,addressId)=>{
    return await axios.delete(`${API_BASE_URL}/api/user/address/${addressId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const readAddress = async(token,addressId)=>{
    return await axios.get(`${API_BASE_URL}/api/user/address/${addressId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const updateAddress = async(token,addressId,form)=>{
    return await axios.put(`${API_BASE_URL}/api/user/address/${addressId}`,form, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}
