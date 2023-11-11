require("dotenv").config();
const { handlingRedirects } = require("../utils/handling-redirections");

module.exports = {
  constructDriveUrl: async ({ web_link, handle_redirects = false }) => {
    /*
     * extracting the sharable id
     */
    const direct_url = process.env.DRIVE_DOWNLOAD_URI + web_link.split("/")[5];

    return handle_redirects ? await handlingRedirects(direct_url) : direct_url;
  },
};
