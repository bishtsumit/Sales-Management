import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

// this is a component Named Private Route
// It is created to work as Route only
// but it will check first if the user is login or not
// it will be used whenever developer wants a component to be opened after checking authentication

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
