import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { GetAllFollowups } from "../../actions/SiteActions";
import { withRouter } from "react-router-dom";
import IsEmpty from "../../validation/is-Empty";
import FollowUpRow from "./FollowUpRow";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class followUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      error: {},
      statusArr: [
        { name: "Pending", value: "" },
        { name: "Active", value: "0" },
        { name: "Completed", value: "1" },
      ],
      followUpstatus: "",
      nextfollowupDate: "",
      email: "",
      name: "",
      previousfollowupDate: "",
    };

    this.UpdateClientFollup = this.UpdateClientFollup.bind(this);
    this.searchDetails = this.searchDetails.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangePreviousFollowUp = this.onChangePreviousFollowUp.bind(this);
    this.onChangeNextFollowUp = this.onChangeNextFollowUp.bind(this);
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) this.props.history.push("/login");

    if (this.props.auth.user.type !== 1) this.props.history.push("/login");

    this.props.GetAllFollowups({ followUpstatus: "" });
  }

  componentWillReceiveProps(nextprops) {
    if (!nextprops.auth.isAuthenticated) this.props.history.push("/login");

    if (nextprops.auth.user.type !== 1) this.props.history.push("/login");

    const users = nextprops.users;

    this.setState({ users: users });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onChangePreviousFollowUp(date) {
    console.log(date);

    this.setState({ previousfollowupDate: date });
  }

  onChangeNextFollowUp(date) {
    console.log(date);

    this.setState({ nextfollowupDate: date });
  }

  UpdateClientFollup(data) {
    axios
      .post("api/user/updateClientFollowup", data)
      .then((res) => {
        console.log(res);

        alert("Details saved successfully !!");

        this.props.GetAllFollowups({ followUpstatus: "" });
      })
      .catch((err) => {
        console.log(err);
        alert("Error in saving details");
      });
  }

  searchDetails() {
    console.log(this.state);
    console.log(IsEmpty(this.state.nextfollowupDate));

    var obj = {};
    if (this.state.name !== "") {
      obj["name"] = this.state.name;
    }

    if (this.state.email !== "") {
      obj["email"] = this.state.email;
    }

    if (
      this.state.previousfollowupDate !== "" &&
      this.state.previousfollowupDate !== null &&
      this.state.previousfollowupDate !== undefined
    ) {
      obj["previousfollowupDate"] = this.state.previousfollowupDate.toString();
    }

    if (
      this.state.nextfollowupDate !== "" &&
      this.state.nextfollowupDate !== null &&
      this.state.nextfollowupDate !== undefined
    ) {
      obj["nextfollowupDate"] = this.state.nextfollowupDate.toString();
    }

    obj["followUpstatus"] = this.state.followUpstatus;

    console.log(obj);

    this.props.GetAllFollowups(obj);
  }

  render() {
    var itr = 0;

    return (
      <div className="AllFollowUps">
        <h1 className="display-6 text-center">Client Follow Ups</h1>
        <div className="row">
          <div className="col-md-2 mt-1 adjust">
            <input
              type="text"
              className={classnames("form-control form-control-lg")}
              placeholder="Name"
              name="name"
              style={{ height: "33px", fontSize: "14px" }}
              value={this.state.name}
              onChange={this.onChange}
            />
          </div>
          <div className="col-md-2 mt-1 adjust">
            <input
              type="text"
              className={classnames("form-control form-control-lg")}
              placeholder="Email"
              name="email"
              style={{ height: "33px", fontSize: "14px" }}
              value={this.state.email}
              onChange={this.onChange}
            />
          </div>
          <div className="col-md-2 mt-1 adjust">
            <DatePicker
              name="previousfollowupDate"
              selected={this.state.previousfollowupDate}
              onChange={(date) => this.onChangePreviousFollowUp(date)} //only when value has changed
              isClearable
              placeholderText="Previous FollowUp Date"
              dateFormat="yyyy/MM/dd"
            />
          </div>
          <div className="col-md-2 mt-1 adjust">
            <DatePicker
              name="nextfollowupDate"
              selected={this.state.nextfollowupDate}
              onChange={(date) => this.onChangeNextFollowUp(date)} //only when value has changed
              isClearable
              placeholderText="Next FollowUp Date"
              dateFormat="yyyy/MM/dd"
            />
          </div>
          <div className="col-md-2 mt-1 adjust">
            <select
              className={classnames("form-control form-control-lg")}
              name="followUpstatus"
              onChange={this.onChange}
              value={this.state.followUpstatus}
              style={{ height: "33px", fontSize: "12px" }}
            >
              {this.state.statusArr.map((dr, idx) => (
                <option key={idx} value={dr.value}>
                  {dr.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 mt-1 adjust">
            <input
              type="button"
              className="btn btn-info btn-block"
              value="Search Details"
              onClick={() => this.searchDetails()}
            />
          </div>
        </div>

        <table className="table mt-2" id="tblFollowUp">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Mobile No.</th>
              <th scope="col">Previous FollowUp</th>
              <th scope="col">Next FollowUp</th>
              <th scope="col">FollowUp Status</th>
              <th scope="col">remarks</th>
              <th scope="col">action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map((dr, idx) => {
              console.log(dr);

              return (
                <FollowUpRow
                  obj={dr}
                  id={++itr}
                  key={dr.email}
                  statusArr={this.state.statusArr}
                  UpdateClientFollup={this.UpdateClientFollup}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  users: state.signUpFollowUp,
  auth: state.auth,
});

export default connect(mapStateToProps, { GetAllFollowups })(followUp);
