module.exports = Object.freeze({
  /* default drive api version */
  DRIVE_API_VERSION: "v3",

  /* local folders */
  TEMP_FOLDER: "temp",

  /* mime types */
  FOLDER_MIME_TYPE: "application/vnd.google-apps.folder",

  /* share permissions type */
  GRANT: "grant",
  REVOKE: "revoke",

  /* query operators */
  operators: { greater: "$gt", lesser: "$lt", not_equal: "$ne" },
});
