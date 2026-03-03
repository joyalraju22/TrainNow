export const loginUser = (user) => {
  localStorage.setItem(
    "auth",
    JSON.stringify({
      username: user.username,
      loggedIn: true,
      loginTime: Date.now()
    })
  );
};

export const logoutUser = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  // Check for token first (new auth system)
  const token = localStorage.getItem("token");
  if (token) return true;
  // Fallback to old auth key
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  return auth?.loggedIn === true;
};
