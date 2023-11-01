module.exports = {
  QUERY_ONLY_FOLDERS: "mimeType = 'application/vnd.google-apps.folder'",
  QUERY_NON_FOLDERS: "not mimeType = 'application/vnd.google-apps.folder'",
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
