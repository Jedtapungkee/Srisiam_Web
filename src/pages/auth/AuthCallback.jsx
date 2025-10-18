import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSrisiamStore from "../../store/Srisiam-store";
import { toast } from "sonner";

const AuthCallback = () => {
  const { setToken } = useSrisiamStore();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSrisiamStore((state) => state.user);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      setToken(token); // เก็บ token ลง zustand + localStorage
    }
  }, [location, setToken]);

  // รอให้ user ถูก set แล้วค่อย redirect ตาม role
  useEffect(() => {
    if (user) {
      roleRedirect(user.role);
      toast.success("Login successful!");
    }
  }, [user, navigate]);

  const roleRedirect = (role) => {
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return <p>Logging in...</p>;
};

export default AuthCallback;
