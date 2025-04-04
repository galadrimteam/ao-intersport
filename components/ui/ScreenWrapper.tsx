import React from "react";
import { Platform, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps extends ViewProps {
  topSafeArea?: boolean;
  topBackgroundClassName?: string;
  bottomSafeArea?: boolean;
  bottomBackgroundClassName?: string;
}

export default function ScreenWrapper({
  topSafeArea = true,
  topBackgroundClassName = "bg-primary-500",
  bottomSafeArea = true,
  bottomBackgroundClassName = "bg-white",
  ...props
}: ScreenWrapperProps) {
  const { top, bottom } = useSafeAreaInsets();
  const bottomSafeAndroid = Platform.OS === "android" ? bottom + 16 : bottom;

  return (
    <View style={{ flex: 1 }} {...props}>
      {topSafeArea && (
        <View
          style={{
            flex: 0,
            paddingTop: top,
          }}
          className={topBackgroundClassName}
        />
      )}

      <View style={{ flex: 1 }}>{props.children}</View>

      {bottomSafeArea && (
        <View
          style={{
            flex: 0,
            paddingBottom: bottomSafeAndroid,
          }}
          className={bottomBackgroundClassName}
        />
      )}
    </View>
  );
}
