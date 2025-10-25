import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useSrisiamStore from "../../store/Srisiam-store";
import {
  createQrCode,
  checkPaymentStatus as checkPaymentStatusAPI,
  verifySlip,
} from "../../api/Payment"; // ใช้ API functions
import BreadcrumbsPayment from "../../components/paymentQR/BreadcrumbsPayment";
import FormContainer from "../../components/form/FormContainer";
import { Input } from "../../components/ui/input";
import { SubmitButton } from "../../components/form/Buttons";
import { toast } from "sonner";
import { Smartphone, Upload } from "lucide-react";
import { Button } from "../../components/ui/button";

const PaymentQRCode = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [qrCodeData, setQrCodeData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(900); // 15 นาที
  const [slipFile, setSlipFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

      const response = await createQrCode(token, orderId, amount);

      if (response.data.success) {
        setQrCodeData(response.data.data);
        setPaymentStatus("PENDING");
        const expiryTime = new Date(response.data.data.expiredAt);
        const now = new Date();
        const secondsLeft = Math.max(0, Math.floor((expiryTime - now) / 1000));
        setTimeLeft(secondsLeft);
      } else {
        toast.error("ไม่สามารถสร้าง QR Code ได้");
      }
    } catch (error) {
      console.error("Error creating QR Code:", error);

      // แสดง error message ที่เข้าใจง่ายขึ้น
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("Payment already exists")
      ) {
        toast.error(
          "มีการชำระเงินสำหรับคำสั่งซื้อนี้อยู่แล้ว กรุณาตรวจสอบสถานะการชำระเงิน"
        );
      } else {
        toast.error(
          error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้าง QR Code"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // console.log("QR Code Data:", qrCodeData);

  const checkPaymentStatus = async () => {
    if (!qrCodeData) return;

    try {
      const response = await checkPaymentStatusAPI(token, qrCodeData.paymentId);

      if (response.data.success) {
        const status = response.data.data.status;
        setPaymentStatus(status);

        if (status === "COMPLETED") {
          toast.success("ชำระเงินสำเร็จ!", {
            description: "กำลังนำคุณไปยังหน้าสรุปการชำระเงิน"
          });
          navigate("/payment/success");
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
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleCreateNewQR = () => {
    setQrCodeData(null); // เคลียร์ QR Code เก่า
    setPaymentStatus("PENDING");
    setTimeLeft(900);
    createPromptPayQR();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    // ตรวจสอบประเภทไฟล์
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("กรุณาเลือกไฟล์รูปภาพ (jpg, jpeg, png) เท่านั้น");
      return;
    }
    // ตรวจสอบขนาดไฟล์ (สูงสุด 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }
    setSlipFile(file);
    setUploadSuccess(false);
  };

  const handleRemoveFile = () => {
    setSlipFile(null);
    setUploadSuccess(false);
    // รีเซ็ต input file
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleSubmitProof = async (data) => {
    if (!slipFile) {
      toast.error("กรุณาเลือกไฟล์สลิปการโอนเงิน");
      return;
    }

    if (!qrCodeData || !qrCodeData.paymentId) {
      toast.error("ไม่พบข้อมูลการชำระเงิน");
      return;
    }

    try {
      setUploadLoading(true);

      const formData = new FormData();
      formData.append("files", slipFile);
      formData.append("paymentId", qrCodeData.paymentId);

      const response = await verifySlip(token, formData);

      if (response.data.success) {
        setUploadSuccess(true);
        setSlipFile(null);
        // รีเซ็ต input file
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";

        // แจ้งเตือนความสำเร็จ
        toast.success("แนบสลิปสำเร็จ!", {
          description: "ระบบกำลังตรวจสอบการชำระเงิน"
        });

        // ตรวจสอบสถานะการชำระเงินอีกครั้งทันที
        setTimeout(() => {
          checkPaymentStatus();
        }, 2000); // รอ 2 วินาทีเพื่อให้ backend ประมวลผลเสร็จ
      } else {
        toast.error(response.data.message || "ไม่สามารถแนบสลิปได้");
      }
    } catch (error) {
      console.error("Error uploading slip:", error);
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการแนบสลิป"
      );
    } finally {
      setUploadLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center p-8">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-900 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            กำลังสร้าง QR Code
          </h2>
          <p className="text-gray-600">กรุณารอสักครู่...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8">
      {/* Breadcrumbs */}
      <BreadcrumbsPayment />
      <div className="container mx-auto px-4 mt-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Section - QR Code */}
          <div className="order-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 hover:shadow-2xl transition-shadow duration-300">
              {/* Header with Icon */}
              <div className="text-center mb-8">
                <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-blue-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  ชำระเงินด้วย PromptPay
                </h1>
                <div className=" text-gray-700 px-6 py-3">
                  <span className="text-sm font-medium">ยอดที่ต้องชำระ</span>
                  <p className="text-3xl font-bold">฿{amount}</p>
                </div>
              </div>

              {/* Payment Status - Completed */}
              {paymentStatus === "COMPLETED" && (
                <div className="text-center mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 animate-pulse">
                  <div className="text-6xl mb-3">✅</div>
                  <h3 className="text-green-700 text-2xl font-bold mb-2">
                    ชำระเงินสำเร็จ!
                  </h3>
                  <p className="text-green-600">
                    กำลังนำทางไปหน้าการสั่งซื้อสำเร็จ...
                  </p>
                </div>
              )}

              {/* Payment Status - Expired */}
              {paymentStatus === "EXPIRED" && (
                <div className="text-center mb-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-200">
                  <h3 className="text-red-600 text-2xl font-bold mb-2">
                    QR Code หมดอายุ
                  </h3>
                  <p className="text-red-600 mb-4">กรุณาสร้าง QR Code ใหม่</p>
                  <button
                    onClick={handleCreateNewQR}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
                  >
                    สร้าง QR Code ใหม่
                  </button>
                </div>
              )}

              {/* QR Code Display */}
              {qrCodeData && paymentStatus === "PENDING" && (
                <div className="text-center">
                  {/* QR Code with Animation */}
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative bg-white p-4 rounded-2xl shadow-lg border-4 border-blue-100">
                      <img
                        src={qrCodeData.qrCode}
                        alt="PromptPay QR Code"
                        className="w-80 h-80 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Scan Instruction */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-900 font-medium flex items-center justify-center gap-2">
                      <Smartphone />
                      สแกน QR Code ด้วยแอพธนาคารของคุณ
                    </p>
                  </div>

                  {/* Timer with Progress Bar */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 font-medium">
                      เหลือเวลา
                    </p>
                    <div className="text-gray-700 text-3xl font-bold py-4 px-6">
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/checkout")}
                disabled={loading}
                isPending={loading}
                className="items-center justify-center w-full mt-4"
              >
                ยกเลิก
              </Button>
            </div>
          </div>

          {/* Right Section - Upload Slip */}
          <div className="order-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100 hover:shadow-2xl transition-shadow duration-300 sticky top-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-purple-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    แนบหลักฐานการโอนเงิน
                  </h2>
                </div>
                <p className="text-gray-600 text-sm">
                  กรุณาแนบสลิปการโอนเงินเพื่อยืนยันการชำระเงิน
                </p>
              </div>

              {/* Upload Form */}
              <FormContainer className="space-y-6" onSubmit={handleSubmitProof}>
                {/* File Input Area */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    เลือกไฟล์รูปภาพสลิป (jpg, png)
                  </label>

                  {/* File Input Button */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      disabled={uploadLoading || paymentStatus !== "PENDING"}
                      className="hidden"
                      id="file-upload-input"
                    />
                    <label
                      htmlFor="file-upload-input"
                      className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors
                        ${
                          uploadLoading || paymentStatus !== "PENDING"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      `}
                    >
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      อัพโหลดสลิป
                    </label>
                    {slipFile && (
                      <span className="ml-3 text-sm text-gray-600">
                        {slipFile.name}
                      </span>
                    )}
                  </div>

                  {/* File Preview */}
                  {slipFile && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-4">
                        {/* Image Preview */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-white rounded-lg border-2 border-blue-200 flex items-center justify-center overflow-hidden">
                            <img
                              src={URL.createObjectURL(slipFile)}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate mb-2">
                            {slipFile.name}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                              {(slipFile.size / 1024).toFixed(2)} KB
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          disabled={uploadLoading}
                          className="flex-shrink-0 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="ลบไฟล์"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Accepted Formats */}
                  <p className="text-xs text-gray-500">
                    รองรับไฟล์: JPG, JPEG, PNG (ขนาดไม่เกิน 5MB)
                  </p>
                </div>

                {/* Submit Button */}
                <SubmitButton
                  text={
                    uploadLoading ? (
                      "กำลังอัปโหลด..."
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Upload className="w-5 h-5" />
                        แจ้งการโอนเงิน
                      </span>
                    )
                  }
                  isPending={uploadLoading}
                  disabled={
                    !slipFile || uploadLoading || paymentStatus !== "PENDING"
                  }
                  className="w-full bg-[#00204E] hover:bg-[#003366] transition-colors duration-200 text-white font-medium rounded-lg py-3  "
                />
              </FormContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentQRCode;
