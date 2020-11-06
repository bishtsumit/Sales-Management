const mongoose = require("mongoose");
const schema = mongoose.Schema;

const requestScehma = new schema({
  clientname: {
    type: String,
    required: true,
  },
  siterequested: {
    type: String,
    required: true,
  },
  subscriptiontype: {
    type: String,
    required: true,
  },
  paymentmode: {
    type: String,
    required: false, // as when user request for website payment mode is not taken as admin will confirm the payment.
  },
  organizationname: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  epochtime: {
    type: Number,
    default: 0,
  },
  customization: {
    type: String,
    required: false,
  },
});

module.exports = clientrequest = mongoose.model(
  "clientrequests",
  requestScehma
);
