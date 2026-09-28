import { useEffect } from "react";

/**
 * Loads one original ThinkSync page engine after React mounts its JSX.
 * This is intentionally small: the team's manually written JS remains in public/legacy.
 */
function useLegacyPage({ title, stylesheet, script }) {
  useEffect(() => {
    document.title = title || "ThinkSync";

    let styleLink = null;
    if (stylesheet) {
      styleLink = document.createElement("link");
      styleLink.rel = "stylesheet";
      styleLink.href = stylesheet;
      styleLink.dataset.thinksyncPageStyle = "true";
      document.head.appendChild(styleLink);
    }

    const pageScript = document.createElement("script");
    pageScript.src = script;
    pageScript.dataset.thinksyncPageScript = "true";
    document.body.appendChild(pageScript);

    return () => {
      if (styleLink && styleLink.parentNode) {
        styleLink.parentNode.removeChild(styleLink);
      }
      if (pageScript && pageScript.parentNode) {
        pageScript.parentNode.removeChild(pageScript);
      }
    };
  }, [title, stylesheet, script]);
}

export default useLegacyPage;
