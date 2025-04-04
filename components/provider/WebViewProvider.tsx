import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { WebView, WebViewProps } from "react-native-webview";
import { useWebView } from "../context/WebViewContext";

export type WebViewWrapperHandle = {
  injectJavaScript: (script: string) => void;
};

const WebViewWrapper = forwardRef<WebViewWrapperHandle, WebViewProps>(
  (props, ref) => {
    const webViewRef = useRef<WebView>(null);
    const { injectedScripts, injectedStyles, messageHandlers } = useWebView();

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
      }
      props.onLoadEnd?.(mockup);
    };

    return (
      <WebView
        ref={webViewRef}
        {...props}
        onLoadEnd={onLoadEnd}
        injectedJavaScript={combinedInjectedJavaScript}
        onMessage={handleMessage}
      />
    );
  }
);

WebViewWrapper.displayName = "WebViewWrapper";

export default WebViewWrapper;
