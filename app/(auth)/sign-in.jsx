import { Image, Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext } from "react";
import { useRouter } from "expo-router"; // ✅ Navigation için
import * as WebBrowser from "expo-web-browser";
import { AuthContext } from "../../AuthContext"; // ✅ Context ekle
import icons from "../../constants/icons";
import { userInfo } from "../../Fetch";

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const { login, logout } = useContext(AuthContext); // ✅ Context'ten login fonksiyonu

  const router = useRouter(); // ✅ Navigation

  const handleLogin = async () => {
    try {
      setLoading(true);
      await WebBrowser.warmUpAsync(); // Tarayıcıyı hazırla

      const loginUrl = "http://localhost:5035/api/auth/login";

      const result = await WebBrowser.openAuthSessionAsync(
        loginUrl,
        "postify://auth/callback",
        {
          // ✅ Browser cache'i temizle
          preferEphemeralSession: true, // iOS: Private browsing mode
        }
      );

      if (result.type === "cancel") {
        Alert.alert("İptal", "Giriş işlemi iptal edildi");
        return;
      }

      if (result.type === "success" && result.url) {
        // ✅ URL'den JWT'yi parse et
        const url = new URL(result.url);
        const jwt = url.searchParams.get("jwt");

        if (jwt) {
          // ✅ 1. Token'ı kaydet
          await login(jwt, null);

          // ✅ 2. User bilgisini backend'den çek
          const userResult = await userInfo();
          console.log("userResult:", userResult); // ✅ Bu satırı ekle

          if (userResult.success) {
            // ✅ 3. Token + User'ı context'e kaydet
            await login(jwt, userResult.data);

            // ✅ 4. Home'a yönlendir
            router.replace("/(tabs)/home");
          } else {
            Alert.alert("Hata", "Kullanıcı bilgileri alınamadı");
            await logout(); // Bir şeyler ters gitti, logout yap
          }
        } else {
          Alert.alert("Hata", "Token alınamadı");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Hata", "Giriş sırasında bir hata oluştu");
    } finally {
      setLoading(false);
      await WebBrowser.coolDownAsync(); // ✅ Tarayıcıyı temizle
    }
  };

  return (
    <SafeAreaView className="h-full w-full bg-[#121212]">
      <View className="flex-1 justify-center items-center">
        <Image
          source={icons.whitelogo}
          resizeMode="cover"
          className="w-24 h-24 mb-8"
        />
        <Text className="text-white text-3xl font-bold">
          Millions of songs.
        </Text>
        <Text className="text-white text-3xl font-bold">Free on Spotify.</Text>
      </View>

      <View className="items-center gap-y-2 pb-14">
        <TouchableOpacity
          className="w-[90%] h-12 px-4 bg-[#1ED760] rounded-full items-center justify-center"
          activeOpacity={0.8}>
          <Text className="font-medium">Sign up free</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[90%] h-12 px-4 border border-[#FFFFFF] rounded-full items-center justify-center"
          activeOpacity={0.8}
          onPress={handleLogin}
          disabled={loading}>
          <Text className="text-white font-medium">
            {loading ? "Loading..." : "Log in"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
