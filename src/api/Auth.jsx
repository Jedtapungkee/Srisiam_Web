import axios from "axios";

export const CurrentAdmin = async (token) => {
  return await axios.post(
    "http://localhost:5000/api/current-admin",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
