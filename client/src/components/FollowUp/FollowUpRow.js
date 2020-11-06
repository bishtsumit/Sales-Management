import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
/* import { GetAllFollowups } from "../../actions/SiteActions"; */
import { withRouter } from "react-router-dom";
import IsEmpty from "../../validation/is-Empty";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class FollowUpRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusArr: this.props.statusArr,
      previousfollowupDate: IsEmpty(this.props.obj.previousfollowupDate)
        ? ""
        : new Date(this.props.obj.previousfollowupDate),
      nextfollowupDate: IsEmpty(this.props.obj.nextfollowupDate)
        ? ""
        : new Date(this.props.obj.nextfollowupDate),
      remarks: this.props.obj.remarks,
      status: this.props.obj.followUpstatus,
      email: this.props.obj.email,
    };

    this.onChange = this.onChange.bind(this);
    this.onChangePreviousFollowUp = this.onChangePreviousFollowUp.bind(this);
    this.onChangeNextFollowUp = this.onChangeNextFollowUp.bind(this);
    this.updateDetails = this.updateDetails.bind(this);
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

  updateDetails() {
    if (
      this.state.previousfollowupDate.toString() ==
      this.state.nextfollowupDate.toString()
    ) {
      alert("Please select different followUp Dates");
    } else {
      var followupData = {
        previousfollowupDate: this.state.previousfollowupDate.toString(),
        nextfollowupDate: this.state.nextfollowupDate.toString(),
        followUpstatus: this.state.status,
        remarks: this.state.remarks,
        email: this.state.email,
      };

      this.props.UpdateClientFollup(followupData);
    }
  }

  render() {
    const daterange = new Date();

    return (
      <tr>
        <td>{this.props.id}</td>
        <td>{this.props.obj.name}</td>
        <td>{this.props.obj.email}</td>
        <td>{this.props.obj.phone}</td>
        <td>
          <DatePicker
            name="previousfollowupDate"
            selected={this.state.previousfollowupDate}
            onSelect={this.handleSelect} //when day is clicked
            onChange={(date) => this.onChangePreviousFollowUp(date)} //only when value has changed
            isClearable
            placeholderText="select Date"
            dateFormat="yyyy/MM/dd"
            maxDate={daterange}
          />
        </td>
        <td>
          <DatePicker
            name="nextfollowupDate"
            selected={this.state.nextfollowupDate}
            onSelect={this.handleSelect} //when day is clicked
            onChange={(date) => this.onChangeNextFollowUp(date)} //only when value has changed
            isClearable
            placeholderText="select Date"
            dateFormat="yyyy/MM/dd"
            minDate={daterange}
          />
        </td>
        <td>
          <select
            className={classnames("form-control form-control-lg")}
            name="status"
            onChange={this.onChange}
            value={this.state.status}
            style={{ height: "37px", fontSize: "14px" }}
          >
            {this.state.statusArr.map((dr, idx) => (
              <option key={idx} value={dr.value}>
                {dr.name}
              </option>
            ))}
          </select>
        </td>
        <td>
          <input
            type="text"
            className={classnames("form-control form-control-lg")}
            style={{ height: "37px" }}
            placeholder="Remarks"
            name="remarks"
            value={this.state.remarks}
            onChange={this.onChange}
          />
        </td>
        <td>
          <input
            type="button"
            className="btn btn-success btn-block wd-50"
            value="Update Details"
            onClick={() => this.updateDetails()}
          />
        </td>
      </tr>
    );
  }
}

/* const mapStateToProps = (state) => ({
  users: state.signUpFollowUp,
  auth: state.auth,
}); */

/* export default connect(mapStateToProps, { GetAllFollowups })(followUp); */

export default FollowUpRow;
