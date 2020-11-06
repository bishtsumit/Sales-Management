import { ALL_FOLLOWUPS } from "../actions/types";

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case ALL_FOLLOWUPS:
      return action.payload;
    default:
      return state;
  }
}
