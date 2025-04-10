import React, { createContext, useContext, useMemo, useState } from "react";

type WebViewContextType = {
  injectedScripts: string[];
  injectedStyles: string[];
  messageHandlers: Array<(message: string) => void>;
  injectScript: (script: string) => void;
  injectStyle: (css: string) => string;
  addMessageHandler: (handler: (message: string) => void) => void;
  removeMessageHandler: (handler: (message: string) => void) => void;
  removeAllHandlers: () => void;
  injectTemporaryScript: (script: string) => void;
};

const WebViewContext = createContext<WebViewContextType | undefined>(undefined);

export const WebViewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messageHandlers, setMessageHandlers] = useState<
    Array<(message: string) => void>
  >([]);
  const [injectedScripts, setInjectedScripts] = useState<string[]>([]);
  const [injectedStyles, setInjectedStyles] = useState<string[]>([]);

  const removeAllHandlers = () => {
    setMessageHandlers([]);
    setInjectedScripts([]);
    setInjectedStyles([]);
  };

  const contextValue = useMemo<WebViewContextType>(
    () => ({
      injectedScripts,
      injectedStyles,
      messageHandlers,
      injectScript: (script: string) => {
        setInjectedScripts((prev) => [...prev, script]);
      },
      injectStyle: (css: string) => {
        const styleId = `style-${Date.now()}`;
        const script = `
          (function() {
            var style = document.createElement('style');
            style.id = '${styleId}';
            style.innerHTML = \`${css}\`;
            document.head.appendChild(style);
          })();
        `;
        setInjectedStyles((prev) => [...prev, script]);
        return styleId;
      },
      addMessageHandler: (handler: (message: string) => void) => {
        setMessageHandlers((prev) => [...prev, handler]);
      },
      removeMessageHandler: (handler: (message: string) => void) => {
        setMessageHandlers((prev) => prev.filter((h) => h !== handler));
      },
      removeAllHandlers: removeAllHandlers,
      injectTemporaryScript: (script: string) => {
        const tempScript = `
          (function() {
            try {
              ${script}
            } catch (e) {
              console.error('Temporary script error:', e);
            }
          })();
          true; // Nécessaire pour le retour de la méthode injectJavaScript pour android
        `;

        setInjectedScripts((prev) => [...prev, tempScript]);

        setTimeout(() => {
          setInjectedScripts((prev) => prev.filter((s) => s !== tempScript));
        }, 1000);
      },
    }),
    [injectedScripts, injectedStyles, messageHandlers]
  );

  return (
    <WebViewContext.Provider value={contextValue}>
      {children}
    </WebViewContext.Provider>
  );
};

export const useWebView = () => {
  const context = useContext(WebViewContext);
  if (!context) {
    throw new Error("useWebView must be used within a WebViewProvider");
  }
  return context;
};
