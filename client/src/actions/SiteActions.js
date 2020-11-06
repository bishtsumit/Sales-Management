import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  REQUEST_SITE,
  GET_ERRORS,
  ALL_REQUESTS,
  REQUEST_DATA_BY_ID,
  ALL_FOLLOWUPS,
} from "./types";

export const RequestSiteAction = (siteData) => (dispatch) => {
  axios
    .post("api/user/requestsite", siteData)
    .then((res) => {
      console.log(res);
      dispatch(Set_Request_Site_and_Errors("success"));

      dispatch({
        type: GET_ERRORS,
        payload: {},
      });
    })
    .catch((err) => {
      console.log(err);

      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });

      dispatch(Set_Request_Site_and_Errors(""));
    });
};

export const GetAllWebRequests = () => (dispatch) => {
  axios
    .post("api/user/allrequests")
    .then((res) => {
      console.log(res.data);

      dispatch({
        type: ALL_REQUESTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);

      dispatch({
        type: ALL_REQUESTS,
        payload: null,
      });
    });
};

export const GetAllFollowups = (data) => (dispatch) => {
  axios
    .post("api/user/GetSignupUsers", data)
    .then((res) => {
      console.log(res.data);

      dispatch({
        type: ALL_FOLLOWUPS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);

      dispatch({
        type: ALL_FOLLOWUPS,
        payload: [],
      });
    });
};

export const getDataById = (id) => (dispatch) => {
  console.log(id);
  axios
    .get(`/api/user/getRequestById/${id}`)
    .then((res) => {
      console.log(res.data);

      dispatch({
        type: REQUEST_DATA_BY_ID,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);

      dispatch({
        type: REQUEST_DATA_BY_ID,
        payload: null,
      });
    });
};

export const UpdateClientRequest = (siteData, id) => (dispatch) => {
  axios
    .post(`/api/user/updateClientRequestStatus`, siteData)
    .then((res) => {
      console.log(res);
      dispatch(Set_Request_Site_and_Errors("success"));

      dispatch({
        type: GET_ERRORS,
        payload: {},
      });
    })
    .catch((err) => {
      console.log(err);

      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });

      dispatch(Set_Request_Site_and_Errors(""));
    });
};

export const ClearSiteKeyFromStore = () => (dispatch) => {
  dispatch(Set_Request_Site_and_Errors(""));
};

export const Set_Request_Site_and_Errors = (value) => {
  return {
    type: REQUEST_SITE,
    payload: value,
  };
};
