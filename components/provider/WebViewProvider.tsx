import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { WebView, WebViewNavigation, WebViewProps } from "react-native-webview";
import { useWebView } from "../context/WebViewContext";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export type WebViewWrapperHandle = {
  injectJavaScript: (script: string) => void;
};

const WebViewWrapper = forwardRef<WebViewWrapperHandle, WebViewProps>(
  (props, ref) => {
    const webViewRef = useRef<WebView>(null);
    const router = useRouter();
    const { injectedScripts, injectedStyles, messageHandlers } = useWebView();
    const [isLoading, setIsLoading] = useState(true);
    const [isScriptInjected, setIsScriptInjected] = useState(false);

    useImperativeHandle(ref, () => ({
      injectJavaScript: (script: string) => {
        webViewRef.current?.injectJavaScript(script);
      },
    }));

    const handleMessage = (event: any) => {
      const message = event.nativeEvent.data;
      messageHandlers.forEach((handler) => handler(message));
    };

    // Combine tous les scripts et styles à injecter
    const combinedInjectedJavaScript = [
      props.injectedJavaScript || "",
      ...injectedScripts,
      ...injectedStyles,
    ].join(";\n");

    // Injecte le code lorsque le WebView est chargé
    const onLoadEnd = (mockup: any) => {
      if (combinedInjectedJavaScript) {
        webViewRef.current?.injectJavaScript(combinedInjectedJavaScript);
        setTimeout(() => setIsScriptInjected(true), 10);
      } else {
        setIsScriptInjected(true);
      }
      props.onLoadEnd?.(mockup);
    };

    const handleNavigationStateChange = (navState: WebViewNavigation) => {
      if (navState.url === "https://www.intersport.fr/my-account/profile/") {
        webViewRef.current?.stopLoading();
        router.push("/(tabs)/account");
        webViewRef.current?.injectJavaScript(`
          window.history.back();
          true;
        `);
        return;
      } else if (navState.url.includes("https://www.intersport.fr/login")) {
        const hideScript = `
          document.getElementById('searchFormulaire')?.remove();
          document.getElementsByClassName('transverse_footer')[0]?.remove();
          document.getElementsByClassName('section-authentification__aside ')[0]?.remove();
          true;
        `;
        webViewRef.current?.injectJavaScript(hideScript);
      }

      // Mettre à jour l'état de chargement lors de la navigation
      setIsLoading(navState.loading);
      if (navState.loading) {
        setIsScriptInjected(false);
      }
    };

    return (
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          {...props}
          onLoadStart={() => {
            setIsLoading(true);
            setIsScriptInjected(false);
            //props.onLoadStart?.();
          }}
          onLoadEnd={onLoadEnd}
          injectedJavaScript={combinedInjectedJavaScript}
          onMessage={handleMessage}
          onNavigationStateChange={(navState) => {
            if (navState.url) {
              handleNavigationStateChange(navState);
            }
          }}
          style={[
            props.style,
            (isLoading || !isScriptInjected) && styles.hiddenWebView,
          ]}
        />

        {(isLoading || !isScriptInjected) && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  hiddenWebView: {
    opacity: 0,
    height: 0,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});

WebViewWrapper.displayName = "WebViewWrapper";

export default WebViewWrapper;
