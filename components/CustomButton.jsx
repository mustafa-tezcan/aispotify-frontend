import { Text, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const CustomButton = ({ title, onPress }) => {
  const { width, height } = Dimensions.get("window");

  //**
  //    colors={["#7C3AED", "#FB7185"]}
  //    start={{ x: 0.1, y: 0.1 }}
  //    end={{ x: 1, y: 1 }} */
  return (
    <LinearGradient
      colors={["#4F46E5", "#7C3AED"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0.3 }}
      style={{
        width: width * 0.85,
        height: height * 0.06,
        borderRadius: 16, // rounded-lg
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 12,
        }}
      >
        <Text
          className="font-sbold"
          style={{ color: "white", fontWeight: "600", fontSize: 16 }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default CustomButton;
