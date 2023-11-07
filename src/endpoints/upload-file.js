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
const {
  downloadFromBinary,
  deleteFolderRecursively,
} = require("../utils/files");
const { TEMP_FOLDER } = require("../constants/properties");
const { isJSON } = require("../utils/json");

module.exports = {
  uploadFileEndpoint: async (req, res) => {
    /* using multer to handle form-data body request */
    const data = req.files[0];
    const metadata = req.body;

    if (data) {
      /* fetching parameters from body file object */
      const { description, parent, properties } = metadata;

      /* converting string properties to actual JSON object */
      const jsonProperties = isJSON(properties) ? JSON.parse(properties) : null;

      /*
       * if properties are defined and parsable to JSON, go on with the request
       * otherwise send bad request response
       */
      if (properties !== undefined && properties !== null) {
        /* downloading binary file */
        const path = await downloadFromBinary({
          name: data.originalname,
          mimeType: data.mimetype,
          buffer: data.buffer,
        });

        /* proceeding only if the file has been downloaded properly */
        if (path) {
          try {
            /* performing authentication */
            const auth = await authenticate();

            /* uploading file */
            const fileId = await uploadFile({
              auth,
              path,
              description,
              properties: jsonProperties,
              parent,
            });

            /* updating the available space for the current set of credentials */
            await updateCredentialsAvailableSpace({ auth });

            /* deleting the temp folder and its content after the upload */
            deleteFolderRecursively(TEMP_FOLDER);

            /* sending successful response */
            sendSuccessResponse(res, `File uploaded successfully`, { fileId });
          } catch (error) {
            console.log(error);

            /* deleting the temp folder and its content in case of failed upload */
            deleteFolderRecursively(TEMP_FOLDER);

            /* sending internal server error response */
            sendInternalServerError(res);
          }
        } else {
          /* bad request response in case of file not convertible from binary */
          sendBadRequest(res, "The file provided can't be read properly");
        }
      } else {
        /* bad request response in case of properties provided not in JSON format */
        sendBadRequest(res, "The param 'properties' must be in JSON format");
      }
    } else {
      /* bad request response in case of binary file not provided */
      sendBadRequest(res, "The binary data object is required for the upload");
    }
  },
};
