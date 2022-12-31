import { useCallback, useEffect, useState } from "react";

let logoutTimer;
export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);
  const [tokenExpDate, setTokenExpDate] = useState();
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    const tokenExpDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpDate(tokenExpDate);
    localStorage.setItem("userData", JSON.stringify({
      userId: uid, 
      token,
      expiration: tokenExpDate.toISOString()
    }))
    setUserId(uid);
  }, [])
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.token && new Date(userData.expiration) > new Date()) {
      login(userData.userId, userData.token, new Date(userData.expiration));
    }
  }, [login]);
  useEffect(() => {
    if (token && tokenExpDate) {
      const remainingTime = tokenExpDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpDate])


  return {token, login, logout, userId}
}