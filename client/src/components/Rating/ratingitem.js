import React, { Component } from "react";
import classnames from "classnames";
import IsEmpty from "../../validation/is-Empty";
import StarRatings from "react-star-ratings";

class RatingItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props);

    return (
      <div className="row mt-2">
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
              {this.props.date}
            </div>
            <div className="col-lg-1"></div>
            <div className="col-lg-9">
              <StarRatings
                rating={this.props.rating}
                starRatedColor="rgb(255, 169, 27)"
                changeRating={this.changeRating}
                numberOfStars={5}
                name="rating"
                starHoverColor="rgb(255, 169, 27)"
                isSelectable={false}
                starDimension="30px"
                starSpacing="4px"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2" style={{ fontSize: "25px" }}>
              {this.props.name}
            </div>
            <div className="col-lg-1"></div>
            <div className="col-lg-9">{this.props.text}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default RatingItem;
