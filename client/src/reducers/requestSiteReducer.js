import { REQUEST_SITE, ALL_REQUESTS } from "../actions/types";

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case REQUEST_SITE:
      return action.payload;
    case ALL_REQUESTS:
      return action.payload;
    default:
      return state;
  }
}
