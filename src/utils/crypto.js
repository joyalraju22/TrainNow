export const hashPassword = (password) =>
  btoa(password + "_trainnow_salt");