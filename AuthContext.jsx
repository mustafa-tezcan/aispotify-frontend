import { createContext, useState, useEffect } from "react";
import { getToken, saveToken, deleteToken } from "./AuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // ✅ kullanıcı bilgisi

  const login = async (token, userData) => {
    await saveToken(token);
    setUserToken(token);
    setUser(userData); // ✅ kullanıcıyı state’e ata
  };

  const logout = async () => {
    await deleteToken();
    setUserToken(null); //tokenı temizle giriş yaparken tokena bakılıyor yoksa giriş ypılıyor.
    setUser(null); // kullanıcıyı temizle
  };

  const checkLogin = async () => {
    const token = await getToken();
    if (token) setUserToken(token);
    setLoading(false);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
