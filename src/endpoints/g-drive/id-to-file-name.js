const { authenticate } = require("../../g-drive/default/authenticate");
const { idToName } = require("../../g-drive/default/properties");
const { sendBadRequest, sendNotFound } = require("../../responses/errors");
const { sendSuccessResponse } = require("../../responses/success");
const { checkJwtToken } = require("../../authentication/middleware");

const idToFileNameEndpoint = async (req, res) => {
  const { id: fileId } = req.params;

  if (fileId) {
    try {
      const auth = await authenticate();

      const name = await idToName({ auth, fileId });

      sendSuccessResponse(res, name);
    } catch (error) {
      console.log(error);
      sendNotFound(res);
    }
  } else {
    sendBadRequest(res, "The param 'fileId' is required");
  }
};

module.exports = {
  idToFileNameEndpoint_authenticated: async (req, res) => {
    await checkJwtToken(req, res, idToFileNameEndpoint);
  },
};
