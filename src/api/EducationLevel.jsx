import axios from "axios";
import API_BASE_URL from "../config/api";

export const listEducationLevels = async()=>{
    return await axios.get(`${API_BASE_URL}/api/education-level`)
}

export const createEducationLevel = async(token,data)=>{
    return await axios.post(`${API_BASE_URL}/api/education-level`,data,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
}

export const removeEducationLevel = async(token,id)=>{
    return await axios.delete(`${API_BASE_URL}/api/education-level/${id}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
}