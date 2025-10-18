import axios from "axios";

export const listEducationLevels = async()=>{
    return await axios.get("http://localhost:5000/api/education-level")
}

export const createEducationLevel = async(token,data)=>{
    return await axios.post("http://localhost:5000/api/education-level",data,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
}

export const removeEducationLevel = async(token,id)=>{
    return await axios.delete(`http://localhost:5000/api/education-level/${id}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
}