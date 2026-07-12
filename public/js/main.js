(function () {
  var chatTriggerIds = ["openChatTop", "openChatHero", "openChatContact", "chatFab", "chatFabLabel"];

  function openChat() {
    if (window.acmeWebchat) {
      if (typeof window.acmeWebchat.toggle === "function") {
        window.acmeWebchat.toggle();
        return;
      }
      if (typeof window.acmeWebchat.open === "function") {
        window.acmeWebchat.open();
        return;
      }
    }
    // Cognigy not configured yet (or still loading) — show a friendly hint instead of doing nothing.
    alert(
      "This demo's chat isn't wired up yet.\n\n" +
      "Open public/js/cognigy-embed.js and paste your Cognigy Webchat Endpoint URL, " +
      "then reload the page."
    );
  }

  chatTriggerIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("click", openChat);
  });

  // Belt-and-suspenders: the CSS rule targeting [data-cognigy-webchat-toggle]
  // in styles.css should hide Cognigy's own default launcher, but widget markup
  // can vary by version — so also watch the DOM directly and hide it the moment
  // it appears, regardless of exact class names.
  function hideNativeToggle(node) {
    if (!node || node.nodeType !== 1 || !node.querySelectorAll) return;
    var matches = [];
    if (node.matches && (node.matches("[data-cognigy-webchat-toggle]") || node.matches(".webchat-toggle-button"))) {
      matches.push(node);
    }
    node.querySelectorAll("[data-cognigy-webchat-toggle], .webchat-toggle-button").forEach(function (el) {
      matches.push(el);
    });
    matches.forEach(function (el) { el.style.setProperty("display", "none", "important"); });
  }
  hideNativeToggle(document.body);
  new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      m.addedNodes.forEach(hideNativeToggle);
    });
  }).observe(document.body, { childList: true, subtree: true });
})();
