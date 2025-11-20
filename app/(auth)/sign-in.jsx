import { Image, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "../../constants/icons";

const SignIn = () => {
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
          activeOpacity={0.8}>
          <Text className="text-white font-medium">Log in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default SignIn;
