const { google } = require("googleapis");
const { getPropsFromFile } = require("./properties");
const { DRIVE_API_VERSION } = require("../../constants/properties");

module.exports = {
  updateFileParent: async ({ auth, fileId, newParentId }) => {
    const driveService = google.drive({ version: DRIVE_API_VERSION, auth });

    if (!fileId) {
      console.log(`The file ${fileId} does not exist.`);
      return;
    }

    if (!newParentId) {
      console.log("The parent folder provided is non existing.");
      return;
    }

    console.log("file: " + fileId);
    console.log("folder: " + newParentId);

    const { parents } = await getPropsFromFile({ auth, fileId });

    let response = await driveService.files.update({
      fileId,
      uploadType: "media",
      addParents: [newParentId],
      removeParents: [parents],
    });

    switch (response.status) {
      case 200:
        console.log("Update completed: ", response.data);
        return;
      default:
        console.log("Error uploading file, " + response.errors);
        break;
    }
  },
};
