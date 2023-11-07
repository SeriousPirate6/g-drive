const { google } = require("googleapis");
const { nameToFolderId } = require("./properties");
const { DRIVE_API_VERSION } = require("../../constants/properties");

module.exports = {
  createFolder: async ({ auth, folderName, parentId = null }) => {
    const driveService = google.drive({ version: DRIVE_API_VERSION, auth });

    if (!folderName) {
      console.log(`Cannot create folder with null name.`);
      return;
    }

    const folderId = await nameToFolderId({ auth, folderName });
    if (folderId) {
      console.log(`The folder ${folderName} already exists.`);
      return folderId;
    }

    const folderMetaData = {
      name: folderName,
      parents: [parentId ? parentId : process.env.ROOT_FOLDER_ID],
      mimeType: "application/vnd.google-apps.folder",
    };

    const response = await driveService.files.create({
      resource: folderMetaData,
      fields: "id",
    });

    switch (response.status) {
      case 200:
        console.log("Folder created id: ", response.data.id);
        return response.data.id;
      default:
        console.log("Error creating folder, " + response.errors);
        break;
    }
  },
};
