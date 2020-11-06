const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateadminClientRequest(data) {
  let errors = {};

  if (data.status != -1) {
    data.clientname = !isEmpty(data.clientname) ? data.clientname : "";
    data.siterequested = !isEmpty(data.siterequested) ? data.siterequested : "";
    data.subscriptiontype = !isEmpty(data.subscriptiontype)
      ? data.subscriptiontype
      : "";
    data.organizationname = !isEmpty(data.organizationname)
      ? data.organizationname
      : "";
    data.address = !isEmpty(data.address) ? data.address : "";
    data.mobile = !isEmpty(data.mobile) ? data.mobile : "";
    data.paymentmode = !isEmpty(data.paymentmode) ? data.paymentmode : "";

    if (!Validator.isLength(data.clientname, { min: 2, max: 30 })) {
      errors.clientname = "Name must be between 2 and 30 characters";
    }

    if (Validator.isEmpty(data.clientname)) {
      errors.clientname = "Name field is required";
    }

    if (Validator.isEmpty(data.siterequested)) {
      errors.siterequested = "Please Select Website";
    }

    if (Validator.isEmpty(data.subscriptiontype)) {
      errors.subscriptiontype = "Please Select Subscription Type";
    }

    if (Validator.isEmpty(data.organizationname)) {
      errors.organizationname = "Organization name is required";
    }

    if (Validator.isEmpty(data.address)) {
      errors.address = "address is required";
    }

    if (Validator.isEmpty(data.mobile)) {
      errors.mobile = "Mobile No. is required";
    }

    if (Validator.isEmpty(data.paymentmode)) {
      errors.paymentmode = "Payment Mode is required";
    }

    if (!Validator.isNumeric(data.mobile)) {
      errors.mobile = "Phone Number is invalid";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
