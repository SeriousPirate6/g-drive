const { google } = require("googleapis");
const { DRIVE_API_VERSION } = require("../../constants/properties");

module.exports = {
  getAllIdsWithToken: async ({
    auth,
    query,
    fields,
    orderBy,
    print = false,
  }) => {
    const drive = google.drive({ version: DRIVE_API_VERSION, auth });
    let foldersList = [];
    let pageToken = true;
    while (pageToken) {
      const res = await drive.files.list({
        q: query
          ? `${query}`
          : "not mimeType = 'application/vnd.google-apps.folder'",
        fields: fields
          ? `nextPageToken, ${fields}`
          : "nextPageToken, files(id, name)",
        orderBy: orderBy ? orderBy : "",
        pageToken: pageToken === true ? "" : pageToken,
        pageSize: 1000,
      });
      pageToken = res.data.nextPageToken;
      res.data.files.forEach((file) => {
        foldersList.push(file);
      });
    }
    if (print) console.log(foldersList);
    return foldersList;
  },

  getFileById: async ({ auth, fileId }) => {
    const drive = google.drive({ version: DRIVE_API_VERSION, auth });
    try {
      const file = await drive.files.get({
        fileId,
        alt: "media",
      });
      console.log(file.status);
      return file.data;
    } catch (error) {
      throw error;
    }
  },
};
