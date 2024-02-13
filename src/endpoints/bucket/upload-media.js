const fs = require("fs");
const path = require("path");
const { DEFAULT_MEDIA_NAME } = require("../../constants/properties");
const { checkJwtToken } = require("../../authentication/middleware");

uploadMediaEndpoint = async (req, res) => {
  const mediaName = req.query.media ? req.query.media : DEFAULT_MEDIA_NAME;

  let data = Buffer.from([]);

  req.on("data", (chunk) => {
    data = Buffer.concat([data, chunk]);
  });

  req.on("end", () => {
    fs.writeFile(path.join(__dirname, mediaName), data, (err) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      } else {
        res.statusCode = 200;
        res.end("Media uploaded successfully");
      }
    });
  });
};

module.exports = {
  uploadMediaEndpoint_authenticated: async (req, res) => {
    await checkJwtToken(req, res, uploadMediaEndpoint);
  },
};
