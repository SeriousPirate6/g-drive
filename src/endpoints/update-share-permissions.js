const { authenticate } = require("../g-drive/default/authenticate");
const { sendSuccessResponse } = require("../responses/success");
const {
  sendInternalServerError,
  sendBadRequest,
} = require("../responses/errors");
const { GRANT, REVOKE } = require("../constants/properties");
const {
  shareFile,
  revokeSharePermission,
} = require("../g-drive/default/share-revoke-access");
const { getPropsFromFile } = require("../g-drive/default/properties");
const { constructDriveUrl } = require("../g-drive/construct-url");
const { checkJwtToken } = require("../authentication/middleware");

const updateSharePermissionsEndpoint = async (req, res) => {
  const fileId = req.params.id;
  const { permissionId, sharePermissionType } = req.body;

  if (fileId) {
    try {
      const auth = await authenticate();

      if (sharePermissionType.toLowerCase() === GRANT) {
        const permission_id = await shareFile({ auth, fileId });

        const fileProps = await getPropsFromFile({
          auth,
          fileId,
          fields: "webViewLink",
        });

        const url = await constructDriveUrl({
          web_link: fileProps.webViewLink,
        });

        sendSuccessResponse(res, `Shared file ${fileId}`, {
          permission_id,
          webViewLink: fileProps.webViewLink,
          url,
        });
      } else if (sharePermissionType.toLowerCase() === REVOKE) {
        await revokeSharePermission({
          auth,
          fileId,
          permissionId: permissionId ? permissionId : "anyoneWithLink",
        });

        sendSuccessResponse(res, `Revoked share permissions at file ${fileId}`);
      } else {
        sendBadRequest(res, "The params 'sharePermissionType' is required");
      }
    } catch (error) {
      console.log(error);
      sendInternalServerError(res);
    }
  }
};

module.exports = {
  updateSharePermissionsEndpoint_authenticated: async (req, res) => {
    await checkJwtToken(req, res, updateSharePermissionsEndpoint());
  },
};
