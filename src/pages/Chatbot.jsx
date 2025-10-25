import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { sendMessageToChatbot } from "../api/Chatbot";
import useEcomStore from "../store/Srisiam-store";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import Message from "../components/chatbot/message";
import LoadingMessage from "../components/chatbot/LoadingMessage";
import Breadcrumbs from "../components/chatbot/Breadcrumbs";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "สวัสดีค่ะคุณลูกค้า แอดมินยินดีให้บริการค่ะ",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Online",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // ใช้ setTimeout เพื่อให้ DOM render เสร็จก่อน
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await sendMessageToChatbot(messageToSend);

      const botMessage = {
        id: Date.now() + 1,
        text: response.message,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "Online",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการส่งข้อความ");

      const errorMessage = {
        id: Date.now() + 1,
        text: "ขออภัยค่ะ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง หรือติดต่อทีมงานได้ที่ 032-211-856",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "Online",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div>
      <Breadcrumbs />
      <div className="container max-w-5xl mx-auto py-6">
        {/* Page Header */}

        {/* Chat Container */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-0">
            <div
              className="flex flex-col"
              style={{ height: "calc(100vh - 350px)", minHeight: "500px" }}
            >
              {/* Messages Area */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white"
              >
                {messages.map((message) => (
                  <Message key={message.id} message={message} />
                ))}

                {isLoading && <LoadingMessage />}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 bg-gray-50/50 p-4">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-3"
                >
                  <Input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="ส่งข้อความ ..."
                    className="flex-1 rounded-md border-gray-300 focus-visible:ring-blue-500 bg-white"
                    disabled={isLoading}
                    autoFocus
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    size="icon"
                    variant="ghost"
                    className="rounded-full shadow-md hover:shadow-lg  transition-all h-11 w-11"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  กด Enter เพื่อส่งข้อความ | Shift + Enter เพื่อขึ้นบรรทัดใหม่
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;
