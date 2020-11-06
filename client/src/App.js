import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import {
  setCurrentUser,
  logoutUser,
  GetAllsites,
  SetAllSites,
} from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";
import Landing from "./components/layout/landing";

import PrivateRoute from "./components/common/PrivateRoute";

import Login from "./components/auth/login";
import Register from "./components/auth/register";
import requestSite from "./components/sales/requestSite";
import WebsiteRequests from "./components/sales/WebsiteRequests";
import adminUpdate from "./components/sales/adminUpdate";
import addWebsite from "./components/websiteFeatures/addWebsite";
import AllWebsites from "./components/websiteFeatures/AllWebsites";
import updateWebsite from "./components/websiteFeatures/updateFeature";
import Dashboard from "./components/sales/Dashboard";
import Followup from "./components/FollowUp/followUp";
import "./App.css";

if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000;

  if (localStorage.sites) {
    const sites = JSON.parse(localStorage.sites);
    store.dispatch(SetAllSites(sites));
  }

  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // TODO: Clear current Profile

    // Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container-fluid">
              <Route
                exact
                path="/register"
                component={Register}
                key="register"
              />
              <Route exact path="/login" component={Login} key="login" />
              <Switch>
                <PrivateRoute
                  exact
                  path="/requestSite"
                  component={requestSite}
                  key="requestSite"
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/websiteRequests"
                  component={WebsiteRequests}
                  key="websiteRequests"
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/adminUpdate/:_id"
                  component={adminUpdate}
                  key="adminUpdate"
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/addWebsite"
                  component={addWebsite}
                  key="addWebsite"
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/websiteList"
                  component={AllWebsites}
                  key="websiteList"
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/UpdatesiteFeature/:_id"
                  component={updateWebsite}
                  key="UpdatesiteFeature"
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/Dashboard"
                  component={Dashboard}
                  key="Dashboard"
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/followup"
                  component={Followup}
                  key="followup"
                />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
