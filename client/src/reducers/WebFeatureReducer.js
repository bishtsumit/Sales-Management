import { ADD_WEBSITE, GET_FEATURES } from "../actions/types";

const initialState = {
  message: "",
  webistes: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_WEBSITE:
      return {
        ...state,
        message: action.payload,
      };
    case GET_FEATURES:
      return {
        ...state,
        webistes: action.payload,
      };
    default:
      return state;
  }
}
