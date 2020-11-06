import axios from "axios";
import jwt_decode from "jwt-decode";
import { GetAllsites } from "./authActions";

import { GET_FEATURES, ADD_WEBSITE, GET_ERRORS } from "./types";

export const getfeatures = () => (dispatch) => {
  axios
    .get(`/api/user/getfeatures/`)
    .then((res) => {
      console.log(res.data);

      dispatch({
        type: GET_FEATURES,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);

      dispatch({
        type: GET_FEATURES,
        payload: null,
      });
    });
};

const saveWesbite = (detail) => (dispatch) => {
  console.log(detail);

  axios
    .post("/api/user/addWebsite", detail, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      dispatch({
        type: ADD_WEBSITE,
        payload: "success",
      });

      // after adding or updating websites update again
      console.log("All site function is getting called");

      dispatch(GetAllsites());
    })
    .catch((err) => {
      console.log(err.response.data);

      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

const updateWebsiteFeature = (detail) => (dispatch) => {
  console.log(detail);

  axios
    .post("/api/user/updateWebsite", detail, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      dispatch({
        type: ADD_WEBSITE,
        payload: "success",
      });

      // after adding or updating websites update again
      console.log("All site function is getting called");

      dispatch(GetAllsites());
    })
    .catch((err) => {
      console.log(err.response.data);

      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

const deleteWebsiteFeature = (detail) => (dispatch) => {
  axios
    .post("/api/user/deleteWebsite", detail)
    .then((res) => {
      dispatch({
        type: ADD_WEBSITE,
        payload: "success",
      });

      // after adding or updating websites update again
      console.log("All site function is getting called");

      dispatch(GetAllsites());
    })
    .catch((err) => {
      console.log(err.response.data);

      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const CheckAndSaveWebsite = (detail, site) => (dispatch) => {
  axios
    .post("/api/user/CheckWebsite", site)
    .then((res) => {
      console.log(res.data);

      // incase of 1 and 2 send files to the api but in 3 for deleting info use only site info.
      if (site.type == 1) dispatch(saveWesbite(detail));
      else if (site.type == 2) dispatch(updateWebsiteFeature(detail));
      else if (site.type == 3) dispatch(deleteWebsiteFeature(site));
    })
    .catch((err) => {
      console.log(err.response.data);

      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};
