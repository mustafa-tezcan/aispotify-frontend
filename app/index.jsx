import { useEffect } from "react";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  useEffect(() => {
    // Root layout'un mount olması için küçük bir gecikme
    const timer = setTimeout(() => {
      router.replace("(auth)/sign-in");
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );
}
