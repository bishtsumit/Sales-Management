import React, { Component } from "react";
import classnames from "classnames";
import IsEmpty from "../../validation/is-Empty";
import RatingItem from "./ratingitem";
import StarRatings from "react-star-ratings";
import { GetAllsites } from "../../actions/authActions";
import { connect } from "react-redux";
import RatingInput from "./RatingInput";
import axios from "axios";
import { parse } from "date-and-time";

class Rating extends Component {
  constructor() {
    super();
    this.state = {
      ratings: [],
      text: "",
      rating: 0,
    };

    this.HorizontalBarChart = this.HorizontalBarChart.bind(this);
    this.RenderHorizontalChartAndStars = this.RenderHorizontalChartAndStars.bind(
      this
    );
    this.saveRating = this.saveRating.bind(this);
  }

  componentWillReceiveProps(nextprops) {
    console.log(this.state.auth);
  }

  HorizontalBarChart(data, container, MaxValue) {
    let margin = { top: 0, right: 40, bottom: 0, left: 0 },
      width = $("#" + container).width(),
      height = $("#" + container).height(),
      y = d3.scaleBand(),
      x = d3.scaleLinear(),
      xAxisCall = d3.axisBottom(),
      yAxisCall = d3.axisLeft(),
      svg,
      variable = "value",
      category = "name";
    if (data.length > 0) {
      (width = width - margin.left - margin.right),
        (height = height - margin.top - margin.bottom);

      let containerSvg = container + "svg";

      d3.select("#" + containerSvg).remove();

      svg = d3
        .select("#" + container)
        .append("svg")
        .attr("id", containerSvg);
      svg = svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      let maxDomain = d3.max(data, function (d) {
        return parseInt(d[variable]) + 10;
      });

      let step = 12,
        min = 0,
        max = maxDomain,
        stepValue = (max - min) / (step - 1),
        tickValues = d3.range(min, max + stepValue, stepValue);

      // Scale the range of the data in the domains
      x.range([0, width]).domain([0, maxDomain]);
      y.range([0, height])
        .padding(0.3)
        .domain(
          data.map(function (d) {
            return d[category];
          })
        );

      //xAxisCall.scale(x).ticks(5).tickValues([0, Math.floor(maxDomain / 3), Math.floor(maxDomain / 1.5), maxDomain]);
      xAxisCall.scale(x).tickValues(tickValues).tickSize(-height);
      yAxisCall.scale(y).tickSize(0);

      // add the x Axis
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x" + variable)
        .call(xAxisCall);

      // add the y Axis
      svg
        .append("g")
        .attr("class", "y" + variable)
        .call(yAxisCall);

      let Barheight;
      Barheight = y.bandwidth();

      // append the rectangles for the bar chart

      svg
        .selectAll(".barTotal")
        .data(data, function (d) {
          return d[variable];
        })
        .enter()
        .append("rect")
        .attr("class", "barTotal")
        .attr("width", function (d) {
          return x(MaxValue);
        })
        .attr("y", function (d) {
          return y(d[category]);
        })
        .attr("rx", 14)
        .attr("height", Barheight) // static height in case there is only one vehicle
        .attr("fill", "#F5F5F5");

      svg
        .selectAll(".bar")
        .data(data, function (d) {
          return d[variable];
        })
        .enter()
        .append("rect")
        //.attr("d", function (d) {

        //	let xparam = 0;
        //	let yparam = y(d[category]);
        //	let wparam = x(d[variable]);
        //	let hparam = Barheight;
        //	let radius = 15;

        //	return rightRoundedRect(xparam, yparam, wparam, hparam, radius);
        //})
        .attr("class", "bar")
        .attr("width", function (d) {
          return x(d[variable]);
        })
        .attr("y", function (d) {
          return y(d[category]);
        })
        .attr("rx", 14)
        .attr("height", Barheight) // static height in case there is only one vehicle
        .attr("fill", "#317BBC");

      // for horizontal chart x will be 0 and for vetical y will be 0
      function rightRoundedRect(x, y, width, height, radius) {
        return (
          "M" +
          x +
          "," +
          y +
          "h" +
          (width - radius) +
          "a" +
          radius +
          "," +
          radius +
          " 0 0 1 " +
          radius +
          "," +
          radius +
          "v" +
          (height - 2 * radius) +
          +"a" +
          radius +
          "," +
          radius +
          " 0 0 1 " +
          -radius +
          "," +
          radius +
          "h" +
          (radius - width) +
          "z"
        );
      }

      // removing axis and lines and numbers
      svg.select(".y" + variable + " .domain").remove();
      svg.selectAll(".y" + variable + " .tick text").remove();
      svg.select(".x" + variable + " .domain").remove();
      svg.selectAll("." + variable).remove();
      svg.selectAll(".domain").remove();
      svg.selectAll(".x" + variable + " line").remove();
      svg.selectAll(".x" + variable + " text").remove();
    }
  }

  saveRating(data) {
    data["siteId"] = this.props.siteId;
    data["email"] = this.props.email;
    data["name"] = this.props.name;

    axios
      .post("api/user/updateClientRating", data)
      .then((res) => {
        console.log(res);

        alert("Details saved successfully !!");

        this.props.GetAllsites();
      })
      .catch((err) => {
        console.log(err);
        alert("Error in saving details");
      });
  }

  RenderHorizontalChartAndStars() {
    let Rates = this.props.sites.filter((item) => {
      return item._id == this.props.siteId;
    });

    Rates = Rates[0].ratings;

    // in percentage
    var mapRates = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    var total = Rates.length;

    for (var key in Rates) {
      let rate = Rates[key].rate;
      mapRates[rate] = mapRates[rate] + 1;
    }

    mapRates[5] = Rates.length > 0 ? parseInt((mapRates[5] / total) * 100) : 0;
    mapRates[4] = Rates.length > 0 ? parseInt((mapRates[4] / total) * 100) : 0;
    mapRates[3] = Rates.length > 0 ? parseInt((mapRates[3] / total) * 100) : 0;
    mapRates[2] = Rates.length > 0 ? parseInt((mapRates[2] / total) * 100) : 0;
    mapRates[1] = Rates.length > 0 ? parseInt((mapRates[1] / total) * 100) : 0;

    var data = [
      { name: "5star", value: mapRates[5] },
      { name: "4star", value: mapRates[4] },
      { name: "3star", value: mapRates[3] },
      { name: "2star", value: mapRates[2] },
      { name: "1star", value: mapRates[1] },
    ];

    document.getElementById("Percent5Star").innerHTML = mapRates[5] + "%";
    document.getElementById("Percent4Star").innerHTML = mapRates[4] + "%";
    document.getElementById("Percent3Star").innerHTML = mapRates[3] + "%";
    document.getElementById("Percent2Star").innerHTML = mapRates[2] + "%";
    document.getElementById("Percent1Star").innerHTML = mapRates[1] + "%";

    let MaxValue = 100;

    this.HorizontalBarChart(data, "DivBarchart", MaxValue);
  }

  render() {
    let Rates = this.props.sites.filter((item) => {
      return item._id == this.props.siteId;
    });

    console.log(this.props.sites);

    console.log(this.props.siteId);

    Rates = Rates[0].ratings;

    let email = this.props.email;

    console.log("email : " + this.props.email);

    let userReview = Rates.filter(function (item) {
      return item["email"] === email;
    });

    let rate, text;
    if (userReview.length > 0) {
      rate = userReview[0].rate;
      text = userReview[0].text;
    } else {
      rate = 0;
      text = "";
    }

    let average = 0;

    if (Rates.length > 0) {
      average =
        Rates.reduce(function (acc, obj) {
          return acc + obj.rate;
        }, 0) / Rates.length;
    }

    average = Math.round(average);

    return (
      <div style={{ width: "100%" }}>
        <div
          className="Row text-primary mt-3"
          style={{ fontSize: "35px", marginLeft: "6%" }}
        >
          Ratings
        </div>
        <div className="row mt-3" style={{ marginLeft: "6%" }}>
          <div className="col-lg-3">
            <div className="row">
              <label
                name="averageRating"
                style={{
                  fontSize: "50px",
                  textAlign: "center",
                  marginLeft: "15%",
                  marginBottom: "-8px",
                  fontWeight: "bold",
                  fontFamily: "system-ui",
                }}
              >
                {average} / 5
              </label>
            </div>
            <div className="row">
              <StarRatings
                rating={average}
                starRatedColor="rgb(255, 169, 27)"
                numberOfStars={5}
                name="rating"
                starHoverColor="rgb(255, 169, 27)"
                isSelectable={false}
                starDimension="30px"
                starSpacing="4px"
              />
            </div>
            <div className="row">
              <label style={{ marginLeft: "10%" }}> Average Rating </label>
            </div>
          </div>
          <div className="col-lg-1"></div>
          <div
            className="col-lg-5"
            id="DivBarchart"
            style={{ height: "188px" }}
          ></div>
          <div className="col-lg-3">
            <div className="row">
              <div className="col-lg-12" style={{ maxWidth: "78%" }}>
                <StarRatings
                  rating={5}
                  starRatedColor="rgb(255, 169, 27)"
                  numberOfStars={5}
                  name="rating"
                  starHoverColor="rgb(255, 169, 27)"
                  isSelectable={false}
                  starDimension="30px"
                  starSpacing="2px"
                />
                <div
                  style={{ float: "right", width: "10px", marginTop: "4px" }}
                  id="Percent5Star"
                >
                  80%
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12" style={{ maxWidth: "78%" }}>
                <StarRatings
                  rating={4}
                  starRatedColor="rgb(255, 169, 27)"
                  numberOfStars={5}
                  name="rating"
                  starHoverColor="rgb(255, 169, 27)"
                  isSelectable={false}
                  starDimension="30px"
                  starSpacing="2px"
                />
                <div
                  style={{ float: "right", width: "10px", marginTop: "4px" }}
                  id="Percent4Star"
                >
                  60%
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12" style={{ maxWidth: "78%" }}>
                <StarRatings
                  rating={3}
                  starRatedColor="rgb(255, 169, 27)"
                  numberOfStars={5}
                  name="rating"
                  starHoverColor="rgb(255, 169, 27)"
                  isSelectable={false}
                  starDimension="30px"
                  starSpacing="2px"
                />
                <div
                  style={{ float: "right", width: "10px", marginTop: "4px" }}
                  id="Percent3Star"
                >
                  80%
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12" style={{ maxWidth: "78%" }}>
                <StarRatings
                  rating={2}
                  starRatedColor="rgb(255, 169, 27)"
                  numberOfStars={5}
                  name="rating"
                  starHoverColor="rgb(255, 169, 27)"
                  isSelectable={false}
                  starDimension="30px"
                  starSpacing="2px"
                />
                <div
                  style={{ float: "right", width: "10px", marginTop: "4px" }}
                  id="Percent2Star"
                >
                  40%
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12" style={{ maxWidth: "78%" }}>
                <StarRatings
                  rating={1}
                  starRatedColor="rgb(255, 169, 27)"
                  numberOfStars={5}
                  name="rating"
                  starHoverColor="rgb(255, 169, 27)"
                  isSelectable={false}
                  starDimension="30px"
                  starSpacing="2px"
                />
                <div
                  style={{ float: "right", width: "10px", marginTop: "4px" }}
                  id="Percent1Star"
                >
                  20%
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="Row text-primary mt-3"
          style={{ fontSize: "35px", marginLeft: "6%" }}
        >
          Reviews
        </div>

        <RatingInput
          saveRating={this.saveRating}
          key={this.props.siteId}
          rate={rate}
          text={text}
        />

        {/* all The client Reviews Container */}
        {Rates.map((dr, idx) => {
          console.log(dr);

          if (email !== dr.email) {
            return (
              <RatingItem
                key={idx}
                text={dr.text}
                name={dr.name}
                rating={dr.rate}
                date={dr.date}
              />
            );
          }
        })}
      </div>
    );
  }

  componentDidMount() {
    this.RenderHorizontalChartAndStars();
  }

  componentDidUpdate() {
    console.log("Component Did Update Called");

    this.RenderHorizontalChartAndStars();
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  sites: state.sites,
});

/* export default Rating; */
export default connect(mapStateToProps, { GetAllsites })(Rating);
