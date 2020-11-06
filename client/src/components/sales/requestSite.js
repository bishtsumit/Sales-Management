import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { RequestSiteAction } from "../../actions/SiteActions";
import { withRouter } from "react-router-dom";
import IsEmpty from "../../validation/is-Empty";

class requestSite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientname: "",
      siterequested: "",
      subscriptiontype: "",
      organizationname: "",
      address: "",
      mobile: "",
      customization: "",
      errors: {},
      RequestSiteMessage: "",
      sites: [],
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) this.props.history.push("/login");

    console.log("request Site component mounted");

    console.log(this.props);

    const { errors, RequestSiteMessage, sites } = this.props;

    console.log(sites);

    if (sites.length > 0) {
      // that means props have been recieved
      this.setState({
        errors: errors,
        RequestSiteMessage: RequestSiteMessage,
        clientname: IsEmpty(errors) ? "" : this.state.clientname,
        siterequested: IsEmpty(errors) ? "" : this.state.siterequested,
        subscriptiontype: IsEmpty(errors) ? "" : this.state.subscriptiontype,
        organizationname: IsEmpty(errors) ? "" : this.state.organizationname,
        address: IsEmpty(errors) ? "" : this.state.address,
        mobile: IsEmpty(errors) ? "" : this.state.mobile,
        customization: IsEmpty(errors) ? "" : this.state.customization,
        sites: sites,
      });
    }
  }

  componentWillReceiveProps(nextprops) {
    if (!nextprops.auth.isAuthenticated) this.props.history.push("/login");

    console.log("props recieved");

    const { errors, RequestSiteMessage, sites } = nextprops;

    console.log(sites);

    this.setState({
      errors: errors,
      RequestSiteMessage: RequestSiteMessage,
      clientname: IsEmpty(errors) ? "" : this.state.clientname,
      siterequested: IsEmpty(errors) ? "" : this.state.siterequested,
      subscriptiontype: IsEmpty(errors) ? "" : this.state.subscriptiontype,
      organizationname: IsEmpty(errors) ? "" : this.state.organizationname,
      address: IsEmpty(errors) ? "" : this.state.address,
      mobile: IsEmpty(errors) ? "" : this.state.mobile,
      customization: IsEmpty(errors) ? "" : this.state.customization,
      sites: sites,
    });

    setTimeout(() => {
      this.setState({ RequestSiteMessage: "" });

      console.log(this.state);
      // to remove success message after some time
    }, 2000);
  }

  /* static getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps called");
  } */

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const siteDetails = {
      clientname: this.state.clientname,
      siterequested: this.state.siterequested,
      subscriptiontype: this.state.subscriptiontype,
      organizationname: this.state.organizationname,
      address: this.state.address,
      mobile: this.state.mobile,
      customization: this.state.customization,
    };

    this.props.RequestSiteAction(siteDetails);
  }

  render() {
    const { errors, RequestSiteMessage, sites } = this.state;

    //console.log(sites);
    const msg = (
      <div className="alert alert-success w-50 text-center mt-5" role="alert">
        Website Request Sent Succesfully !!
      </div>
    );

    return (
      <div className="BuySite">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Buy Site</h1>
              <p className="lead text-center">
                Fill all inputs to request for a website
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.clientname,
                    })}
                    placeholder="Name"
                    name="clientname"
                    value={this.state.clientname}
                    onChange={this.onChange}
                  />
                  {errors.clientname && (
                    <div className="invalid-feedback">{errors.clientname}</div>
                  )}
                </div>
                <div className="form-group">
                  <select
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.siterequested,
                    })}
                    name="siterequested"
                    onChange={this.onChange}
                    value={this.state.siterequested}
                  >
                    <option value=""> Select Website </option>
                    {sites.map((dr, idx) => (
                      <option key={idx} value={dr.sitename}>
                        {dr.sitename}
                      </option>
                    ))}

                    {/* <option value="Student Man.">Student Man.</option>
                    <option value="Office Man.">Office Man.</option>
                    <option value="Hospital Man.">Hospital Man.</option> */}
                  </select>
                  {errors.siterequested && (
                    <div className="invalid-feedback">
                      {errors.siterequested}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <select
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.subscriptiontype,
                    })}
                    name="subscriptiontype"
                    onChange={this.onChange}
                    value={this.state.subscriptiontype}
                  >
                    <option value=""> Select Subscription Type </option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>

                  {errors.subscriptiontype && (
                    <div className="invalid-feedback">
                      {errors.subscriptiontype}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.organizationname,
                    })}
                    placeholder="Organization Name"
                    name="organizationname"
                    value={this.state.organizationname}
                    onChange={this.onChange}
                  />
                  {errors.organizationname && (
                    <div className="invalid-feedback">
                      {" "}
                      {errors.organizationname}{" "}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.address,
                    })}
                    placeholder="Address"
                    name="address"
                    value={this.state.address}
                    onChange={this.onChange}
                  />
                  {errors.address && (
                    <div className="invalid-feedback"> {errors.address} </div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.mobile,
                    })}
                    placeholder="Phone Number"
                    name="mobile"
                    value={this.state.mobile}
                    onChange={this.onChange}
                  />
                  {errors.mobile && (
                    <div className="invalid-feedback"> {errors.mobile} </div>
                  )}
                </div>
                <div className="form-group">
                  <textarea
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.customization,
                    })}
                    placeholder="List extra Customization You Need ( Amount Can increase )"
                    name="customization"
                    value={this.state.customization}
                    onChange={this.onChange}
                  ></textarea>
                  {errors.customization && (
                    <div className="invalid-feedback">
                      {" "}
                      {errors.customization}{" "}
                    </div>
                  )}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
                {RequestSiteMessage == "success" ? msg : ""}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// if u want to get the auth reducer state into the component.
// and then auth will be the property within your component.
const mapStateToProps = (state) => ({
  auth: state.auth,
  RequestSiteMessage: state.RequestSiteMessage,
  errors: state.errors,
  sites: state.sites,
});

// to call the component through action we need to set this syntax
// withRouter is added because register component will route to another component through the action which is registerUser
export default connect(mapStateToProps, { RequestSiteAction })(
  withRouter(requestSite)
);
