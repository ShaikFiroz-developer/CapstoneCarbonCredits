import { createContext } from "react";

export const LoginContext = createContext({
  isLoggedIn: false,
  userroles: "",
  username: "",
  setLoginState: () => {},
});
