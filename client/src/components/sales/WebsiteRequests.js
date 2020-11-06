import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { GetAllWebRequests } from "../../actions/SiteActions";
import { withRouter } from "react-router-dom";
import IsEmpty from "../../validation/is-Empty";
import { Link } from "react-router-dom";

class WebsiteRequests extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) this.props.history.push("/login");

    if (this.props.auth.user.type !== 1) this.props.history.push("/login");

    this.props.GetAllWebRequests();
  }

  componentWillReceiveProps(nextprops) {
    if (!nextprops.auth.isAuthenticated) this.props.history.push("/login");

    if (nextprops.auth.user.type !== 1) this.props.history.push("/login");

    const data = nextprops.data;

    this.setState({ data: data });
  }

  render() {
    var itr = 0;

    /*     for (var i = this.props.displayStart; i < this.props.displayEnd; ) {
      var record = this.props.records[i];
      arr.push(
        <tr
          className={i % 2 === 0 ? "w2ui-even" : "w2ui-odd"}
          style={{ height: this.props.recordHeight }}
        >
          <td className="w2ui-grid-data" col="0">
            <div title={i + 1}>{i + 1}</div>
          </td>
          <td className="w2ui-grid-data" col="1">
            <div title={record.fname}>{record.fname}</div>
          </td>
          <td className="w2ui-grid-data" col="2">
            <div title={record.lname}>{record.lname}</div>
          </td>
          <td className="w2ui-grid-data" col="3">
            <div title={record.email}>{record.email}</div>
          </td>
          <td className="w2ui-grid-data-last"></td>
        </tr>
      );
    } */

    return (
      <div className="AllSites">
        <h1 className="display-6 text-center">
          Update Client Website Requests
        </h1>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Site Requested</th>
              <th scope="col">Organization name</th>
              <th scope="col">Mobile No.</th>
              <th scope="col">Date</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((dr, idx) => (
              <tr key={idx}>
                <td>{++itr}</td>
                <td>{dr.clientname}</td>
                <td>{dr.siterequested}</td>
                <td>{dr.organizationname}</td>
                <td>{dr.mobile}</td>
                <td>{dr.date}</td>
                <td>
                  <Link
                    to={`/adminUpdate/${dr._id}`} // in mongo auto generated column is _id
                    className="btn btn-info mr-1"
                  >
                    Action
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.RequestSiteMessage,
  auth: state.auth,
});

export default connect(mapStateToProps, { GetAllWebRequests })(WebsiteRequests);
