import { Stack } from "expo-router";
import { Slot } from "expo-router";

const TabsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default TabsLayout;
