import Router from "next/router";
import axios from "axios";

axios.defaults.withCredentials = true;

const WINDOW_USER_SCRIPT_VARIABLE = `__USER__`;

export const getUserScript = user => {
  return `${WINDOW_USER_SCRIPT_VARIABLE} = ${JSON.stringify(user)};`;
};

export const getServerSideToken = req => {
  const { signedCookies = {} } = req;

  if (!signedCookies) {
    return {};
  } else if (!signedCookies.token) {
    return {};
  }
  return { user: signedCookies.token };
};

export const getClientSideToken = () => {
  if (typeof window !== "undefined") {
    const user = window[WINDOW_USER_SCRIPT_VARIABLE] || {};
    return { user };
  }
  return { user: {} };
};

const redirectUser = (res, path) => {
  if (res) {
    // can specify it as a 302 (temporary instead of a 301 redirect)
    res.redirect(302, path);
    // res.finished is a next.js construct only, that tells next.js you have handled the entire request/response lifecycle in getInitialProps, so that it knows not to continue writing to the response.
    res.finished = true;
    return {};
  }
  // if no response, redirect on the client with Next's router
  Router.replace(path);
  return {};
};

export const authInitialProps = isProtectedRoute => ({ req, res }) => {
  const auth = req ? getServerSideToken(req) : getClientSideToken();
  const currentPath = req ? req.url : window.location.pathname;
  const user = auth.user;
  const isAnonymous = !user || user.type !== "authenticated";
  if (isProtectedRoute && isAnonymous && currentPath !== "/login") {
    return redirectUser(res, "/login");
  }
  return { auth };
};

export const getUserProfile = async () => {
  const { data } = await axios.get("/api/profile");
  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await axios.post("/api/login", { email, password });
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = data || {};
  }
};

export const logoutUser = async () => {
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = {};
  }
  await axios.post("/api/logout");
  Router.push("/login");
};
