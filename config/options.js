const _ = require("lodash");

const options = {
  appName: "sevima-hackaton-server",
  appVersion: "0.0.1",
  service: "running",
  mobileNumberLocale: "en-IN",
  minPasswordLength: 6,
  user: {
    status: {
      ACTIVE: "active",
      DISABLED: "disabled",
    },
  },
  generateOtp: () => {
    return Math.floor(1000 + Math.random() * 9000);
  },
  responseMessage: ({
    res,
    statusCode = 200,
    auth,
    message = "",
    data = {},
  }) => {
    res.status(statusCode);
    res.json({
      auth,
      statusCode,
      message,
      data,
    });

    res.end();
  },
};

module.exports = options;
