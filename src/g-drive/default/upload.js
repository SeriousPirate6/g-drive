const { google } = require("googleapis");
const { createReadStream } = require("../../utils/read-stream");
const { getMimeType, getBasicProps } = require("../../utils/files");

module.exports = {
  uploadFile: async ({
    auth,
    filePath,
    description,
    file_props,
    parentFolder = null,
  }) => {
    const driveService = google.drive({ version: "v3", auth });

    const { fileName, fileExtension } = getBasicProps(filePath);

    const fileMetaData = {
      name: `${fileName}.${fileExtension}`,
      parents: [
        parentFolder ? parentFolder : process.env.DRIVE_AI_IMAGES_FOLDER,
      ],
      description,
      properties: file_props,
    };

    try {
      const body = await createReadStream(filePath);

      const media = {
        mimeType: getMimeType(filePath),
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
