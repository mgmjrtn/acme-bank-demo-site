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
})();
