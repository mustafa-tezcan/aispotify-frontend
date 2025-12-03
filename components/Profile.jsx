import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import icons from "../constants/icons";
import { useRouter } from "expo-router";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  // ✅ Logout sırasında gösterme
  if (isLoggingOut) {
    return (
      <View className="flex-1 bg-[#121212] justify-center items-center">
        <ActivityIndicator size="large" color="#1ED760" />
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-x-4 ml-4 mt-4">
      <View className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 items-center justify-center">
        {user?.profilePicture ? (
          <Image
            source={{ uri: user.profilePicture }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Text className="text-white text-lg font-bold">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </Text>
        )}
      </View>
      <Text className="text-white font-bold">{user.username}</Text>
      <View className="flex-1 items-end mr-4">
        <TouchableOpacity activeOpacity={0.8} onPress={handleLogout}>
          <Image source={icons.logout} resizeMode="cover" className="w-8 h-8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
