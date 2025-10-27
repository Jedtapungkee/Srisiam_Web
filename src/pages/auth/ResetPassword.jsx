import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { resetPassword } from "../../api/Auth";
import FormContainer from "../../components/form/formcontainer";
import FormInput from "../../components/form/FormInput";
import { SubmitButton } from "../../components/form/Buttons";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const otp = location.state?.otp;
  const email = location.state?.email;

  useEffect(() => {
    if (!otp || !email) {
      toast.error("ข้อมูลไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
      navigate("/auth/forgot-password");
    }
  }, [otp, email, navigate]);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (data.password.length < 6) {
      toast.error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword(email, otp, data.password);
      toast.success(res.data.message || "เปลี่ยนรหัสผ่านสำเร็จ");
      // Navigate to login page
      setTimeout(() => {
        navigate("/auth/login");
      }, 1500);
    } catch (error) {
      const errMsg = error.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
      toast.error(errMsg);
      console.error(error);
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
          <div className="text-center mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">สร้างรหัสผ่านใหม่</h2>
            <p className="text-gray-600 mt-2">กรุณาสร้างรหัสผ่านใหม่ของคุณ</p>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <FormContainer onSubmit={onSubmit} className="space-y-3">
              <div>
                <FormInput
                  name="password"
                  label="รหัสผ่าน"
                  type="password"
                  placeholder="รหัสผ่าน"
                  className="bg-gray-200 border-0 focus:bg-gray-200 focus:ring-2 focus:ring-[#001F3F] h-12"
                  required
                />
              </div>

              <div>
                <FormInput
                  name="confirmPassword"
                  label="ยืนยันรหัสผ่าน"
                  type="password"
                  placeholder="ยืนยันรหัสผ่าน"
                  className="bg-gray-200 border-0 focus:bg-gray-200 focus:ring-2 focus:ring-[#001F3F] h-12"
                  required
                />
              </div>

              <SubmitButton
                className="w-full bg-[#001F3F] hover:bg-[#003366] text-white h-12 rounded-lg font-medium mt-2"
                size="lg"
                text={isLoading ? "กำลังบันทึก..." : "บันทึก"}
                disabled={isLoading}
              />
            </FormContainer>

            {/* Back to Login Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                จำรหัสผ่านได้แล้ว?{" "}
                <a href="/auth/login" className="text-[#001F3F] hover:underline font-medium">
                  เข้าสู่ระบบ
                </a>
              </p>
            </div>
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

export default ResetPassword;
