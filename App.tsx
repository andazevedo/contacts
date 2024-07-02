import { StatusBar } from "react-native";

import { Loading } from "@/app/components/loading";
import { Home } from "@/app/home";

import {
  useFonts,
  Ubuntu_700Bold,
  Ubuntu_500Medium,
  Ubuntu_400Regular,
} from "@expo-google-fonts/ubuntu";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [fontsLoaded] = useFonts({
    Ubuntu_700Bold,
    Ubuntu_500Medium,
    Ubuntu_400Regular,
  });
  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={"transparent"}
        translucent
      />
      <Home />
    </GestureHandlerRootView>
  );
}
