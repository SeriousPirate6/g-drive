const path = require("path");
const mime = require("mime");

module.exports = {
  getBasicProps: (getBasicProps = (filePath) => {
    /*
     * Get the file name without extension
     */
    const fileName = path.basename(filePath, path.extname(filePath));

    /*
     * Get the file extension
     */
    const fileExtension = path.extname(filePath).slice(1);

    /*
     * Get the parent folder (if present)
     */
    const fileParent = path.dirname(filePath).split(path.sep).pop();

    /*
     * returning all fetched properties as a JSON object
     */
    return { fileName, fileExtension, fileParent };
  }),

  getMimeType: (filePath) => {
    return mime.getType(filePath);
  },
};
