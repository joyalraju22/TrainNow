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
};

export const isAuthenticated = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth?.loggedIn === true;
};
