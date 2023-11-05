const { FOLDER_MIME_TYPE } = require("./properties");

module.exports = {
  QUERY_ONLY_FOLDERS: `mimeType = '${FOLDER_MIME_TYPE}'`,
  QUERY_NON_FOLDERS: `not mimeType = '${FOLDER_MIME_TYPE}'`,
  QUERY_IN_PARENT: (folderId) => {
    return `'${folderId}' in parents`;
  },
  QUERY_NAME_EQUAL: (fileName) => {
    return `name = '${fileName}'`;
  },
  QUERY_NAME_CONTAINS: (fileName) => {
    return `name contains '${fileName}'`;
  },
};
