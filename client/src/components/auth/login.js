import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { LoginUser } from "../../actions/authActions";
import { withRouter } from "react-router-dom";

import GetCurrentDate from "../../utils/commonfunction";

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // checking if user is authenticated or not
    if (this.props.auth.isAuthenticated) {
      //  1 means user is admin
      if (this.props.auth.user.type === 1)
        this.props.history.push("/Dashboard");
      else this.props.history.push("/websiteList");
    }
  }

  componentWillReceiveProps(nextprops) {
    console.log("login props recieved");

    if (nextprops.auth.isAuthenticated) {
      if (nextprops.auth.user.type === 1) nextprops.history.push("/Dashboard");
      else nextprops.history.push("/requestSite");
    }

    if (nextprops.errors) this.setState({ errors: nextprops.errors });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    var width = screen.width;
    const agent = window.navigator.userAgent;
    var device = "";

    var date = GetCurrentDate();

    if (agent.indexOf("Android") > -1 || agent.indexOf("iPhone") > -1) {
      if (width > 700) device = "Tablet";
      else device = "Mobile";
    } else if (agent.indexOf("Windows") > -1) device = "Web";
    else device = "Misc";

    const login = {
      email: this.state.email,
      password: this.state.password,
      device: device,
      date: date,
    };

    console.log(login);

    this.props.LoginUser(login);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your BuySite account
              </p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.email,
                    })}
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.password,
                    })}
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// converting the values which will be returning as state to props from corresponding actions and will recieve these
// values in componentWillrecieveProps
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { LoginUser })(login);
