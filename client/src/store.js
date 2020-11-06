import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};
const middleware = [thunk];
const composevarDev = compose(
  applyMiddleware(...middleware),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const composevarProd = compose(applyMiddleware(...middleware));

const store = createStore(
  rootReducer,
  initialState,
  process.env.NODE_ENV === "production" ? composevarProd : composevarDev // redux extension tool is only for local not for production
);

export default store;
