import axios from "axios";


export const createUserCart = async (token, cart) => {
  return await axios.post("http://localhost:5000/api/user/cart", cart, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const listUserCart = async (token) => {
  return await axios.get("http://localhost:5000/api/user/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const createUserOrder = async(token) => {
  return await axios.post("http://localhost:5000/api/user/order", {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}