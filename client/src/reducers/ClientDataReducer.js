import { REQUEST_DATA_BY_ID } from "../actions/types";

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case REQUEST_DATA_BY_ID:
      return action.payload;
    default:
      return state;
  }
}
