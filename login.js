document.querySelector(".spooky-button").addEventListener("click", () => {
  const redirectUri = chrome.identity.getRedirectURL();

  chrome.identity.launchWebAuthFlow(
    {
      url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=846131186905-bv91u99v2feddvs5jajrescgicnnm6ak.apps.googleusercontent.com&response_type=token&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=https://www.googleapis.com/auth/gmail.modify%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile`,
      interactive: true,
    },
    (redirectUrl) => {
      if (chrome.runtime.lastError || !redirectUrl) {
        console.error("Login failed:", chrome.runtime.lastError);
        return;
      }

      // Extract the access token from the redirect URL
      const accessToken = new URL(redirectUrl).hash.split("&")[0].split("=")[1];
      console.log("Access Token:", accessToken);

      // Store the token in localStorage for future use
      localStorage.setItem("authToken", accessToken);

      // Redirect to index.html or display a success message
      window.location.href = "/index.html";
    }
  );
});
