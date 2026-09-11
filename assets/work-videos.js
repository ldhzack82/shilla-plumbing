/* No YouTube player or external thumbnail request until the visitor clicks. */
(() => {
  "use strict";
  document.querySelectorAll(".work-video-play[data-youtube-id]").forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", () => {
      const id = button.dataset.youtubeId;
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&playsinline=1&rel=0`;
      iframe.title = button.dataset.videoTitle;
      iframe.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      button.replaceWith(iframe);
      iframe.focus();
    }, { once: true });
  });
})();
