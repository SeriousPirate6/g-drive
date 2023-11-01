const { authenticate } = require("../g-drive/default/authenticate");
const { getAllIdsWithToken } = require("../g-drive/default/list");
const { QUERY_ONLY_FOLDERS } = require("../constants/filters");
const { sendSuccessResponse } = require("../responses/success");
const { sendInternalServerError } = require("../responses/errors");

module.exports = {
  listAllFoldersEndpoints: async (res) => {
    try {
      const auth = await authenticate();
      const folders = await getAllIdsWithToken({
        auth,
        query: QUERY_ONLY_FOLDERS,
        fields: "files(id, name, parents)",
      });

      sendSuccessResponse(res, folders);
    } catch (error) {
      console.log(error);
      sendInternalServerError();
    }
  },
};
