/*
  Cognigy Webchat v3 embed.
  Fill in the two values below from your Cognigy Endpoint (Deploy > Endpoints > Webchat).
  Everything else in this file is optional styling/behavior and already matches the site's
  navy/gold theme, so you likely only need to touch the two lines marked TODO.
*/

window.__COGNIGY_ENDPOINT_URL__ = "https://endpoint-trial.cognigy.ai/9863dba1d12ed73f7ed01800c7da5c4d66004f28e3efa2ddadf4b9794f47c34c";
window.__COGNIGY_WEBCHAT_SCRIPT__ = "https://github.com/Cognigy/Webchat/releases/latest/download/webchat.js"; // usually fine as-is

(function loadCognigyWebchat() {
  var script = document.createElement("script");
  script.src = window.__COGNIGY_WEBCHAT_SCRIPT__;
  script.async = true;
  script.onload = initCognigyWebchat;
  document.head.appendChild(script);
})();

function initCognigyWebchat() {
  if (window.__COGNIGY_ENDPOINT_URL__.indexOf("REPLACE_WITH") === 0) {
    console.warn(
      "[Acme Bank demo] Cognigy endpoint URL is not set yet. " +
      "Open public/js/cognigy-embed.js and paste your Endpoint URL from " +
      "Cognigy > Deploy > Endpoints > Webchat."
    );
    return;
  }

  initWebchat(window.__COGNIGY_ENDPOINT_URL__, {
    settings: {
      colors: {
        primaryColor: "#B9902E",
        primaryContrastColor: "#0F2A44"
      },
      widgetSettings: {
        title: "Support Concierge",
        useOtherAgentLogo: false
      },
      // "injection" auto-sends the get-started payload the instant the widget opens,
      // so the flow's welcome/greeting response shows immediately — no "Start
      // Conversation" button click required. GET_STARTED is the same payload Cognigy's
      // own default button already sends, so no Flow changes should be needed.
      startBehavior: {
        startBehavior: "injection",
        getStartedPayload: "GET_STARTED",
        getStartedText: ""
      },
      embeddingConfiguration: {
        awaitEndpointConfig: false
      }
    }
  }).then(function (webchat) {
    window.acmeWebchat = webchat;
    document.dispatchEvent(new Event("acme-webchat-ready"));
  }).catch(function (err) {
    console.error("[Acme Bank demo] Cognigy webchat failed to initialize:", err);
  });
}
