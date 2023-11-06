const fs = require("fs");
const {
  sendBadRequest,
  sendInternalServerError,
} = require("../responses/errors");
const { uploadFile } = require("../g-drive/default/upload");
const { authenticate } = require("../g-drive/default/authenticate");
const { sendSuccessResponse } = require("../responses/success");
const { getTokenIdByHash } = require("../database/tokens");

module.exports = {
  uploadFileEndpoint: async (req, res) => {
    /* TODO update the remaining space after each successfully upload */
    const file = req.body.file;

    if (file) {
      const { path, description, properties, parent } = file;

      if (path) {
        try {
          const auth = await authenticate();

          /* TESTING PHASE */
          const fileId = null;
          // const fileId = await uploadFile({
          //   auth,
          //   path,
          //   description,
          //   properties,
          //   parent,
          // });

          const credentials = JSON.parse(
            fs.readFileSync(process.env.GDRIVE_KEY_FILE).toString()
          );
          const tokenId = await getTokenIdByHash({ credentials });

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
