import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import icons from "../constants/icons";

const ListCard = ({
  name,
  profilePicture,
  username,
  description,
  listId,
  onPress, // tıklama fonksiyonu
  showStartRoom, // butonu gösterecek mi
}) => {
  const { width } = Dimensions.get("window");

  const handlePress = () => {
    if (onPress) onPress(listId); // sadece onPress varsa çağır
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
      <View className="items-center">
        <View
          className="bg-primary h-44 rounded-3xl mt-4 shadow-lg"
          style={{ width: width * 0.85 }}>
          <View className="flex-row mt-3 ml-3">
            <View className="w-16 h-16">
              <Image
                className="h-16 w-16 rounded-xl"
                source={{ uri: profilePicture }}
              />
            </View>
            <View className="mt-1 ml-4">
              <Text className="text-sm">created by </Text>
              <Text className="font-sbold text-lg">{username}</Text>
            </View>
          </View>

          <View>
            <Text className="font-bold text-center mt-3">{name}</Text>
            <Text className="ml-3">{description}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListCard;
