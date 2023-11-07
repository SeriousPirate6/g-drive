const {
  sendBadRequest,
  sendInternalServerError,
} = require("../responses/errors");
const { uploadFile } = require("../g-drive/default/upload");
const { authenticate } = require("../g-drive/default/authenticate");
const { sendSuccessResponse } = require("../responses/success");
const {
  updateCredentialsAvailableSpace,
} = require("../g-drive/update-credentials-available-space");

module.exports = {
  uploadFileEndpoint: async (req, res) => {
    const file = req.body.file;

    if (file) {
      /* fetching parameters from body file object */
      const { path, description, properties, parent } = file;

      if (path) {
        try {
          /* performing authentication */
          const auth = await authenticate();

          /* uploading file */
          const fileId = await uploadFile({
            auth,
            path,
            description,
            properties,
            parent,
          });

          /* updating the available space for the current set of credentials */
          await updateCredentialsAvailableSpace({ auth });

          /* sending successful response */
          sendSuccessResponse(res, `File uploaded successfully`, { fileId });
        } catch (error) {
          console.log(error);
          sendInternalServerError(res);
        }
      } else {
        sendBadRequest(res, "The param 'path' is required");
      }
    } else {
      sendBadRequest(res, "The param 'file' is required");
    }
  },
};
