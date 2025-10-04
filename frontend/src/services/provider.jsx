import { useState } from "react";
import authService, { AuthContext } from "@/services/authService";

function AuthProvider({ children }) {
  let [isAuth, setIsAuth] = useState(!!authService.getAccessToken());
  let [userInfo, setUserInfo] = useState(authService.getUserDetails());

  let signin = (token = authService.getFakeToken()) => {
    authService.setAccessToken(token);
    setIsAuth(true);
  };

  let signout = () => {
    authService.clearToken();
    setIsAuth(false);
    setUserInfo(undefined);
  };

  let addUserInfo = (info) => {
    setUserInfo(info);
    authService.setUserDetails(info);
  };

  let value = { isAuth, signin, signout, userInfo, addUserInfo };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
