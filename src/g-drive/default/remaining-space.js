const { google } = require("googleapis");
const { DRIVE_API_VERSION } = require("../../constants/properties");

module.exports = {
  remainingSpace: async ({ auth, print = false } = {}) => {
    const drive = google.drive({ version: DRIVE_API_VERSION, auth });
    const about = await drive.about.get({ fields: "storageQuota" });
    const total_space = about.data.storageQuota.limit;
    const used_space = about.data.storageQuota.usage;

    const remaining_space = Number(
      ((total_space - used_space) / 1024 / 1024 / 1024).toFixed(2)
    );
    if (print) console.log(`\nRemaining space: ${remaining_space} GB\n`);
    return remaining_space;
  },
};
