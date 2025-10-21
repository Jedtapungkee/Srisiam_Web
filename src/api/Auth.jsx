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
