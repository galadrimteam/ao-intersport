import { useEffect, useCallback } from "react";
import { useWebView } from "../context/WebViewContext";
import { useUser } from "../context/AuthContext";

export const useWebViewCookies = () => {
  const { injectScript, addMessageHandler, removeMessageHandler } =
    useWebView();
  const { setIsConnected, setUser, setFavoriteStore } = useUser();

  // Mémoïsez le handler pour éviter des recréations
  const messageHandler = useCallback(
    (message: string) => {
      console.log("Message received:", message);
      if (message === "cookie:connected") {
        setIsConnected(true);
      } else if (message === "cookie:not_connected") {
        setIsConnected(false);
        setUser(null);
      } else if (message.startsWith("customerInformations=")) {
        const cookieValue = message.split("|");
        const email = atob(cookieValue[0].replace("customerInformations=", ""));
        const name = decodeURIComponent(cookieValue[1]).replace(",", " ");
        const id = atob(cookieValue[2]);
        setUser({ email, name, id });
      } else if (message.startsWith("customerFavoriteStore=")) {
        const favoriteStore = decodeURIComponent(
          message.replace("customerFavoriteStore=", "")
        );
        setFavoriteStore(favoriteStore);
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
          const isConnected = cookies.includes('customerInformations');
          const cookieValue = document.cookie.split('; ').find(row => row.startsWith('customerInformations='));
          const favoriteStore = document.cookie.split('; ').find(row => row.startsWith('customerFavoriteStore='));
          if (lastState !== isConnected) {
            lastState = isConnected;
            window.ReactNativeWebView.postMessage(isConnected ? 'cookie:connected' : 'cookie:not_connected');
            window.ReactNativeWebView.postMessage(cookieValue);
            window.ReactNativeWebView.postMessage(favoriteStore);
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
