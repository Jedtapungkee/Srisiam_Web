import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { verifyOtp, forgotPassword } from "../../api/Auth";
import OtpInput from "../../components/form/OtpInput";
import { Button } from "../../components/ui/button";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/auth/forgot-password");
      return;
    }

    // Countdown timer for resend
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleOtpComplete = async (otpValue) => {
    setIsLoading(true);
    try {
      const res = await verifyOtp(email, otpValue);
      toast.success("ยืนยัน OTP สำเร็จ");
      // Navigate to reset password page with email and otp
      navigate("/auth/reset-password", { 
        state: { otp: otpValue, email: email } 
      });
    } catch (error) {
      const errMsg = error.response?.data?.message || "OTP ไม่ถูกต้องหรือหมดอายุ";
      toast.error(errMsg);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    try {
      await forgotPassword(email);
      toast.success("ส่ง OTP ใหม่แล้ว");
      setCanResend(false);
      setCountdown(60);
      
      // Restart countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      const errMsg = error.response?.data?.message || "ไม่สามารถส่ง OTP ได้";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-6 py-8 lg:px-16 lg:py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">กรอกรหัส OTP</h2>
            <p className="text-gray-600 mt-2">
              รหัส OTP ถูกส่งไปที่ {email}
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <OtpInput 
              length={6} 
              onComplete={handleOtpComplete} 
              disabled={isLoading}
            />
          </div>

          {/* Resend OTP */}
          <div className="text-center mb-6">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-[#001F3F] hover:underline font-medium disabled:opacity-50"
              >
                ส่งรหัสอีกครั้ง
              </button>
            ) : (
              <p className="text-gray-500">
                ส่งรหัสอีกครั้งใน {countdown} วินาที
              </p>
            )}
          </div>

          {/* Confirm Button */}
          <Button
            onClick={() => {}}
            disabled={isLoading}
            className="w-full bg-[#001F3F] hover:bg-[#003366] text-white h-12 rounded-lg font-medium"
          >
            {isLoading ? "กำลังตรวจสอบ..." : "ยืนยัน"}
          </Button>

          {/* Back Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              <a href="/auth/forgot-password" className="text-[#001F3F] hover:underline font-medium">
                กลับไปหน้าลืมรหัสผ่าน
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Welcome Section */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#001F3F] to-[#003366] flex items-center justify-center p-8 lg:p-16 relative overflow-hidden lg:rounded-l-[100px]">
        {/* Decorative blob */}
        <div className="absolute top-0 left-0 w-64 h-64 lg:w-96 lg:h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 lg:w-96 lg:h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center py-12 lg:py-0">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6">
            Welcome Back!
          </h1>
          <p className="text-lg lg:text-xl text-blue-100 mb-6 lg:mb-8">
            มีบัญชีอยู่แล้วใช่ไหม ?
          </p>
          <a
            href="/auth/login"
            className="inline-block px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-[#001F3F] transition-all duration-300"
          >
            เข้าสู่ระบบ
          </a>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
