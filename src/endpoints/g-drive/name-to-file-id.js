const {
  nameToFileId,
  nameToFolderId,
} = require("../../g-drive/default/properties");
const { authenticate } = require("../../g-drive/default/authenticate");
const { checkJwtToken } = require("../../authentication/middleware");

const nameToFileIdEndpoint = async (req, res) => {
  try {
    const { fileName, contains } = req.query;

    if (fileName) {
      const auth = await authenticate();

      /*
       * checking if the url of the endpoint is from /files or /folders
       * then, calling the correct function accordingly
       */
      const fileId = !req.url.toLowerCase().includes("folder")
        ? await nameToFileId({ auth, fileName, contains })
        : await nameToFolderId({ auth, folderName: fileName, contains });

      res.send({ status: "success", name: fileId });
    } else {
      res.status(400).send({
        status: "failed",
        message: 'The param "fileName" is required',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Unable to execute the request, please retry later",
    });
  }
};

module.exports = {
  nameToFileIdEndpoint_authenticated: async (req, res) => {
    await checkJwtToken(req, res, nameToFileIdEndpoint);
  },
};
