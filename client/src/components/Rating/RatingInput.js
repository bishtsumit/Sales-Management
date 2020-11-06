import React, { Component } from "react";
import classnames from "classnames";
import IsEmpty from "../../validation/is-Empty";
import StarRatings from "react-star-ratings";
import { connect } from "react-redux";
import GetCurrentDate from "../../common/commonfunction";

class RatingInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: this.props.rate,
      text: this.props.text,
      auth: {},
    };

    this.changeRating = this.changeRating.bind(this);
    this.submitDetails = this.submitDetails.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    console.log("Rating Input getDerivedStateFromProps Called");
    if (IsEmpty(state.auth)) {
      console.log(props.auth);

      return {
        auth: props.auth,
      };
    } else {
      return null;
    }
  }

  changeRating(newRating, name) {
    this.setState({ rating: newRating });
  }
  onChange(e) {
    this.setState({ text: e.target.value });
  }

  submitDetails(e) {
    e.preventDefault();

    if (this.state.rating > 0) {
      let data = this.state;
      data["email"] = this.state.auth.email;
      data["name"] = this.state.auth.name;

      this.props.saveRating(data);
    } else {
      alert("please select Rating");
    }
  }

  render() {
    const { text, rating, auth } = this.state;
    var ratinghtml = "";

    console.log(auth);

    let curDate = GetCurrentDate();

    if (auth.user.type != 1) {
      ratinghtml = (
        <div className="row mt-2 mb-4">
          <div className="col-lg-2">
            <img
              src="https://www.seekpng.com/png/detail/202-2024994_profile-icon-profile-logo-no-background.png"
              style={{
                width: "inherit",
                height: "auto",
                borderRadius: "50%",
                marginLeft: "39%",
                width: "100px",
              }}
            />
          </div>
          <div className="col-lg-10">
            <div className="row">
              <div
                className="col-lg-2 text-secondary"
                style={{ fontSize: "14px", marginTop: "14px" }}
              >
                {curDate}
              </div>
              <div className="col-lg-1"></div>
              <div className="col-lg-9">
                <StarRatings
                  rating={rating}
                  starRatedColor="rgb(255, 169, 27)"
                  changeRating={this.changeRating}
                  numberOfStars={5}
                  name="rating"
                  starHoverColor="rgb(255, 169, 27)"
                  starDimension="30px"
                  starSpacing="4px"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-2" style={{ fontSize: "25px" }}>
                {this.state.auth.user.name}
              </div>
              <div className="col-lg-1"></div>
              <div className="col-lg-7">
                <input
                  type="text"
                  className={classnames("form-control form-control-lg")}
                  placeholder="Enter Your Review"
                  name="ReviewText"
                  value={text}
                  onChange={this.onChange}
                />
              </div>
              <div className="col-lg-2">
                <input
                  type="button"
                  className="btn btn-info btn-block"
                  value="Submit"
                  onClick={this.submitDetails}
                />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      ratinghtml = "";
    }

    return <div className="RatingInput"> {ratinghtml} </div>;
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(RatingInput);
