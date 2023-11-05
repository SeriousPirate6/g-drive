require("dotenv").config();
const { handlingRedirects } = require("../utils/handling-redirections");

module.exports = {
  constructDriveUrl: async ({ web_link }) => {
    /*
     * extracting the sharable id
     */
    return await handlingRedirects(
      process.env.DRIVE_DOWNLOAD_URI + web_link.split("/")[5]
    );
  },
};
