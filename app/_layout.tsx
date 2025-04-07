import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import * as NavigationBar from "expo-navigation-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UserProvider } from "@/components/context/AuthContext";
import { WebViewProvider } from "@/components/context/WebViewContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync("overlay-swipe");
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <UserProvider>
        <WebViewProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="webview" options={{ title: "Browser" }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </WebViewProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
