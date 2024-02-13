const { deleteItems } = require("../../g-drive/default/delete");
const { sendSuccessResponse } = require("../../responses/success");
const { authenticate } = require("../../g-drive/default/authenticate");
const { sendNotModifiedResponse } = require("../../responses/no-changes");
const { checkJwtToken } = require("../../authentication/middleware");

const deleteFileEndpoint = async (req, res) => {
  const fileId = req.params.id;
  const ids = req.body.ids;

  try {
    const auth = await authenticate();

    /*
     * in case of ID coming from endpoint param
     */
    if (fileId) {
      await deleteItems({ auth, ids: fileId });
    }

    /*
     * in case of ID or multiple IDs coming from body request
     */
    if (ids) {
      await deleteItems({ auth, ids });
    }

    sendSuccessResponse(res, "File/s deleted successfully");
  } catch (error) {
    console.log(error);
    sendNotModifiedResponse(res, `Could not find the file ${fileId}`);
  }
};

module.exports = {
  deleteFileEndpoint_authenticated: async (req, res) => {
    await checkJwtToken(req, res, deleteFileEndpoint);
  },
};
