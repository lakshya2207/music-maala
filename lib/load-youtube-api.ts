let apiPromise: Promise<typeof YT> | null = null;

/**
 * Loads the YouTube IFrame Player API exactly once and resolves with the
 * global YT namespace once it's ready to construct players.
 */
export function loadYouTubeAPI(): Promise<typeof YT> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("loadYouTubeAPI called on the server"));
  }

  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }

  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT as typeof YT);
    };

    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });

  return apiPromise;
}
