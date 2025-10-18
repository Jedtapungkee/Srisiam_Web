import axios from "axios";


export const createAddress = async (token, form) => {
  return await axios.post("http://localhost:5000/api/user/address", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const listAddress = async(token)=>{
    return await axios.get("http://localhost:5000/api/user/address", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const removeAddress = async(token,addressId)=>{
    return await axios.delete(`http://localhost:5000/api/user/address/${addressId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const readAddress = async(token,addressId)=>{
    return await axios.get(`http://localhost:5000/api/user/address/${addressId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const updateAddress = async(token,addressId,form)=>{
    return await axios.put(`http://localhost:5000/api/user/address/${addressId}`,form, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}
