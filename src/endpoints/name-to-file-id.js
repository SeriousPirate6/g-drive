const { nameToFileId } = require("../g-drive/properties");
const { authenticate } = require("../g-drive/authenticate");

module.exports = {
  nameToFileId: async (req, res) => {
    try {
      const fileName = req.query.fileId;
      const folder = req.query.isFolder;
      const contains = req.query.contains;

      if (fileName) {
        const auth = await authenticate();

        const name = nameToFileId({ auth, fileName, contains, folder });

        res.send({ status: "success", name });
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
  },
};
