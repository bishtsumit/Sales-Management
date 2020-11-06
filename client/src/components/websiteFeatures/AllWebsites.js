import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import IsEmpty from "../../validation/is-Empty";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import Rating from "../Rating/Rating";

class AllWebsites extends Component {
  constructor() {
    super();
    this.state = {
      sites: [],
      selectedSite: {},
      auth: {},
    };

    this.onChange = this.onChange.bind(this);
    this.changeRating = this.changeRating.bind(this);
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) this.props.history.push("/login");

    console.log(this.props);

    const { sites, auth } = this.props;
    this.setState({ sites: sites, auth: auth });

    console.log(sites);
  }

  componentWillReceiveProps(nextprops) {
    console.log("next props called");

    if (!nextprops.auth.isAuthenticated) this.props.history.push("/login");
  }

  onChange(e) {
    console.log(e.target.value);

    var filteredArray = this.state.sites.filter(function (item) {
      return item.sitename == e.target.value;
    });

    this.setState({
      selectedSite: filteredArray[0],
    });
  }

  changeRating(newRating, name) {
    alert("You left a " + newRating + " star rating for " + name);
  }

  render() {
    const { sites, selectedSite, auth } = this.state;
    var content = "";

    if (!IsEmpty(selectedSite)) {
      var URL = IsEmpty(selectedSite.URL)
        ? "http://localhost:5000"
        : selectedSite.URL;
      var files = selectedSite.files;

      console.log(this.state.auth.user.email);

      content = (
        <div>
          <div className="row bg-info text-white p-4">
            <div className="col-sm-4 mt-5">
              <div className="row">
                <div className="col-sm-12">
                  <h1> {selectedSite.sitename} </h1>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">{selectedSite.description}</div>
              </div>
              <div className="row">
                {auth.user.type == 1 ? (
                  <div className="col-sm-12">
                    <Link
                      to={`/UpdatesiteFeature/${selectedSite._id}`}
                      className="btn btn-info mt-5 bg-dark ml-2"
                    >
                      Edit
                    </Link>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-sm-8">
              <div
                id="carouselExampleControls"
                className="carousel slide"
                data-ride="carousel"
              >
                <div className="carousel-inner">
                  {files.map((dr, idx) =>
                    idx === 0 ? (
                      <div key={idx} className="carousel-item active">
                        <img
                          src={URL + "/" + dr.filename}
                          className="d-block w-100"
                          alt="..."
                          height="400px"
                        />
                      </div>
                    ) : (
                      <div key={idx} className="carousel-item">
                        <img
                          src={URL + "/" + dr.filename}
                          className="d-block w-100"
                          alt="..."
                          height="400px"
                        />
                      </div>
                    )
                  )}
                </div>
                <a
                  className="carousel-control-prev"
                  href="#carouselExampleControls"
                  role="button"
                  data-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">Previous</span>
                </a>
                <a
                  className="carousel-control-next"
                  href="#carouselExampleControls"
                  role="button"
                  data-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">Next</span>
                </a>
              </div>
            </div>
          </div>
          <div className="row">
            <Rating
              siteId={this.state.selectedSite._id}
              email={this.state.auth.user.email}
              name={this.state.auth.user.name}
            />
          </div>
        </div>
      );
    } else {
      content = <div style={{ height: "480px" }}></div>;
    }

    return (
      <div className="AllWebsites">
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <select
                  className="form-control form-control-lg"
                  name="siterequested"
                  onChange={this.onChange}
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
              </div>
            </div>
            <div className="col-sm-6" style={{ marginTop: "10px" }}>
              {" "}
              Note : please Select Website to see its features{" "}
            </div>
          </div>
          <div className="row" style={{ marginTop: "20px" }}>
            <div className="col-sm-12">{content}</div>
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
  sites: state.sites,
});

// to call the component through action we need to set this syntax
// withRouter is added because register component will route to another component through the action which is registerUser
export default connect(mapStateToProps)(AllWebsites);
