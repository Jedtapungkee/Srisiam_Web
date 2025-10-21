import axios from "axios";
import API_BASE_URL from "../config/api";


export const listCategory = async()=>{
    return await axios.get(`${API_BASE_URL}/api/category`)
}

export const createCategory = async(token,data)=>{
    return await axios.post(`${API_BASE_URL}/api/category`,data,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
}

export const removeCategory = async(token,id)=>{
    return await axios.delete(`${API_BASE_URL}/api/category/${id}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
}