import axios from "axios";
import { GET_ERRORS, SET_CURRENT_USER, ALL_SITES } from "./types";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/api/user/register", userData)
    .then((res) => history.push("/login"))
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

//Login -- get user token

export const LoginUser = (userData) => (dispatch) => {
  axios
    .post("/api/user/login", userData)
    .then((res) => {
      const { token } = res.data;

      localStorage.setItem("jwtToken", token);

      console.log(token);

      // set auth token to the header for the API calls
      setAuthToken(token);

      //Decode token to get user data
      const decoded = jwt_decode(token);

      dispatch(setCurrentUser(decoded));

      dispatch(GetAllsites());
    })
    .catch((err) => {
      console.log(err);

      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const logoutUser = (history) => (dispatch) => {
  localStorage.removeItem("jwtToken");

  // remove the auth header fo future request
  setAuthToken(false);

  // set current user to  {} like the initial state

  dispatch(setCurrentUser({}));

  //history.push("/");
  window.location.href = "/";
};

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

export const GetAllsites = () => (dispatch) => {
  axios
    .post("/api/user/GetAllSites")
    .then((res) => {
      console.log("saving all sites");

      localStorage.setItem("sites", JSON.stringify(res.data));

      dispatch(SetAllSites(res.data));
    })
    .catch((err) => {
      console.log(err);

      dispatch(SetAllSites([]));
    });
};

export const SetAllSites = (data) => {
  console.log(data);

  return {
    type: ALL_SITES,
    payload: data,
  };
};
