const { authenticate } = require("../g-drive/default/authenticate");
const { QUERY_ONLY_FOLDERS } = require("../constants/filters");
const { sendSuccessResponse } = require("../responses/success");
const { sendInternalServerError } = require("../responses/errors");
const {
  getFilesInFoldersAndSubFolderRecursively,
} = require("../g-drive/get-files-recursively");

module.exports = {
  listAllFilesEndpoint: async ({ res }) => {
    try {
      const auth = await authenticate();

      const files = await getFilesInFoldersAndSubFolderRecursively({
        auth,
        noFolders: true,
      });

      sendSuccessResponse(res, files);
    } catch (error) {
      console.log(error);
      sendInternalServerError(res);
    }
  },

  listAllFoldersEndpoint: async ({ res }) => {
    try {
      const auth = await authenticate();

      const folders = await getFilesInFoldersAndSubFolderRecursively({
        auth,
        query: QUERY_ONLY_FOLDERS,
      });

      sendSuccessResponse(res, folders);
    } catch (error) {
      console.log(error);
      sendInternalServerError(res);
    }
  },
};
