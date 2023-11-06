const { encryptAndInsertToken } = require("../database/tokens");
const {
  sendBadRequest,
  sendInternalServerError,
} = require("../responses/errors");
const { sendSuccessResponse } = require("../responses/success");

module.exports = {
  addNewCredentialsEndpoint: async (req, res) => {
    const { credentials } = req.body;

    if (credentials) {
      try {
        await encryptAndInsertToken({ credentials });

        sendSuccessResponse(res, "New credentials stored correctly");
      } catch (error) {
        console.log(error);

        sendInternalServerError(res);
      }
    } else {
      sendBadRequest(res, "The param 'credentials' is required");
    }
  },
};
