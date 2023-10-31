const { google } = require("googleapis");

module.exports = {
  authenticate: async () => {
    return new Promise((resolve) => {
      const SCOPES = [process.env.GDRIVE_API_URL];

      auth = new google.auth.GoogleAuth({
        keyFile: process.env.GDRIVE_KEY_FILE,
        scopes: SCOPES,
      });
      resolve(auth);
    });
  },
};
