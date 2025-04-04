import { useEffect } from "react";
import { useWebView } from "../context/WebViewContext";

export const useWebViewStyles = (css: string) => {
  const { injectStyle } = useWebView();

  useEffect(() => {
    if (!css) return; // Ne rien faire si le CSS est vide

    const styleId = injectStyle(css);

    return () => {
      const removeScript = `
        (function() {
          var style = document.getElementById('${styleId}');
          if (style) style.remove();
        })();
      `;
      injectStyle(removeScript);
    };
  }, [css]); // Retirez injectStyle des dépendances
};
