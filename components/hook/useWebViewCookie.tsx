import { useEffect, useCallback } from "react";
import { useWebView } from "../context/WebViewContext";
import { useUser } from "../context/AuthContext";

export const useWebViewCookies = () => {
  const { injectScript, addMessageHandler, removeMessageHandler } =
    useWebView();
  const { setIsConnected } = useUser();

  // Mémoïsez le handler pour éviter des recréations
  const messageHandler = useCallback(
    (message: string) => {
      if (message === "cookie:connected") {
        setIsConnected(true);
      } else if (message === "cookie:not_connected") {
        setIsConnected(false);
      }
    },
    [setIsConnected]
  );

  useEffect(() => {
    const cookieCheckScript = `
      (function() {
        let lastState = null;
        function checkCookie() {
          const cookies = document.cookie;
          const isConnected = cookies.includes('JSESSIONID') || cookies.includes('uid');
          if (lastState !== isConnected) {
            lastState = isConnected;
            window.ReactNativeWebView.postMessage(isConnected ? 'cookie:connected' : 'cookie:not_connected');
          }
        }
        checkCookie();
        setInterval(checkCookie, 5000);
      })();
    `;

    injectScript(cookieCheckScript);
    addMessageHandler(messageHandler);

    return () => {
      removeMessageHandler(messageHandler);
    };
  }, [messageHandler]); // Dépendances simplifiées
};
