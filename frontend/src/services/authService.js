import { createContext } from "react";
import { Db } from "@/helper/db";
import { APP_TOKEN_NAME } from "@/services/config";

const FAKE_TOKEN =
  "eyFAKETOKEN1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const USER_STORE = "FARA__USER_STORE";

export const AuthContext = createContext();

const authService = {
  getAccessToken: () => {
    return localStorage.getItem(APP_TOKEN_NAME);
  },

  clearToken: () => {
    localStorage.removeItem(APP_TOKEN_NAME);
    localStorage.removeItem(USER_STORE);

    sessionStorage.removeItem(Db.logged_login);
    sessionStorage.removeItem(Db.logged_nom);
    sessionStorage.removeItem(Db.logged_role);
  },

  setAccessToken: (token) => {
    authService.isLogged = true;
    localStorage.setItem(APP_TOKEN_NAME, token);
  },

  setFakeAccessToken: () => {
    localStorage.setItem(APP_TOKEN_NAME, FAKE_TOKEN);
  },

  removeFakeAccessToken: () => {
    localStorage.removeItem(APP_TOKEN_NAME);
  },

  setUserDetails: (item) => {
    localStorage.setItem(USER_STORE, JSON.stringify(item));
  },

  getUserDetails: () => {
    return JSON.parse(localStorage.getItem(USER_STORE));
  },

  updateUserDetails: (key, value) => {
    let _temp = JSON.parse(localStorage.getItem(USER_STORE));
    _temp[key] = value;
    localStorage.setItem(USER_STORE, JSON.stringify(_temp));
  },

  getFakeToken: () => FAKE_TOKEN,
};

export default authService;
