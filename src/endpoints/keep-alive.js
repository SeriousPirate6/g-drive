const { sendSuccessResponse } = require("../responses/success");

module.exports = {
  keepAlive: async ({ res }) => {
    sendSuccessResponse(res, "Service running");
  },
};
