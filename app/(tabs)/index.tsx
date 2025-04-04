import { useWebViewCookies } from "@/components/hook/useWebViewCookie";
import { useWebViewStyles } from "@/components/hook/useWebViewStyle";
import WebViewWrapper from "@/components/provider/WebViewProvider";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet } from "react-native";
import WebView from "react-native-webview";

const MAIN_URI = "https://www.intersport.fr";

const customCSS = `
  .header-nav__top { 
    background-color: darkturquoise !important; 
  }
`;

export default function WebViewScreen() {
  useWebViewCookies();
  useWebViewStyles(customCSS);

  return (
    <ScreenWrapper style={styles.safeAreaContainer}>
      <WebViewContent />
    </ScreenWrapper>
  );
}

type WebViewParams = {
  url?: string;
};

const WebViewContent = React.forwardRef((props, ref) => {
  const params = useLocalSearchParams<WebViewParams>();

  const initialUrl = params?.url || "https://www.intersport.fr";
  const handleMessage = (event: any) => {
    console.log("Message from WebView:", event.nativeEvent.data);
  };

  return (
    <WebViewWrapper
      ref={ref as React.RefObject<WebView>}
      source={{ uri: initialUrl || MAIN_URI }}
      style={styles.webView}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onMessage={handleMessage}
      injectedJavaScriptBeforeContentLoaded={`
        window.isNativeApp = true;
        true;
      `}
      onLoadProgress={({ nativeEvent }) => {
        if (nativeEvent.progress === 1) {
          console.log("WebView fully loaded");
        }
      }}
      onError={(error) => console.error("WebView error:", error)}
    />
  );
});

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});
