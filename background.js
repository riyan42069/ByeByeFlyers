chrome.identity.getAuthToken({ interactive: true }, (token) => {
  if (chrome.runtime.lastError || !token) {
    console.error("Failed to authenticate.");
    return;
  }
  console.log("Authenticated with token:", token);
  fetchGmailMessages(token);
});

function fetchGmailMessages(token) {
  fetch("https://www.googleapis.com/gmail/v1/users/me/messages", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Gmail messages:", data);
      // Call unsubscribe function or further processing here
    })
    .catch((error) => console.error("Error fetching messages:", error));
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "startUnsubscribe") {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      unsubscribeFlyers(token);
    });
  }
});

function unsubscribeFlyers(token) {
  fetch("https://www.googleapis.com/gmail/v1/users/me/messages", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.json())
    .then((data) => {
      const flyerMessages = data.messages.filter((msg) =>
        msg.snippet.includes("Unsubscribe")
      );
      flyerMessages.forEach((msg) => {
        fetch(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}/modify`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              removeLabelIds: ["INBOX"],
              addLabelIds: ["UNSUBSCRIBED"],
            }),
          }
        );
      });
    })
    .catch((error) => console.error("Error unsubscribing from flyers:", error));
}
