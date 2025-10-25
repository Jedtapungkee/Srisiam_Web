import axios from "axios";
import API_BASE_URL from "../config/api";

// Send message to chatbot
export const sendMessageToChatbot = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/chatbot/message`, {
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message to chatbot:", error);

    // Handle error gracefully
    if (error.response) {
      throw new Error(
        error.response.data.message || "เกิดข้อผิดพลาดในการส่งข้อความ"
      );
    } else if (error.request) {
      throw new Error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } else {
      throw new Error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  }
};
