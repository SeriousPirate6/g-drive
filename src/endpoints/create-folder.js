const { authenticate } = require("../g-drive/default/authenticate");
const { createFolder } = require("../g-drive/default/create-folders");
const { sendSuccessResponse } = require("../responses/success");
const {
  sendInternalServerError,
  sendBadRequest,
} = require("../responses/errors");

module.exports = {
  createFolderEndpoint: async (req, res) => {
    const folder = req.body.folder;
    if (folder) {
      const folderName = folder.name;
      const parentId = folder.parentId;

      try {
        const auth = await authenticate();

        const folderId = await createFolder({ auth, folderName, parentId });

        sendSuccessResponse(res, folderId);
      } catch (error) {
        console.log(error);
        sendInternalServerError(res);
      }
    } else {
      sendBadRequest(
        res,
        "The param 'folder' must be provided in the body request"
      );
    }
  },
};
