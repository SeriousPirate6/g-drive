const fs = require("fs");
const path = require("path");
const { checkJwtToken } = require("../../authentication/middleware");

listMediaEndpoint = async (req, res) => {
  const files = fs.readdirSync(__dirname);

  /*
   * filtering the array to return only media files
   */
  const mediaFiles = files.filter((file) => {
    const extname = path.extname(file).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".mp4", ".avi", ".mkv"].includes(extname);
  });

  res.send({ mediaFiles });
};

module.exports = {
  listMediaEndpoint_authenticated: async (req, res) => {
    await checkJwtToken(req, res, listMediaEndpoint);
  },
};
