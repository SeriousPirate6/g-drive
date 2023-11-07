const { google } = require("googleapis");
const { createReadStream } = require("../../utils/read-stream");
const { getMimeType, getBasicProps } = require("../../utils/files");
const { DRIVE_API_VERSION } = require("../../constants/properties");

module.exports = {
  uploadFile: async ({ auth, path, description, properties, parent }) => {
    const driveService = google.drive({ version: DRIVE_API_VERSION, auth });

    const { fileName, fileExtension } = getBasicProps(path);

    const fileMetaData = {
      name: `${fileName}.${fileExtension}`,
      parents: [parent ? parent : process.env.ROOT_FOLDER_ID],
      description,
      properties: properties,
    };

    try {
      const body = await createReadStream(path);

      const media = {
        mimeType: getMimeType(path),
        body,
      };

      const response = await driveService.files.create({
        resource: fileMetaData,
        media: media,
        fields: "id",
      });

      switch (response.status) {
        case 200:
          console.log("File created id: ", response.data.id);
          return response.data.id;
        default:
          console.log("Error creating file, " + response.errors);
          break;
      }
    } catch (err) {
      console.log(err);
    }
  },
};
