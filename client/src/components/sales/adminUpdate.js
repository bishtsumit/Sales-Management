import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { getDataById, UpdateClientRequest } from "../../actions/SiteActions";
import IsEmpty from "../../validation/is-Empty";

class adminUpdate extends Component {
  constructor() {
    super();

    this.state = {
      id: "",
      clientname: "",
      siterequested: "",
      subscriptiontype: "",
      organizationname: "",
      address: "",
      mobile: "",
      paymentmode: "",
      remarks: "",
      customization: "",
      errors: {},
      RequestSiteMessage: "",
      sites: [],
      contactperson: "",
    };

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) this.props.history.push("/login");

    if (this.props.auth.user.type !== 1) this.props.history.push("/login");

    this.props.getDataById(this.props.match.params._id);
  }

  componentWillReceiveProps(nextprops) {
    if (!nextprops.auth.isAuthenticated) this.props.history.push("/login");

    if (nextprops.auth.user.type !== 1) this.props.history.push("/login");

    const { errors, RequestSiteMessage, databyid, sites } = nextprops;

    console.log(databyid);

    this.setState({
      errors: errors,
      RequestSiteMessage: RequestSiteMessage,
      clientname: databyid.clientname,
      siterequested: databyid.siterequested,
      subscriptiontype: databyid.subscriptiontype,
      organizationname: databyid.organizationname,
      address: databyid.address,
      mobile: databyid.mobile,
      paymentmode: !IsEmpty(databyid.paymentmode) ? databyid.paymentmode : "",
      remarks: !IsEmpty(databyid.remarks) ? databyid.remarks : "",
      sites: sites,
      contactperson: nextprops.auth.user.email,
      customization: databyid.customization,
    });

    console.log(nextprops.auth.user.email);

    if (RequestSiteMessage === "success") {
      setTimeout(() => {
        this.setState({ RequestSiteMessage: "" });

        console.log(this.state);

        window.location.href = "/WebsiteRequests";
      }, 2000);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onClick(status) {
    console.log(status);

    const siteDetails = {
      _id: this.props.match.params._id,
      clientname: this.state.clientname,
      siterequested: this.state.siterequested,
      subscriptiontype: this.state.subscriptiontype,
      organizationname: this.state.organizationname,
      address: this.state.address,
      mobile: this.state.mobile,
      paymentmode: this.state.paymentmode,
      remarks: this.state.remarks,
      status: status,
      contactperson: this.state.contactperson,
      customization: this.state.customization,
    };

    this.props.UpdateClientRequest(siteDetails, this.props.match.params._id);
  }

  render() {
    const value = this.props.match.params._id;

    const { errors, RequestSiteMessage, sites } = this.state;

    const msg = (
      <div className="alert alert-success w-50 text-center mt-5" role="alert">
        Request Updated Successfully
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
              <form noValidate>
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
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.paymentmode,
                    })}
                    placeholder="Payment Mode"
                    name="paymentmode"
                    value={this.state.paymentmode}
                    onChange={this.onChange}
                  />
                  {errors.paymentmode && (
                    <div className="invalid-feedback">{errors.paymentmode}</div>
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
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.remarks,
                    })}
                    placeholder="Remarks"
                    name="remarks"
                    value={
                      IsEmpty(this.state.remarks) ? "" : this.state.remarks
                    }
                    onChange={this.onChange}
                  />
                  {errors.remarks && (
                    <div className="invalid-feedback"> {errors.remarks} </div>
                  )}
                </div>

                <input
                  type="button"
                  className="btn btn-success btn-block mt-4 wd-50"
                  value="Update Details"
                  onClick={() => this.onClick(1)}
                />
                <input
                  type="button"
                  className="btn btn-danger btn-block mt-4 wd-50"
                  value="Delete Details"
                  onClick={() => this.onClick(-1)}
                />
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
  databyid: state.databyid,
  sites: state.sites,
});

// to call the component through action we need to set this syntax
// withRouter is added because register component will route to another component through the action which is registerUser
export default connect(mapStateToProps, { getDataById, UpdateClientRequest })(
  adminUpdate
);
