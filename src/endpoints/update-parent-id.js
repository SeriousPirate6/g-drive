const { authenticate } = require("../g-drive/default/authenticate");
const { sendSuccessResponse } = require("../responses/success");
const {
  sendBadRequest,
  sendInternalServerError,
} = require("../responses/errors");
const { updateFileParent } = require("../g-drive/default/update-parent");

module.exports = {
  updateParentIdEndpoint: async (req, res) => {
    const { fileId, newParentId } = req.body;

    if (fileId && newParentId) {
      try {
        const auth = await authenticate();

        await updateFileParent({ auth, fileId, newParentId });

        sendSuccessResponse(res, `Parent ID of ${fileId} updated successfully`);
      } catch (error) {
        console.log(error);
        sendInternalServerError(res);
      }
    } else {
      sendBadRequest(res, "The params 'fileId' and 'newParentId' are required");
    }
  },
};
