const {
  sendBadRequest,
  sendInternalServerError,
} = require("../responses/errors");
const { uploadFile } = require("../g-drive/default/upload");
const { authenticate } = require("../g-drive/default/authenticate");
const { sendSuccessResponse } = require("../responses/success");

module.exports = {
  uploadFileEndpoint: async (req, res) => {
    const file = req.body.file;

    if (file) {
      const { path, description, properties, parent } = file;

      if (path) {
        try {
          const auth = await authenticate();

          const fileId = await uploadFile({
            auth,
            path,
            description,
            properties,
            parent,
          });

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
