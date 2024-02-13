const fs = require("fs");
const path = require("path");
const { checkJwtToken } = require("../../authentication/middleware");
const { DEFAULT_MEDIA_NAME } = require("../../constants/properties");

getMediaEndpoint = async (req, res) => {
  const mediaName = req.query.media ? req.query.media : DEFAULT_MEDIA_NAME;

  const mediaPath = path.join(__dirname, mediaName);

  if (fs.existsSync(mediaPath)) {
    console.log("Media found and sent.");
    res.sendFile(mediaPath);
  } else {
    console.log("Media not found.");
    res.send({ status: 404, message: "Media not found." });
  }
};

module.exports = {
  getMediaEndpoint_authenticated: async (req, res) => {
    await checkJwtToken(req, res, getMediaEndpoint);
  },
};
