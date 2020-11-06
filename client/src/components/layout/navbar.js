import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser(this.props.history);
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const ClientLinks = (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/websiteList">
            {" "}
            Website List
          </Link>
        </li>
      </ul>
    );

    const AdminLinks = (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/WebsiteRequests">
            {" "}
            Webiste Requests
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/requestSite">
            {" "}
            Request Site
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/websiteList">
            {" "}
            Website List
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/addWebsite">
            {" "}
            Add New Website
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/followup">
            {" "}
            Users Followup
          </Link>
        </li>
      </ul>
    );

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a
            href=""
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
          >
            <img
              className="rounded-circle"
              alt={user.name}
              style={{ width: "25px", marginRight: "5px" }}
            />{" "}
            Logout
          </a>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Home
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            {user.type == 1 && isAuthenticated
              ? AdminLinks
              : user.type == 2 && isAuthenticated
              ? ClientLinks
              : ""}
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(navbar);
