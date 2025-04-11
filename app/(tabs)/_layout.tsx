import { Tabs } from "expo-router";
import React, { useRef } from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { MaterialIcons } from "@expo/vector-icons";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFocusEffect } from "@react-navigation/native";
import { WebViewRef } from "./index";
import { useWebView } from "@/components/context/WebViewContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [lastFocusedTab, setLastFocusedTab] = React.useState<string | null>(
    null
  );
  const { injectTemporaryScript } = useWebView();

  useFocusEffect(
    React.useCallback(() => {
      setLastFocusedTab("index");
    }, [lastFocusedTab])
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Boutique",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="shopping-cart" color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              injectTemporaryScript("");
            }
          },
        })}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="camera-alt" color={color} />
          ),
        }}
        listeners={() => ({
          tabPress: () => setLastFocusedTab("scan"),
        })}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Mon compte",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="person" color={color} />
          ),
        }}
        listeners={() => ({
          tabPress: () => setLastFocusedTab("account"),
        })}
      />
    </Tabs>
  );
}
