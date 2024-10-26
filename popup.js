document.getElementById("unsubscribe").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "startUnsubscribe" });
});
