const fs = require("fs");
const mime = require("mime");
const path = require("path");
const { TEMP_FOLDER } = require("../constants/properties");

getBasicProps = (filePath) => {
  /* Get the file name without extension */
  const fileName = path.basename(filePath, path.extname(filePath));

  /* Get the file extension */
  const fileExtension = path.extname(filePath).slice(1);

  /* Get the parent folder (if present) */
  const fileParent = path.dirname(filePath).split(path.sep).pop();

  /* returning all fetched properties as a JSON object */
  return { fileName, fileExtension, fileParent };
};

deleteFolderRecursively = (dir_output) => {
  /* checking if folder exists */
  if (fs.existsSync(dir_output)) {
    /* in affirmative case, deleting the folder and its whole content */
    console.log(`Deleting ${dir_output}...`);
    fs.rmSync(dir_output, { recursive: true });
  }
};

module.exports = {
  getBasicProps,
  deleteFolderRecursively,

  getMimeType: (filePath) => {
    /* fetching the mime type of file from its path */
    return mime.getType(filePath);
  },

  downloadFromBinary: async ({ name, buffer, mimeType }) => {
    /* saving binary data from buffer */
    const binaryData = Buffer.from(buffer, "binary");

    /* sanitize the file name, removing eventual folders or extensions */
    const sanitizedName = getBasicProps(name).fileName;

    /* creating the temp folder if non-existent */
    if (!fs.existsSync(TEMP_FOLDER)) fs.mkdirSync(TEMP_FOLDER);

    /* constructing the output path */
    const filePath = `${TEMP_FOLDER}/${sanitizedName}.${mime.getExtension(
      mimeType
    )}`;

    return new Promise((resolve, reject) => {
      /* writing the file on disk */
      fs.writeFile(filePath, binaryData, "binary", (err) => {
        if (err) {
          /* rejecting the promise in case of error */
          console.error(err);
          reject();
        } else {
          /* resolving the promise with the file path in case of success */
          console.log(`File saved to ${filePath}`);
          resolve(filePath);
        }
      });
    });
  },
};
