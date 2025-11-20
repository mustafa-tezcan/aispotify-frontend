import {
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { useState, useRef } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import icons from "../constants/icons";

const FormField = ({
  placeholder,
  onChangeText,
  value,
  title,
  fieldWith,
  mode,
}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [open, setOpen] = useState(false); // dropdown için
  const [items, setItems] = useState([
    { label: "Public", value: true },
    { label: "Private", value: false },
  ]);

  const inputRef = useRef(null);
  const { width, height } = Dimensions.get("window");
  const borderColor = isFocused ? "border-[#7C3AED]" : "border-inputBorder";

  const togglePassword = () => {
    setShowPassword(!showPassword);
    inputRef.current?.setNativeProps({ secureTextEntry: !showPassword });
  };

  return (
    <View className="mb-4">
      {title && <Text className="ml-1 mb-1 text-black">{title}</Text>}

      {mode === "dropdown" ? (
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={onChangeText}
          setItems={setItems}
          style={{
            width: width * fieldWith,
            minHeight: height * 0.06,
            borderRadius: 16,
            borderColor: "#ccc",
          }}
          dropDownContainerStyle={{
            width: width * fieldWith,
            borderColor: "#ccc",
          }}
        />
      ) : (
        <View className="flex-row">
          <TextInput
            ref={inputRef}
            style={{
              width: width * fieldWith,
              height: height * 0.06,
              borderRadius: 16,
            }}
            className={`px-3 rounded-xl text-black font-sregular border ${borderColor}`}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            secureTextEntry={mode === "password" && showPassword}
            onChangeText={onChangeText}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {mode === "password" && (
            <View className="absolute right-3 top-5">
              <TouchableOpacity onPress={togglePassword}>
                <Image
                  source={!showPassword ? icons.show : icons.hide}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default FormField;
