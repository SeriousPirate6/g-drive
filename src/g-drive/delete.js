require("dotenv").config();
const { google } = require("googleapis");

delItem = async ({ auth, fileId }) => {
  const drive = google.drive({ version: "v3", auth });

  let response = await drive.files.delete({
    fileId,
  });
  switch (response.status) {
    case 200:
      console.log("Deleted file: ", response.data.files);
      break;
    default:
      console.log("Deleting file...", fileId);
      break;
  }
};

module.exports = {
  deleteItems: async ({ ids }) => {
    if (!Array.isArray(ids)) ids = [ids];

    for await (const fileId of ids) {
      await delItem({ fileId });
    }
  },
};
