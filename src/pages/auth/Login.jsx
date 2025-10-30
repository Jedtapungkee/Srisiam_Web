import useSrisiamStore from "../../store/Srisiam-store";
import { SubmitButton } from "../../components/form/Buttons";
import FormContainer from "../../components/form/formcontainer";
import FormInput from "../../components/form/FormInput";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import API_BASE_URL from "../../config/api";

const Login = () => {
  const actionLogin = useSrisiamStore((state) => state.actionLogin);
  const user = useSrisiamStore((state) => state.user);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const res = await actionLogin(data);
      const role = res.data.payload.role;
      toast.success("Welcome back!");
      roleRedirect(role);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      toast.error(errMsg);
    }
  };

  const logingoogle = () => {
    window.location.href = `${API_BASE_URL}/api/google`;
  };

  const roleRedirect = (role) => {
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate(-1);
    }
  };
  return (
    <div className="min-h-screen flex flex-col-reverse md:flex-row">
      {/* Left Side - Welcome Section */}
      <div className="md:w-1/2 bg-gradient-to-br from-[#001F3F] to-[#003366] flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-16 relative overflow-hidden lg:rounded-r-[100px]">
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center py-6 sm:py-8 md:py-12 lg:py-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">
            Srisiam, Welcome!
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-4 sm:mb-6 lg:mb-8">
            ไม่มีบัญชีใช่หรือไม่ ?
          </p>
          <Link to="/auth/register">
            <p
              className="inline-block px-4 sm:px-6 md:px-8 py-2 sm:py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-[#001F3F] transition-all duration-300"
            >
              ลงทะเบียน
            </p>
          </Link>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 md:w-1/2 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8 lg:py-12 bg-white">
        <div className="w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-xl">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              เข้าสู่ระบบ
            </h2>
          </div>

          {/* Login Form */}
          <div className="space-y-3 sm:space-y-4">
            <FormContainer onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <FormInput
                  name="email"
                  label="ชื่อ"
                  type="email"
                  placeholder="ชื่อ"
                  className="bg-gray-200 border-0 focus:bg-gray-200 focus:ring-2 focus:ring-[#001F3F] h-10 sm:h-12"
                />
              </div>

              <div>
                <FormInput
                  name="password"
                  label="รหัสผ่าน"
                  type="password"
                  placeholder="รหัสผ่าน"
                  className="bg-gray-200 border-0 focus:bg-gray-200 focus:ring-2 focus:ring-[#001F3F] h-10 sm:h-12"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-right pt-1">
                <Link
                  to="/auth/forgot-password"
                  className="text-xs sm:text-sm text-[#001F3F] hover:underline font-medium"
                >
                  ลืมรหัสผ่าน?
                </Link>
              </div>

              <SubmitButton
                className="w-full bg-[#001F3F] hover:bg-[#003366] text-white h-10 sm:h-12 rounded-lg font-medium mt-2"
                size="lg"
                text="เข้าสู่ระบบ"
              />
            </FormContainer>

            {/* Divider */}
            <div className="relative my-4 sm:my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-4 bg-white text-gray-400">
                  ตำเนินการต่อด้วย
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              onClick={logingoogle}
              className="w-full flex items-center justify-center px-4 h-10 sm:h-12 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
            >
              {/* Google Icon */}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-xs sm:text-sm">Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
