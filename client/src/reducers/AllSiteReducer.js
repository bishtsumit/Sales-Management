import { ALL_SITES } from "../actions/types";

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case ALL_SITES:
      console.log(action.payload);

      return action.payload;
    default:
      return state;
  }
}
