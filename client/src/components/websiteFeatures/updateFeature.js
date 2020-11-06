import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { CheckAndSaveWebsite } from "../../actions/WebsiteFeatureActions";
import IsEmpty from "../../validation/is-Empty";
class updateFeature extends Component {
  constructor() {
    super();
    this.state = {
      sitename: "",
      description: "",
      sites: [],
      files: [],
      errors: {},
      message: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.maxSelectFile = this.maxSelectFile.bind(this);
    this.checkMimeType = this.checkMimeType.bind(this);
    this.checkFileSize = this.checkFileSize.bind(this);
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) this.props.history.push("/login");

    if (this.props.auth.user.type !== 1) this.props.history.push("/login");

    const queryId = this.props.match.params._id;

    // check if user come through valid site name

    console.log(this.props.sites);

    var filteredArray = this.props.sites.filter(function (item) {
      return item._id == queryId;
    });

    if (filteredArray.length > 0) {
      this.setState({
        sites: this.props.sites,
        sitename: filteredArray[0].sitename,
        description: filteredArray[0].description,
        files: filteredArray[0].files,
      });
    } else {
      this.setState({
        sites: [],
        sitename: "",
        description: "",
        files: [],
        errors: { sitename: "Website not found !!" },
      });
    }
  }

  componentWillReceiveProps(nextprops) {
    if (!nextprops.auth.isAuthenticated) this.props.history.push("/login");

    if (nextprops.auth.user.type !== 1) this.props.history.push("/login");

    const { errors, websites } = nextprops;

    this.setState({
      errors: errors,
      message: websites.message,
      sitename: IsEmpty(errors.sitename) ? "" : this.state.sitename,
      description: IsEmpty(errors.description) ? "" : this.state.description,
    });

    setTimeout(() => {
      this.setState({ message: "" });
      // to remove success message after some time

      window.location.href = "/websiteList";
    }, 2000);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  maxSelectFile = (event) => {
    let files = event.target.files; // create file object
    if (files.length > 3) {
      const msg = "Only 3 images can be uploaded at a time";
      event.target.value = null; // discard selected file
      console.log(msg);
      return false;
    }
    return true;
  };

  checkMimeType = (event) => {
    //getting file object
    let files = event.target.files;
    //define message container
    let err = "";
    // list allow mime type
    const types = ["image/png", "image/jpeg", "image/gif"];
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every((type) => files[x].type !== type)) {
        // create error message and assign to container
        err += files[x].type + " is not a supported format\n";
      }
    }

    if (err !== "") {
      // if message not same old that mean has error
      event.target.value = null; // discard selected file
      console.log(err);
      return false;
    }
    return true;
  };

  checkFileSize = (event) => {
    let files = event.target.files;
    let size = 9500000;
    let err = "";
    for (var x = 0; x < files.length; x++) {
      console.log(files[x].size);
      if (files[x].size > size) {
        err += files[x].type + "is too large, please pick a smaller file\n";
      }
    }
    if (err !== "") {
      event.target.value = null;
      console.log(err);
      return false;
    }

    return true;
  };

  onFileChange(event) {
    if (
      this.maxSelectFile(event) &&
      this.checkMimeType(event) &&
      this.checkFileSize(event)
    ) {
      this.setState({ files: event.target.files });
      console.log(event.target.files);
    } else {
      this.setState({
        errors: { files: "Please upload files under restrictions" },
      });
    }
  }

  onClick(type) {
    this.setState({ message: "Please Wait" });
    var filecount = 0;

    const data = new FormData();

    for (var x = 0; x < this.state.files.length; x++) {
      data.append("file", this.state.files[x]);
      ++filecount;
    }

    data.append("sitename", this.state.sitename);
    data.append("description", this.state.description);

    // send one in case of insert and 2 in case of update.
    const siteDetail = {
      sitename: this.state.sitename,
      description: this.state.description,
      type: type,
      filecount: filecount,
    };

    console.log(type);

    setTimeout(() => {
      this.props.CheckAndSaveWebsite(data, siteDetail);
    }, 1000);
  }

  render() {
    const msg = (
      <div className="alert alert-success w-50 text-center mt-5" role="alert">
        Details updated Successfully
      </div>
    );

    const { errors, message } = this.state;

    return (
      <div className="BuySite">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Buy Site</h1>
              <p className="lead text-center">
                Add New Website and upload their Features
              </p>
              <form noValidate>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.sitename,
                    })}
                    placeholder="Enter Website Name"
                    name="sitename"
                    value={this.state.sitename}
                    onChange={this.onChange}
                    disabled
                  />

                  {errors.sitename && (
                    <div className="invalid-feedback">{errors.sitename}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.description,
                    })}
                    placeholder="Enter Description"
                    name="description"
                    value={this.state.description}
                    onChange={this.onChange}
                  />

                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>
                <div className="form-group">
                  <div className="custom-file">
                    <input
                      type="file"
                      className={classnames("custom-file-input", {
                        "is-invalid": errors.files,
                      })}
                      id="customFile"
                      accept="image/*"
                      multiple
                      onChange={this.onFileChange}
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      Choose file
                    </label>

                    {errors.files && (
                      <div className="invalid-feedback">{errors.files}</div>
                    )}
                  </div>
                </div>

                <input
                  type="button"
                  className="btn btn-success btn-block mt-4 wd-50"
                  value="Update Request"
                  onClick={() => this.onClick(2)}
                />
                <input
                  type="button"
                  className="btn btn-danger btn-block mt-4 wd-50"
                  value="Delete Request"
                  onClick={() => this.onClick(3)}
                />
                {message == "success" ? msg : ""}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  websites: state.websites,
  sites: state.sites,
});

export default connect(mapStateToProps, { CheckAndSaveWebsite })(updateFeature);
