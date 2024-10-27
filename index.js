window.onload = () => {
  // Check if the auth token exists in localStorage
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    // Redirect to the login page if token is not found
    window.location.href = "/login.html";
  } else {
    console.log("User is authenticated, token:", authToken);
    // Continue loading the page or perform additional actions
  }
};
