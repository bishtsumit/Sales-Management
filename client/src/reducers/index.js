import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import RequestSiteMessage from "./requestSiteReducer";
import ClientDataReducer from "./ClientDataReducer";
import websites from "./WebFeatureReducer";
import Sites from "./AllSiteReducer";
import signUpFollowUp from "./SignupUserReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  RequestSiteMessage: RequestSiteMessage,
  databyid: ClientDataReducer,
  websites: websites,
  sites: Sites,
  signUpFollowUp: signUpFollowUp,
});
