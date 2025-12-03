import { createContext, useState, useEffect } from "react";
import { getToken, saveToken, deleteToken } from "./AuthService";
import { userInfo } from "./Fetch"; // ✅ Import ekle

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
    try {
      const token = await getToken();
      console.log("🔑 Token:", token); // ✅ Bu satırı ekle

      if (token) {
        setUserToken(token);

        const result = await userInfo();
        console.log("👤 User result:", result); // ✅ Bu satırı ekle

        if (result.success) {
          setUser(result.data);
        } else {
          console.log("Token geçersiz, logout yapılıyor");
          await logout();
        }
      } else {
        console.log("❌ Token bulunamadı"); // ✅ Bu satırı ekle
      }
    } catch (error) {
      console.error("checkLogin error:", error);
      await logout();
    } finally {
      setLoading(false);
    }
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
