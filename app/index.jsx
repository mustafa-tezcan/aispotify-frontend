import { useEffect, useContext } from "react";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../AuthContext"; // ✅ Context ekle

export default function Index() {
  const { userToken, loading } = useContext(AuthContext); // ✅ Token ve loading al

  useEffect(() => {
    // ✅ Loading bitene kadar bekle
    if (loading) return;

    // ✅ Token varsa home, yoksa login
    if (userToken) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/(auth)/sign-in");
    }
  }, [loading, userToken]); // ✅ Dependency array

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );
}
