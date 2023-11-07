const { authenticate } = require("../g-drive/default/authenticate");
const { idToName } = require("../g-drive/default/properties");
const {
  sendBadRequest,
  sendInternalServerError,
} = require("../responses/errors");
const { sendSuccessResponse } = require("../responses/success");

module.exports = {
  idToFileNameEndpoint: async (req, res) => {
    const { id: fileId } = req.params;

    if (fileId) {
      try {
        const auth = await authenticate();

        const name = await idToName({ auth, fileId });

        sendSuccessResponse(res, name);
      } catch (error) {
        console.log(error);

        sendInternalServerError(res);
      }
    } else {
      sendBadRequest(res, "The param 'fileId' is required");
    }
  },
};
