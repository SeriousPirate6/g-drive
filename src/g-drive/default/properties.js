const { google } = require("googleapis");
const { getAllIdsWithToken } = require("./list");

module.exports = {
  idToName: async ({ auth, fileId }) => {
    const drive = google.drive({ version: "v3", auth });
    const response = await drive.files.get({
      fileId,
    });
    return response.data;
  },

  nameToFileId: (nameToFileId = async ({
    auth,
    fileName,
    contains = false,
    folder = false,
  }) => {
    const searchMethod = contains ? "contains" : "=";
    const condition = folder ? "" : "not";

    const fileIds = await getAllIdsWithToken({
      auth,
      query: `name ${searchMethod} '${fileName}' and ${condition} mimeType = 'application/vnd.google-apps.folder'`,
      fields: "files(id, name, createdTime, webViewLink)",
      orderBy: "createdTime asc",
    });

    console.log(fileIds.length);

    if (contains) {
      return fileIds.length === 0 ? null : fileIds;
    }
    return fileIds.length === 0 ? null : fileIds[0].id;
  }),

  nameToFolderId: async ({ auth, folderName, contains = false }) => {
    return await nameToFileId({
      auth,
      fileName: folderName,
      contains,
      folder: true,
    });
  },

  getPropsFromFile: async ({ auth, fileId, fields }) => {
    const drive = google.drive({ version: "v3", auth });
    const file = await drive.files.get({
      fileId: fileId,
      fields: fields
        ? fields
        : "id, name, size, mimeType, parents, webViewLink, " +
          "properties(db_quote_id)," +
          "permissions(kind, id, emailAddress, role)",
    });
    console.log(file.data);
    return file.data ? file.data : null;
  },
};
