import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useSrisiamStore from "../../store/Srisiam-store";
import { createQrCode, checkPaymentStatus as checkPaymentStatusAPI } from "../../api/Payment"; // ใช้ API functions

const PaymentQRCode = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [qrCodeData, setQrCodeData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(900); // 15 นาที
  const [error, setError] = useState("");
  
  const token = useSrisiamStore((state) => state.token);
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    if (orderId && amount) {
      createPromptPayQR();
    }
  }, [orderId, amount]);

  useEffect(() => {
    let interval;
    if (qrCodeData && paymentStatus === "PENDING") {
      // ตรวจสอบสถานะทุก 5 วินาที
      interval = setInterval(() => {
        checkPaymentStatus();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [qrCodeData, paymentStatus]);

  useEffect(() => {
    // นับถอยหลังเวลา
    let timer;
    if (timeLeft > 0 && paymentStatus === "PENDING") {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setPaymentStatus("EXPIRED");
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, paymentStatus]);

  const createPromptPayQR = async () => {
    // ป้องกันการเรียก API ซ้ำถ้ามี QR Code อยู่แล้ว
    if (qrCodeData && paymentStatus === "PENDING") {
      return;
    }
    
    try {
      setLoading(true);
      setError(""); // เคลียร์ error เก่า
      
    //   console.log(`Frontend creating QR - OrderID: ${orderId}, Amount: ${amount}`);
      
      const response = await createQrCode(token, orderId, amount);

      if (response.data.success) {
        // console.log("QR Code response:", response.data.data);
        setQrCodeData(response.data.data);
        setPaymentStatus("PENDING");
        const expiryTime = new Date(response.data.data.expiredAt);
        const now = new Date();
        const secondsLeft = Math.max(0, Math.floor((expiryTime - now) / 1000));
        setTimeLeft(secondsLeft);
      } else {
        setError("ไม่สามารถสร้าง QR Code ได้");
      }
    } catch (error) {
      console.error("Error creating QR Code:", error);
      
      // แสดง error message ที่เข้าใจง่ายขึ้น
      if (error.response?.status === 400 && error.response?.data?.message?.includes("Payment already exists")) {
        setError("มีการชำระเงินสำหรับคำสั่งซื้อนี้อยู่แล้ว กรุณาตรวจสอบสถานะการชำระเงิน");
      } else {
        setError(error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้าง QR Code");
      }
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!qrCodeData) return;

    try {
      const response = await checkPaymentStatusAPI(token, qrCodeData.paymentId);

      if (response.data.success) {
        const status = response.data.data.status;
        setPaymentStatus(status);
        
        if (status === "COMPLETED") {
          // ชำระเงินสำเร็จ - นำทางไปหน้า success
          setTimeout(() => {
            navigate("/order-success");
          }, 2000);
        } else if (status === "EXPIRED") {
          setTimeLeft(0);
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCreateNewQR = () => {
    setError("");
    setQrCodeData(null); // เคลียร์ QR Code เก่า
    setPaymentStatus("PENDING");
    setTimeLeft(900);
    createPromptPayQR();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p>กำลังสร้าง QR Code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <div className="text-red-600 text-xl mb-4">❌ เกิดข้อผิดพลาด</div>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={() => navigate("/checkout")}
            className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
          >
            กลับไปหน้าชำระเงิน
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ชำระเงินด้วย PromptPay
            </h1>
            <p className="text-gray-600">
              ยอดที่ต้องชำระ: <span className="font-semibold text-red-500">฿{amount}</span>
            </p>
          </div>

          {/* Payment Status */}
          {paymentStatus === "COMPLETED" && (
            <div className="text-center mb-6 p-4 bg-green-50 rounded-lg">
              <div className="text-green-600 text-xl mb-2">✅ ชำระเงินสำเร็จ!</div>
              <p className="text-green-700">กำลังนำทางไปหน้าการสั่งซื้อสำเร็จ...</p>
            </div>
          )}

          {paymentStatus === "EXPIRED" && (
            <div className="text-center mb-6 p-4 bg-red-50 rounded-lg">
              <div className="text-red-600 text-xl mb-2">⏰ QR Code หมดอายุ</div>
              <p className="text-red-700 mb-4">กรุณาสร้าง QR Code ใหม่</p>
              <button 
                onClick={handleCreateNewQR}
                className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
              >
                สร้าง QR Code ใหม่
              </button>
            </div>
          )}

          {/* QR Code */}
          {qrCodeData && paymentStatus === "PENDING" && (
            <div className="text-center mb-6">
              <div className="mb-4">
                <img 
                  src={qrCodeData.qrCode} 
                  alt="PromptPay QR Code" 
                  className="mx-auto border rounded-lg shadow-sm"
                  style={{ width: '300px', height: '300px' }}
                />
              </div>
              
              {/* Timer */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">เหลือเวลา:</p>
                <div className="text-2xl font-bold text-red-500">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate("/checkout")}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              กลับ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentQRCode;