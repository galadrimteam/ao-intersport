import { useWebViewCookies } from "@/components/hook/useWebViewCookie";
import { useWebViewStyles } from "@/components/hook/useWebViewStyle";
import WebViewWrapper from "@/components/provider/WebViewProvider";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { useLocalSearchParams } from "expo-router";
import React from "react";
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
    <ScreenWrapper>
      <WebViewContent />
    </ScreenWrapper>
  );
}

type WebViewParams = {
  url?: string | string[];
  timestamp?: string | string[];
};

const getUrl = (params?: WebViewParams) => {
  if (!params?.url) return MAIN_URI;
  return Array.isArray(params.url) ? params.url[0] : params.url;
};

const getTimestamp = (params?: WebViewParams) => {
  if (!params?.timestamp) return Date.now().toString();
  return Array.isArray(params.timestamp)
    ? params.timestamp[0]
    : params.timestamp;
};

const WebViewContent = React.forwardRef((props, ref) => {
  const params = useLocalSearchParams<WebViewParams>();
  const initialUrl = getUrl(params);
  const timestamp = getTimestamp(params);

  const handleMessage = (event: any) => {
    console.log("Message from WebView:", event.nativeEvent.data);
  };

  return (
    <WebViewWrapper
      ref={ref as React.RefObject<WebView>}
      source={{ uri: initialUrl }}
      style={styles.webView}
      key={timestamp}
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
  webView: {
    flex: 1,
  },
});
