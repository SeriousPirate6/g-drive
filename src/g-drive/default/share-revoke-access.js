const { google } = require("googleapis");
const { DRIVE_API_VERSION } = require("../../constants/properties");

module.exports = {
  shareFile: async ({ auth, fileId }) => {
    const driveService = google.drive({ version: DRIVE_API_VERSION, auth });

    const permission = {
      type: "anyone",
      role: "reader",
    };

    try {
      const result = await driveService.permissions.create({
        resource: permission,
        fileId: fileId,
        fields: "id",
      });
      console.log(`Inserted permission for id: ${result.data.id}`);
      return result.data.id;
    } catch (err) {
      console.error(err);
      return err;
    }
  },

  revokeSharePermission: async ({ auth, fileId, permissionId }) => {
    const driveService = google.drive({ version: DRIVE_API_VERSION, auth });

    try {
      const result = await driveService.permissions.delete({
        fileId,
        permissionId,
        fields: "id",
      });
      console.log(`Revoked permission for id: ${fileId}`);
      return result.data.id;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
};
