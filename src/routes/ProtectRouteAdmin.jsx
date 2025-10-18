import React, { useState, useEffect } from "react";
import useSrisiamStore from "../store/Srisiam-store";
import { CurrentAdmin } from "../api/Auth";
import LoadingToRedirect from "./LoadingToRedirect";

const ProtectRouteAdmin = ({ element }) => {
  const [ok, setOk] = useState(false);
  const user = useSrisiamStore((state) => state.user);
  const token = useSrisiamStore((state) => state.token);

  useEffect(() => {
    if (user && token) {
      CurrentAdmin(token)
        .then((res) => setOk(true))
        .catch((err) => setOk(false));
    }
  }, []);

  return ok ? element : <LoadingToRedirect />;
};
export default ProtectRouteAdmin;